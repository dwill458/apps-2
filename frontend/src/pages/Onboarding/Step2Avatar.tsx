/**
 * Step2Avatar - Character and color palette selection
 * Second step of the onboarding flow
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useOnboardingStore, useUserStore } from '../../store/useStore';
import { OnboardingLayout } from './OnboardingLayout';
import { Button } from '../../components/ui/Button';
import { GlassCard } from '../../components/ui/GlassCard';
import { User, Dog as Fox, PawPrint as BearIcon, Bird, Sprout } from 'lucide-react';
import { clsx } from 'clsx';
import type { AvatarCharacter, ColorPalette } from '../../types';

const characters: Array<{ id: AvatarCharacter; icon: any; label: string }> = [
  { id: 'person', icon: User, label: 'Person' },
  { id: 'fox', icon: Fox, label: 'Fox' },
  { id: 'bear', icon: BearIcon, label: 'Bear' },
  { id: 'bird', icon: Bird, label: 'Bird' },
  { id: 'plant', icon: Sprout, label: 'Plant' },
];

const colors: Array<{ id: ColorPalette; name: string; bg: string; border: string }> = [
  { id: 'sage', name: 'Sage', bg: 'bg-emerald-100 dark:bg-emerald-800', border: 'border-emerald-500' },
  { id: 'moss', name: 'Moss', bg: 'bg-green-100 dark:bg-green-800', border: 'border-green-500' },
  { id: 'lavender', name: 'Lavender', bg: 'bg-purple-100 dark:bg-purple-800', border: 'border-purple-500' },
  { id: 'peach', name: 'Peach', bg: 'bg-orange-100 dark:bg-orange-800', border: 'border-orange-500' },
  { id: 'sky', name: 'Sky', bg: 'bg-blue-100 dark:bg-blue-800', border: 'border-blue-500' },
];

export const Step2Avatar = () => {
  const navigate = useNavigate();
  const { nextStep, previousStep } = useOnboardingStore();
  const { user, setUser } = useUserStore();

  const [selectedCharacter, setSelectedCharacter] = useState<AvatarCharacter>(
    user?.avatarCharacter || 'person'
  );
  const [selectedColor, setSelectedColor] = useState<ColorPalette>(
    user?.avatarColor || 'sage'
  );

  const handleBack = () => {
    previousStep();
    navigate('/onboarding/welcome');
  };

  const handleContinue = () => {
    if (user) {
      setUser({
        ...user,
        avatarCharacter: selectedCharacter,
        avatarColor: selectedColor,
      });
    }
    nextStep();
    navigate('/onboarding/goal');
  };

  return (
    <OnboardingLayout onBack={handleBack}>
      <GlassCard className="p-8 md:p-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 dark:text-emerald-100 mb-3">
            Choose Your Avatar
          </h2>
          <p className="text-lg text-emerald-700 dark:text-emerald-300">
            Pick a character and color that feels right for you
          </p>
        </motion.div>

        {/* Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <div
            className={clsx(
              'w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300',
              colors.find((c) => c.id === selectedColor)?.bg
            )}
          >
            {(() => {
              const Icon = characters.find((c) => c.id === selectedCharacter)?.icon;
              return Icon ? <Icon className="w-12 h-12 text-emerald-900 dark:text-emerald-100" strokeWidth={2} /> : null;
            })()}
          </div>
        </motion.div>

        {/* Character selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <label className="block text-sm font-medium text-emerald-800 dark:text-emerald-200 mb-3">
            Character
          </label>
          <div className="grid grid-cols-5 gap-3">
            {characters.map(({ id, icon: Icon, label }) => (
              <motion.button
                key={id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCharacter(id)}
                className={clsx(
                  'aspect-square rounded-xl flex flex-col items-center justify-center gap-2 transition-all duration-200',
                  selectedCharacter === id
                    ? 'bg-emerald-500 text-white shadow-lg scale-105'
                    : 'bg-white/50 dark:bg-white/10 text-emerald-700 dark:text-emerald-300 hover:bg-white/70 dark:hover:bg-white/20'
                )}
              >
                <Icon className="w-8 h-8" strokeWidth={2} />
                <span className="text-xs font-medium">{label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Color selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <label className="block text-sm font-medium text-emerald-800 dark:text-emerald-200 mb-3">
            Color Theme
          </label>
          <div className="grid grid-cols-5 gap-3">
            {colors.map(({ id, name, bg, border }) => (
              <motion.button
                key={id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedColor(id)}
                className={clsx(
                  'aspect-square rounded-xl transition-all duration-200 border-4',
                  bg,
                  selectedColor === id
                    ? `${border} shadow-lg scale-105`
                    : 'border-transparent hover:border-emerald-300 dark:hover:border-emerald-700'
                )}
                title={name}
              >
                <span className="sr-only">{name}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Continue button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            onClick={handleContinue}
            variant="primary"
            size="lg"
            className="w-full"
          >
            Continue
          </Button>
        </motion.div>
      </GlassCard>
    </OnboardingLayout>
  );
};

export default Step2Avatar;
