import { useInView } from '../hooks/useInView'

const socials = [
  { label: 'Email', value: 'brentjustine00@gmail.com', href: 'mailto:brentjustine00@gmail.com' },
  { label: 'GitHub', value: 'https://github.com/brentjustine00', href: 'https://github.com/brentjustine00' },
  { label: 'LinkedIn', value: 'linkedin.com/in/brentjustine', href: 'https://www.linkedin.com/in/brent-justine-barbadillo-350668383/' },
]

export default function Contact() {
  const { ref, isVisible } = useInView<HTMLDivElement>()

  return (
    <section id="contact" className="section-wrap">
      <div ref={ref} className={`section-card p-10 reveal ${isVisible ? 'is-visible' : ''}`}>
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent-400">Contact</p>
            <h2 className="mt-3 font-display text-3xl font-semibold">Let's build together</h2>
          </div>
          <p className="max-w-sm text-sm text-white/60">
            Open to collaborations and junior roles in full stack web development.
          </p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {socials.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="rounded-xl border border-base-600 p-5 text-sm transition hover:border-accent-400"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">{item.label}</p>
              <p className="mt-2 text-white/80">{item.value}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
