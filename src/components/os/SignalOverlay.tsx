import { motion } from 'framer-motion'
import { useMemo } from 'react'

type Props = {
  onClose: () => void
  onResume: () => void
}

export default function SignalOverlay({ onClose, onResume }: Props) {
  const lines = useMemo(() => {
    return ['Connection established…', 'Ready to build something together?']
  }, [])

  return (
    <motion.div
      className="absolute inset-0 z-40"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <motion.div
        className="absolute inset-0 bg-black/70 backdrop-blur-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      <motion.div
        className="absolute inset-0 flex items-center justify-center p-4 md:p-8"
        initial={{ y: 18, opacity: 0, scale: 0.99 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 18, opacity: 0, scale: 0.99 }}
        transition={{ type: 'spring', stiffness: 220, damping: 26 }}
      >
        <div className="relative w-[min(760px,92vw)] overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_0_130px_rgba(185,124,255,0.16)] backdrop-blur-2xl">
          <div className="pointer-events-none absolute -inset-32 bg-[radial-gradient(circle_at_30%_30%,rgba(80,175,255,0.18),transparent_58%),radial-gradient(circle_at_70%_65%,rgba(185,124,255,0.22),transparent_62%)] blur-2xl" />

          <div className="relative p-6 md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/45">
                  Signal Transmission
                </p>
                <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight md:text-3xl">
                  Channel Ready
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.3em] text-white/70 transition hover:border-white/20 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60"
              >
                Close
              </button>
            </div>

            <div className="mt-6 space-y-2 font-mono text-sm text-white/75">
              {lines.map((l) => (
                <div key={l} className="flex gap-3">
                  <span className="select-none text-white/30">&gt;</span>
                  <span>{l}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=brentjustine00@gmail.com"
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-cyan-300/90 px-6 py-3 text-center text-xs font-semibold uppercase tracking-[0.3em] text-black transition hover:bg-cyan-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60"
              >
                Transmit Email
              </a>
              <button
                type="button"
                onClick={onResume}
                className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white/80 transition hover:border-white/20 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60"
              >
                Download Resume
              </button>
              <a
                href="https://github.com/brentjustine00"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-center text-xs font-semibold uppercase tracking-[0.3em] text-white/80 transition hover:border-white/20 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60"
              >
                Open GitHub
              </a>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white/60 transition hover:border-white/20 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60"
              >
                Back to About Me
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
