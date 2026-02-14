import { useInView } from '../hooks/useInView'

export default function About() {
  const { ref, isVisible } = useInView<HTMLDivElement>()

  return (
    <section id="about" className="section-wrap py-12 md:py-20">
      <div ref={ref} className={`section-card p-6 md:p-10 reveal ${isVisible ? 'is-visible' : ''}`}>
        <div className="grid gap-6 md:gap-8 lg:grid-cols-[0.4fr_0.6fr]">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent-400">About</p>
            <h2 className="mt-3 font-display text-2xl font-semibold md:text-3xl">Learning with intent.</h2>
          </div>
          <div className="space-y-4 text-white/70 md:space-y-5">
            <p>
              I'm building my foundation as a full-stack developer by combining strong front-end craft with
              reliable back-end systems. My focus is on clean UI composition, fast iteration, and meaningful
              user experiences.
            </p>
            <p>
              My goal is to contribute to teams that value thoughtful product design, accessible interfaces,
              and scalable architecture. I'm actively learning and shipping projects that push my skills
              across the stack.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
