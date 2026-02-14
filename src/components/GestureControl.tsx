import { useEffect, useRef, useState } from 'react'

const sections = ['home', 'about', 'skills', 'projects', 'education', 'contact']

export default function GestureControl() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const recognizerRef = useRef<any>(null)
  const rafRef = useRef<number | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const sectionIndexRef = useRef(0)
  const lastActionRef = useRef(0)
  const stableGestureRef = useRef<string | null>(null)
  const stableCountRef = useRef(0)

  const [enabled, setEnabled] = useState(false)
  const [ready, setReady] = useState(false)
  const [status, setStatus] = useState('Gesture control is off')

  const jumpToSection = (next: boolean) => {
    sectionIndexRef.current = next
      ? Math.min(sectionIndexRef.current + 1, sections.length - 1)
      : Math.max(sectionIndexRef.current - 1, 0)

    const section = document.getElementById(sections[sectionIndexRef.current])
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const syncCurrentSection = () => {
    let currentIndex = 0

    sections.forEach((id, index) => {
      const section = document.getElementById(id)
      if (section == null) return

      const rect = section.getBoundingClientRect()
      if (rect.top <= 140) {
        currentIndex = index
      }
    })

    sectionIndexRef.current = currentIndex
  }

  const detect = () => {
    const recognizer = recognizerRef.current
    const video = videoRef.current

    if (recognizer == null || video == null || video.readyState < 2) {
      rafRef.current = window.requestAnimationFrame(detect)
      return
    }

    const results = recognizer.recognizeForVideo(video, performance.now())
    const candidateGesture = results.gestures?.[0]?.[0]?.categoryName ?? null

    if (candidateGesture === stableGestureRef.current) {
      stableCountRef.current += 1
    } else {
      stableGestureRef.current = candidateGesture
      stableCountRef.current = 1
    }

    const now = Date.now()
    const cooldownElapsed = now - lastActionRef.current > 1300
    const isStable = stableCountRef.current >= 5

    if (isStable && cooldownElapsed) {
      if (stableGestureRef.current === 'Open_Palm') {
        jumpToSection(true)
        lastActionRef.current = now
        stableCountRef.current = 0
        setStatus('Open palm detected: moved to next section')
      }

      if (stableGestureRef.current === 'Closed_Fist') {
        jumpToSection(false)
        lastActionRef.current = now
        stableCountRef.current = 0
        setStatus('Closed fist detected: moved to previous section')
      }
    }

    rafRef.current = window.requestAnimationFrame(detect)
  }

  const stop = () => {
    setEnabled(false)
    setReady(false)
    setStatus('Gesture control is off')

    stableGestureRef.current = null
    stableCountRef.current = 0

    if (rafRef.current) {
      window.cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }

  const start = async () => {
    try {
      setStatus('Loading MediaPipe model...')
      const vision = await import('@mediapipe/tasks-vision')
      const resolver = await vision.FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm',
      )

      recognizerRef.current = await vision.GestureRecognizer.createFromOptions(resolver, {
        baseOptions: {
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task',
        },
        numHands: 1,
        runningMode: 'VIDEO',
      })

      streamRef.current = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = streamRef.current
        await videoRef.current.play()
      }

      syncCurrentSection()
      setEnabled(true)
      setReady(true)
      setStatus('Hands-free active: open palm next, closed fist previous')
      detect()
    } catch {
      setStatus('Could not start MediaPipe gesture control. Check camera permissions.')
      stop()
    }
  }

  useEffect(() => {
    const onScroll = () => syncCurrentSection()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      stop()
    }
  }, [])

  const previewClass = [
    'h-12 w-16 rounded border border-base-600 object-cover',
    ready ? 'block' : 'hidden',
  ].join(' ')

  return (
    <div className='section-wrap pt-6 pb-0'>
      <div className='section-card flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between md:p-5'>
        <div className='space-y-1'>
          <p className='font-mono text-[10px] uppercase tracking-[0.25em] text-accent-400'>MediaPipe</p>
          <p className='text-sm text-white/80'>Hands-free gesture navigation</p>
          <p className='text-xs text-white/55'>{status}</p>
        </div>
        <div className='flex items-center gap-3'>
          <video ref={videoRef} className={previewClass} muted playsInline />
          {enabled ? (
            <button
              type='button'
              onClick={stop}
              className='rounded-full border border-red-400/70 px-4 py-2 text-xs uppercase tracking-[0.2em] text-red-300 transition hover:bg-red-500/20'
            >
              Stop
            </button>
          ) : (
            <button
              type='button'
              onClick={start}
              className='rounded-full border border-accent-500 px-4 py-2 text-xs uppercase tracking-[0.2em] text-accent-300 transition hover:bg-accent-500 hover:text-base-900'
            >
              Start Gesture
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

