/**
 * Cozy Settings Page - Comprehensive Settings
 * All user preferences, accessibility options, and data management
 */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User,
  Bell,
  Accessibility,
  Sparkles,
  Database,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Palette,
  Type,
  Zap,
  Download,
  Trash2,
  AlertTriangle,
  Check,
} from 'lucide-react'
import { GlassCard, Button, Input, Modal } from '@/components/ui'
import { useUserStore } from '@/store/useStore'
import type { AvatarCharacter, ColorPalette, ReminderIntensity, EnergyLevel, TaskDuration } from '@/types'

export const CozySettings = () => {
  const { user, updateSettings } = useUserStore()
  const [expandedSection, setExpandedSection] = useState<string | null>('profile')
  const [showResetModal, setShowResetModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const handleExportData = () => {
    // Export user data as JSON
    const dataStr = JSON.stringify(user, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `cozy-growth-data-${new Date().toISOString().split('T')[0]}.json`
    link.click()
  }

  const handleResetData = () => {
    // Reset all data to defaults
    console.log('Reset data - would clear all goals, tasks, and journal entries')
    setShowResetModal(false)
  }

  const handleDeleteAccount = () => {
    // Delete account
    console.log('Delete account - would remove all user data')
    setShowDeleteModal(false)
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-400">Loading settings...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-8 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-gradient mb-2">Settings</h1>
        <p className="text-gray-400 text-lg">
          Customize your Cozy Growth experience
        </p>
      </motion.div>

      {/* Profile Section */}
      <SettingsSection
        title="Profile"
        icon={<User className="w-5 h-5" />}
        isExpanded={expandedSection === 'profile'}
        onToggle={() => toggleSection('profile')}
      >
        <div className="space-y-4">
          <Input
            label="Display Name"
            value={user.name}
            onChange={(e) => {
              // Would update user name
              console.log('Update name:', e.target.value)
            }}
            placeholder="Your name"
          />

          <div>
            <label className="block text-sm font-medium mb-3 text-gray-300">
              Avatar Character
            </label>
            <div className="grid grid-cols-5 gap-3">
              {(['person', 'fox', 'bear', 'bird', 'plant'] as AvatarCharacter[]).map((char) => (
                <button
                  key={char}
                  onClick={() => {
                    // Would update avatar character
                    console.log('Update avatar:', char)
                  }}
                  className={`p-4 rounded-lg text-3xl text-center transition-all ${
                    user.avatarCharacter === char
                      ? 'bg-primary-500/30 ring-2 ring-primary-400'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  {getCharacterEmoji(char)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-3 text-gray-300">
              Color Palette
            </label>
            <div className="grid grid-cols-5 gap-3">
              {(['sage', 'moss', 'lavender', 'peach', 'sky'] as ColorPalette[]).map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    // Would update color palette
                    console.log('Update color:', color)
                  }}
                  className={`p-4 rounded-lg capitalize transition-all ${
                    user.avatarColor === color
                      ? 'ring-2 ring-primary-400'
                      : 'hover:ring-2 hover:ring-white/20'
                  } ${getColorClass(color)}`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Daily Goal (minutes)
            </label>
            <input
              type="range"
              min="5"
              max="120"
              step="5"
              value={user.dailyGoalMinutes}
              onChange={(e) => updateSettings({ dailyGoalMinutes: parseInt(e.target.value) })}
              className="w-full"
            />
            <div className="flex items-center justify-between text-sm text-gray-400 mt-2">
              <span>5 min</span>
              <span className="text-primary-400 font-semibold">{user.dailyGoalMinutes} min</span>
              <span>120 min</span>
            </div>
          </div>
        </div>
      </SettingsSection>

      {/* Notifications Section */}
      <SettingsSection
        title="Notifications"
        icon={<Bell className="w-5 h-5" />}
        isExpanded={expandedSection === 'notifications'}
        onToggle={() => toggleSection('notifications')}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-3 text-gray-300">
              Reminder Frequency
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['rarely', 'sometimes', 'often'] as ReminderIntensity[]).map((intensity) => (
                <button
                  key={intensity}
                  onClick={() => {
                    // Would update reminder intensity
                    console.log('Update reminder:', intensity)
                  }}
                  className={`p-3 rounded-lg capitalize transition-all ${
                    user.reminderIntensity === intensity
                      ? 'bg-primary-500/30 ring-2 ring-primary-400'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  {intensity}
                </button>
              ))}
            </div>
          </div>

          <ToggleSetting
            label="Quiet Hours"
            description="Disable notifications during specific hours"
            enabled={user.settings.quietHoursEnabled}
            onChange={(enabled) => updateSettings({ quietHoursEnabled: enabled })}
          />

          {user.settings.quietHoursEnabled && (
            <div className="grid grid-cols-2 gap-4 pl-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Start Time
                </label>
                <input
                  type="time"
                  value={user.settings.quietHoursStart}
                  onChange={(e) => updateSettings({ quietHoursStart: e.target.value })}
                  className="input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  End Time
                </label>
                <input
                  type="time"
                  value={user.settings.quietHoursEnd}
                  onChange={(e) => updateSettings({ quietHoursEnd: e.target.value })}
                  className="input w-full"
                />
              </div>
            </div>
          )}

          <ToggleSetting
            label="Sound Effects"
            description="Play sounds for celebrations and completions"
            enabled={user.settings.notificationSound}
            onChange={(enabled) => updateSettings({ notificationSound: enabled })}
          />

          <ToggleSetting
            label="Vibration"
            description="Haptic feedback on mobile devices"
            enabled={user.settings.notificationVibration}
            onChange={(enabled) => updateSettings({ notificationVibration: enabled })}
          />
        </div>
      </SettingsSection>

      {/* Accessibility Section */}
      <SettingsSection
        title="Accessibility"
        icon={<Accessibility className="w-5 h-5" />}
        isExpanded={expandedSection === 'accessibility'}
        onToggle={() => toggleSection('accessibility')}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-3 text-gray-300">
              Appearance
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['light', 'dark', 'auto'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => updateSettings({ appearance: mode as any })}
                  className={`p-3 rounded-lg capitalize flex items-center justify-center gap-2 transition-all ${
                    user.settings.appearance === mode
                      ? 'bg-primary-500/30 ring-2 ring-primary-400'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  {mode === 'light' && <Sun className="w-4 h-4" />}
                  {mode === 'dark' && <Moon className="w-4 h-4" />}
                  {mode === 'auto' && <Sparkles className="w-4 h-4" />}
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-3 text-gray-300">
              Text Size
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['cozy', 'comfortable', 'spacious'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => updateSettings({ textSize: size })}
                  className={`p-3 rounded-lg capitalize transition-all ${
                    user.settings.textSize === size
                      ? 'bg-primary-500/30 ring-2 ring-primary-400'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <ToggleSetting
            label="Dyslexia-Friendly Font"
            description="Use OpenDyslexic font for better readability"
            enabled={user.settings.dyslexiaFont}
            onChange={(enabled) => updateSettings({ dyslexiaFont: enabled })}
          />

          <ToggleSetting
            label="Reduce Motion"
            description="Minimize animations and transitions"
            enabled={user.settings.reduceMotion}
            onChange={(enabled) => updateSettings({ reduceMotion: enabled })}
          />

          <ToggleSetting
            label="High Contrast"
            description="Increase contrast for better visibility"
            enabled={user.settings.highContrast}
            onChange={(enabled) => updateSettings({ highContrast: enabled })}
          />
        </div>
      </SettingsSection>

      {/* Growth Preferences Section */}
      <SettingsSection
        title="Growth Preferences"
        icon={<Sparkles className="w-5 h-5" />}
        isExpanded={expandedSection === 'growth'}
        onToggle={() => toggleSection('growth')}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-3 text-gray-300">
              Default Energy Level
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['low', 'medium', 'high'] as EnergyLevel[]).map((energy) => (
                <button
                  key={energy}
                  onClick={() => updateSettings({ defaultEnergyLevel: energy })}
                  className={`p-3 rounded-lg capitalize flex items-center justify-center gap-2 transition-all ${
                    user.settings.defaultEnergyLevel === energy
                      ? 'bg-primary-500/30 ring-2 ring-primary-400'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  {energy === 'low' && '🌙'}
                  {energy === 'medium' && '☀️'}
                  {energy === 'high' && '⚡'}
                  {energy}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-3 text-gray-300">
              Preferred Duration
            </label>
            <div className="grid grid-cols-4 gap-3">
              {([3, 5, 10, 15] as TaskDuration[]).map((duration) => (
                <button
                  key={duration}
                  onClick={() => updateSettings({ preferredDuration: duration })}
                  className={`p-3 rounded-lg transition-all ${
                    user.settings.preferredDuration === duration
                      ? 'bg-primary-500/30 ring-2 ring-primary-400'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  {duration}m
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-3 text-gray-300">
              Task Suggestions Mode
            </label>
            <div className="space-y-2">
              {[
                { value: 'surprise', label: 'Surprise Me', desc: 'Let the app pick what fits' },
                { value: 'predictable', label: 'Predictable', desc: 'Follow goal order strictly' },
                { value: 'easy', label: 'Easy First', desc: 'Start with simpler tasks' },
              ].map(({ value, label, desc }) => (
                <button
                  key={value}
                  onClick={() => updateSettings({ taskSuggestionsMode: value as any })}
                  className={`w-full text-left p-4 rounded-lg transition-all ${
                    user.settings.taskSuggestionsMode === value
                      ? 'bg-primary-500/30 ring-2 ring-primary-400'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="font-medium">{label}</div>
                  <div className="text-sm text-gray-400">{desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-3 text-gray-300">
              Chain Intensity
            </label>
            <div className="space-y-2">
              {[
                { value: 'one_and_done', label: 'One and Done', desc: 'Celebrate after one task' },
                { value: 'keep_momentum', label: 'Keep Momentum', desc: 'Gentle nudge to continue' },
                { value: 'flow_state', label: 'Flow State', desc: 'Encourage task chaining' },
              ].map(({ value, label, desc }) => (
                <button
                  key={value}
                  onClick={() => updateSettings({ chainIntensity: value as any })}
                  className={`w-full text-left p-4 rounded-lg transition-all ${
                    user.settings.chainIntensity === value
                      ? 'bg-primary-500/30 ring-2 ring-primary-400'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="font-medium">{label}</div>
                  <div className="text-sm text-gray-400">{desc}</div>
                </button>
              ))}
            </div>
          </div>

          <ToggleSetting
            label="Debug Prompts"
            description="Show helpful tips when you skip tasks"
            enabled={user.settings.debugPrompts}
            onChange={(enabled) => updateSettings({ debugPrompts: enabled })}
          />

          <ToggleSetting
            label="Learning Mode"
            description="Get guidance and explanations as you use the app"
            enabled={user.settings.learningMode}
            onChange={(enabled) => updateSettings({ learningMode: enabled })}
          />
        </div>
      </SettingsSection>

      {/* Data & Privacy Section */}
      <SettingsSection
        title="Data & Privacy"
        icon={<Database className="w-5 h-5" />}
        isExpanded={expandedSection === 'data'}
        onToggle={() => toggleSection('data')}
      >
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-info-500/10 border border-info-500/20">
            <p className="text-sm text-info-300">
              Your data is stored locally on your device. We never collect or share your personal information.
            </p>
          </div>

          <Button
            onClick={handleExportData}
            variant="ghost"
            icon={<Download className="w-5 h-5" />}
            className="w-full justify-start"
          >
            Export My Data
          </Button>

          <div className="border-t border-white/10 pt-4">
            <h4 className="text-sm font-medium text-gray-300 mb-3">Danger Zone</h4>

            <Button
              onClick={() => setShowResetModal(true)}
              variant="ghost"
              icon={<Trash2 className="w-5 h-5" />}
              className="w-full justify-start text-warning-400 hover:text-warning-300 mb-2"
            >
              Reset All Data
            </Button>

            <Button
              onClick={() => setShowDeleteModal(true)}
              variant="ghost"
              icon={<AlertTriangle className="w-5 h-5" />}
              className="w-full justify-start text-danger-400 hover:text-danger-300"
            >
              Delete Account
            </Button>
          </div>
        </div>
      </SettingsSection>

      {/* About & Support Section */}
      <SettingsSection
        title="About & Support"
        icon={<HelpCircle className="w-5 h-5" />}
        isExpanded={expandedSection === 'about'}
        onToggle={() => toggleSection('about')}
      >
        <div className="space-y-4">
          <div className="text-center py-6">
            <div className="text-6xl mb-4">🌱</div>
            <h3 className="text-2xl font-bold mb-2">Cozy Growth</h3>
            <p className="text-gray-400 mb-1">Version 1.0.0</p>
            <p className="text-sm text-gray-500">ADHD-friendly productivity made cozy</p>
          </div>

          <div className="space-y-2 text-sm">
            <a
              href="#"
              className="block p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
            >
              Help & Documentation
            </a>
            <a
              href="#"
              className="block p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
            >
              Send Feedback
            </a>
            <a
              href="#"
              className="block p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="block p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
            >
              Terms of Service
            </a>
          </div>

          <div className="text-center pt-4 text-xs text-gray-500">
            Made with 💚 for the neurodiverse community
          </div>
        </div>
      </SettingsSection>

      {/* Reset Modal */}
      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="Reset All Data?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowResetModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleResetData}>
              Reset Everything
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 rounded-lg bg-warning-500/10 border border-warning-500/20">
            <AlertTriangle className="w-5 h-5 text-warning-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-warning-300 font-medium mb-1">This action cannot be undone</p>
              <p className="text-sm text-gray-400">
                This will delete all your goals, tasks, journal entries, and streak data.
                Your account settings will be preserved.
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-400">
            Consider exporting your data first if you want to keep a backup.
          </p>
        </div>
      </Modal>

      {/* Delete Account Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Account?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteAccount}>
              Delete Account
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 rounded-lg bg-danger-500/10 border border-danger-500/20">
            <AlertTriangle className="w-5 h-5 text-danger-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-danger-300 font-medium mb-1">This action is permanent</p>
              <p className="text-sm text-gray-400">
                This will permanently delete your account and all associated data.
                You will not be able to recover your data.
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

// Settings Section Component
const SettingsSection = ({
  title,
  icon,
  isExpanded,
  onToggle,
  children,
}: {
  title: string
  icon: React.ReactNode
  isExpanded: boolean
  onToggle: () => void
  children: React.ReactNode
}) => {
  return (
    <GlassCard className="overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="text-primary-400">{icon}</div>
          <h2 className="text-xl font-bold">{title}</h2>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2 border-t border-white/10">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  )
}

// Toggle Setting Component
const ToggleSetting = ({
  label,
  description,
  enabled,
  onChange,
}: {
  label: string
  description?: string
  enabled: boolean
  onChange: (enabled: boolean) => void
}) => {
  return (
    <div className="flex items-start justify-between gap-4 p-4 rounded-lg bg-white/5">
      <div className="flex-1">
        <div className="font-medium text-white">{label}</div>
        {description && (
          <div className="text-sm text-gray-400 mt-1">{description}</div>
        )}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${
          enabled ? 'bg-success-500' : 'bg-white/20'
        }`}
      >
        <motion.div
          animate={{ x: enabled ? 24 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg"
        />
      </button>
    </div>
  )
}

// Helper functions
const getCharacterEmoji = (char: AvatarCharacter): string => {
  const emojis: Record<AvatarCharacter, string> = {
    person: '🧑',
    fox: '🦊',
    bear: '🐻',
    bird: '🐦',
    plant: '🌿',
  }
  return emojis[char]
}

const getColorClass = (color: ColorPalette): string => {
  const classes: Record<ColorPalette, string> = {
    sage: 'bg-green-500/30 text-green-300',
    moss: 'bg-emerald-500/30 text-emerald-300',
    lavender: 'bg-purple-500/30 text-purple-300',
    peach: 'bg-orange-500/30 text-orange-300',
    sky: 'bg-blue-500/30 text-blue-300',
  }
  return classes[color]
}

export default CozySettings
