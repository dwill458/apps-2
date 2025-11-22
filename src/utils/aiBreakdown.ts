/**
 * AI Task Breakdown Utility
 * Simulates AI-powered task breakdown into smaller, actionable steps
 */

import { Task } from '../types';

interface BreakdownSuggestion {
  title: string;
  description?: string;
  durationMinutes: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

/**
 * Simulates AI breakdown of a large task into smaller subtasks
 * In a real implementation, this would call an actual AI API
 */
export function breakdownTask(
  taskTitle: string,
  taskDescription: string,
  totalDuration: number,
  goalId: string
): BreakdownSuggestion[] {
  // Simulated AI logic - pattern matching for common task types
  const lowerTitle = taskTitle.toLowerCase();
  const lowerDesc = (taskDescription || '').toLowerCase();

  // Determine task category
  const isLearning = lowerTitle.includes('learn') || lowerTitle.includes('study') ||
                     lowerDesc.includes('learn') || lowerDesc.includes('course');
  const isWriting = lowerTitle.includes('write') || lowerTitle.includes('blog') ||
                    lowerTitle.includes('article') || lowerDesc.includes('write');
  const isProject = lowerTitle.includes('project') || lowerTitle.includes('build') ||
                    lowerTitle.includes('create');
  const isExercise = lowerTitle.includes('exercise') || lowerTitle.includes('workout') ||
                     lowerTitle.includes('fitness');

  let subtasks: BreakdownSuggestion[] = [];

  if (isLearning) {
    subtasks = generateLearningSubtasks(taskTitle, totalDuration);
  } else if (isWriting) {
    subtasks = generateWritingSubtasks(taskTitle, totalDuration);
  } else if (isProject) {
    subtasks = generateProjectSubtasks(taskTitle, totalDuration);
  } else if (isExercise) {
    subtasks = generateExerciseSubtasks(taskTitle, totalDuration);
  } else {
    // Generic breakdown
    subtasks = generateGenericSubtasks(taskTitle, totalDuration);
  }

  return subtasks;
}

function generateLearningSubtasks(title: string, duration: number): BreakdownSuggestion[] {
  const avgMinutes = Math.max(5, Math.floor(duration / 4));

  return [
    {
      title: 'Review prerequisites and gather materials',
      description: 'Collect necessary resources, review basics',
      durationMinutes: Math.min(10, avgMinutes),
      difficulty: 'easy',
    },
    {
      title: 'Watch/read main content',
      description: 'Go through the primary learning material',
      durationMinutes: Math.floor(duration * 0.4),
      difficulty: 'medium',
    },
    {
      title: 'Take notes and summarize key points',
      description: 'Document important concepts in your own words',
      durationMinutes: Math.floor(duration * 0.3),
      difficulty: 'medium',
    },
    {
      title: 'Practice with examples or exercises',
      description: 'Apply what you learned through practice',
      durationMinutes: Math.floor(duration * 0.3),
      difficulty: 'hard',
    },
  ];
}

function generateWritingSubtasks(title: string, duration: number): BreakdownSuggestion[] {
  return [
    {
      title: 'Brainstorm and outline',
      description: 'Jot down ideas and create a rough structure',
      durationMinutes: Math.floor(duration * 0.2),
      difficulty: 'easy',
    },
    {
      title: 'Write first draft',
      description: 'Get your ideas down without worrying about perfection',
      durationMinutes: Math.floor(duration * 0.5),
      difficulty: 'medium',
    },
    {
      title: 'Review and edit',
      description: 'Refine content, check flow and clarity',
      durationMinutes: Math.floor(duration * 0.2),
      difficulty: 'medium',
    },
    {
      title: 'Final polish and proofread',
      description: 'Check grammar, formatting, and final touches',
      durationMinutes: Math.floor(duration * 0.1),
      difficulty: 'easy',
    },
  ];
}

function generateProjectSubtasks(title: string, duration: number): BreakdownSuggestion[] {
  return [
    {
      title: 'Define scope and requirements',
      description: 'Clarify what needs to be built and why',
      durationMinutes: Math.floor(duration * 0.15),
      difficulty: 'medium',
    },
    {
      title: 'Plan architecture and approach',
      description: 'Design the solution and identify key components',
      durationMinutes: Math.floor(duration * 0.15),
      difficulty: 'medium',
    },
    {
      title: 'Build core functionality',
      description: 'Implement the main features',
      durationMinutes: Math.floor(duration * 0.5),
      difficulty: 'hard',
    },
    {
      title: 'Test and refine',
      description: 'Debug, test edge cases, and improve',
      durationMinutes: Math.floor(duration * 0.2),
      difficulty: 'medium',
    },
  ];
}

function generateExerciseSubtasks(title: string, duration: number): BreakdownSuggestion[] {
  return [
    {
      title: 'Warm-up',
      description: 'Light stretching and movement to prepare',
      durationMinutes: Math.max(5, Math.floor(duration * 0.15)),
      difficulty: 'easy',
    },
    {
      title: 'Main workout',
      description: 'Core exercise routine',
      durationMinutes: Math.floor(duration * 0.7),
      difficulty: 'hard',
    },
    {
      title: 'Cool down and stretch',
      description: 'Gentle stretches to recover',
      durationMinutes: Math.floor(duration * 0.15),
      difficulty: 'easy',
    },
  ];
}

function generateGenericSubtasks(title: string, duration: number): BreakdownSuggestion[] {
  const numSteps = Math.min(5, Math.max(2, Math.floor(duration / 10)));
  const avgDuration = Math.floor(duration / numSteps);

  return Array.from({ length: numSteps }, (_, i) => ({
    title: `${title} - Step ${i + 1}`,
    description: `Complete phase ${i + 1} of the task`,
    durationMinutes: avgDuration,
    difficulty: i === 0 ? 'easy' : i === numSteps - 1 ? 'medium' : 'medium',
  }));
}

/**
 * Estimates task difficulty based on duration and description
 */
export function estimateDifficulty(
  durationMinutes: number,
  description: string
): 'easy' | 'medium' | 'hard' {
  const lowerDesc = description.toLowerCase();

  // Keywords suggesting difficulty
  const hardKeywords = ['complex', 'difficult', 'challenging', 'advanced', 'hard'];
  const easyKeywords = ['simple', 'easy', 'basic', 'quick', 'straightforward'];

  const hasHardKeyword = hardKeywords.some(kw => lowerDesc.includes(kw));
  const hasEasyKeyword = easyKeywords.some(kw => lowerDesc.includes(kw));

  if (hasHardKeyword || durationMinutes > 45) return 'hard';
  if (hasEasyKeyword || durationMinutes <= 10) return 'easy';
  return 'medium';
}
