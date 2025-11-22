/**
 * Settings Page
 */
import { GlassCard } from '@/components/ui'
import { Settings as SettingsIcon } from 'lucide-react'

export const Settings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gradient mb-2">Settings</h1>
        <p className="text-gray-400">Manage your account and preferences</p>
      </div>

      <GlassCard className="p-12 text-center">
        <SettingsIcon className="w-16 h-16 mx-auto mb-4 text-primary-500" />
        <h3 className="text-2xl font-bold mb-2">Settings Coming Soon</h3>
        <p className="text-gray-400 max-w-md mx-auto">
          Configure your account settings, notifications, and betting preferences.
        </p>
      </GlassCard>
    </div>
  )
}

export default Settings
