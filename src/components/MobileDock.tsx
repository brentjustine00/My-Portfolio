const items = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
]

export default function MobileDock() {
  return (
    <nav className="fixed inset-x-4 bottom-4 z-50 rounded-2xl border border-base-600 bg-base-800/95 p-2 shadow-card backdrop-blur md:hidden">
      <ul className="grid grid-cols-4 gap-2">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="block rounded-xl px-2 py-2 text-center text-[10px] uppercase tracking-[0.2em] text-white/70 transition hover:bg-base-700 hover:text-accent-300"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
