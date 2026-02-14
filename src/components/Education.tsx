import { useInView } from '../hooks/useInView'

export default function Education() {
  const { ref, isVisible } = useInView<HTMLDivElement>()

  return (
    <section id="education" className="section-wrap py-12 md:py-20">
      <div ref={ref} className={`section-card p-6 md:p-10 reveal ${isVisible ? 'is-visible' : ''}`}>
        <div className="flex flex-wrap items-center justify-between gap-4 md:gap-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent-400">Education</p>
            <h2 className="mt-3 font-display text-2xl font-semibold md:text-3xl">Computer Science Undergraduate</h2>
          </div>
          <span className="rounded-full border border-base-600 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/60">
            2022 - Present
          </span>
        </div>
        <div className="mt-6 space-y-6 text-sm text-white/70">
          <div>
            <p className="font-display text-lg text-white">Laguna State Polytechnic University</p>
            <p className="text-xs uppercase tracking-[0.2em] text-white/50">2022 - Present</p>
            <p className="mt-3">
              Bachelor of Science in Computer Science focused on software engineering, data structures, and
              building full-stack web applications with modern frameworks and APIs.
            </p>
          </div>
          <div>
            <p className="font-display text-lg text-white">Trace College</p>
            <p className="text-xs uppercase tracking-[0.2em] text-white/50">
              2020 - 2022 | Senior High School | Grade 11-12 (STEM)
            </p>
            <p className="mt-3">
              Completed the STEM track with emphasis on programming fundamentals, mathematics, and
              analytical problem-solving.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
