/**
 * DebugLoop - Blocker selection screen
 * Helps users identify why they want to skip a task
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTaskFlowStore, useGoalsStore, useJournalStore } from '../../store/useStore';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import {
  ArrowLeft,
  AlertCircle,
  Calendar,
  Zap,
  ThumbsDown,
  Lightbulb,
} from 'lucide-react';
import { clsx } from 'clsx';
import type { BlockerType } from '../../types';

const blockerOptions: Array<{
  id: BlockerType;
  icon: any;
  label: string;
  description: string;
  color: string;
}> = [
  {
    id: 'too_big',
    icon: AlertCircle,
    label: 'Feels Too Big',
    description: 'This task seems overwhelming right now',
    color: 'text-amber-600 dark:text-amber-400',
  },
  {
    id: 'wrong_time',
    icon: Calendar,
    label: 'Wrong Time',
    description: "Not the right moment for this task",
    color: 'text-blue-600 dark:text-blue-400',
  },
  {
    id: 'unexpected_event',
    icon: Zap,
    label: 'Something Came Up',
    description: 'An unexpected event changed my plans',
    color: 'text-purple-600 dark:text-purple-400',
  },
  {
    id: 'not_feeling_it',
    icon: ThumbsDown,
    label: 'Not Feeling It',
    description: 'Just not in the mood for this right now',
    color: 'text-rose-600 dark:text-rose-400',
  },
];

export const DebugLoop = () => {
  const navigate = useNavigate();
  const { chainState, skipTask } = useTaskFlowStore();
  const { goals, updateTask } = useGoalsStore();
  const addEntry = useJournalStore((state) => state.addEntry);

  const [selectedBlocker, setSelectedBlocker] = useState<BlockerType | null>(null);
  const [notes, setNotes] = useState('');

  const currentTask = chainState.currentTask;
  const currentGoal = currentTask
    ? goals.find((g) => g.id === currentTask.goalId)
    : null;

  const handleBack = () => {
    navigate('/task/suggestion');
  };

  const handleSubmit = () => {
    if (!selectedBlocker || !currentTask) return;

    // Record the blocker
    const journalEntry = {
      id: crypto.randomUUID(),
      userId: currentTask.goalId, // Using goalId as userId for now
      date: new Date().toISOString().split('T')[0],
      content: `Skipped task: ${currentTask.title}. Reason: ${selectedBlocker}. ${notes ? `Notes: ${notes}` : ''}`,
      type: 'sprout' as const,
      linkedGoalId: currentTask.goalId,
      linkedStepId: currentTask.id,
      createdAt: new Date().toISOString(),
    };

    addEntry(journalEntry);

    // Update task status
    updateTask(currentTask.id, { status: 'skipped' });

    // Navigate based on blocker type
    if (selectedBlocker === 'too_big') {
      // Offer an easier alternative
      navigate('/task/fallback');
    } else {
      // Return to home
      navigate('/home');
    }
  };

  if (!currentTask || !currentGoal) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950 dark:via-teal-950 dark:to-cyan-950">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 -left-20 w-96 h-96 bg-emerald-200/20 dark:bg-emerald-800/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 dark:hover:text-emerald-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassCard className="p-8 md:p-12">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <Lightbulb className="w-16 h-16 text-amber-400" fill="currentColor" />
              </motion.div>
            </div>

            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-emerald-900 dark:text-emerald-100 mb-3">
                Let's Debug This
              </h2>
              <p className="text-lg text-emerald-700 dark:text-emerald-300">
                Understanding what's blocking you helps us suggest better tasks
              </p>
            </div>

            {/* Task context */}
            <div className="mb-6 p-4 bg-white/50 dark:bg-white/10 rounded-lg">
              <p className="text-sm text-emerald-600 dark:text-emerald-400 mb-1">
                Task you wanted to skip:
              </p>
              <p className="font-semibold text-emerald-900 dark:text-emerald-100">
                {currentTask.title}
              </p>
            </div>

            {/* Blocker selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-emerald-800 dark:text-emerald-200 mb-3">
                What's making this hard right now?
              </label>
              <div className="space-y-3">
                {blockerOptions.map(({ id, icon: Icon, label, description, color }) => (
                  <motion.button
                    key={id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedBlocker(id)}
                    className={clsx(
                      'w-full p-4 rounded-xl flex items-center gap-4 transition-all duration-200 text-left',
                      selectedBlocker === id
                        ? 'bg-emerald-500 text-white shadow-lg scale-105'
                        : 'bg-white/50 dark:bg-white/10 hover:bg-white/70 dark:hover:bg-white/20'
                    )}
                  >
                    <Icon
                      className={clsx(
                        'w-6 h-6 flex-shrink-0',
                        selectedBlocker === id ? 'text-white' : color
                      )}
                    />
                    <div className="flex-1">
                      <div className="font-semibold mb-1">{label}</div>
                      <div
                        className={clsx(
                          'text-sm',
                          selectedBlocker === id
                            ? 'text-white/90'
                            : 'text-emerald-600 dark:text-emerald-400'
                        )}
                      >
                        {description}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Optional notes */}
            {selectedBlocker && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-6"
              >
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-emerald-800 dark:text-emerald-200 mb-2"
                >
                  Any additional thoughts? (optional)
                </label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="What would make this task easier?"
                  className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-white/10 border-2 border-emerald-200 dark:border-emerald-800 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-0 transition-colors text-emerald-900 dark:text-emerald-100 placeholder-emerald-400 dark:placeholder-emerald-600 resize-none"
                  rows={3}
                />
              </motion.div>
            )}

            {/* Submit button */}
            <div>
              <Button
                onClick={handleSubmit}
                variant="primary"
                size="lg"
                className="w-full"
                disabled={!selectedBlocker}
              >
                {selectedBlocker === 'too_big'
                  ? 'Find Easier Alternative'
                  : 'Got It, Thanks!'}
              </Button>
            </div>

            {/* Encouraging message */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center text-sm text-emerald-600 dark:text-emerald-400 mt-6 italic"
            >
              It's totally okay to skip a task. We're learning what works best for you.
            </motion.p>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

export default DebugLoop;
