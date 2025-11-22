/**
 * ConfettiAnimation Component - Cozy Growth Design System
 * Celebration confetti effect using Framer Motion with plant-themed particles
 */
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ConfettiAnimationProps {
  isActive: boolean
  onComplete?: () => void
  duration?: number // in seconds
  particleCount?: number
  type?: 'celebration' | 'achievement' | 'task-complete'
}

interface Particle {
  id: number
  x: number
  y: number
  rotation: number
  delay: number
  emoji: string
  scale: number
}

const particleEmojis = {
  celebration: ['🌸', '🌼', '🌻', '🌺', '✨', '⭐', '💫', '🌟'],
  achievement: ['🏆', '🎖️', '👑', '✨', '⭐', '🌟', '💎'],
  'task-complete': ['✅', '🌱', '🌿', '🍃', '✨', '💚', '🌟'],
}

export const ConfettiAnimation = ({
  isActive,
  onComplete,
  duration = 3,
  particleCount = 50,
  type = 'celebration',
}: ConfettiAnimationProps) => {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    if (isActive) {
      // Generate particles
      const emojis = particleEmojis[type]
      const newParticles: Particle[] = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        x: Math.random() * 100, // percentage across screen
        y: -10, // start above screen
        rotation: Math.random() * 360,
        delay: Math.random() * 0.5,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        scale: 0.8 + Math.random() * 0.4, // 0.8 to 1.2
      }))
      setParticles(newParticles)

      // Call onComplete after animation
      if (onComplete) {
        const timer = setTimeout(onComplete, duration * 1000)
        return () => clearTimeout(timer)
      }
    } else {
      setParticles([])
    }
  }, [isActive, duration, particleCount, type, onComplete])

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {isActive &&
          particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute text-2xl"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
              }}
              initial={{
                y: -50,
                x: 0,
                rotate: particle.rotation,
                opacity: 1,
                scale: particle.scale,
              }}
              animate={{
                y: window.innerHeight + 50,
                x: (Math.random() - 0.5) * 200, // drift left/right
                rotate: particle.rotation + 720, // spin while falling
                opacity: [1, 1, 0.8, 0],
              }}
              transition={{
                duration: duration,
                delay: particle.delay,
                ease: [0.33, 1, 0.68, 1], // easeOutCubic
              }}
              exit={{ opacity: 0 }}
            >
              {particle.emoji}
            </motion.div>
          ))}
      </AnimatePresence>
    </div>
  )
}

/**
 * Simple confetti burst for quick celebrations
 */
interface ConfettiBurstProps {
  x?: number // x position in pixels
  y?: number // y position in pixels
  onComplete?: () => void
}

export const ConfettiBurst = ({ x = 0, y = 0, onComplete }: ConfettiBurstProps) => {
  const [isActive, setIsActive] = useState(true)
  const burstParticles = 20

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsActive(false)
      onComplete?.()
    }, 1500)
    return () => clearTimeout(timer)
  }, [onComplete])

  const particles = Array.from({ length: burstParticles }, (_, i) => {
    const angle = (i / burstParticles) * Math.PI * 2
    const distance = 100 + Math.random() * 100
    const emojis = ['✨', '🌟', '⭐', '💫', '🌸']
    return {
      id: i,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      rotation: Math.random() * 360,
    }
  })

  return (
    <div
      className="fixed pointer-events-none z-50"
      style={{ left: x, top: y }}
    >
      <AnimatePresence>
        {isActive &&
          particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute text-xl"
              initial={{
                x: 0,
                y: 0,
                scale: 0,
                rotate: 0,
                opacity: 1,
              }}
              animate={{
                x: particle.x,
                y: particle.y,
                scale: [0, 1.2, 0],
                rotate: particle.rotation,
                opacity: [1, 1, 0],
              }}
              transition={{
                duration: 1.5,
                ease: 'easeOut',
              }}
              exit={{ opacity: 0 }}
            >
              {particle.emoji}
            </motion.div>
          ))}
      </AnimatePresence>
    </div>
  )
}

export default ConfettiAnimation
