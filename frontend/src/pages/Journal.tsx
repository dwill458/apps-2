/**
 * Journal Page - Garden Journal
 * Quick capture thoughts, categorize them, and move sprouts to active goals
 */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sprout,
  Leaf,
  Flower2,
  Send,
  Filter,
  MoreVertical,
  Trash2,
  ArrowRight,
} from 'lucide-react'
import { GlassCard, Button, Modal } from '@/components/ui'
import { useJournalStore, useGoalsStore } from '@/store/useStore'
import type { JournalEntry, JournalEntryType } from '@/types'
import { format } from 'date-fns'

export const Journal = () => {
  const { entries, addEntry, updateEntry, deleteEntry } = useJournalStore()
  const { goals } = useGoalsStore()
  const [newEntryContent, setNewEntryContent] = useState('')
  const [filterType, setFilterType] = useState<JournalEntryType | 'all'>('all')
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null)
  const [showMoveModal, setShowMoveModal] = useState(false)

  const handleAddEntry = (type: JournalEntryType) => {
    if (!newEntryContent.trim()) return

    const entry: JournalEntry = {
      id: `entry-${Date.now()}`,
      userId: 'current-user',
      date: new Date().toISOString(),
      content: newEntryContent,
      type,
      createdAt: new Date().toISOString(),
    }

    addEntry(entry)
    setNewEntryContent('')
  }

  const handleMoveToGoal = (goalId: string) => {
    if (!selectedEntry) return
    // In a real app, this would create a new task for the selected goal
    // based on the journal entry content
    console.log('Moving entry to goal:', goalId, selectedEntry)
    setShowMoveModal(false)
    setSelectedEntry(null)
  }

  const filteredEntries =
    filterType === 'all'
      ? entries
      : entries.filter((e) => e.type === filterType)

  const seedEntries = entries.filter((e) => e.type === 'seed')
  const sproutEntries = entries.filter((e) => e.type === 'sprout')
  const bloomEntries = entries.filter((e) => e.type === 'bloom')

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-gradient mb-2">
          Garden Journal
        </h1>
        <p className="text-gray-400 text-lg">
          Capture your thoughts and watch them grow
        </p>
      </motion.div>

      {/* Quick Capture */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <GlassCard className="p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Capture</h2>
          <textarea
            className="input w-full min-h-[120px] resize-none mb-4"
            placeholder="What's on your mind? Ideas, wins, or learnings..."
            value={newEntryContent}
            onChange={(e) => setNewEntryContent(e.target.value)}
          />
          <div className="flex items-center gap-3">
            <p className="text-sm text-gray-400 flex-1">Tag as:</p>
            <Button
              onClick={() => handleAddEntry('seed')}
              variant="ghost"
              size="sm"
              icon={<Sprout className="w-4 h-4" />}
              disabled={!newEntryContent.trim()}
            >
              Seed
            </Button>
            <Button
              onClick={() => handleAddEntry('sprout')}
              variant="ghost"
              size="sm"
              icon={<Leaf className="w-4 h-4" />}
              disabled={!newEntryContent.trim()}
            >
              Sprout
            </Button>
            <Button
              onClick={() => handleAddEntry('bloom')}
              variant="success"
              size="sm"
              icon={<Flower2 className="w-4 h-4" />}
              disabled={!newEntryContent.trim()}
            >
              Bloom
            </Button>
          </div>
          <div className="mt-3 text-xs text-gray-500 space-y-1">
            <p>🌱 <strong>Seed</strong> - Raw ideas, things to explore later</p>
            <p>🌿 <strong>Sprout</strong> - Action items, things to work on</p>
            <p>🌸 <strong>Bloom</strong> - Wins, gratitude, completed milestones</p>
          </div>
        </GlassCard>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard className="p-6 text-center">
          <div className="text-4xl mb-2">🌱</div>
          <div className="text-3xl font-bold text-primary-400">{seedEntries.length}</div>
          <p className="text-sm text-gray-400 mt-1">Seeds Planted</p>
        </GlassCard>
        <GlassCard className="p-6 text-center">
          <div className="text-4xl mb-2">🌿</div>
          <div className="text-3xl font-bold text-success-400">{sproutEntries.length}</div>
          <p className="text-sm text-gray-400 mt-1">Sprouts Growing</p>
        </GlassCard>
        <GlassCard className="p-6 text-center">
          <div className="text-4xl mb-2">🌸</div>
          <div className="text-3xl font-bold text-warning-400">{bloomEntries.length}</div>
          <p className="text-sm text-gray-400 mt-1">Blooms Celebrated</p>
        </GlassCard>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <Filter className="w-5 h-5 text-gray-400" />
        <div className="flex items-center gap-2">
          <FilterButton
            active={filterType === 'all'}
            onClick={() => setFilterType('all')}
            label="All"
          />
          <FilterButton
            active={filterType === 'seed'}
            onClick={() => setFilterType('seed')}
            label="Seeds"
            icon={<Sprout className="w-4 h-4" />}
          />
          <FilterButton
            active={filterType === 'sprout'}
            onClick={() => setFilterType('sprout')}
            label="Sprouts"
            icon={<Leaf className="w-4 h-4" />}
          />
          <FilterButton
            active={filterType === 'bloom'}
            onClick={() => setFilterType('bloom')}
            label="Blooms"
            icon={<Flower2 className="w-4 h-4" />}
          />
        </div>
      </div>

      {/* Entries Feed */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredEntries.length > 0 ? (
            filteredEntries.map((entry, index) => (
              <EntryCard
                key={entry.id}
                entry={entry}
                index={index}
                onDelete={() => deleteEntry(entry.id)}
                onMoveToGoal={() => {
                  setSelectedEntry(entry)
                  setShowMoveModal(true)
                }}
                onChangeType={(newType) =>
                  updateEntry(entry.id, { type: newType })
                }
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <GlassCard className="p-12 text-center">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold mb-2">No entries yet</h3>
                <p className="text-gray-400">
                  {filterType === 'all'
                    ? 'Start capturing your thoughts above'
                    : `No ${filterType} entries found`}
                </p>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Move to Goal Modal */}
      <Modal
        isOpen={showMoveModal}
        onClose={() => setShowMoveModal(false)}
        title="Move to Active Goal"
      >
        <div className="space-y-3">
          <p className="text-gray-400 text-sm mb-4">
            Convert this sprout into a task for one of your active goals:
          </p>
          {goals.filter((g) => g.status === 'active').length > 0 ? (
            goals
              .filter((g) => g.status === 'active')
              .map((goal) => (
                <GlassCard
                  key={goal.id}
                  className="p-4 cursor-pointer hover:bg-white/15 transition-all"
                  onClick={() => handleMoveToGoal(goal.id)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getPlantEmoji(goal.plantStage)}</span>
                    <div className="flex-1">
                      <h4 className="font-semibold">{goal.title}</h4>
                      <p className="text-xs text-gray-400">
                        {goal.completedSteps} of {goal.totalSteps} steps
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                </GlassCard>
              ))
          ) : (
            <p className="text-gray-400 text-center py-4">
              No active goals. Create a goal first!
            </p>
          )}
        </div>
      </Modal>
    </div>
  )
}

// Entry Card Component
const EntryCard = ({
  entry,
  index,
  onDelete,
  onMoveToGoal,
  onChangeType,
}: {
  entry: JournalEntry
  index: number
  onDelete: () => void
  onMoveToGoal: () => void
  onChangeType: (type: JournalEntryType) => void
}) => {
  const [showMenu, setShowMenu] = useState(false)

  const typeConfig = {
    seed: { icon: <Sprout className="w-5 h-5" />, color: 'text-primary-400', bg: 'bg-primary-500/20' },
    sprout: { icon: <Leaf className="w-5 h-5" />, color: 'text-success-400', bg: 'bg-success-500/20' },
    bloom: { icon: <Flower2 className="w-5 h-5" />, color: 'text-warning-400', bg: 'bg-warning-500/20' },
  }

  const config = typeConfig[entry.type]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.05 }}
    >
      <GlassCard className="p-5">
        <div className="flex items-start gap-4">
          <div className={`p-2 rounded-lg ${config.bg} ${config.color}`}>
            {config.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white whitespace-pre-wrap break-words">
              {entry.content}
            </p>
            <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
              <span>{format(new Date(entry.date), 'MMM d, yyyy • h:mm a')}</span>
              <span className={`font-medium ${config.color} capitalize`}>
                {entry.type}
              </span>
            </div>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-lg hover:bg-white/10 text-gray-400 transition-colors"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute right-0 mt-2 w-48 glass p-2 space-y-1 shadow-xl z-10"
              >
                {entry.type !== 'seed' && (
                  <button
                    onClick={() => {
                      onChangeType('seed')
                      setShowMenu(false)
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 text-sm flex items-center gap-2"
                  >
                    <Sprout className="w-4 h-4" /> Move to Seeds
                  </button>
                )}
                {entry.type !== 'sprout' && (
                  <button
                    onClick={() => {
                      onChangeType('sprout')
                      setShowMenu(false)
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 text-sm flex items-center gap-2"
                  >
                    <Leaf className="w-4 h-4" /> Move to Sprouts
                  </button>
                )}
                {entry.type !== 'bloom' && (
                  <button
                    onClick={() => {
                      onChangeType('bloom')
                      setShowMenu(false)
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 text-sm flex items-center gap-2"
                  >
                    <Flower2 className="w-4 h-4" /> Move to Blooms
                  </button>
                )}
                {entry.type === 'sprout' && (
                  <>
                    <div className="border-t border-white/10 my-1" />
                    <button
                      onClick={() => {
                        onMoveToGoal()
                        setShowMenu(false)
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 text-sm flex items-center gap-2 text-success-400"
                    >
                      <ArrowRight className="w-4 h-4" /> Add to Goal
                    </button>
                  </>
                )}
                <div className="border-t border-white/10 my-1" />
                <button
                  onClick={() => {
                    onDelete()
                    setShowMenu(false)
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 text-sm flex items-center gap-2 text-danger-400"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
}

// Filter Button Component
const FilterButton = ({
  active,
  onClick,
  label,
  icon,
}: {
  active: boolean
  onClick: () => void
  label: string
  icon?: React.ReactNode
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all ${
        active
          ? 'bg-primary-500/30 text-primary-300 ring-2 ring-primary-500/50'
          : 'bg-white/5 text-gray-400 hover:bg-white/10'
      }`}
    >
      {icon}
      {label}
    </motion.button>
  )
}

// Helper functions
const getPlantEmoji = (stage: number): string => {
  const emojis: Record<number, string> = {
    1: '🌱',
    2: '🌿',
    3: '🪴',
    4: '🌳',
    5: '🌸',
  }
  return emojis[stage] || '🌱'
}

export default Journal
