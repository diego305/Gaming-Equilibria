import { HabitQuest, AchievementBadge } from '../types/gamification';
import { Language } from '../data/translations';

export const LEVEL_THRESHOLDS = [
  { level: 1, minXp: 0, titleEs: 'Iniciado del Bienestar', titleEn: 'Wellness Novice' },
  { level: 2, minXp: 120, titleEs: 'Explorador de Hábitos', titleEn: 'Habit Explorer' },
  { level: 3, minXp: 350, titleEs: 'Guardián del Equilibrio', titleEn: 'Balance Guardian' },
  { level: 4, minXp: 750, titleEs: 'Maestro Vital', titleEn: 'Vital Master' },
  { level: 5, minXp: 1400, titleEs: 'Titán de la Longevidad', titleEn: 'Longevity Titan' },
];

export function calculateLevel(xp: number, lang: Language = 'es'): {
  level: number;
  levelTitle: string;
  currentLevelMinXp: number;
  nextLevelMinXp: number;
  progressPercent: number;
  isMaxLevel: boolean;
} {
  let currentTier = LEVEL_THRESHOLDS[0];
  let nextTier = LEVEL_THRESHOLDS[1];

  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i].minXp) {
      currentTier = LEVEL_THRESHOLDS[i];
      nextTier = LEVEL_THRESHOLDS[i + 1] || null;
    }
  }

  const isMaxLevel = !nextTier;
  const currentMin = currentTier.minXp;
  const nextMin = nextTier ? nextTier.minXp : currentMin + 1000;
  const range = nextMin - currentMin;
  const progressInLevel = Math.max(0, xp - currentMin);
  const progressPercent = isMaxLevel ? 100 : Math.min(100, Math.round((progressInLevel / range) * 100));

  return {
    level: currentTier.level,
    levelTitle: lang === 'en' ? currentTier.titleEn : currentTier.titleEs,
    currentLevelMinXp: currentMin,
    nextLevelMinXp: nextMin,
    progressPercent,
    isMaxLevel,
  };
}

