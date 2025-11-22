// ===================================
// COZY GROWTH UTILITY HELPERS
// ===================================

import type {
  PlantStage,
  BadgeType,
  TaskDifficulty,
  StreakLog,
  EnergyLevel,
  TaskDuration,
} from '../types';

// ===================================
// ID GENERATION
// ===================================

/**
 * Generate a unique ID (UUID v4)
 */
export const generateId = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Generate a short ID for display purposes
 */
export const generateShortId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

// ===================================
// DURATION FORMATTING
// ===================================

const durationPhrases: Record<number, string[]> = {
  3: [
    'one song',
    'a quick stretch',
    'brewing coffee',
    'a short walk',
    'tying your shoes',
  ],
  5: [
    'half a podcast',
    'one meditation',
    'making tea',
    'a quick tidy',
    'checking in',
  ],
  10: [
    'a short walk',
    'folding laundry',
    'watering plants',
    'a snack break',
    'stretching session',
  ],
  15: [
    'a coffee chat',
    'short commute',
    'quick workout',
    'meditation session',
    'reading a chapter',
  ],
};

/**
 * Convert minutes to friendly, relatable text
 */
export const formatDuration = (minutes: TaskDuration): string => {
  const phrases = durationPhrases[minutes] || [`${minutes} minutes`];
  const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
  return `${minutes} min (${randomPhrase})`;
};

/**
 * Format duration for display (simple version)
 */
export const formatDurationSimple = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

/**
 * Convert seconds to MM:SS format
 */
export const formatTimeMMSS = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// ===================================
// DATE FORMATTING
// ===================================

/**
 * Format date nicely (e.g., "Today", "Yesterday", "Jan 15")
 */
export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Reset time to midnight for comparison
  const dateOnly = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const yesterdayOnly = new Date(
    yesterday.getFullYear(),
    yesterday.getMonth(),
    yesterday.getDate()
  );

  if (dateOnly.getTime() === todayOnly.getTime()) {
    return 'Today';
  }
  if (dateOnly.getTime() === yesterdayOnly.getTime()) {
    return 'Yesterday';
  }

  // Format as "Jan 15" or "Jan 15, 2024" if not current year
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  if (d.getFullYear() !== today.getFullYear()) {
    options.year = 'numeric';
  }

  return d.toLocaleDateString('en-US', options);
};

/**
 * Format date with time (e.g., "Today at 2:30 PM")
 */
export const formatDateTime = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const dateStr = formatDate(d);
  const timeStr = d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  return `${dateStr} at ${timeStr}`;
};

/**
 * Get relative time string (e.g., "2 hours ago", "just now")
 */
export const formatRelativeTime = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  return formatDate(d);
};

// ===================================
// STREAK CALCULATIONS
// ===================================

/**
 * Calculate current streak days from logs
 */
export const calculateStreakDays = (logs: StreakLog[]): number => {
  if (!logs || logs.length === 0) return 0;

  // Sort logs by date descending
  const sortedLogs = [...logs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < sortedLogs.length; i++) {
    const logDate = new Date(sortedLogs[i].date);
    logDate.setHours(0, 0, 0, 0);

    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() - i);

    // Check if log is for the expected date
    if (logDate.getTime() === expectedDate.getTime()) {
      if (sortedLogs[i].didShowUp) {
        streak++;
      } else {
        break;
      }
    } else {
      break;
    }
  }

  return streak;
};

/**
 * Check if user showed up today
 */
export const didShowUpToday = (logs: StreakLog[]): boolean => {
  const today = new Date().toISOString().split('T')[0];
  const todayLog = logs.find((log) => log.date === today);
  return todayLog?.didShowUp || false;
};

/**
 * Get streak emoji based on count
 */
export const getStreakEmoji = (streak: number): string => {
  if (streak === 0) return '🌱';
  if (streak < 3) return '🔥';
  if (streak < 7) return '🔥🔥';
  if (streak < 14) return '🔥🔥🔥';
  if (streak < 30) return '✨🔥✨';
  return '🏆🔥🏆';
};

