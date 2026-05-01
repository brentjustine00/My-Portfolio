import { motion } from 'framer-motion'
import { education } from '../../data/education'

type Props = {
  onClose: () => void
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
      <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/45">{k}</p>
      <p className="mt-2 font-display text-lg font-semibold tracking-tight text-white/85">{v}</p>
    </div>
  )
}

export default function CoreOverlay({ onClose }: Props) {
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
        initial={{ y: 18, opacity: 0, scale: 0.985 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 18, opacity: 0, scale: 0.985 }}
        transition={{ type: 'spring', stiffness: 220, damping: 26 }}
      >
        <div className="relative w-[min(1080px,95vw)] max-h-[92vh] overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_0_140px_rgba(80,175,255,0.12)] backdrop-blur-2xl">
          <div className="pointer-events-none absolute -inset-28 bg-[radial-gradient(circle_at_22%_18%,rgba(80,175,255,0.20),transparent_55%),radial-gradient(circle_at_82%_72%,rgba(185,124,255,0.22),transparent_60%)] blur-2xl" />

          <div className="relative max-h-[92vh] overflow-y-auto overscroll-contain p-6 pr-4 md:p-8 md:pr-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/45">
                  About Me
                </p>
                <div className="mt-3 flex items-center gap-4">
                  <img
                    src="/projects/1b1.jpg"
                    alt="Brent Barbadillo"
                    className="h-16 w-16 rounded-2xl border border-white/10 object-cover shadow-[0_0_35px_rgba(80,175,255,0.14)]"
                    loading="lazy"
                  />
                  <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
                    Brent Barbadillo
                  </h2>
                </div>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70 md:text-base">
                  I build cinematic, high-performance interfaces where interaction feels inevitable. My work
                  lives at the intersection of systems thinking, motion design, and clean engineering.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.3em] text-white/70 transition hover:border-white/20 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60"
              >
                Close
              </button>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              <Stat k="Mode" v="Creative Developer" />
              <Stat k="Focus" v="Full‑Stack / UI Systems" />
              <Stat k="Signal" v="Open to collabs" />
            </div>

            <div className="mt-7 grid gap-6 md:grid-cols-[1.05fr_0.95fr]">
              <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/45">
                  Personal Directive
                </p>
                <div className="mt-4 space-y-4 text-sm leading-relaxed text-white/70">
                  <p>
                    I like building experiences that behave like products, not pages—where every state change
                    is intentional, and motion communicates meaning.
                  </p>
                  <p>
                    My strongest work emerges when I treat UI as a living system: data flows, feedback loops,
                    and small interactions that add up to something cinematic.
                  </p>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/45">
                  Education Memory
                </p>
                <div className="mt-4 space-y-4">
                  {education.map((e) => (
                    <div key={`${e.school}-${e.period}`} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className="font-display text-base font-semibold tracking-tight text-white/85">
                          {e.school}
                        </p>
                        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/45">
                          {e.period}
                        </p>
                      </div>
                      <p className="mt-2 text-sm text-white/70">{e.program}</p>
                      {e.notes?.length ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {e.notes.map((n) => (
                            <span
                              key={n}
                              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-white/60"
                            >
                              {n}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-xs text-white/40">
                  Replace placeholders in `src/data/education.ts`.
                </p>
              </div>
            </div>

            <div className="mt-7 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />
            <p className="mt-4 text-xs text-white/45">
              Tip: click project nodes to expand • press <span className="font-mono">R</span> to return
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
