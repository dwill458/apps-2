// ===================================
// AI SERVICE (Mock Implementation)
// ===================================
// This is a placeholder service with realistic mock responses
// Replace with actual AI API calls when integrating with Claude/OpenAI

import type {
  GoalBreakdownRequest,
  GoalBreakdownResponse,
  MicroTask,
  TaskDuration,
  TaskDifficulty,
  BlockerType,
} from '../types';
import { generateId } from '../utils/helpers';

// ===================================
// GOAL BREAKDOWN (Mock AI)
// ===================================

interface TaskTemplate {
  keywords: string[];
  steps: Array<{
    titlePattern: string;
    description: string;
    duration: TaskDuration;
    difficulty: TaskDifficulty;
    spicy: boolean;
  }>;
}

// Pre-built task templates for common goal types
const taskTemplates: TaskTemplate[] = [
  {
    keywords: ['learn', 'study', 'language', 'course', 'education'],
    steps: [
      {
        titlePattern: 'Research and choose learning resources',
        description: 'Find 2-3 recommended resources (apps, books, videos)',
        duration: 10,
        difficulty: 'easy',
        spicy: false,
      },
      {
        titlePattern: 'Set up study space and materials',
        description: 'Organize notebook, bookmarks, or app',
        duration: 5,
        difficulty: 'easy',
        spicy: false,
      },
      {
        titlePattern: 'Learn foundational concepts (Part 1)',
        description: 'Start with the absolute basics',
        duration: 15,
        difficulty: 'easy',
        spicy: false,
      },
      {
        titlePattern: 'Practice basic exercises',
        description: 'Apply what you learned through simple practice',
        duration: 10,
        difficulty: 'medium',
        spicy: false,
      },
      {
        titlePattern: 'Learn intermediate concepts',
        description: 'Build on the foundation',
        duration: 15,
        difficulty: 'medium',
        spicy: false,
      },
      {
        titlePattern: 'Try a challenging exercise',
        description: 'Push yourself a little outside comfort zone',
        duration: 15,
        difficulty: 'hard',
        spicy: true,
      },
      {
        titlePattern: 'Review and practice what you\'ve learned',
        description: 'Repetition helps it stick',
        duration: 10,
        difficulty: 'medium',
        spicy: false,
      },
    ],
  },
  {
    keywords: ['organize', 'clean', 'declutter', 'tidy', 'sort'],
    steps: [
      {
        titlePattern: 'Take "before" photos for motivation',
        description: 'Document current state',
        duration: 3,
        difficulty: 'easy',
        spicy: false,
      },
      {
        titlePattern: 'Clear everything out',
        description: 'Empty the space completely for fresh start',
        duration: 10,
        difficulty: 'easy',
        spicy: false,
      },
      {
        titlePattern: 'Sort into keep/donate/trash',
        description: 'Be honest about what you actually need',
        duration: 15,
        difficulty: 'medium',
        spicy: false,
      },
      {
        titlePattern: 'Clean the empty space',
        description: 'Wipe down, vacuum, make it fresh',
        duration: 10,
        difficulty: 'easy',
        spicy: false,
      },
      {
        titlePattern: 'Set up organizational system',
        description: 'Containers, labels, categories',
        duration: 15,
        difficulty: 'medium',
        spicy: false,
      },
      {
        titlePattern: 'Put items back thoughtfully',
        description: 'Everything has its place',
        duration: 10,
        difficulty: 'easy',
        spicy: false,
      },
    ],
  },
  {
    keywords: ['read', 'book', 'finish', 'reading'],
    steps: [
      {
        titlePattern: 'Set reading schedule',
        description: 'Decide: X pages per day',
        duration: 3,
        difficulty: 'easy',
        spicy: false,
      },
      {
        titlePattern: 'Read first section',
        description: 'Just start, even if it\'s a few pages',
        duration: 10,
        difficulty: 'easy',
        spicy: false,
      },
      {
        titlePattern: 'Take notes on key ideas',
        description: 'Write down what resonates',
        duration: 5,
        difficulty: 'easy',
        spicy: false,
      },
      {
        titlePattern: 'Continue reading next section',
        description: 'Build momentum',
        duration: 15,
        difficulty: 'medium',
        spicy: false,
      },
      {
        titlePattern: 'Discuss or reflect on concepts',
        description: 'Process what you\'re learning',
        duration: 10,
        difficulty: 'medium',
        spicy: false,
      },
      {
        titlePattern: 'Finish final section',
        description: 'Complete the book!',
        duration: 15,
        difficulty: 'medium',
        spicy: false,
      },
    ],
  },
  {
    keywords: ['write', 'blog', 'journal', 'article', 'creative'],
    steps: [
      {
        titlePattern: 'Brainstorm ideas',
        description: 'Free write without judgment',
        duration: 5,
        difficulty: 'easy',
        spicy: false,
      },
      {
        titlePattern: 'Choose topic and outline',
        description: 'Pick one idea and sketch structure',
        duration: 10,
        difficulty: 'medium',
        spicy: false,
      },
      {
        titlePattern: 'Write rough first draft',
        description: 'Get words on page, don\'t edit yet',
        duration: 15,
        difficulty: 'medium',
        spicy: false,
      },
      {
        titlePattern: 'Take break and return with fresh eyes',
        description: 'Walk away, come back later',
        duration: 5,
        difficulty: 'easy',
        spicy: false,
      },
      {
        titlePattern: 'Edit and refine',
        description: 'Polish the writing',
        duration: 15,
        difficulty: 'hard',
        spicy: true,
      },
      {
        titlePattern: 'Share or publish',
        description: 'Send it out into the world!',
        duration: 5,
        difficulty: 'medium',
        spicy: true,
      },
    ],
  },
];

