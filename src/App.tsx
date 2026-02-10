import NavBar from './components/NavBar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Education from './components/Education'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="relative min-h-screen bg-base-900 text-white">
      <div className="absolute inset-0 -z-10 pointer-events-none dot-grid opacity-70" />
      <NavBar />
      <main className="relative">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Education />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
