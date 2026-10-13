import { UserGamificationState, HabitContract } from '../types/gamification';
import { calculateLevel, BADGES_CATALOG } from '../data/gamificationData';
import { playChime } from './audio';

const STORAGE_KEY_GAMIFICATION = 'equilibria_gamification_state_v1';

function getTodayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getYesterdayString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function getDefaultGamificationState(): UserGamificationState {
  const lvlInfo = calculateLevel(0);
  return {
    xp: 0,
    level: lvlInfo.level,
    levelTitle: lvlInfo.levelTitle,
    currentStreak: 1,
    lastActiveDate: getTodayString(),
    completedQuestsToday: [],
    userQuests: {},
    unlockedBadges: [],
    soundEnabled: true,
    contract: null,
  };
}

export function getGamificationState(): UserGamificationState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_GAMIFICATION);
    if (!raw) {
      const initial = getDefaultGamificationState();
      saveGamificationState(initial);
      return initial;
    }
    const state = JSON.parse(raw) as UserGamificationState;

    // Check day turnover
    const today = getTodayString();
    const yesterday = getYesterdayString();

    if (state.lastActiveDate !== today) {
      if (state.lastActiveDate === yesterday) {
        // Consecutive day
        // streak stays active until user takes action today
      } else if (state.lastActiveDate && state.lastActiveDate < yesterday) {
        // Streak broken
        state.currentStreak = 1;
      }
      state.completedQuestsToday = [];
    }

    // Ensure level title is in sync
    const lvl = calculateLevel(state.xp);
    state.level = lvl.level;
    state.levelTitle = lvl.levelTitle;

    return state;
  } catch (err) {
    console.error('Error loading gamification state:', err);
    return getDefaultGamificationState();
  }
}

export function saveGamificationState(state: UserGamificationState): void {
  try {
    localStorage.setItem(STORAGE_KEY_GAMIFICATION, JSON.stringify(state));
  } catch (err) {
    console.error('Error saving gamification state:', err);
  }
}

export function addXp(amount: number, reason?: string): {
  state: UserGamificationState;
  leveledUp: boolean;
  newLevel: number;
} {
  const state = getGamificationState();
  const prevLevel = state.level;
  const today = getTodayString();
  const yesterday = getYesterdayString();

  // Update streak if first action today
  if (state.lastActiveDate !== today) {
    if (state.lastActiveDate === yesterday) {
      state.currentStreak += 1;
    } else {
      state.currentStreak = 1;
    }
    state.lastActiveDate = today;
  }

  state.xp += amount;
  const lvlInfo = calculateLevel(state.xp);
  state.level = lvlInfo.level;
  state.levelTitle = lvlInfo.levelTitle;

  const leveledUp = state.level > prevLevel;

  // Check badges for streak
  if (state.currentStreak >= 3 && !state.unlockedBadges.includes('badge_streak_3')) {
    state.unlockedBadges.push('badge_streak_3');
    state.xp += 75;
  }

  saveGamificationState(state);

  if (leveledUp) {
    playChime('levelUp', state.soundEnabled);
  } else {
    playChime('success', state.soundEnabled);
  }

  return {
    state,
    leveledUp,
    newLevel: state.level,
  };
}

export function completeQuest(questId: string, questXp: number): {
  state: UserGamificationState;
  leveledUp: boolean;
  isFirstAction: boolean;
} {
  const state = getGamificationState();
  const today = getTodayString();
  const prevLevel = state.level;

  let isFirstAction = false;
  if (!state.unlockedBadges.includes('badge_first_action')) {
    state.unlockedBadges.push('badge_first_action');
    state.xp += 40;
    isFirstAction = true;
  }

  if (!state.completedQuestsToday.includes(questId)) {
    state.completedQuestsToday.push(questId);
  }

  const existingProg = state.userQuests[questId] || {
    questId,
    completedDates: [],
    currentStreak: 0,
    isAccepted: true,
  };

  if (!existingProg.completedDates.includes(today)) {
    existingProg.completedDates.push(today);
    existingProg.currentStreak += 1;
  }
  existingProg.isAccepted = true;
  state.userQuests[questId] = existingProg;

  // Award XP
  const xpRes = addXp(questXp);
  // Merge back
  xpRes.state.completedQuestsToday = state.completedQuestsToday;
  xpRes.state.userQuests = state.userQuests;
  xpRes.state.unlockedBadges = state.unlockedBadges;

  saveGamificationState(xpRes.state);

  return {
    state: xpRes.state,
    leveledUp: xpRes.leveledUp || xpRes.state.level > prevLevel,
    isFirstAction,
  };
}

export function acceptQuest(questId: string): UserGamificationState {
  const state = getGamificationState();
  const existingProg = state.userQuests[questId] || {
    questId,
    completedDates: [],
    currentStreak: 0,
    isAccepted: true,
  };
  existingProg.isAccepted = true;
  state.userQuests[questId] = existingProg;
  saveGamificationState(state);
  playChime('select', state.soundEnabled);
  return state;
}

export function unlockBadge(badgeId: string): { state: UserGamificationState; newlyUnlocked: boolean } {
  const state = getGamificationState();
  if (state.unlockedBadges.includes(badgeId)) {
    return { state, newlyUnlocked: false };
  }
  const badgeDef = BADGES_CATALOG.find((b) => b.id === badgeId);
  state.unlockedBadges.push(badgeId);
  if (badgeDef) {
    state.xp += badgeDef.xpReward;
  }
  const lvlInfo = calculateLevel(state.xp);
  state.level = lvlInfo.level;
  state.levelTitle = lvlInfo.levelTitle;

  saveGamificationState(state);
  playChime('levelUp', state.soundEnabled);
  return { state, newlyUnlocked: true };
}

export function signHabitContract(name: string, commitments: string[]): {
  state: UserGamificationState;
  newlySigned: boolean;
} {
  const state = getGamificationState();
  const wasAlreadySigned = Boolean(state.contract?.signed);

  state.contract = {
    signed: true,
    name: name || 'Participante Comprometido',
    date: new Date().toISOString(),
    commitments,
  };

  if (!wasAlreadySigned) {
    if (!state.unlockedBadges.includes('badge_signed_pact')) {
      state.unlockedBadges.push('badge_signed_pact');
    }
    state.xp += 75;
    const lvlInfo = calculateLevel(state.xp);
    state.level = lvlInfo.level;
    state.levelTitle = lvlInfo.levelTitle;
  }

  saveGamificationState(state);
  playChime('success', state.soundEnabled);
  return { state, newlySigned: !wasAlreadySigned };
}

export function toggleSoundSetting(): boolean {
  const state = getGamificationState();
  state.soundEnabled = !state.soundEnabled;
  saveGamificationState(state);
  if (state.soundEnabled) {
    playChime('select', true);
  }
  return state.soundEnabled;
}
