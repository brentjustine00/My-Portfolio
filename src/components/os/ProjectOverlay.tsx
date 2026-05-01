import { motion } from 'framer-motion'
import type { Project } from '../../data/projects'

type Props = {
  project: Project
  onClose: () => void
}

function Pill({ children }: { children: string }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-white/70">
      {children}
    </span>
  )
}

export default function ProjectOverlay({ project, onClose }: Props) {
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
        <div className="relative w-[min(980px,94vw)] max-h-[92vh] overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_0_120px_rgba(120,170,255,0.14)] backdrop-blur-2xl">
          <div className="pointer-events-none absolute -inset-24 bg-[radial-gradient(circle_at_20%_20%,rgba(80,175,255,0.20),transparent_55%),radial-gradient(circle_at_80%_70%,rgba(185,124,255,0.22),transparent_60%)] blur-2xl" />

          <div className="relative grid max-h-[92vh] gap-0 overflow-y-auto overscroll-contain md:grid-cols-[1.05fr_0.95fr]">
            <div className="p-6 md:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/45">
                    Project Node
                  </p>
                  <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight md:text-4xl">
                    {project.title}
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

              <p className="mt-5 max-w-prose text-sm leading-relaxed text-white/70 md:text-base">
                {project.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {project.skills.map((s) => (
                  <Pill key={s}>{s}</Pill>
                ))}
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                {project.link ? (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-cyan-300/90 px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-black transition hover:bg-cyan-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60"
                  >
                    Open Link
                  </a>
                ) : (
                  <span className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-xs uppercase tracking-[0.3em] text-white/40">
                    Link unavailable
                  </span>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white/70 transition hover:border-white/20 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60"
                >
                  Back to System
                </button>
              </div>
            </div>

            <div className="border-t border-white/10 bg-black/20 p-6 md:border-l md:border-t-0 md:p-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/45">
                Memory Frames
              </p>
              <div className="mt-4 grid gap-3">
                {project.images.slice(0, 3).map((img) => (
                  <div
                    key={img.src}
                    className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5"
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      loading="lazy"
                      className="h-40 w-full object-cover opacity-90 md:h-44"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.55),transparent_60%)]" />
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs leading-relaxed text-white/45">
                Click outside to collapse this node back into the network.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
