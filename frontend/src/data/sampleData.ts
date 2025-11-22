// ===================================
// COZY GROWTH SAMPLE DATA
// ===================================

import type {
  User,
  Goal,
  MicroTask,
  JournalEntry,
  StreakLog,
  Badge,
  PlantCollectionItem,
  DailyStats,
} from '../types';

// ===================================
// SAMPLE USER PROFILE
// ===================================

export const sampleUser: User = {
  id: 'user-001',
  name: 'Alex Rivers',
  email: 'alex@cozy.growth',
  avatarCharacter: 'fox',
  avatarColor: 'sage',
  reminderIntensity: 'sometimes',
  dailyGoalMinutes: 15,
  onboardingCompleted: true,
  graceBlooms: 3,
  bloomPoints: 2450,
  totalDaysShowedUp: 45,
  longestStreak: 12,
  currentStreak: 7,
  lastActiveDate: new Date().toISOString().split('T')[0],
  createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
  settings: {
    quietHoursEnabled: true,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00',
    notificationSound: true,
    notificationVibration: false,
    appearance: 'auto',
    textSize: 'comfortable',
    dyslexiaFont: false,
    reduceMotion: false,
    highContrast: false,
    defaultEnergyLevel: 'medium',
    preferredDuration: 10,
    taskSuggestionsMode: 'surprise',
    chainIntensity: 'keep_momentum',
    debugPrompts: true,
    learningMode: true,
  },
};

// ===================================
// SAMPLE GOALS
// ===================================