// Generic fallback template
const genericTemplate: TaskTemplate = {
  keywords: [],
  steps: [
    {
      titlePattern: 'Research and plan approach',
      description: 'Gather information and resources',
      duration: 10,
      difficulty: 'easy',
      spicy: false,
    },
    {
      titlePattern: 'Start with the easiest part',
      description: 'Build confidence with a quick win',
      duration: 5,
      difficulty: 'easy',
      spicy: false,
    },
    {
      titlePattern: 'Work on core component',
      description: 'Tackle the main work',
      duration: 15,
      difficulty: 'medium',
      spicy: false,
    },
    {
      titlePattern: 'Handle the tricky part',
      description: 'This might need extra focus',
      duration: 15,
      difficulty: 'hard',
      spicy: true,
    },
    {
      titlePattern: 'Review and refine',
      description: 'Check quality and make improvements',
      duration: 10,
      difficulty: 'medium',
      spicy: false,
    },
    {
      titlePattern: 'Finish and celebrate',
      description: 'Complete final touches',
      duration: 5,
      difficulty: 'easy',
      spicy: false,
    },
  ],
};

/**
 * Find best matching template for goal
 */
const findMatchingTemplate = (goalTitle: string, goalDescription?: string): TaskTemplate => {
  const searchText = `${goalTitle} ${goalDescription || ''}`.toLowerCase();

  for (const template of taskTemplates) {
    const hasMatch = template.keywords.some((keyword) =>
      searchText.includes(keyword.toLowerCase())
    );
    if (hasMatch) {
      return template;
    }
  }

  return genericTemplate;
};

/**
 * Break down a goal into micro-tasks (Mock AI)
 */
export const breakdownGoal = async (
  request: GoalBreakdownRequest
): Promise<GoalBreakdownResponse> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const template = findMatchingTemplate(request.goalTitle, request.goalDescription);

  // Customize steps based on user context
  let steps = [...template.steps];

  // If low energy user, simplify tasks
  if (request.userContext?.energyLevel === 'low') {
    steps = steps.map((step) => ({
      ...step,
      duration: Math.min(step.duration, 10) as TaskDuration,
      difficulty: step.difficulty === 'hard' ? 'medium' : step.difficulty,
    }));
  }

  // Calculate total estimated hours
  const totalMinutes = steps.reduce((sum, step) => sum + step.duration, 0);
  const totalEstimatedHours = Math.round((totalMinutes / 60) * 10) / 10;

  // Add order indices
  const stepsWithOrder = steps.map((step, index) => ({
    ...step,
    title: step.titlePattern,
    orderIndex: index + 1,
  }));

  return {
    steps: stepsWithOrder,
    totalEstimatedHours,
    efficiency: steps.length <= 8 ? 'well_balanced' : 'needs_simplification',
  };
};

// ===================================
// DEBUG RESPONSE GENERATION
// ===================================

interface DebugResponse {
  insight: string;
  suggestion: string;
  alternativeAction: string;
  supportiveMessage: string;
}

