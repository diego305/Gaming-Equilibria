import { PillarId } from './wellness';

export type QuestDifficulty = 'micro' | 'daily' | 'weekly';

export interface HabitQuest {
  id: string;
  pillar: PillarId;
  title: string;
  description: string;
  xp: number;
  durationLabel: string;
  difficulty: QuestDifficulty;
  recommendedForLowScore?: boolean;
}

export interface UserQuestProgress {
  questId: string;
  completedDates: string[]; // YYYY-MM-DD
  currentStreak: number;
  isAccepted: boolean;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  xpReward: number;
  category: 'starter' | 'streak' | 'action' | 'mastery';
  unlockedAt?: string;
}

export interface HabitContract {
  signed: boolean;
  name: string;
  date: string;
  commitments: string[];
}

export interface UserGamificationState {
  xp: number;
  level: number;
  levelTitle: string;
  currentStreak: number;
  lastActiveDate: string | null;
  completedQuestsToday: string[];
  userQuests: Record<string, UserQuestProgress>;
  unlockedBadges: string[];
  soundEnabled: boolean;
  contract: HabitContract | null;
}
