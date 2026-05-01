import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'

type Props = {
  lines: string[]
  onComplete: () => void
}

export default function BootSequence({ lines, onComplete }: Props) {
  const [cursorLine, setCursorLine] = useState(0)
  const [cursorChar, setCursorChar] = useState(0)
  const [isDone, setIsDone] = useState(false)

  const typed = useMemo(() => {
    return lines.map((line, index) => {
      if (index < cursorLine) return line
      if (index > cursorLine) return ''
      return line.slice(0, cursorChar)
    })
  }, [cursorChar, cursorLine, lines])

  useEffect(() => {
    if (isDone) return
    const current = lines[cursorLine] ?? ''
    const isLineDone = cursorChar >= current.length

    const timeout = window.setTimeout(
      () => {
        if (isLineDone) {
          const nextLine = cursorLine + 1
          if (nextLine >= lines.length) {
            setIsDone(true)
            window.setTimeout(onComplete, 650)
            return
          }
          setCursorLine(nextLine)
          setCursorChar(0)
          return
        }
        setCursorChar((c) => c + 1)
      },
      isLineDone ? 240 : 16,
    )

    return () => window.clearTimeout(timeout)
  }, [cursorChar, cursorLine, isDone, lines, onComplete])

  return (
    <motion.div
      className="absolute inset-0 z-20 flex items-center justify-center bg-black"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: 'easeInOut' }}
    >
      <div className="relative w-[min(760px,92vw)] rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_0_80px_rgba(107,140,255,0.14)] backdrop-blur-xl md:p-8">
        <div className="pointer-events-none absolute -inset-24 rounded-[48px] bg-[radial-gradient(circle_at_30%_20%,rgba(140,111,255,0.20),transparent_55%),radial-gradient(circle_at_70%_60%,rgba(80,175,255,0.16),transparent_55%)] blur-2xl" />
        <div className="relative">
          <div className="flex items-center justify-between">
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-white/60">
              Brent.OS Boot
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-cyan-300/80 shadow-[0_0_14px_rgba(34,211,238,0.7)]" />
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
                runtime
              </span>
            </div>
          </div>
          <div className="mt-5 space-y-2 font-mono text-sm leading-relaxed text-white/80 md:text-base">
            {typed.map((line, index) => (
              <div key={`${index}-${line}`} className="flex gap-3">
                <span className="select-none text-white/30">&gt;</span>
                <span className="min-h-[1.2em]">
                  {line}
                  {index === cursorLine && !isDone && (
                    <span className="ml-0.5 inline-block h-[1.1em] w-2 translate-y-[2px] animate-pulse bg-white/70" />
                  )}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-white/40">
              Scroll to zoom • Drag to drift • Click nodes to expand
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/30">
              build 0xB0
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

