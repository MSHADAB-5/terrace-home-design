import { AnimatePresence, motion } from 'motion/react'

export function Loader({ done }: { done: boolean }) {
  return (
    <AnimatePresence>
      {!done && (
        <motion.div className="loader" exit={{ opacity: 0, transition: { duration: 0.8 } }} role="status" aria-label="Loading 3D preview">
          <svg viewBox="0 0 120 80" width="160">
            <motion.path
              d="M10 70 L10 30 L60 18 L110 30 L110 70 Z M10 70 L110 70 M60 70 L60 40 M30 70 L30 50 L42 50 L42 70"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.6, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
            />
          </svg>
          <p>Raising the walls…</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