export const HABIT_QUESTS_ES: HabitQuest[] = [
  // --- PILAR 1: SUEÑO ---
  {
    id: 'sleep_digital_sunset',
    pillar: 'sleep',
    title: 'Atardecer Digital',
    description: 'Apaga o deja el móvil fuera del dormitorio 30 minutos antes de acostarte hoy.',
    xp: 40,
    durationLabel: '30 min antes de dormir',
    difficulty: 'daily',
    recommendedForLowScore: true,
  },
  {
    id: 'sleep_fixed_alarm',
    pillar: 'sleep',
    title: 'Despertar Constante',
    description: 'Levántate mañana exactamente a la misma hora sin posponer la alarma ni una sola vez.',
    xp: 35,
    durationLabel: 'Al despertar',
    difficulty: 'micro',
  },
  {
    id: 'sleep_cool_cave',
    pillar: 'sleep',
    title: 'Santuario Oscuro y Fresco',
    description: 'Baja las persianas por completo, apaga LEDs y ventila la habitación para mantenerla fresca.',
    xp: 30,
    durationLabel: '5 min',
    difficulty: 'micro',
  },
  {
    id: 'sleep_caffeine_cutoff',
    pillar: 'sleep',
    title: 'Corte de Cafeína a las 14h',
    description: 'Sustituye cualquier café o energizante después de las 2:00 PM por agua o infusión sin teína.',
    xp: 45,
    durationLabel: 'Tarde',
    difficulty: 'daily',
  },

  // --- PILAR 2: NUTRICIÓN ---
  {
    id: 'nutri_morning_water',
    pillar: 'nutrition',
    title: 'Riego Matutino (500 ml)',
    description: 'Bebe un vaso grande de agua natural antes de tomar el café o desayunar.',
    xp: 30,
    durationLabel: '1 min al despertar',
    difficulty: 'micro',
    recommendedForLowScore: true,
  },
  {
    id: 'nutri_half_plate_green',
    pillar: 'nutrition',
    title: 'Mitad del Plato Verde',
    description: 'Asegura que al menos el 50% de tu almuerzo o cena esté compuesto por verduras u hortalizas.',
    xp: 45,
    durationLabel: 'En tu comida principal',
    difficulty: 'daily',
    recommendedForLowScore: true,
  },
  {
    id: 'nutri_zero_liquid_sugar',
    pillar: 'nutrition',
    title: 'Cero Azúcar Líquida Hoy',
    description: 'Elimina hoy todos los refrescos azucarados, zumos comerciales y cafés con sirope.',
    xp: 40,
    durationLabel: 'Todo el día',
    difficulty: 'daily',
  },
  {
    id: 'nutri_mindful_eating',
    pillar: 'nutrition',
    title: 'Comida Sin Pantallas',
    description: 'Haz una de tus comidas del día sentado y sin mirar el móvil, televisor ni ordenador.',
    xp: 35,
    durationLabel: '15 min de calma',
    difficulty: 'micro',
  },

  // --- PILAR 3: SALUD MENTAL ---
  {
    id: 'mind_breath_pause',
    pillar: 'mind',
    title: 'Pausa Respiratoria 4-7-8',
    description: 'Dedica 2 minutos a hacer 4 ciclos completos de respiración profunda consciente.',
    xp: 35,
    durationLabel: '2 minutos',
    difficulty: 'micro',
    recommendedForLowScore: true,
  },
  {
    id: 'mind_nature_walk',
    pillar: 'mind',
    title: 'Paseo de Desconexión',
    description: 'Sal a caminar 10 minutos al aire libre mirando el cielo o árboles sin auriculares.',
    xp: 45,
    durationLabel: '10 min',
    difficulty: 'daily',
  },
  {
    id: 'mind_gratitude_triad',
    pillar: 'mind',
    title: 'Tríada de Gratitud',
    description: 'Escribe o piensa en 3 cosas concretas por las que sientes agradecimiento el día de hoy.',
    xp: 30,
    durationLabel: '2 min',
    difficulty: 'micro',
  },
  {
    id: 'mind_social_connection',
    pillar: 'mind',
    title: 'Mensaje de Cariño Real',
    description: 'Envía un mensaje o llama a un buen amigo o familiar solo para saludarle con sinceridad.',
    xp: 35,
    durationLabel: '3 min',
    difficulty: 'micro',
    recommendedForLowScore: true,
  },

  // --- PILAR 4: EJERCICIO ---
  {
    id: 'exercise_daily_steps',
    pillar: 'exercise',
    title: 'Micro-Dosis de Pasos (15 min)',
    description: 'Camina al menos 15 minutos seguidos a paso vivo (puedes bajarte una parada antes o dar un paseo post-comida).',
    xp: 40,
    durationLabel: '15 min',
    difficulty: 'daily',
    recommendedForLowScore: true,
  },
  {
    id: 'exercise_desk_stretch',
    pillar: 'exercise',
    title: 'Reset Postural de Silla',
    description: 'Levántate, estira espalda, hombros y abre el pecho durante 90 segundos.',
    xp: 25,
    durationLabel: '90 segundos',
    difficulty: 'micro',
    recommendedForLowScore: true,
  },
  {
    id: 'exercise_stairs_hero',
    pillar: 'exercise',
    title: 'Conquistador de Escaleras',
    description: 'Sube por las escaleras en lugar de usar ascensor o escaleras mecánicas en 2 ocasiones hoy.',
    xp: 35,
    durationLabel: 'Durante el día',
    difficulty: 'micro',
  },
  {
    id: 'exercise_fun_movement',
    pillar: 'exercise',
    title: '20 Minutos de Movimiento Lúdico',
    description: 'Baila tu música favorita, anda en bicicleta, juega con tu mascota o practica tu deporte preferido.',
    xp: 50,
    durationLabel: '20 min',
    difficulty: 'weekly',
  },
];

