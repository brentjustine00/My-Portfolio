import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { projects, type Project } from '../../data/projects'
import BootSequence from './BootSequence'
import CoreOverlay from './CoreOverlay'
import Hud from './Hud'
import NeuralSpace, { type NeuralSpaceHandle } from './NeuralSpace'
import ProjectOverlay from './ProjectOverlay'
import SignalOverlay from './SignalOverlay'

export default function BrentOS() {
  const neuralRef = useRef<NeuralSpaceHandle | null>(null)
  const [isBooted, setIsBooted] = useState(false)
  const [activeProject, setActiveProject] = useState<Project | null>(null)
  const [isSignalOpen, setIsSignalOpen] = useState(false)
  const [isCoreOpen, setIsCoreOpen] = useState(false)

  const bootLines = useMemo(
    () => [
      'Initializing Brent.OS…',
      'Verifying runtime…',
      'Mapping neural pathways…',
      `Loading projects… (${projects.length})`,
      'Calibrating depth field…',
      'System ready.',
    ],
    [],
  )

  const handleReturnToCore = useCallback(() => {
    setActiveProject(null)
    setIsSignalOpen(false)
    setIsCoreOpen(false)
    neuralRef.current?.returnToCore()
  }, [])

  const handleOpenCore = useCallback(() => {
    setActiveProject(null)
    setIsSignalOpen(false)
    setIsCoreOpen(true)
    neuralRef.current?.returnToCore()
  }, [])

  const handleContact = useCallback(() => {
    setActiveProject(null)
    setIsCoreOpen(false)
    setIsSignalOpen(true)
  }, [])

  const handleResume = useCallback(() => {
    // Keep this intentionally “OS-like”: a direct file pull.
    window.location.href = '/Resume.pdf'
  }, [])

  useEffect(() => {
    const onKeyDown = (ev: KeyboardEvent) => {
      if (!isBooted) return
      if (ev.key === 'Escape') handleReturnToCore()
      if (ev.key.toLowerCase() === 'r') handleReturnToCore()
      if (ev.key.toLowerCase() === 'i') handleOpenCore()
      if (ev.key.toLowerCase() === 'c') handleContact()
      if (ev.key.toLowerCase() === 'd') handleResume()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [handleContact, handleOpenCore, handleResume, handleReturnToCore, isBooted])

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      <NeuralSpace
        ref={neuralRef}
        projects={projects}
        onSelectProject={(project) => setActiveProject(project)}
        onSelectCore={handleOpenCore}
        dimmed={Boolean(activeProject) || isSignalOpen || isCoreOpen || !isBooted}
      />

      <AnimatePresence>
        {!isBooted && (
          <BootSequence key="boot" lines={bootLines} onComplete={() => setIsBooted(true)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isBooted && (
          <motion.div
            key="hud"
            className="pointer-events-none absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <div className="pointer-events-auto">
              <Hud
                onReturn={handleReturnToCore}
                onCore={handleOpenCore}
                onContact={handleContact}
                onResume={handleResume}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeProject && (
          <ProjectOverlay
            key={`project:${activeProject.title}`}
            project={activeProject}
            onClose={handleReturnToCore}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCoreOpen && <CoreOverlay key="core" onClose={handleReturnToCore} />}
      </AnimatePresence>

      <AnimatePresence>
        {isSignalOpen && (
          <SignalOverlay key="signal" onClose={handleReturnToCore} onResume={handleResume} />
        )}
      </AnimatePresence>
    </div>
  )
}
