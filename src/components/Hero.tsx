import { useInView } from '../hooks/useInView'
import logoMark from '../assets/logo-mark.svg'
import profile from '../assets/profile.jpg'

export default function Hero() {
  const { ref, isVisible } = useInView<HTMLDivElement>()

  return (
    <section id="home" className="section-wrap">
      <div
        ref={ref}
        className={`grid gap-12 lg:grid-cols-[1.1fr_0.9fr] ${isVisible ? 'is-visible' : ''} reveal`}
      >
        <div className="space-y-8">
          <div className="tag w-fit">Portfolio</div>
          <div className="space-y-4">
            <h1 className="font-display text-4xl font-semibold leading-tight transition duration-300 hover:-translate-y-1 hover:text-accent-300 md:text-5xl lg:text-6xl">
              Brent Barbadillo
            </h1>
            <p className="font-mono text-sm uppercase tracking-[0.3em] text-accent-400">
              Aspiring Full-Stack Web Developer
            </p>
          </div>
          <p className="max-w-xl text-lg text-white/70">
            I'm a Computer Science undergraduate with hands-on experience building modern web applications
            using React, FastAPI, and Supabase. I enjoy turning ideas into clean, functional, and user-focused
            digital experiences.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#projects"
              className="rounded-full bg-accent-500 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-base-900 transition hover:bg-accent-300"
            >
              View Projects
            </a>
            <a
              href="/Resume.pdf"
              download
              className="rounded-full border border-accent-500 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-accent-300 transition hover:bg-accent-500 hover:text-base-900"
            >
              Download Resume
            </a>
            <a
              href="#contact"
              className="rounded-full border border-white/30 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:border-accent-400 hover:text-accent-300"
            >
              Contact Me
            </a>
          </div>
        </div>
        <div className="relative">
          <div className="mb-6 flex items-center gap-4">
            <div className="group relative">
              <img
                src={profile}
                alt="Brent Barbadillo"
                className="h-24 w-24 rounded-2xl border border-base-600 object-cover shadow-card transition duration-300 hover:-translate-y-1 hover:scale-[1.02]"
                loading="lazy"
              />
              <span className="pointer-events-none absolute -inset-2 rounded-[20px] border border-accent-400/30 opacity-0 transition duration-300 group-hover:opacity-100" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">Available for projects</p>
              <p className="font-display text-lg text-white/90">Let’s build something great.</p>
            </div>
          </div>
          <div className="section-card p-6 transition duration-300 hover:-translate-y-1 hover:border-accent-400/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={logoMark} alt="Logo mark" className="h-10 w-10" />
                <div>
                  <p className="font-display text-lg font-semibold">Brent</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-accent-400">Front-end focus</p>
                </div>
              </div>
              <span className="rounded-full border border-base-600 px-3 py-1 text-xs text-white/60">
                2026
              </span>
            </div>
            <div className="mt-6 space-y-4 text-sm text-white/70">
              <p>
                Currently building a Developer Path AI integrated polished website, responsive interfaces with accessible components and thoughtful
                micro-interactions.
              </p>
              <div className="subtle-border" />
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em]">
                <span className="text-white/50">Currently</span>
                <span className="text-accent-300">Working on DevPath</span>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-10 -right-8 h-32 w-32 rounded-full bg-accent-500/20 blur-3xl animate-glow" />
        </div>
      </div>
    </section>
  )
}