const debugResponses: Record<BlockerType, DebugResponse[]> = {
  too_big: [
    {
      insight: 'This task might need to be broken down further.',
      suggestion: 'Try doing just the first 3 minutes of this task.',
      alternativeAction: 'Start with the absolute smallest piece you can think of.',
      supportiveMessage: 'Big tasks are just collections of tiny tasks. You\'ve got this! 🌱',
    },
    {
      insight: 'Sometimes we underestimate complexity.',
      suggestion: 'Break this into 2-3 mini-tasks of 5 minutes each.',
      alternativeAction: 'Write down the first tiny step, then do only that.',
      supportiveMessage: 'Every expert started with small steps. Be gentle with yourself. 💚',
    },
    {
      insight: 'The task description might be too vague.',
      suggestion: 'Get specific: what\'s the very first action?',
      alternativeAction: 'Describe what "done" looks like in detail.',
      supportiveMessage: 'Clarity comes with practice. You\'re learning! ✨',
    },
  ],
  wrong_time: [
    {
      insight: 'Timing matters for different types of tasks.',
      suggestion: 'Try this task when your energy is higher.',
      alternativeAction: 'Do something easier now, save this for later.',
      supportiveMessage: 'Listen to what your body needs. That\'s wisdom! 🦋',
    },
    {
      insight: 'Your energy ebbs and flows throughout the day.',
      suggestion: 'Schedule this for your peak focus time.',
      alternativeAction: 'Do a 3-minute task instead, build momentum.',
      supportiveMessage: 'Working with your natural rhythm is smart, not lazy. 🌊',
    },
    {
      insight: 'Context switching can make tasks feel harder.',
      suggestion: 'Wait for a better moment when you\'re in the right headspace.',
      alternativeAction: 'Try a different task from the same goal.',
      supportiveMessage: 'Your instincts are valid. Trust yourself! 🌟',
    },
  ],
  unexpected_event: [
    {
      insight: 'Life happens, and that\'s okay.',
      suggestion: 'Come back to this when things settle.',
      alternativeAction: 'Do a 3-minute grounding task instead.',
      supportiveMessage: 'You showed up despite chaos. That\'s heroic! 🌈',
    },
    {
      insight: 'Unexpected events can throw us off our plans.',
      suggestion: 'Reschedule this task for tomorrow.',
      alternativeAction: 'Take 5 minutes for self-care instead.',
      supportiveMessage: 'Flexibility is a superpower. You\'re handling this! 💫',
    },
    {
      insight: 'Sometimes we need to prioritize what\'s urgent.',
      suggestion: 'Handle the urgent thing first, come back refreshed.',
      alternativeAction: 'Mark this task for later and let it go for now.',
      supportiveMessage: 'You\'re making wise choices under pressure. 🌸',
    },
  ],
  not_feeling_it: [
    {
      insight: 'Motivation comes and goes - that\'s human.',
      suggestion: 'Try a different task that sparks more interest.',
      alternativeAction: 'Do just the first 2 minutes to see if flow comes.',
      supportiveMessage: 'Feelings are information, not commands. You\'re still showing up! 🌺',
    },
    {
      insight: 'Sometimes our resistance is trying to tell us something.',
      suggestion: 'Pause and ask: is this goal still aligned with what I want?',
      alternativeAction: 'Try a completely different goal for now.',
      supportiveMessage: 'It\'s okay to pivot. Growth isn\'t linear! 🍃',
    },
    {
      insight: 'Energy follows action, not the other way around.',
      suggestion: 'Start tiny: commit to just 90 seconds of this task.',
      alternativeAction: 'Do a fun 3-minute task to build momentum.',
      supportiveMessage: 'You don\'t need to feel motivated to start. Start anyway! 🔥',
    },
  ],
};

/**
 * Generate supportive response for task blocker (Mock AI)
 */
export const generateDebugResponse = async (
  blocker: BlockerType,
  task: MicroTask
): Promise<DebugResponse> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  const responses = debugResponses[blocker];
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];

  return randomResponse;
};

// ===================================
// PATTERN DETECTION
// ===================================

export interface DetectedPattern {
  pattern: string;
  insight: string;
  suggestion: string;
  confidence: 'low' | 'medium' | 'high';
}

/**
 * Detect patterns in task completion history (Mock AI)
 */
