import { skills } from '../data/skills'
import { useInView } from '../hooks/useInView'

export default function Skills() {
  const { ref, isVisible } = useInView<HTMLDivElement>()

  return (
    <section id="skills" className="section-wrap">
      <div ref={ref} className={`section-card p-10 reveal ${isVisible ? 'is-visible' : ''}`}>
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent-400">Skills</p>
            <h2 className="mt-3 font-display text-3xl font-semibold">Tech stack</h2>
          </div>
          <p className="max-w-sm text-sm text-white/60">
            Tools and technologies I'm using to craft responsive and reliable web experiences.
          </p>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          {skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-base-600 px-4 py-2 text-sm text-white/80 transition hover:border-accent-400 hover:text-accent-300"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
