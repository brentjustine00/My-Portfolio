import { useEffect, useRef, useState } from 'react'
import logo from '../assets/logo.svg'

const navItems = ['home', 'about', 'skills', 'projects', 'education', 'contact'] as const

type NavId = (typeof navItems)[number]

type IndicatorState = {
  left: number
  width: number
  visible: boolean
}

export default function NavBar() {
  const [active, setActive] = useState<NavId>('home')
  const [indicator, setIndicator] = useState<IndicatorState>({ left: 0, width: 0, visible: false })

  const navRef = useRef<HTMLDivElement | null>(null)
  const linkRefs = useRef<Record<NavId, HTMLAnchorElement | null>>({
    home: null,
    about: null,
    skills: null,
    projects: null,
    education: null,
    contact: null,
  })

  const moveIndicator = (id: NavId) => {
    const nav = navRef.current
    const link = linkRefs.current[id]

    if (!nav || !link) return

    const navRect = nav.getBoundingClientRect()
    const linkRect = link.getBoundingClientRect()

    setIndicator({
      left: linkRect.left - navRect.left,
      width: linkRect.width,
      visible: true,
    })
  }

  useEffect(() => {
    const handleScroll = () => {
      let current: NavId = 'home'

      navItems.forEach((id) => {
        const section = document.getElementById(id)
        if (!section) return

        const rect = section.getBoundingClientRect()
        if (rect.top <= 140) {
          current = id
        }
      })

      setActive((prev) => (prev === current ? prev : current))
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    moveIndicator(active)
  }, [active])

  useEffect(() => {
    const onResize = () => moveIndicator(active)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [active])

  return (
    <header className="sticky top-0 z-40 border-b border-base-700/60 bg-base-900/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 md:px-6 md:py-4">
        <div className="flex min-w-0 items-center gap-3">
          <img src={logo} alt="Logo" className="h-8 w-8" />
          <div className="min-w-0">
            <p className="truncate font-display text-base font-semibold tracking-tight md:text-lg">Brent Barbadillo</p>
            <p className="truncate text-[10px] uppercase tracking-[0.2em] text-accent-400 md:text-xs">Aspiring Full-Stack</p>
          </div>
        </div>

        <div ref={navRef} className="relative hidden md:block">
          <nav className="flex items-center gap-8 text-sm">
            {navItems.map((item) => {
              const isActive = active === item
              const linkClass = [
                'uppercase tracking-[0.2em] transition',
                isActive ? 'text-accent-300' : 'text-white/70 hover:text-white',
              ].join(' ')

              return (
                <a
                  key={item}
                  href={`#${item}`}
                  ref={(el) => {
                    linkRefs.current[item] = el
                  }}
                  onClick={() => setActive(item)}
                  className={linkClass}
                >
                  {item}
                </a>
              )
            })}
          </nav>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-2 h-[2px] bg-accent-400 transition-all duration-300"
            style={{
              left: indicator.left,
              width: indicator.width,
              opacity: indicator.visible ? 1 : 0,
            }}
          />
        </div>

        <a
          href="#contact"
          className="rounded-full border border-accent-500 px-3 py-2 text-[10px] uppercase tracking-[0.25em] text-accent-300 transition hover:bg-accent-500 hover:text-base-900 md:px-4 md:text-xs md:tracking-[0.3em]"
        >
          Let's Talk
        </a>
      </div>
    </header>
  )
}