export const detectPattern = async (
  taskHistory: Array<{
    task: MicroTask;
    completedAt: string;
    actualDuration: number;
  }>
): Promise<DetectedPattern[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 700));

  if (taskHistory.length < 5) {
    return [
      {
        pattern: 'Early days',
        insight: 'You\'re just getting started!',
        suggestion: 'Keep showing up, patterns will emerge.',
        confidence: 'low',
      },
    ];
  }

  const patterns: DetectedPattern[] = [];

  // Analyze completion times
  const morningTasks = taskHistory.filter((h) => {
    const hour = new Date(h.completedAt).getHours();
    return hour >= 5 && hour < 12;
  });

  if (morningTasks.length / taskHistory.length > 0.6) {
    patterns.push({
      pattern: 'Morning momentum',
      insight: 'You complete most tasks in the morning.',
      suggestion: 'Schedule your hardest tasks before noon.',
      confidence: 'high',
    });
  }

  // Analyze task duration accuracy
  const overestimated = taskHistory.filter(
    (h) => h.actualDuration < h.task.durationMinutes * 0.8
  );

  if (overestimated.length / taskHistory.length > 0.5) {
    patterns.push({
      pattern: 'Speedy achiever',
      insight: 'You often finish faster than expected.',
      suggestion: 'You might be able to tackle harder tasks than you think!',
      confidence: 'medium',
    });
  }

  // Analyze difficulty distribution
  const easyTasks = taskHistory.filter((h) => h.task.difficulty === 'easy');

  if (easyTasks.length / taskHistory.length > 0.7) {
    patterns.push({
      pattern: 'Building confidence',
      insight: 'You\'re focusing on easier tasks to build momentum.',
      suggestion: 'When you\'re ready, try mixing in some medium difficulty tasks.',
      confidence: 'medium',
    });
  }

  // Analyze consistency
  const dates = taskHistory.map((h) => h.completedAt.split('T')[0]);
  const uniqueDates = new Set(dates);

  if (uniqueDates.size >= taskHistory.length * 0.8) {
    patterns.push({
      pattern: 'Consistent growth',
      insight: 'You show up regularly across different days.',
      suggestion: 'Keep this rhythm going - consistency compounds!',
      confidence: 'high',
    });
  }

  return patterns.length > 0
    ? patterns
    : [
        {
          pattern: 'Exploring your style',
          insight: 'You\'re still finding your rhythm.',
          suggestion: 'Keep experimenting with different types of tasks.',
          confidence: 'low',
        },
      ];
};

// ===================================
// MOTIVATIONAL INSIGHTS
// ===================================

export interface MotivationalInsight {
  title: string;
  message: string;
  action?: string;
}

/**
 * Generate personalized motivational insight (Mock AI)
 */
export const generateMotivationalInsight = async (userData: {
  currentStreak: number;
  totalTasksCompleted: number;
  bloomPoints: number;
  daysActive: number;
}): Promise<MotivationalInsight> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const insights: MotivationalInsight[] = [
    {
      title: 'Momentum Builder',
      message: `You've completed ${userData.totalTasksCompleted} tasks! Each one is proof that you can do hard things.`,
      action: 'Keep this energy going with one more task today.',
    },
    {
      title: 'Consistency Champion',
      message: `${userData.currentStreak} day streak! This is how lasting change happens - one day at a time.`,
      action: 'Protect your streak with just 5 minutes today.',
    },
    {
      title: 'Growth Mindset',
      message: `You've shown up ${userData.daysActive} days. Even on hard days, you chose progress.`,
      action: 'Celebrate how far you\'ve come!',
    },
    {
      title: 'Point Collector',
      message: `${userData.bloomPoints} bloom points earned through consistent action!`,
      action: 'Every point represents a moment you chose to grow.',
    },
  ];

  return insights[Math.floor(Math.random() * insights.length)];
};

// ===================================
// TASK REFINEMENT
// ===================================

/**
 * Suggest refinements to a task that's been skipped multiple times (Mock AI)
 */
export const suggestTaskRefinement = async (
  task: MicroTask,
  skipCount: number
): Promise<{
  refinedTitle: string;
  refinedDescription: string;
  suggestedDuration: TaskDuration;
  reasoning: string;
}> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  // Make it easier if skipped multiple times
  const newDuration = Math.max(3, Math.floor(task.durationMinutes / 2)) as TaskDuration;

  return {
    refinedTitle: `${task.title} (simplified)`,
    refinedDescription: `Just the first small step: ${task.description || task.title}`,
    suggestedDuration: newDuration,
    reasoning: `This task has been skipped ${skipCount} times. Let's make it smaller and less intimidating.`,
  };
};

// ===================================
// EXPORT ALL
// ===================================

export const aiService = {
  breakdownGoal,
  generateDebugResponse,
  detectPattern,
  generateMotivationalInsight,
  suggestTaskRefinement,
};

export default aiService;