export const HABIT_QUESTS_EN: HabitQuest[] = [
  // Sleep
  {
    id: 'sleep_digital_sunset',
    pillar: 'sleep',
    title: 'Digital Sunset',
    description: 'Turn off or leave screens outside your bedroom 30 minutes before sleep tonight.',
    xp: 40,
    durationLabel: '30 min before bed',
    difficulty: 'daily',
    recommendedForLowScore: true,
  },
  {
    id: 'sleep_fixed_alarm',
    pillar: 'sleep',
    title: 'Consistent Wake-Up',
    description: 'Wake up at your set time tomorrow without hitting snooze once.',
    xp: 35,
    durationLabel: 'At wake-up',
    difficulty: 'micro',
  },
  {
    id: 'sleep_cool_cave',
    pillar: 'sleep',
    title: 'Dark & Cool Cave',
    description: 'Block outside light, cover bright LEDs, and let fresh cool air into the bedroom.',
    xp: 30,
    durationLabel: '5 min',
    difficulty: 'micro',
  },
  {
    id: 'sleep_caffeine_cutoff',
    pillar: 'sleep',
    title: '2 PM Caffeine Cutoff',
    description: 'Switch from coffee and energy drinks to water or caffeine-free herbal tea after 2 PM.',
    xp: 45,
    durationLabel: 'Afternoon',
    difficulty: 'daily',
  },

  // Nutrition
  {
    id: 'nutri_morning_water',
    pillar: 'nutrition',
    title: 'Morning Hydration Glass',
    description: 'Drink a full 16 oz / 500 ml glass of water before reaching for coffee or breakfast.',
    xp: 30,
    durationLabel: '1 min at wake-up',
    difficulty: 'micro',
    recommendedForLowScore: true,
  },
  {
    id: 'nutri_half_plate_green',
    pillar: 'nutrition',
    title: 'Half Plate of Greens',
    description: 'Make sure at least 50% of your lunch or dinner consists of fresh vegetables.',
    xp: 45,
    durationLabel: 'Main meal',
    difficulty: 'daily',
    recommendedForLowScore: true,
  },
  {
    id: 'nutri_zero_liquid_sugar',
    pillar: 'nutrition',
    title: 'Zero Liquid Sugar Today',
    description: 'Skip all sugary sodas, sweetened juices, and dessert coffees today.',
    xp: 40,
    durationLabel: 'All day',
    difficulty: 'daily',
  },
  {
    id: 'nutri_mindful_eating',
    pillar: 'nutrition',
    title: 'Screen-Free Meal',
    description: 'Enjoy one meal seated comfortably without glancing at phones, laptops, or TV.',
    xp: 35,
    durationLabel: '15 min quiet',
    difficulty: 'micro',
  },

  // Mind
  {
    id: 'mind_breath_pause',
    pillar: 'mind',
    title: '4-7-8 Breathing Reset',
    description: 'Perform 4 mindful breath cycles (inhale 4s, hold 7s, exhale 8s) to reset your nervous system.',
    xp: 35,
    durationLabel: '2 minutes',
    difficulty: 'micro',
    recommendedForLowScore: true,
  },
  {
    id: 'mind_nature_walk',
    pillar: 'mind',
    title: 'Mindful Outdoor Stroll',
    description: 'Take a 10-minute walk outside with your phone in your pocket, noticing trees and sounds.',
    xp: 45,
    durationLabel: '10 min',
    difficulty: 'daily',
  },
  {
    id: 'mind_gratitude_triad',
    pillar: 'mind',
    title: 'Gratitude Triad',
    description: 'Write down or mentally reflect on 3 specific things you are grateful for today.',
    xp: 30,
    durationLabel: '2 min',
    difficulty: 'micro',
  },
  {
    id: 'mind_social_connection',
    pillar: 'mind',
    title: 'Heartfelt Check-In',
    description: 'Send a warm, sincere message or phone call to a friend or loved one just to say hello.',
    xp: 35,
    durationLabel: '3 min',
    difficulty: 'micro',
    recommendedForLowScore: true,
  },

  // Exercise
  {
    id: 'exercise_daily_steps',
    pillar: 'exercise',
    title: 'Brisk Walk Dose (15 min)',
    description: 'Take a 15-minute brisk walk (post-meal walk, step out early, or neighborhood loop).',
    xp: 40,
    durationLabel: '15 min',
    difficulty: 'daily',
    recommendedForLowScore: true,
  },
  {
    id: 'exercise_desk_stretch',
    pillar: 'exercise',
    title: '90s Posture Reset',
    description: 'Stand up, roll shoulders back, open chest, and stretch spine for 90 seconds.',
    xp: 25,
    durationLabel: '90 seconds',
    difficulty: 'micro',
    recommendedForLowScore: true,
  },
  {
    id: 'exercise_stairs_hero',
    pillar: 'exercise',
    title: 'Stairs Champion',
    description: 'Take stairs instead of elevator or escalator on two occasions today.',
    xp: 35,
    durationLabel: 'Throughout day',
    difficulty: 'micro',
  },
  {
    id: 'exercise_fun_movement',
    pillar: 'exercise',
    title: '20 Min Playful Movement',
    description: 'Dance to your favorite playlist, ride a bike, play with a pet, or play sports.',
    xp: 50,
    durationLabel: '20 min',
    difficulty: 'weekly',
  },
];

