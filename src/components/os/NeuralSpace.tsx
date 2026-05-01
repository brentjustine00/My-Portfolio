import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import type { Project } from '../../data/projects'

type NodeKind = 'core' | 'project'

type Node = {
  id: string
  kind: NodeKind
  label: string
  project?: Project
  x: number
  y: number
  z: number
  baseRadius: number
  color: { r: number; g: number; b: number }
}

type Edge = {
  a: string
  b: string
  weight: number // 0..1
}

export type NeuralSpaceHandle = {
  returnToCore: () => void
}

type Props = {
  projects: Project[]
  onSelectProject: (project: Project) => void
  onSelectCore?: () => void
  dimmed?: boolean
}

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

function hashColor(input: string) {
  let h = 2166136261
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  const hue = (h >>> 0) % 360
  const s = 0.72
  const l = 0.58
  // HSL -> RGB (compact)
  const c = (1 - Math.abs(2 * l - 1)) * s
  const hp = hue / 60
  const x = c * (1 - Math.abs((hp % 2) - 1))
  let r1 = 0,
    g1 = 0,
    b1 = 0
  if (hp >= 0 && hp < 1) (r1 = c), (g1 = x)
  else if (hp < 2) (r1 = x), (g1 = c)
  else if (hp < 3) (g1 = c), (b1 = x)
  else if (hp < 4) (g1 = x), (b1 = c)
  else if (hp < 5) (r1 = x), (b1 = c)
  else (r1 = c), (b1 = x)
  const m = l - c / 2
  return { r: Math.round((r1 + m) * 255), g: Math.round((g1 + m) * 255), b: Math.round((b1 + m) * 255) }
}

function buildGraph(projects: Project[]): { nodes: Node[]; edges: Edge[] } {
  const core: Node = {
    id: 'core',
    kind: 'core',
    label: 'About Me',
    x: 0,
    y: 0,
    z: 0,
    baseRadius: 26,
    color: { r: 120, g: 170, b: 255 },
  }

  const nodes: Node[] = [core]
  const radius = 520
  for (let i = 0; i < projects.length; i++) {
    const p = projects[i]
    const a = (i / Math.max(1, projects.length)) * Math.PI * 2 + (i % 2 ? 0.45 : -0.2)
    const r = radius * (0.62 + ((i * 73) % 100) / 260)
    const z = ((i * 97) % 100) / 100 - 0.5
    nodes.push({
      id: `project:${p.title}`,
      kind: 'project',
      label: p.title,
      project: p,
      x: Math.cos(a) * r,
      y: Math.sin(a) * r,
      z,
      baseRadius: 18,
      color: hashColor(p.title),
    })
  }

  const edges: Edge[] = []
  const byId = new Map(nodes.map((n) => [n.id, n]))

  // Core ↔ project edges, weighted by number of skills (capped).
  for (const node of nodes) {
    if (node.kind !== 'project' || !node.project) continue
    const skillCount = node.project.skills.length
    edges.push({ a: 'core', b: node.id, weight: clamp(skillCount / 6, 0.35, 1) })
  }

  // Project ↔ project edges by shared skills.
  const projectNodes = nodes.filter((n) => n.kind === 'project') as Node[]
  for (let i = 0; i < projectNodes.length; i++) {
    for (let j = i + 1; j < projectNodes.length; j++) {
      const A = projectNodes[i]
      const B = projectNodes[j]
      const aSkills = new Set(A.project?.skills ?? [])
      const bSkills = B.project?.skills ?? []
      let shared = 0
      for (const s of bSkills) if (aSkills.has(s)) shared++
      if (shared <= 0) continue
      const weight = clamp(shared / 3, 0.25, 0.95)
      edges.push({ a: A.id, b: B.id, weight })
    }
  }

  // If graph is too dense, keep only strongest project-project edges.
  const denseLimit = Math.max(6, projects.length * 2)
  const pp = edges.filter((e) => e.a !== 'core' && e.b !== 'core').sort((x, y) => y.weight - x.weight)
  const keptPP = new Set(pp.slice(0, denseLimit).map((e) => `${e.a}|${e.b}`))
  const filtered = edges.filter((e) => e.a === 'core' || e.b === 'core' || keptPP.has(`${e.a}|${e.b}`))

  // Sanity: ensure edge endpoints exist
  return { nodes, edges: filtered.filter((e) => byId.has(e.a) && byId.has(e.b)) }
}

