import NavBar from './components/NavBar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Education from './components/Education'
import Contact from './components/Contact'
import Footer from './components/Footer'
import GestureControl from './components/GestureControl'
import MobileDock from './components/MobileDock'

export default function App() {
  return (
    <div className="relative min-h-screen bg-base-900 pb-24 text-white md:pb-0">
      <div className="absolute inset-0 -z-10 pointer-events-none dot-grid opacity-70" />
      <NavBar />
      <GestureControl />
      <main className="relative">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Education />
        <Contact />
      </main>
      <Footer />
      <MobileDock />
    </div>
  )
}
