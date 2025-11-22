/**
 * Garden Page - Goals Overview
 * Display all active goals as growing plants
 */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Sprout, Flower2, TreePine, Leaf } from 'lucide-react'
import { Link } from 'react-router-dom'
import { GlassCard, Button, Modal, Input } from '@/components/ui'
import { useGoalsStore } from '@/store/useStore'
import type { Goal, PlantStage } from '@/types'

export const Garden = () => {
  const { goals, addGoal } = useGoalsStore()
  const [showNewGoalModal, setShowNewGoalModal] = useState(false)
  const [newGoalTitle, setNewGoalTitle] = useState('')
  const [newGoalDescription, setNewGoalDescription] = useState('')

  const activeGoals = goals.filter(g => g.status === 'active')
  const completedGoals = goals.filter(g => g.status === 'completed')

  const handleCreateGoal = () => {
    if (!newGoalTitle.trim()) return

    const newGoal: Goal = {
      id: `goal-${Date.now()}`,
      userId: 'current-user',
      title: newGoalTitle,
      description: newGoalDescription || undefined,
      plantType: getRandomPlantType(),
      plantStage: 1,
      status: 'active',
      totalSteps: 10, // Will be updated when AI breaks down the goal
      completedSteps: 0,
      estimatedHours: 0,
      createdAt: new Date().toISOString(),
    }

    addGoal(newGoal)
    setNewGoalTitle('')
    setNewGoalDescription('')
    setShowNewGoalModal(false)
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold text-gradient mb-2">
            Your Garden
          </h1>
          <p className="text-gray-400 text-lg">
            Watch your goals grow into beautiful blooms
          </p>
        </div>
        <Button
          onClick={() => setShowNewGoalModal(true)}
          variant="success"
          icon={<Plus className="w-5 h-5" />}
        >
          New Goal
        </Button>
      </motion.div>

      {/* Active Goals Grid */}
      {activeGoals.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-white/90">Growing Plants</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeGoals.map((goal, index) => (
              <PlantCard key={goal.id} goal={goal} index={index} />
            ))}
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <GlassCard className="p-12 text-center">
            <div className="text-6xl mb-4">🌱</div>
            <h3 className="text-2xl font-semibold mb-2">Plant Your First Seed</h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Start your growth journey by adding your first goal.
              Watch it grow as you complete small, achievable tasks.
            </p>
            <Button
              onClick={() => setShowNewGoalModal(true)}
              variant="success"
              icon={<Plus className="w-5 h-5" />}
            >
              Add Your First Goal
            </Button>
          </GlassCard>
        </motion.div>
      )}

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-white/90">
            Bloomed Goals ({completedGoals.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {completedGoals.map((goal, index) => (
              <CompletedPlantCard key={goal.id} goal={goal} index={index} />
            ))}
          </div>
        </div>
      )}

      {/* New Goal Modal */}
      <Modal
        isOpen={showNewGoalModal}
        onClose={() => setShowNewGoalModal(false)}
        title="Plant a New Goal"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setShowNewGoalModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="success"
              onClick={handleCreateGoal}
              disabled={!newGoalTitle.trim()}
            >
              Plant Goal
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="What do you want to grow?"
            placeholder="e.g., Learn to play guitar"
            value={newGoalTitle}
            onChange={(e) => setNewGoalTitle(e.target.value)}
            autoFocus
          />
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Description (optional)
            </label>
            <textarea
              className="input w-full min-h-[100px] resize-none"
              placeholder="Add more details about your goal..."
              value={newGoalDescription}
              onChange={(e) => setNewGoalDescription(e.target.value)}
            />
          </div>
          <p className="text-sm text-gray-400">
            After creating your goal, we'll help you break it down into small,
            achievable tasks that you can tackle one at a time.
          </p>
        </div>
      </Modal>
    </div>
  )
}

// Plant Card Component
const PlantCard = ({ goal, index }: { goal: Goal; index: number }) => {
  const { getTasksByGoal } = useGoalsStore()
  const tasks = getTasksByGoal(goal.id)
  const progress = goal.totalSteps > 0
    ? Math.round((goal.completedSteps / goal.totalSteps) * 100)
    : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link to={`/garden/${goal.id}`}>
        <GlassCard className="p-6 hover:bg-white/15 transition-all cursor-pointer h-full">
          {/* Plant Visualization */}
          <div className="relative mb-6 h-32 flex items-end justify-center">
            <PlantVisualization stage={goal.plantStage} plantType={goal.plantType} />
          </div>

          {/* Goal Info */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-white line-clamp-2">
              {goal.title}
            </h3>

            {goal.description && (
              <p className="text-sm text-gray-400 line-clamp-2">
                {goal.description}
              </p>
            )}

            {/* Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Progress</span>
                <span className="font-semibold text-success-400">
                  {goal.completedSteps} of {goal.totalSteps} steps
                </span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                  className="h-full bg-gradient-to-r from-success-500 to-success-400 rounded-full"
                />
              </div>
            </div>

            {/* Plant Stage Badge */}
            <div className="flex items-center gap-2 text-sm text-gray-400">
              {getStageIcon(goal.plantStage)}
              <span>{getStageName(goal.plantStage)}</span>
            </div>
          </div>
        </GlassCard>
      </Link>
    </motion.div>
  )
}

// Completed Plant Card
const CompletedPlantCard = ({ goal, index }: { goal: Goal; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
    >
      <GlassCard className="p-4 text-center opacity-75 hover:opacity-100 transition-opacity">
        <div className="text-4xl mb-2">🌸</div>
        <h4 className="font-semibold text-sm text-white mb-1 line-clamp-1">
          {goal.title}
        </h4>
        <p className="text-xs text-success-400">Bloomed!</p>
      </GlassCard>
    </motion.div>
  )
}

// Plant Visualization Component
const PlantVisualization = ({ stage, plantType }: { stage: PlantStage; plantType: string }) => {
  const getPlantEmoji = (stage: PlantStage) => {
    const emojis: Record<PlantStage, string> = {
      1: '🌱', // Seedling
      2: '🌿', // Small sprout
      3: '🪴', // Growing plant
      4: '🌳', // Young tree
      5: '🌸', // Full bloom
    }
    return emojis[stage]
  }

  const scale = stage * 0.15 + 0.7 // Scales from 0.85 to 1.45

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      className="text-6xl filter drop-shadow-lg"
    >
      {getPlantEmoji(stage)}
    </motion.div>
  )
}

// Helper functions
const getStageIcon = (stage: PlantStage) => {
  const icons: Record<PlantStage, JSX.Element> = {
    1: <Sprout className="w-4 h-4" />,
    2: <Leaf className="w-4 h-4" />,
    3: <Sprout className="w-4 h-4" />,
    4: <TreePine className="w-4 h-4" />,
    5: <Flower2 className="w-4 h-4" />,
  }
  return icons[stage]
}

const getStageName = (stage: PlantStage): string => {
  const names: Record<PlantStage, string> = {
    1: 'Just Planted',
    2: 'Sprouting',
    3: 'Growing Strong',
    4: 'Almost There',
    5: 'In Full Bloom',
  }
  return names[stage]
}

const getRandomPlantType = (): string => {
  const types = ['sunflower', 'rose', 'tulip', 'lavender', 'cherry-blossom', 'oak', 'bamboo']
  return types[Math.floor(Math.random() * types.length)]
}

export default Garden