type Camera = {
  x: number
  y: number
  zoom: number
  tx: number
  ty: number
  tZoom: number
}

type Particle = { x: number; y: number; z: number; vx: number; vy: number }

const NeuralSpace = forwardRef<NeuralSpaceHandle, Props>(function NeuralSpace(
  { projects, onSelectProject, onSelectCore, dimmed },
  ref,
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const lastRef = useRef<number>(performance.now())
  const pointerRef = useRef<{ x: number; y: number; down: boolean; px: number; py: number }>({
    x: 0,
    y: 0,
    down: false,
    px: 0,
    py: 0,
  })
  const gestureRef = useRef<{ startX: number; startY: number; startAt: number }>({
    startX: 0,
    startY: 0,
    startAt: 0,
  })

  const graph = useMemo(() => buildGraph(projects), [projects])
  const nodesRef = useRef<Node[]>(graph.nodes)
  const edgesRef = useRef<Edge[]>(graph.edges)
  useEffect(() => {
    nodesRef.current = graph.nodes
    edgesRef.current = graph.edges
  }, [graph.edges, graph.nodes])

  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const hoveredIdRef = useRef<string | null>(null)
  useEffect(() => {
    hoveredIdRef.current = hoveredId
  }, [hoveredId])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.style.cursor = hoveredId ? 'pointer' : 'grab'
  }, [hoveredId])

  const cameraRef = useRef<Camera>({ x: 0, y: 0, zoom: 0.92, tx: 0, ty: 0, tZoom: 0.92 })
  const particlesRef = useRef<Particle[]>([])

  useImperativeHandle(ref, () => ({
    returnToCore() {
      const cam = cameraRef.current
      cam.tx = 0
      cam.ty = 0
      cam.tZoom = 0.92
    },
  }))

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => {
      const dpr = clamp(window.devicePixelRatio || 1, 1, 2)
      const rect = canvas.getBoundingClientRect()
      canvas.width = Math.max(1, Math.floor(rect.width * dpr))
      canvas.height = Math.max(1, Math.floor(rect.height * dpr))
    }

    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const hitTest = (x: number, y: number) => {
      const rect = canvas.getBoundingClientRect()
      const w = rect.width
      const h = rect.height
      if (w <= 0 || h <= 0) return null

      const cam = cameraRef.current
      const nodes = nodesRef.current

      let hit: { id: string; d2: number } | null = null
      // Easier tapping on mobile
      const minHitRadius = 26
      const projectDepth = 1.0

      for (const n of nodes) {
        const depth = 1 + n.z * 0.18 * projectDepth
        const sx = (n.x - cam.x * depth) * cam.zoom + w / 2
        const sy = (n.y - cam.y * depth) * cam.zoom + h / 2
        const r =
          (n.baseRadius + (n.kind === 'core' ? 10 : 0)) *
          cam.zoom *
          (0.88 + (n.z + 0.5) * 0.22)
        const hitR = Math.max(r, minHitRadius)
        const dx = x - sx
        const dy = y - sy
        const d2 = dx * dx + dy * dy
        if (d2 <= hitR * hitR) {
          if (!hit || d2 < hit.d2) hit = { id: n.id, d2 }
        }
      }

      return hit?.id ?? null
    }

    const rectOf = () => canvas.getBoundingClientRect()

    const onPointerMove = (ev: PointerEvent) => {
      const r = rectOf()
      const x = ev.clientX - r.left
      const y = ev.clientY - r.top
      const p = pointerRef.current
      p.x = x
      p.y = y
      if (p.down) {
        const cam = cameraRef.current
        cam.tx -= (x - p.px) / cam.zoom
        cam.ty -= (y - p.py) / cam.zoom
      }
      p.px = x
      p.py = y
    }

    const onPointerDown = (ev: PointerEvent) => {
      canvas.setPointerCapture(ev.pointerId)
      const p = pointerRef.current
      p.down = true
      const r = rectOf()
      p.px = ev.clientX - r.left
      p.py = ev.clientY - r.top

      const g = gestureRef.current
      g.startX = p.px
      g.startY = p.py
      g.startAt = performance.now()

      // Ensure taps work even without pointermove (common on mobile).
      hoveredIdRef.current = hitTest(p.px, p.py)
      setHoveredId(hoveredIdRef.current)
    }

    const onPointerUp = (ev: PointerEvent) => {
      pointerRef.current.down = false

      const r = rectOf()
      const x = ev.clientX - r.left
      const y = ev.clientY - r.top
      const g = gestureRef.current
      const moved = Math.hypot(x - g.startX, y - g.startY)
      const elapsed = performance.now() - g.startAt

      // Treat as tap when the user didn't pan/drag.
      if (moved > 10 || elapsed > 650) return

      const id = hitTest(x, y)
      if (!id) return
      if (id === 'core') {
        const cam = cameraRef.current
        cam.tx = 0
        cam.ty = 0
        cam.tZoom = 0.92
        onSelectCore?.()
        return
      }
      const node = nodesRef.current.find((n) => n.id === id)
      if (node?.project) onSelectProject(node.project)
    }

    const onWheel = (ev: WheelEvent) => {
      ev.preventDefault()
      const cam = cameraRef.current
      const delta = ev.deltaY
      const zoomFactor = Math.exp(-delta * 0.0012)
      cam.tZoom = clamp(cam.tZoom * zoomFactor, 0.55, 2.15)
    }

    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointerup', onPointerUp)
    canvas.addEventListener('wheel', onWheel, { passive: false })

    return () => {
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointerup', onPointerUp)
      canvas.removeEventListener('wheel', onWheel)
    }
  }, [onSelectCore, onSelectProject])

  useEffect(() => {
    // Seed background particles once.
    if (particlesRef.current.length) return
    const seed: Particle[] = []
    for (let i = 0; i < 160; i++) {
      const z = Math.random() * 1.2 - 0.6
      seed.push({
        x: (Math.random() - 0.5) * 2200,
        y: (Math.random() - 0.5) * 1600,
        z,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6,
      })
    }
    particlesRef.current = seed
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const frame = (now: number) => {
      const dt = clamp((now - lastRef.current) / 1000, 0.001, 0.033)
      lastRef.current = now

      const dpr = clamp(window.devicePixelRatio || 1, 1, 2)
      const w = canvas.width / dpr
      const h = canvas.height / dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const cam = cameraRef.current
      cam.x = lerp(cam.x, cam.tx, 1 - Math.pow(0.0009, dt))
      cam.y = lerp(cam.y, cam.ty, 1 - Math.pow(0.0009, dt))
      cam.zoom = lerp(cam.zoom, cam.tZoom, 1 - Math.pow(0.0012, dt))

      // Subtle ambient drift (feels alive, not “static”).
      const drift = 10
      cam.x += Math.sin(now * 0.00013) * drift * dt
      cam.y += Math.cos(now * 0.00011) * drift * dt

      ctx.clearRect(0, 0, w, h)

      // Background vignette + volumetric glow
      const g = ctx.createRadialGradient(w * 0.5, h * 0.6, 0, w * 0.5, h * 0.55, Math.max(w, h) * 0.75)
      g.addColorStop(0, 'rgba(18,20,26,0.0)')
      g.addColorStop(0.35, 'rgba(6,7,10,0.35)')
      g.addColorStop(1, 'rgba(0,0,0,0.92)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)

      const dim = dimmed ? 0.6 : 1

      // Particles (deep field)
      const particles = particlesRef.current
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx * dt
        p.y += p.vy * dt
        if (p.x < -2600) p.x = 2600
        if (p.x > 2600) p.x = -2600
        if (p.y < -1900) p.y = 1900
        if (p.y > 1900) p.y = -1900

        const parallax = 1 + p.z * 0.25
        const sx = (p.x - cam.x * parallax) * cam.zoom + w / 2
        const sy = (p.y - cam.y * parallax) * cam.zoom + h / 2
        if (sx < -40 || sx > w + 40 || sy < -40 || sy > h + 40) continue
        const a = (0.08 + (p.z + 0.6) * 0.08) * dim
        ctx.fillStyle = `rgba(180,210,255,${a})`
        ctx.fillRect(sx, sy, 1.2, 1.2)
      }

      const nodes = nodesRef.current
      const edges = edgesRef.current

      // Hover detection (in render loop to stay perfectly in sync with camera).
      const mx = pointerRef.current.x
      const my = pointerRef.current.y
      let hit: { id: string; d2: number } | null = null

      const projectDepth = 1.0
      for (const n of nodes) {
        const depth = 1 + n.z * 0.18 * projectDepth
        const sx = (n.x - cam.x * depth) * cam.zoom + w / 2
        const sy = (n.y - cam.y * depth) * cam.zoom + h / 2
        const r = (n.baseRadius + (n.kind === 'core' ? 10 : 0)) * cam.zoom * (0.88 + (n.z + 0.5) * 0.22)
        const dx = mx - sx
        const dy = my - sy
        const d2 = dx * dx + dy * dy
        if (d2 <= r * r) {
          if (!hit || d2 < hit.d2) hit = { id: n.id, d2 }
        }
      }
      if (hit?.id !== hoveredIdRef.current) setHoveredId(hit?.id ?? null)

      // Connections (skills as energy)
      ctx.lineCap = 'round'
      for (const e of edges) {
        const A = nodes.find((n) => n.id === e.a)
        const B = nodes.find((n) => n.id === e.b)
        if (!A || !B) continue

        const depthA = 1 + A.z * 0.18
        const depthB = 1 + B.z * 0.18
        const ax = (A.x - cam.x * depthA) * cam.zoom + w / 2
        const ay = (A.y - cam.y * depthA) * cam.zoom + h / 2
        const bx = (B.x - cam.x * depthB) * cam.zoom + w / 2
        const by = (B.y - cam.y * depthB) * cam.zoom + h / 2

        const dx = bx - ax
        const dy = by - ay
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 1) continue

        const wgt = e.weight
        const baseAlpha = (0.12 + wgt * 0.22) * dim
        const pulse = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(now * 0.0017 + dist * 0.007 + wgt * 3))
        const alpha = baseAlpha * pulse

        const grad = ctx.createLinearGradient(ax, ay, bx, by)
        grad.addColorStop(0, `rgba(80,175,255,${alpha})`)
        grad.addColorStop(0.5, `rgba(160,110,255,${alpha * 0.9})`)
        grad.addColorStop(1, `rgba(80,175,255,${alpha})`)
        ctx.strokeStyle = grad
        ctx.lineWidth = (1.1 + wgt * 1.7) * cam.zoom
        ctx.beginPath()
        ctx.moveTo(ax, ay)
        ctx.lineTo(bx, by)
        ctx.stroke()

        // Pulse packet traveling along the edge
        const t = (now * 0.00018 + wgt) % 1
        const px = ax + dx * t
        const py = ay + dy * t
        const pr = (2.2 + wgt * 3.3) * cam.zoom
        ctx.fillStyle = `rgba(190,230,255,${(0.12 + wgt * 0.22) * dim})`
        ctx.beginPath()
        ctx.arc(px, py, pr, 0, Math.PI * 2)
        ctx.fill()
      }

      // Nodes
      for (const n of nodes) {
        const depth = 1 + n.z * 0.18
        const sx = (n.x - cam.x * depth) * cam.zoom + w / 2
        const sy = (n.y - cam.y * depth) * cam.zoom + h / 2
        const hovered = hoveredIdRef.current === n.id

        const zBoost = 0.86 + (n.z + 0.5) * 0.28
        const radius = (n.baseRadius + (n.kind === 'core' ? 12 : 0)) * cam.zoom * zBoost * (hovered ? 1.18 : 1)

        const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, radius * 2.9)
        const c = n.color
        const glowAlpha = (hovered ? 0.35 : 0.22) * dim
        glow.addColorStop(0, `rgba(${c.r},${c.g},${c.b},${glowAlpha})`)
        glow.addColorStop(0.45, `rgba(${c.r},${c.g},${c.b},${glowAlpha * 0.55})`)
        glow.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(sx, sy, radius * 2.9, 0, Math.PI * 2)
        ctx.fill()

        // Glass orb
        const orb = ctx.createRadialGradient(sx - radius * 0.4, sy - radius * 0.5, 0, sx, sy, radius)
        orb.addColorStop(0, `rgba(255,255,255,${(hovered ? 0.22 : 0.14) * dim})`)
        orb.addColorStop(0.35, `rgba(${c.r},${c.g},${c.b},${(hovered ? 0.22 : 0.14) * dim})`)
        orb.addColorStop(1, `rgba(0,0,0,${(hovered ? 0.58 : 0.68) * dim})`)
        ctx.fillStyle = orb
        ctx.beginPath()
        ctx.arc(sx, sy, radius, 0, Math.PI * 2)
        ctx.fill()

        // Rim
        ctx.strokeStyle = `rgba(255,255,255,${(hovered ? 0.22 : 0.12) * dim})`
        ctx.lineWidth = 1.15 * cam.zoom
        ctx.beginPath()
        ctx.arc(sx, sy, radius, 0, Math.PI * 2)
        ctx.stroke()

        if (n.kind === 'core') {
          const ringR = radius * 1.55
          const rot = now * 0.00055
          ctx.strokeStyle = `rgba(80,175,255,${0.16 * dim})`
          ctx.lineWidth = 1.2 * cam.zoom
          ctx.beginPath()
          ctx.arc(sx, sy, ringR, rot, rot + Math.PI * 1.25)
          ctx.stroke()
          ctx.strokeStyle = `rgba(185,124,255,${0.14 * dim})`
          ctx.beginPath()
          ctx.arc(sx, sy, ringR * 0.92, rot + 1.8, rot + 1.8 + Math.PI * 0.9)
          ctx.stroke()

          // Small orbiting “thought particles”
          for (let i = 0; i < 6; i++) {
            const t = rot * 1.4 + i * (Math.PI * 2) / 6
            const ox = sx + Math.cos(t) * ringR
            const oy = sy + Math.sin(t) * ringR
            ctx.fillStyle = `rgba(190,230,255,${0.10 * dim})`
            ctx.beginPath()
            ctx.arc(ox, oy, 2.1 * cam.zoom, 0, Math.PI * 2)
            ctx.fill()
          }
        }

        // Label (minimal, cinematic; only near hover or core)
        const showLabel = hovered || n.kind === 'core'
        if (showLabel) {
          ctx.font = `${Math.max(12, 12 * cam.zoom)}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'top'
          ctx.fillStyle = `rgba(255,255,255,${(hovered ? 0.82 : 0.55) * dim})`
          ctx.fillText(n.kind === 'core' ? 'Brent.OS' : n.label, sx, sy + radius + 10 * cam.zoom)
        }
      }

      // Pointer hint (cursor glow)
      const hid = hoveredIdRef.current
      if (hid) {
        const hint = ctx.createRadialGradient(mx, my, 0, mx, my, 48)
        hint.addColorStop(0, `rgba(140,111,255,${0.06 * dim})`)
        hint.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = hint
        ctx.beginPath()
        ctx.arc(mx, my, 48, 0, Math.PI * 2)
        ctx.fill()
      }

      rafRef.current = window.requestAnimationFrame(frame)
    }

    rafRef.current = window.requestAnimationFrame(frame)
    return () => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [dimmed])

  return (
    <div className="absolute inset-0">
      <canvas
        ref={canvasRef}
        className="h-full w-full touch-none bg-[radial-gradient(circle_at_50%_20%,rgba(60,80,255,0.12),transparent_60%),radial-gradient(circle_at_30%_70%,rgba(185,124,255,0.14),transparent_62%),radial-gradient(circle_at_70%_70%,rgba(0,255,255,0.06),transparent_60%)]"
        aria-label="Brent.OS Neural Space"
        role="img"
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.35)_55%,rgba(0,0,0,0.92)_100%)]" />
    </div>
  )
})

export default NeuralSpace
