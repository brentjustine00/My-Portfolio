import { useState } from 'react'
import logo from '../assets/logo.svg'

export default function NavBar() {
  const [active, setActive] = useState('about')

  return (
    <header className="sticky top-0 z-40 border-b border-base-700/60 bg-base-900/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="h-8 w-8" />
          <div>
            <p className="font-display text-lg font-semibold tracking-tight">Brent Barbadillo</p>
            <p className="text-xs uppercase tracking-[0.2em] text-accent-400">Aspiring Full-Stack</p>
          </div>
        </div>
        <nav className="hidden items-center gap-8 text-sm md:flex">
          {['about', 'skills', 'projects', 'education', 'contact'].map((item) => (
            <a
              key={item}
              href={`#${item}`}
              onClick={() => setActive(item)}
              className={`relative uppercase tracking-[0.2em] transition ${
                active === item ? 'text-accent-300' : 'text-white/70 hover:text-white'
              }`}
            >
              {item}
              <span
                className={`absolute -bottom-2 left-0 h-[2px] w-full origin-left bg-accent-400 transition-transform duration-300 ${
                  active === item ? 'scale-x-100' : 'scale-x-0'
                }`}
              />
            </a>
          ))}
        </nav>
        <a
          href="#contact"
          className="rounded-full border border-accent-500 px-4 py-2 text-xs uppercase tracking-[0.3em] text-accent-300 transition hover:bg-accent-500 hover:text-base-900"
        >
          Let's Talk
        </a>
      </div>
    </header>
  )
}
