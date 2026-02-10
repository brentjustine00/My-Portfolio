import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { projects } from '../data/projects'
import { useInView } from '../hooks/useInView'

export default function Projects() {
  const { ref, isVisible } = useInView<HTMLDivElement>()
  const [activeImage, setActiveImage] = useState<{ src: string; alt: string } | null>(null)

  return (
    <section id="projects" className="section-wrap">
      <div ref={ref} className={`reveal ${isVisible ? 'is-visible' : ''}`}>
        <div className="mb-8 flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent-400">Projects</p>
            <h2 className="mt-3 font-display text-3xl font-semibold">Selected work</h2>
          </div>
          <p className="max-w-sm text-sm text-white/60">
            A snapshot of projects that show my ability to build full-stack solutions and polished user
            interfaces.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project) => {
            const [primary, ...secondary] = project.images

            return (
              <article key={project.title} className="section-card flex h-full flex-col gap-6 p-8">
                <div className="space-y-4">
                  <h3 className="font-display text-xl font-semibold">{project.title}</h3>
                  <p className="text-sm text-white/70">{project.description}</p>
                </div>
                {primary ? (
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => setActiveImage(primary)}
                      className="group relative"
                      aria-label="Open project image"
                    >
                      <img
                        src={primary.src}
                        alt={primary.alt}
                        className="h-48 w-full rounded-xl border border-base-600 object-cover transition group-hover:opacity-90"
                        loading="lazy"
                      />
                      <span className="pointer-events-none absolute inset-0 rounded-xl border border-accent-400/40 opacity-0 transition group-hover:opacity-100" />
                    </button>
                    {secondary.length > 0 ? (
                      <div className="grid gap-3 sm:grid-cols-2">
                        {secondary.map((image) => (
                          <button
                            type="button"
                            key={image.src}
                            onClick={() => setActiveImage(image)}
                            className="group relative"
                            aria-label="Open project image"
                          >
                            <img
                              src={image.src}
                              alt={image.alt}
                              className="h-24 w-full rounded-lg border border-base-600 object-cover transition group-hover:opacity-90"
                              loading="lazy"
                            />
                            <span className="pointer-events-none absolute inset-0 rounded-lg border border-accent-400/40 opacity-0 transition group-hover:opacity-100" />
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : null}
                <div className="flex flex-wrap gap-2">
                  {project.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-base-600 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/60"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </article>
            )
          })}
        </div>
      </div>
      <AnimatePresence>
        {activeImage ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveImage(null)}
          >
            <motion.div
              className="relative max-h-[90vh] w-full max-w-5xl"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 26 }}
              onClick={(event) => event.stopPropagation()}
            >
              <img
                src={activeImage.src}
                alt={activeImage.alt}
                className="max-h-[90vh] w-full rounded-2xl border border-base-600 object-contain bg-base-900"
              />
              <button
                type="button"
                onClick={() => setActiveImage(null)}
                className="absolute right-4 top-4 rounded-full border border-white/30 bg-base-900/80 px-3 py-2 text-xs uppercase tracking-[0.3em] text-white/80 transition hover:border-accent-400 hover:text-accent-300"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  )
}