// ===================================
// PLANT STAGES & ICONS
// ===================================

/**
 * Get emoji/icon for plant stage
 */
export const getPlantStageIcon = (stage: PlantStage): string => {
  const icons: Record<PlantStage, string> = {
    1: '🌱', // Seed/Sprout
    2: '🌿', // Young plant
    3: '🪴', // Growing plant
    4: '🌸', // Budding
    5: '🌺', // Full bloom
  };
  return icons[stage] || '🌱';
};

/**
 * Get name for plant stage
 */
export const getPlantStageName = (stage: PlantStage): string => {
  const names: Record<PlantStage, string> = {
    1: 'Seed',
    2: 'Sprout',
    3: 'Growing',
    4: 'Budding',
    5: 'Blooming',
  };
  return names[stage] || 'Seed';
};

/**
 * Get progress percentage for plant stage
 */
export const getPlantStageProgress = (
  stage: PlantStage,
  completedSteps: number,
  totalSteps: number
): number => {
  const stageProgress = ((stage - 1) / 4) * 100;
  const stepProgress = (completedSteps / totalSteps) * 20; // 20% per stage
  return Math.min(Math.round(stageProgress + stepProgress), 100);
};

// ===================================
// BADGE ICONS
// ===================================

/**
 * Get icon for badge type
 */
export const getBadgeIcon = (badgeType: BadgeType): string => {
  const icons: Record<BadgeType, string> = {
    streak: '🔥',
    milestone: '⭐',
    seasonal: '🎭',
  };
  return icons[badgeType] || '🏅';
};

// ===================================
// POINTS & DIFFICULTY
// ===================================

/**
 * Calculate bloom points earned based on duration and difficulty
 */
export const calculateBloomPoints = (
  durationMinutes: TaskDuration,
  difficulty: TaskDifficulty,
  chainMultiplier: number = 1
): number => {
  const basePoints: Record<TaskDuration, number> = {
    3: 20,
    5: 30,
    10: 50,
    15: 75,
  };

  const difficultyMultiplier: Record<TaskDifficulty, number> = {
    easy: 1.0,
    medium: 1.2,
    hard: 1.5,
  };

  const base = basePoints[durationMinutes] || 50;
  const diffMult = difficultyMultiplier[difficulty] || 1.0;
  const points = Math.round(base * diffMult * chainMultiplier);

  return points;
};

/**
 * Get difficulty color
 */
export const getDifficultyColor = (difficulty: TaskDifficulty): string => {
  const colors: Record<TaskDifficulty, string> = {
    easy: '#4ade80', // green
    medium: '#fbbf24', // yellow
    hard: '#f87171', // red
  };
  return colors[difficulty] || '#94a3b8';
};

/**
 * Get energy level color
 */
export const getEnergyLevelColor = (energy: EnergyLevel): string => {
  const colors: Record<EnergyLevel, string> = {
    low: '#94a3b8', // gray
    medium: '#60a5fa', // blue
    high: '#a78bfa', // purple
  };
  return colors[energy] || '#94a3b8';
};

// ===================================
// TIME OF DAY
// ===================================

/**
 * Get current time of day
 */
export const getTimeOfDay = (): 'morning' | 'afternoon' | 'evening' | 'night' => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
};

/**
 * Get greeting based on time of day
 */
export const getGreeting = (name?: string): string => {
  const timeOfDay = getTimeOfDay();
  const greetings: Record<typeof timeOfDay, string[]> = {
    morning: ['Good morning', 'Rise and shine', 'Morning'],
    afternoon: ['Good afternoon', 'Hello', 'Hey there'],
    evening: ['Good evening', 'Evening', 'Hey'],
    night: ['Good evening', 'Hello', 'Hey there'],
  };

  const greetingList = greetings[timeOfDay];
  const greeting = greetingList[Math.floor(Math.random() * greetingList.length)];

  return name ? `${greeting}, ${name}` : greeting;
};

