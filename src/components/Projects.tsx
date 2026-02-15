import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { projects } from '../data/projects'
import { useInView } from '../hooks/useInView'

const IMAGE_CACHE_VERSION = '20260215'

function withVersion(src: string) {
  return src.includes('?') ? src : `${src}?v=${IMAGE_CACHE_VERSION}`
}

export default function Projects() {
  const { ref, isVisible } = useInView<HTMLDivElement>()
  const [activeImage, setActiveImage] = useState<{ src: string; alt: string } | null>(null)
  const [showAll, setShowAll] = useState(false)

  const visibleProjects = showAll ? projects : projects.slice(0, 3)

  return (
    <section id="projects" className="section-wrap py-12 md:py-20">
      <div ref={ref} className={`reveal ${isVisible ? 'is-visible' : ''}`}>
        <div className="mb-8 flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent-400">Projects</p>
            <h2 className="mt-3 font-display text-2xl font-semibold md:text-3xl">Selected work</h2>
          </div>
          <p className="max-w-sm text-sm text-white/60">
            A snapshot of projects that show my ability to build full-stack solutions and polished user
            interfaces.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 md:gap-6">
          {visibleProjects.map((project) => {
            const [primary, ...secondary] = project.images

            return (
              <article key={project.title} className="section-card flex h-full flex-col gap-5 p-5 md:gap-6 md:p-8">
                <div className="space-y-3 md:space-y-4">
                  <h3 className="font-display text-lg font-semibold md:text-xl">{project.title}</h3>
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
                        src={withVersion(primary.src)}
                        alt={primary.alt}
                        className="h-44 w-full rounded-xl border border-base-600 object-cover transition group-hover:opacity-90 md:h-48"
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
                              src={withVersion(image.src)}
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

                {project.link ? (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-fit rounded-full border border-accent-400/60 px-4 py-2 text-xs uppercase tracking-[0.2em] text-accent-300 transition hover:bg-accent-500 hover:text-base-900"
                  >
                    GitHub Repo
                  </a>
                ) : null}
              </article>
            )
          })}
        </div>

        {projects.length > 3 ? (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setShowAll((prev) => !prev)}
              className="rounded-full border border-base-600 px-5 py-2 text-xs uppercase tracking-[0.25em] text-white/70 transition hover:border-accent-400 hover:text-accent-300"
            >
              {showAll ? 'Show Less' : 'Show All Projects'}
            </button>
          </div>
        ) : null}
      </div>

      <AnimatePresence>
        {activeImage ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 md:p-6"
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
                src={withVersion(activeImage.src)}
                alt={activeImage.alt}
                className="max-h-[90vh] w-full rounded-2xl border border-base-600 object-contain bg-base-900"
              />
              <button
                type="button"
                onClick={() => setActiveImage(null)}
                className="absolute right-3 top-3 rounded-full border border-white/30 bg-base-900/80 px-3 py-2 text-xs uppercase tracking-[0.3em] text-white/80 transition hover:border-accent-400 hover:text-accent-300 md:right-4 md:top-4"
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