export const sampleGoals: Goal[] = [
  {
    id: 'goal-001',
    userId: 'user-001',
    title: 'Learn Spanish Basics',
    description: 'Build foundation in Spanish for upcoming trip to Mexico',
    plantType: 'sunflower',
    plantStage: 3,
    status: 'active',
    totalSteps: 12,
    completedSteps: 7,
    estimatedHours: 3,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'goal-002',
    userId: 'user-001',
    title: 'Start Daily Journaling',
    description: 'Develop a consistent journaling habit for mental clarity',
    plantType: 'lavender',
    plantStage: 2,
    status: 'active',
    totalSteps: 8,
    completedSteps: 3,
    estimatedHours: 2,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'goal-003',
    userId: 'user-001',
    title: 'Organize Home Office',
    description: 'Create a clean, inspiring workspace',
    plantType: 'cactus',
    plantStage: 4,
    status: 'active',
    totalSteps: 10,
    completedSteps: 8,
    estimatedHours: 4,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'goal-004',
    userId: 'user-001',
    title: 'Read "Atomic Habits"',
    description: 'Finish reading and take notes on key concepts',
    plantType: 'fern',
    plantStage: 5,
    status: 'completed',
    totalSteps: 6,
    completedSteps: 6,
    estimatedHours: 6,
    createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// ===================================
// SAMPLE MICRO-TASKS
// ===================================

export const sampleMicroTasks: MicroTask[] = [
  // Spanish Learning Tasks
  {
    id: 'task-001',
    goalId: 'goal-001',
    title: 'Learn 5 common greetings',
    description: 'Practice: Hola, Buenos días, Buenas tardes, Buenas noches, ¿Cómo estás?',
    durationMinutes: 5,
    difficulty: 'easy',
    spicyFlag: false,
    orderIndex: 1,
    status: 'completed',
    completedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'task-002',
    goalId: 'goal-001',
    title: 'Count from 1 to 20',
    description: 'Write and pronounce numbers uno through veinte',
    durationMinutes: 5,
    difficulty: 'easy',
    spicyFlag: false,
    orderIndex: 2,
    status: 'completed',
    completedAt: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'task-003',
    goalId: 'goal-001',
    title: 'Learn days of the week',
    description: 'Memorize lunes through domingo with pronunciation',
    durationMinutes: 5,
    difficulty: 'easy',
    spicyFlag: false,
    orderIndex: 3,
    status: 'completed',
    completedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'task-004',
    goalId: 'goal-001',
    title: 'Practice basic introductions',
    description: 'Say: Me llamo..., Soy de..., Tengo... años',
    durationMinutes: 10,
    difficulty: 'medium',
    spicyFlag: false,
    orderIndex: 4,
    status: 'completed',
    completedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'task-005',
    goalId: 'goal-001',
    title: 'Learn 10 food words',
    description: 'Common foods: agua, pan, café, arroz, pollo, etc.',
    durationMinutes: 10,
    difficulty: 'medium',
    spicyFlag: false,
    orderIndex: 5,
    status: 'completed',
    completedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'task-006',
    goalId: 'goal-001',
    title: 'Order food at restaurant (role-play)',
    description: 'Practice: Quisiera..., La cuenta por favor, etc.',
    durationMinutes: 10,
    difficulty: 'medium',
    spicyFlag: true,
    orderIndex: 6,
    status: 'completed',
    completedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'task-007',
    goalId: 'goal-001',
    title: 'Ask for directions',
    description: 'Learn: ¿Dónde está...?, a la derecha, a la izquierda',
    durationMinutes: 10,
    difficulty: 'medium',
    spicyFlag: false,
    orderIndex: 7,
    status: 'completed',
    completedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'task-008',
    goalId: 'goal-001',
    title: 'Practice present tense -ar verbs',
    description: 'Conjugate: hablar, caminar, estudiar, trabajar',
    durationMinutes: 15,
    difficulty: 'hard',
    spicyFlag: true,
    orderIndex: 8,
    status: 'pending',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'task-009',
    goalId: 'goal-001',
    title: 'Learn common question words',
    description: 'Qué, Dónde, Cuándo, Cómo, Por qué, Quién, Cuánto',
    durationMinutes: 10,
    difficulty: 'medium',
    spicyFlag: false,
    orderIndex: 9,
    status: 'pending',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'task-010',
    goalId: 'goal-001',
    title: 'Watch a 5-min Spanish kids video',
    description: 'Listen for words you know, pause and repeat',
    durationMinutes: 10,
    difficulty: 'medium',
    spicyFlag: false,
    orderIndex: 10,
    status: 'pending',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },

  // Journaling Tasks
  {
    id: 'task-011',
    goalId: 'goal-002',
    title: 'Pick a journal and pen',
    description: 'Choose tools that feel good to use',
    durationMinutes: 5,
    difficulty: 'easy',
    spicyFlag: false,
    orderIndex: 1,
    status: 'completed',
    completedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'task-012',
    goalId: 'goal-002',
    title: 'Write about today in 3 sentences',
    description: 'Just describe what happened, no pressure',
    durationMinutes: 5,
    difficulty: 'easy',
    spicyFlag: false,
    orderIndex: 2,
    status: 'completed',
    completedAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'task-013',
    goalId: 'goal-002',
    title: 'List 5 things you\'re grateful for',
    description: 'Can be big or tiny things',
    durationMinutes: 5,
    difficulty: 'easy',
    spicyFlag: false,
    orderIndex: 3,
    status: 'completed',
    completedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'task-014',
    goalId: 'goal-002',
    title: 'Morning pages - stream of consciousness',
    description: 'Write whatever comes to mind for 10 minutes',
    durationMinutes: 10,
    difficulty: 'medium',
    spicyFlag: false,
    orderIndex: 4,
    status: 'pending',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'task-015',
    goalId: 'goal-002',
    title: 'Reflect on a recent challenge',
    description: 'What did you learn? How did you grow?',
    durationMinutes: 10,
    difficulty: 'medium',
    spicyFlag: true,
    orderIndex: 5,
    status: 'pending',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },

  // Home Office Organization Tasks
  {
    id: 'task-016',
    goalId: 'goal-003',
    title: 'Clear desk surface completely',
    description: 'Move everything off - fresh start',
    durationMinutes: 10,
    difficulty: 'easy',
    spicyFlag: false,
    orderIndex: 1,
    status: 'completed',
    completedAt: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'task-017',
    goalId: 'goal-003',
    title: 'Sort papers into keep/recycle/scan',
    description: 'Make three piles and be ruthless',
    durationMinutes: 15,
    difficulty: 'medium',
    spicyFlag: false,
    orderIndex: 2,
    status: 'completed',
    completedAt: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'task-018',
    goalId: 'goal-003',
    title: 'Organize cables and chargers',
    description: 'Label them and use cable ties',
    durationMinutes: 10,
    difficulty: 'easy',
    spicyFlag: false,
    orderIndex: 3,
    status: 'completed',
    completedAt: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'task-019',
    goalId: 'goal-003',
    title: 'Clean keyboard and monitor',
    description: 'Wipe down all surfaces',
    durationMinutes: 5,
    difficulty: 'easy',
    spicyFlag: false,
    orderIndex: 4,
    status: 'completed',
    completedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'task-020',
    goalId: 'goal-003',
    title: 'Set up filing system',
    description: 'Create labeled folders or drawers',
    durationMinutes: 15,
    difficulty: 'medium',
    spicyFlag: false,
    orderIndex: 5,
    status: 'completed',
    completedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'task-021',
    goalId: 'goal-003',
    title: 'Arrange desk items ergonomically',
    description: 'Position monitor, keyboard, mouse for comfort',
    durationMinutes: 10,
    difficulty: 'medium',
    spicyFlag: false,
    orderIndex: 6,
    status: 'completed',
    completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'task-022',
    goalId: 'goal-003',
    title: 'Add a plant or personal item',
    description: 'Make the space feel welcoming',
    durationMinutes: 5,
    difficulty: 'easy',
    spicyFlag: false,
    orderIndex: 7,
    status: 'completed',
    completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'task-023',
    goalId: 'goal-003',
    title: 'Set up better lighting',
    description: 'Add desk lamp or adjust existing lights',
    durationMinutes: 10,
    difficulty: 'medium',
    spicyFlag: false,
    orderIndex: 8,
    status: 'completed',
    completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'task-024',
    goalId: 'goal-003',
    title: 'Create weekly cleaning routine',
    description: 'Write down 5-min daily maintenance tasks',
    durationMinutes: 10,
    difficulty: 'easy',
    spicyFlag: false,
    orderIndex: 9,
    status: 'pending',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'task-025',
    goalId: 'goal-003',
    title: 'Take "after" photo for motivation',
    description: 'Document your accomplishment!',
    durationMinutes: 3,
    difficulty: 'easy',
    spicyFlag: false,
    orderIndex: 10,
    status: 'pending',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// ===================================
// SAMPLE JOURNAL ENTRIES
// ===================================

export const sampleJournalEntries: JournalEntry[] = [
  {
    id: 'journal-001',
    userId: 'user-001',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    content: 'Started my day with a quick Spanish practice session. Feeling more confident with greetings!',
    type: 'sprout',
    linkedGoalId: 'goal-001',
    linkedStepId: 'task-001',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'journal-002',
    userId: 'user-001',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    content: 'My desk looks amazing! I can actually focus now. Adding that plant made such a difference.',
    type: 'bloom',
    linkedGoalId: 'goal-003',
    linkedStepId: 'task-022',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'journal-003',
    userId: 'user-001',
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    content: 'Just had the idea to organize my home office. It\'s been chaos for months!',
    type: 'seed',
    linkedGoalId: 'goal-003',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'journal-004',
    userId: 'user-001',
    date: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    content: 'Journaling feels awkward at first, but I think it\'ll get easier with practice.',
    type: 'seed',
    linkedGoalId: 'goal-002',
    createdAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'journal-005',
    userId: 'user-001',
    date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    content: 'Ordering food in Spanish felt so real! Can\'t wait to use this in Mexico.',
    type: 'sprout',
    linkedGoalId: 'goal-001',
    linkedStepId: 'task-006',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'journal-006',
    userId: 'user-001',
    date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    content: 'Decided to learn Spanish today. Mexico trip is in 3 months!',
    type: 'seed',
    linkedGoalId: 'goal-001',
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// ===================================
// SAMPLE STREAK LOGS (Last 30 Days)
// ===================================

const generateStreakLogs = (): StreakLog[] => {
  const logs: StreakLog[] = [];
  const today = new Date();

  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];

    // Simulate realistic pattern: active most days, with a few gaps
    const didShowUp = i < 7 || // Current 7-day streak
      (i >= 10 && i < 15) || // Previous 5-day streak
      (i >= 18 && i < 25) || // Earlier 7-day streak
      i === 28; // One random day

    logs.push({
      id: `streak-${i}`,
      userId: 'user-001',
      date: dateString,
      didShowUp,
      tasksCompleted: didShowUp ? Math.floor(Math.random() * 4) + 1 : 0,
      totalMinutes: didShowUp ? Math.floor(Math.random() * 30) + 5 : 0,
    });
  }

  return logs.reverse();
};

export const sampleStreakLogs: StreakLog[] = generateStreakLogs();

// ===================================
// SAMPLE BADGES & ACHIEVEMENTS
// ===================================

export const sampleBadges: Badge[] = [
  {
    id: 'badge-001',
    userId: 'user-001',
    badgeName: 'First Sprout',
    badgeType: 'milestone',
    description: 'Completed your very first task',
    icon: '🌱',
    unlockedAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'badge-002',
    userId: 'user-001',
    badgeName: '7-Day Streak',
    badgeType: 'streak',
    description: 'Showed up for 7 days in a row',
    icon: '🔥',
    unlockedAt: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'badge-003',
    userId: 'user-001',
    badgeName: 'Goal Gardener',
    badgeType: 'milestone',
    description: 'Completed your first goal from seed to bloom',
    icon: '🌻',
    unlockedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'badge-004',
    userId: 'user-001',
    badgeName: 'Early Bird',
    badgeType: 'seasonal',
    description: 'Completed a task before 9 AM five times',
    icon: '🌅',
    unlockedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'badge-005',
    userId: 'user-001',
    badgeName: 'Chain Starter',
    badgeType: 'milestone',
    description: 'Completed 3 tasks in one session',
    icon: '⛓️',
    unlockedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// ===================================
// PLANT COLLECTION
// ===================================

export const samplePlantCollection: PlantCollectionItem[] = [
  {
    plantType: 'sunflower',
    name: 'Cheerful Sunflower',
    rarity: 'common',
    unlockRequirement: 'Available from start',
    isUnlocked: true,
    icon: '🌻',
    description: 'Bright, optimistic, reaches for the sky',
  },
  {
    plantType: 'lavender',
    name: 'Calming Lavender',
    rarity: 'common',
    unlockRequirement: 'Available from start',
    isUnlocked: true,
    icon: '💜',
    description: 'Peaceful, gentle, and soothing',
  },
  {
    plantType: 'cactus',
    name: 'Resilient Cactus',
    rarity: 'common',
    unlockRequirement: 'Available from start',
    isUnlocked: true,
    icon: '🌵',
    description: 'Tough, steady, thrives with minimal fuss',
  },
  {
    plantType: 'fern',
    name: 'Lush Fern',
    rarity: 'common',
    unlockRequirement: 'Available from start',
    isUnlocked: true,
    icon: '🌿',
    description: 'Abundant, flourishing, brings life',
  },
  {
    plantType: 'rose',
    name: 'Elegant Rose',
    rarity: 'uncommon',
    unlockRequirement: 'Complete 3 goals',
    isUnlocked: false,
    icon: '🌹',
    description: 'Classic, beautiful, worth the effort',
  },
  {
    plantType: 'orchid',
    name: 'Exotic Orchid',
    rarity: 'rare',
    unlockRequirement: 'Maintain 14-day streak',
    isUnlocked: false,
    icon: '🌺',
    description: 'Rare, exquisite, requires dedication',
  },
  {
    plantType: 'bonsai',
    name: 'Ancient Bonsai',
    rarity: 'legendary',
    unlockRequirement: 'Complete 10 goals',
    isUnlocked: false,
    icon: '🎋',
    description: 'Masterful, patient, timeless wisdom',
  },
  {
    plantType: 'cherry_blossom',
    name: 'Cherry Blossom',
    rarity: 'rare',
    unlockRequirement: 'Complete Spring Challenge',
    isUnlocked: false,
    icon: '🌸',
    description: 'Fleeting beauty, moment of perfection',
  },
];

// ===================================
// DAILY STATS
// ===================================

export const sampleDailyStats: DailyStats[] = [
  {
    date: new Date().toISOString().split('T')[0],
    minutesCompleted: 25,
    tasksCompleted: 3,
    chainCount: 2,
    bloomPointsEarned: 150,
    goalsWorkedOn: ['goal-001', 'goal-002'],
  },
  {
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    minutesCompleted: 15,
    tasksCompleted: 2,
    chainCount: 1,
    bloomPointsEarned: 100,
    goalsWorkedOn: ['goal-003'],
  },
  {
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    minutesCompleted: 30,
    tasksCompleted: 4,
    chainCount: 3,
    bloomPointsEarned: 200,
    goalsWorkedOn: ['goal-001', 'goal-003'],
  },
];

// ===================================
// HELPER FUNCTIONS
// ===================================

export const getGoalById = (goalId: string): Goal | undefined => {
  return sampleGoals.find((goal) => goal.id === goalId);
};

export const getTasksByGoalId = (goalId: string): MicroTask[] => {
  return sampleMicroTasks.filter((task) => task.goalId === goalId);
};

export const getTaskById = (taskId: string): MicroTask | undefined => {
  return sampleMicroTasks.find((task) => task.id === taskId);
};

export const getActiveGoals = (): Goal[] => {
  return sampleGoals.filter((goal) => goal.status === 'active');
};

export const getPendingTasks = (): MicroTask[] => {
  return sampleMicroTasks.filter((task) => task.status === 'pending');
};

export const getCompletedTasks = (): MicroTask[] => {
  return sampleMicroTasks.filter((task) => task.status === 'completed');
};

export const getRecentJournalEntries = (count: number = 5): JournalEntry[] => {
  return [...sampleJournalEntries]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, count);
};

export const getCurrentStreakDays = (): number => {
  return sampleUser.currentStreak;
};

export const getUnlockedPlants = (): PlantCollectionItem[] => {
  return samplePlantCollection.filter((plant) => plant.isUnlocked);
};

export const getLockedPlants = (): PlantCollectionItem[] => {
  return samplePlantCollection.filter((plant) => !plant.isUnlocked);
};
