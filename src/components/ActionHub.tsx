import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Flame,
  Zap,
  Award,
  CheckCircle2,
  Clock,
  Sparkles,
  FileCheck,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  Moon,
  Apple,
  Brain,
  Activity,
  ChevronRight,
  ShieldCheck,
  Share2,
} from 'lucide-react';
import { PillarId } from '../types/wellness';
import { HabitQuest, UserGamificationState, HabitContract } from '../types/gamification';
import { getHabitQuests, BADGES_CATALOG, calculateLevel } from '../data/gamificationData';
import { completeQuest, acceptQuest, signHabitContract, toggleSoundSetting } from '../utils/gamificationStorage';
import { ImmediateActionModal, MicroActionType } from './ImmediateActionModal';
import { useLanguage } from '../context/LanguageContext';

interface ActionHubProps {
  gamificationState: UserGamificationState;
  onStateUpdate: (updatedState: UserGamificationState) => void;
  onGoToQuiz: () => void;
  defaultUserName?: string;
}

export const ActionHub: React.FC<ActionHubProps> = ({
  gamificationState,
  onStateUpdate,
  onGoToQuiz,
  defaultUserName,
}) => {
  const { language, t } = useLanguage();
  const isEn = language === 'en';

  const [filterPillar, setFilterPillar] = useState<PillarId | 'all'>('all');
  const [modalActionType, setModalActionType] = useState<MicroActionType | null>(null);

  // Contract form state
  const [contractName, setContractName] = useState(gamificationState.contract?.name || defaultUserName || '');
  const [selectedCommitments, setSelectedCommitments] = useState<string[]>(
    gamificationState.contract?.commitments || [
      isEn ? 'Digital sunset 30 minutes before sleep' : 'Apagar pantallas 30 minutos antes de dormir',
      isEn ? 'Drink 1 big glass of water upon waking up' : 'Beber un vaso de agua al despertar',
      isEn ? 'Walk briskly for 15 minutes every day' : 'Caminar al menos 15 minutos al día a paso vivo',
    ]
  );
  const [isSigning, setIsSigning] = useState(false);
  const [contractCopied, setContractCopied] = useState(false);

  const quests = getHabitQuests(language);
  const levelInfo = calculateLevel(gamificationState.xp, language);

  const filteredQuests = quests.filter((q) => {
    if (filterPillar === 'all') return true;
    return q.pillar === filterPillar;
  });

  const completedTodayCount = gamificationState.completedQuestsToday.length;

  const handleCompleteQuestClick = (quest: HabitQuest) => {
    const isAlreadyDone = gamificationState.completedQuestsToday.includes(quest.id);
    if (isAlreadyDone) return;

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#0d9488', '#10b981', '#6366f1', '#f59e0b'],
      });
    } catch {
      // safe fallback
    }

    const { state } = completeQuest(quest.id, quest.xp);
    onStateUpdate(state);
  };

  const handleToggleSound = () => {
    const newSound = toggleSoundSetting();
    onStateUpdate({
      ...gamificationState,
      soundEnabled: newSound,
    });
  };

  const handleSignContract = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contractName.trim()) return;

    setIsSigning(true);
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.5 },
      });
    } catch {}

    const { state } = signHabitContract(contractName, selectedCommitments);
    onStateUpdate(state);
    setIsSigning(false);
  };

  const handleCopyContract = () => {
    const text = isEn
      ? `EQUILIBRIA PERSONAL HABIT CONTRACT\nSigned by: ${gamificationState.contract?.name}\nCommitments:\n${gamificationState.contract?.commitments.map((c, i) => `• ${c}`).join('\n')}\nDate: ${new Date(gamificationState.contract?.date || '').toLocaleDateString()}`
      : `CONTRATO DE COMPROMISO EQUILIBRIA\nFirmado por: ${gamificationState.contract?.name}\nCompromisos adquiridos:\n${gamificationState.contract?.commitments.map((c, i) => `• ${c}`).join('\n')}\nFecha: ${new Date(gamificationState.contract?.date || '').toLocaleDateString()}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setContractCopied(true);
      setTimeout(() => setContractCopied(false), 2000);
    }
  };

  const pillarIcons: Record<PillarId, React.ReactNode> = {
    sleep: <Moon className="w-4 h-4 text-indigo-500" />,
    nutrition: <Apple className="w-4 h-4 text-emerald-500" />,
    mind: <Brain className="w-4 h-4 text-teal-500" />,
    exercise: <Activity className="w-4 h-4 text-amber-500" />,
  };

  const defaultPledges = isEn
    ? [
        'Digital sunset 30 minutes before sleep',
        'Drink 1 big glass of water upon waking up',
        'Take a 2-minute mindful breathing break daily',
        'Walk briskly for 15 minutes every day',
        'Eat at least one screen-free whole meal',
        'Stop caffeine consumption after 2:00 PM',
      ]
    : [
        'Apagar pantallas 30 minutos antes de dormir',
        'Beber un vaso de agua al despertar',
        'Hacer una pausa de respiración consciente 4-7-8 al día',
        'Caminar al menos 15 minutos al día a paso vivo',
        'Comer al menos una comida sin mirar pantallas',
        'Cortar el consumo de café después de las 14:00',
      ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-10">
      {/* SECTION 1: GAMIFICATION HUD HEADER */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-teal-900/40 relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Left: Player Profile & Level */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-teal-400" />
                <span>{isEn ? `Level ${levelInfo.level}` : `Nivel ${levelInfo.level}`}</span>
              </span>
              <span className="text-xs text-slate-300">
                {levelInfo.levelTitle}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {isEn ? 'Habits Action Hub & Challenges' : 'Centro de Retos y Hábitos en Acción'}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              {isEn
                ? 'Knowledge without action has no power. Complete daily micro-quests, practice immediate habits, and build an unstoppable vitality streak.'
                : 'El conocimiento sin acción no transforma tu salud. Completa micro-retos diarios, activa hábitos inmediatos y eleva tu nivel de bienestar.'}
            </p>
          </div>

          {/* Right: Gamified Stats Pills */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Streak Counter */}
            <div className="px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Flame className="w-6 h-6 fill-amber-400 text-amber-500 animate-pulse" />
              </div>
              <div>
                <span className="text-xl font-bold font-mono tabular-nums leading-none block">
                  {gamificationState.currentStreak} {isEn ? 'Days' : 'Días'}
                </span>
                <span className="text-[11px] text-slate-300 font-medium">
                  {isEn ? 'Active Streak' : 'Racha Activa'}
                </span>
              </div>
            </div>

            {/* Total XP */}
            <div className="px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
                <Zap className="w-6 h-6 fill-teal-400 text-teal-400" />
              </div>
              <div>
                <span className="text-xl font-bold font-mono tabular-nums leading-none block">
                  {gamificationState.xp} XP
                </span>
                <span className="text-[11px] text-slate-300 font-medium">
                  {isEn ? 'Total Points' : 'Puntos Totales'}
                </span>
              </div>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={handleToggleSound}
              title={isEn ? 'Toggle sound effects' : 'Efectos de sonido de logros'}
              className="p-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-slate-300 hover:text-white transition-colors"
            >
              {gamificationState.soundEnabled ? <Volume2 className="w-5 h-5 text-teal-300" /> : <VolumeX className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Level XP Progress Bar */}
        <div className="mt-6 pt-5 border-t border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-medium">
              {isEn ? 'Progress to next rank' : 'Progreso hacia el siguiente rango'}
            </span>
            <span className="font-mono tabular-nums">
              {gamificationState.xp} / {levelInfo.nextLevelMinXp} XP ({levelInfo.progressPercent}%)
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/15 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${levelInfo.progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: IMMEDIATE ACTION (DO IT RIGHT NOW IN 60s) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
              {isEn ? 'Instant Habit Sparks' : 'Micro-Acciones Inmediatas'}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
              {isEn ? 'Do It Now in 60 Seconds (Zero Inertia)' : '¡Hazlo Ahora en 60 Segundos! (Cero Inercia)'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {isEn
                ? 'Do not postpone. Click any quick exercise right on your screen to reset energy and claim instant XP.'
                : 'No lo dejes para mañana. Haz un ejercicio guiado ahora mismo en pantalla para romper la inercia y ganar XP.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Breathing */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:border-teal-400 dark:hover:border-teal-600 transition-all flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <Brain className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                {isEn ? '4-7-8 Breathing' : 'Respiración 4-7-8'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {isEn ? '2-min guided cycle to relieve tension and stress.' : 'Ciclo interactivo de 2 min para calmar el ritmo cardíaco.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <span className="text-xs font-bold text-teal-600 dark:text-teal-400">+35 XP</span>
              <button
                onClick={() => setModalActionType('breathing')}
                className="px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1 transition-all"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>{isEn ? 'Start' : 'Iniciar'}</span>
              </button>
            </div>
          </div>

          {/* Card 2: Hydration */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:border-teal-400 dark:hover:border-teal-600 transition-all flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Apple className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                {isEn ? 'Drink 1 Glass Now' : '1 Vaso de Agua Ahora'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {isEn ? 'Pour and drink 350ml water right now.' : 'Levántate, sírvete un vaso de agua y reactiva tu cuerpo.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <span className="text-xs font-bold text-teal-600 dark:text-teal-400">+30 XP</span>
              <button
                onClick={() => setModalActionType('hydration')}
                className="px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1 transition-all"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>{isEn ? 'Start' : 'Iniciar'}</span>
              </button>
            </div>
          </div>

          {/* Card 3: Desk Stretch */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:border-teal-400 dark:hover:border-teal-600 transition-all flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                {isEn ? '90s Posture Reset' : 'Estiramiento 90s'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {isEn ? 'Decompress neck, back and chest from your chair.' : '3 movimientos rápidos guiados para descontracturar hombros.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <span className="text-xs font-bold text-teal-600 dark:text-teal-400">+30 XP</span>
              <button
                onClick={() => setModalActionType('stretch')}
                className="px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1 transition-all"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>{isEn ? 'Start' : 'Iniciar'}</span>
              </button>
            </div>
          </div>

          {/* Card 4: 20-20-20 Eye Reset */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:border-teal-400 dark:hover:border-teal-600 transition-all flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                {isEn ? '20-20-20 Vision Rest' : 'Detox Visual 20-20-20'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {isEn ? '20 seconds looking 6m away to prevent eye fatigue.' : '20 segundos enfocando a lo lejos para relajar la vista.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <span className="text-xs font-bold text-teal-600 dark:text-teal-400">+25 XP</span>
              <button
                onClick={() => setModalActionType('eye')}
                className="px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1 transition-all"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>{isEn ? 'Start' : 'Iniciar'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: DAILY ACTION QUESTS */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
              {isEn ? 'Pillar Quests' : 'Retos Diarios de los 4 Pilares'}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
              {isEn ? 'Select & Complete Your Action Quests' : 'Misiones Activas de Buenos Hábitos'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {isEn
                ? `${completedTodayCount} quests completed today. Pick a quest and fulfill it today.`
                : `${completedTodayCount} retos completados hoy. Elige un compromiso y márcalo al cumplirlo.`}
            </p>
          </div>

          {/* Pillar Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto">
            <button
              onClick={() => setFilterPillar('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                filterPillar === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {isEn ? 'All' : 'Todos'}
            </button>
            <button
              onClick={() => setFilterPillar('sleep')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                filterPillar === 'sleep'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {isEn ? 'Sleep' : 'Sueño'}
            </button>
            <button
              onClick={() => setFilterPillar('nutrition')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                filterPillar === 'nutrition'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {isEn ? 'Nutrition' : 'Nutrición'}
            </button>
            <button
              onClick={() => setFilterPillar('mind')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                filterPillar === 'mind'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {isEn ? 'Mind' : 'Mente'}
            </button>
            <button
              onClick={() => setFilterPillar('exercise')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                filterPillar === 'exercise'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {isEn ? 'Exercise' : 'Ejercicio'}
            </button>
          </div>
        </div>

        {/* Quest Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredQuests.map((quest) => {
            const isDoneToday = gamificationState.completedQuestsToday.includes(quest.id);
            const userProg = gamificationState.userQuests[quest.id];
            const questStreak = userProg?.currentStreak || 0;

            return (
              <div
                key={quest.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  isDoneToday
                    ? 'bg-teal-50/50 dark:bg-teal-950/30 border-teal-300 dark:border-teal-800'
                    : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div>
                  {/* Top metadata unboxed */}
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2.5">
                    <div className="flex items-center gap-2">
                      <span>{pillarIcons[quest.pillar]}</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300 capitalize">
                        {quest.pillar}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{quest.durationLabel}</span>
                    </div>

                    <div className="flex items-center gap-1.5 font-bold text-teal-700 dark:text-teal-400 font-mono">
                      <span>+{quest.xp} XP</span>
                      {questStreak > 0 && (
                        <span className="text-amber-500 flex items-center text-[11px]">
                          <Flame className="w-3 h-3 fill-current inline" />
                          {questStreak}d
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                    {quest.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {quest.description}
                  </p>
                </div>

                {/* Bottom CTA */}
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <div className="text-[11px] text-slate-400">
                    {isDoneToday
                      ? isEn
                        ? 'Completed today'
                        : 'Completado con éxito hoy'
                      : isEn
                      ? 'Commit today'
                      : 'Cumplir hoy'}
                  </div>

                  {isDoneToday ? (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-teal-700 dark:text-teal-400">
                      <CheckCircle2 className="w-4 h-4 text-teal-600" />
                      <span>{isEn ? 'Done Today' : '¡Completado!'}</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleCompleteQuestClick(quest)}
                      className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-all active:scale-[0.98]"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isEn ? `I did this! (+${quest.xp} XP)` : `¡Lo cumplí! (+${quest.xp} XP)`}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 4: HABIT COMMITMENT CONTRACT (PACTO PERSONAL) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
              {isEn ? 'Psychological Commitment' : 'Compromiso Psicológico'}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
              {isEn ? 'My Personal Healthy Habits Contract' : 'Mi Pacto de Honor de Buenos Hábitos'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {isEn
                ? 'Studies show writing and signing your commitments increases consistency by up to 300%.'
                : 'La ciencia del comportamiento demuestra que firmar un pacto explícito multiplica la adherencia a largo plazo.'}
            </p>
          </div>

          {gamificationState.contract?.signed && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyContract}
                className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{contractCopied ? (isEn ? 'Copied!' : '¡Copiado!') : isEn ? 'Copy Pledge' : 'Copiar Pacto'}</span>
              </button>
            </div>
          )}
        </div>

        {gamificationState.contract?.signed ? (
          /* Signed Certificate Card */
          <div className="p-6 rounded-2xl bg-gradient-to-br from-teal-50/60 via-emerald-50/40 to-slate-50 dark:from-teal-950/40 dark:via-emerald-950/20 dark:to-slate-900 border-2 border-dashed border-teal-300 dark:border-teal-700 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-teal-800 dark:text-teal-300 uppercase tracking-widest">
                <FileCheck className="w-4 h-4 text-teal-600" />
                <span>{isEn ? 'Official Signed Pledge' : 'Pacto de Honor en Vigor'}</span>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                {new Date(gamificationState.contract.date).toLocaleDateString()}
              </span>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                {isEn ? 'Signed by' : 'Firmado por'}
              </p>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {gamificationState.contract.name}
              </h3>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                {isEn ? 'Active Commitments' : 'Compromisos Asumidos'}
              </p>
              <ul className="space-y-1.5">
                {gamificationState.contract.commitments.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-3 border-t border-teal-200/60 dark:border-teal-800/60 flex items-center justify-between text-xs text-teal-900 dark:text-teal-300">
              <span>{isEn ? 'Pledge Status: ACTIVE' : 'Estado del Pacto: ACTIVO'}</span>
              <span className="font-bold">+75 XP {isEn ? 'Claimed' : 'Reclamados'}</span>
            </div>
          </div>
        ) : (
          /* Sign Contract Form */
          <form onSubmit={handleSignContract} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                {isEn ? 'Your Name or Alias to Sign' : 'Tu Nombre o Firma para el Pacto'}
              </label>
              <input
                type="text"
                value={contractName}
                onChange={(e) => setContractName(e.target.value)}
                placeholder={isEn ? 'E.g. Elena, Alex, Dr. Smith...' : 'Ej. Carlos, Laura, Diego...'}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                {isEn ? 'Choose 2 to 3 core commitments' : 'Selecciona de 2 a 3 compromisos clave'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {defaultPledges.map((pledge, index) => {
                  const isChecked = selectedCommitments.includes(pledge);
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        if (isChecked) {
                          setSelectedCommitments(selectedCommitments.filter((p) => p !== pledge));
                        } else {
                          setSelectedCommitments([...selectedCommitments, pledge]);
                        }
                      }}
                      className={`p-3 rounded-xl text-left border text-xs font-medium transition-all flex items-start gap-2.5 ${
                        isChecked
                          ? 'border-teal-500 bg-teal-50/60 dark:bg-teal-950/40 text-teal-950 dark:text-teal-100 font-semibold shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {isChecked ? (
                          <CheckCircle2 className="w-4 h-4 text-teal-600" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600" />
                        )}
                      </div>
                      <span>{pledge}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={!contractName.trim() || selectedCommitments.length === 0 || isSigning}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
              >
                <FileCheck className="w-4 h-4" />
                <span>
                  {isEn
                    ? 'Sign Personal Contract (+75 XP)'
                    : 'Firmar Mi Pacto de Honor (+75 XP)'}
                </span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* SECTION 5: ACHIEVEMENTS & BADGES HALL */}
      <div className="space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
            {isEn ? 'Trophy Room' : 'Sala de Trofeos'}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
            {isEn ? 'Unlocked Badges & Achievements' : 'Medallas y Logros de Bienestar'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {isEn
              ? `${gamificationState.unlockedBadges.length} of ${BADGES_CATALOG.length} badges unlocked.`
              : `${gamificationState.unlockedBadges.length} de ${BADGES_CATALOG.length} medallas desbloqueadas.`}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {BADGES_CATALOG.map((badge) => {
            const isUnlocked = gamificationState.unlockedBadges.includes(badge.id);

            return (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-between ${
                  isUnlocked
                    ? 'bg-white dark:bg-slate-900 border-teal-300 dark:border-teal-800 shadow-sm'
                    : 'bg-slate-50/50 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 opacity-60'
                }`}
              >
                <div className="space-y-2 flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg ${
                      isUnlocked
                        ? 'bg-teal-100 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 shadow-sm'
                        : 'bg-slate-200/80 dark:bg-slate-800 text-slate-400'
                    }`}
                  >
                    <Award className="w-6 h-6" />
                  </div>

                  <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-tight">
                    {badge.title}
                  </h3>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                    {badge.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 w-full text-[10px] font-mono font-bold text-teal-700 dark:text-teal-400">
                  {isUnlocked ? (isEn ? 'UNLOCKED' : 'DESBLOQUEADO') : `+${badge.xpReward} XP`}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Immediate Action Modal */}
      {modalActionType && (
        <ImmediateActionModal
          initialType={modalActionType}
          isOpen={modalActionType !== null}
          onClose={() => setModalActionType(null)}
          onActionCompleted={(xp, name) => {
            // refresh state
            const updated = { ...gamificationState };
            onStateUpdate(updated);
          }}
          soundEnabled={gamificationState.soundEnabled}
        />
      )}
    </div>
  );
};