export const BADGES_CATALOG: AchievementBadge[] = [
  {
    id: 'badge_first_test',
    title: 'Primer Diagnóstico',
    description: 'Completaste tu primera evaluación completa de hábitos saludables.',
    iconName: 'Award',
    xpReward: 50,
    category: 'starter',
  },
  {
    id: 'badge_first_action',
    title: 'Paso a la Acción',
    description: 'Completaste tu primer reto o micro-acción inmediata en tiempo real.',
    iconName: 'Zap',
    xpReward: 40,
    category: 'action',
  },
  {
    id: 'badge_breath_master',
    title: 'Mente Zen 4-7-8',
    description: 'Completaste una sesión guiada de respiración consciente.',
    iconName: 'Brain',
    xpReward: 35,
    category: 'action',
  },
  {
    id: 'badge_hydration_hero',
    title: 'Fuente Vital',
    description: 'Realizaste una recarga de hidratación consciente.',
    iconName: 'Droplet',
    xpReward: 30,
    category: 'action',
  },
  {
    id: 'badge_signed_pact',
    title: 'Pacto de Honor',
    description: 'Firmaste tu compromiso personal de buenos hábitos.',
    iconName: 'FileCheck',
    xpReward: 60,
    category: 'action',
  },
  {
    id: 'badge_streak_3',
    title: 'Racha Imparable (3 Días)',
    description: 'Mantuviste 3 días consecutivos de actividad y retos completados.',
    iconName: 'Flame',
    xpReward: 75,
    category: 'streak',
  },
  {
    id: 'badge_sleep_guardian',
    title: 'Guardián del Sueño',
    description: 'Alcanzaste 80%+ en el pilar de sueño o completaste 3 retos nocturnos.',
    iconName: 'Moon',
    xpReward: 50,
    category: 'mastery',
  },
  {
    id: 'badge_golden_balance',
    title: 'Equilibrio Dorado',
    description: 'Alcanzaste un puntaje global superior al 80% en tu evaluación.',
    iconName: 'Crown',
    xpReward: 100,
    category: 'mastery',
  },
];

export function getHabitQuests(lang: Language = 'es'): HabitQuest[] {
  return lang === 'en' ? HABIT_QUESTS_EN : HABIT_QUESTS_ES;
}