// ===================================
// SUPPORTIVE MESSAGES
// ===================================

const supportiveMessages = [
  'You\'ve got this! 🌱',
  'Small steps, big growth 🌿',
  'Every bit counts ✨',
  'Progress, not perfection 💚',
  'You showed up today 🌟',
  'One step at a time 🦋',
  'Keep growing 🌻',
  'Proud of you! 🌈',
  'You\'re doing great 💫',
  'Onward and upward 🌸',
  'Trust the process 🍃',
  'You\'re on your way 🌺',
  'Consistency is key 🔑',
  'Tiny tasks, mighty impact 💪',
  'Building momentum 🚀',
];

/**
 * Get a random supportive message
 */
export const getSupportiveMessage = (): string => {
  return supportiveMessages[Math.floor(Math.random() * supportiveMessages.length)];
};

const celebrationMessages = [
  'Incredible work! 🎉',
  'You crushed it! 🌟',
  'Amazing progress! ✨',
  'Look at you go! 🚀',
  'Absolutely brilliant! 💫',
  'You did it! 🎊',
  'Phenomenal! 🏆',
  'That\'s the spirit! 🔥',
  'Outstanding! 🌺',
  'You\'re unstoppable! 💪',
];

/**
 * Get a random celebration message
 */
export const getCelebrationMessage = (): string => {
  return celebrationMessages[Math.floor(Math.random() * celebrationMessages.length)];
};

const encouragementMessages = [
  'It\'s okay to start small',
  'Take it one step at a time',
  'No pressure, just progress',
  'You can always try again tomorrow',
  'Be gentle with yourself',
  'Rest is part of growth too',
  'It\'s about showing up',
  'Your pace is perfect',
  'Small wins add up',
  'You\'re exactly where you need to be',
];

/**
 * Get a random encouragement message (for difficult moments)
 */
export const getEncouragementMessage = (): string => {
  return encouragementMessages[
    Math.floor(Math.random() * encouragementMessages.length)
  ];
};

// ===================================
// TEXT FORMATTING
// ===================================

/**
 * Truncate text with ellipsis
 */
export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

/**
 * Capitalize first letter
 */
export const capitalize = (text: string): string => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
};

/**
 * Pluralize word based on count
 */
export const pluralize = (
  count: number,
  singular: string,
  plural?: string
): string => {
  if (count === 1) return singular;
  return plural || `${singular}s`;
};

// ===================================
// VALIDATION
// ===================================

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Check if date is today
 */
export const isToday = (date: string | Date): boolean => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
};

/**
 * Check if date is in the past
 */
export const isPast = (date: string | Date): boolean => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.getTime() < new Date().getTime();
};

// ===================================
// ARRAY UTILITIES
// ===================================

/**
 * Shuffle array randomly
 */
export const shuffle = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Get random item from array
 */
export const randomItem = <T>(array: T[]): T | undefined => {
  if (array.length === 0) return undefined;
  return array[Math.floor(Math.random() * array.length)];
};

/**
 * Group array by key function
 */
export const groupBy = <T>(array: T[], keyFn: (item: T) => string): Record<string, T[]> => {
  return array.reduce((acc, item) => {
    const key = keyFn(item);
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {} as Record<string, T[]>);
};

// ===================================
// LOCAL STORAGE HELPERS
// ===================================

/**
 * Safely get item from localStorage
 */
export const getStorageItem = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

/**
 * Safely set item in localStorage
 */
export const setStorageItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

/**
 * Remove item from localStorage
 */
export const removeStorageItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to remove from localStorage:', error);
  }
};

// ===================================
// DEBUG HELPERS
// ===================================

/**
 * Log with timestamp (development only)
 */
export const debugLog = (message: string, data?: any): void => {
  if (import.meta.env.DEV) {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] ${message}`, data || '');
  }
};

/**
 * Format object for display
 */
export const prettyPrint = (obj: any): string => {
  return JSON.stringify(obj, null, 2);
};
