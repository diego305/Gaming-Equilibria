import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  Droplet,
  Brain,
  Activity,
  Eye,
  CheckCircle2,
  Play,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { playChime } from '../utils/audio';
import { addXp, unlockBadge } from '../utils/gamificationStorage';
import { useLanguage } from '../context/LanguageContext';

export type MicroActionType = 'breathing' | 'hydration' | 'stretch' | 'eye';

interface ImmediateActionModalProps {
  initialType?: MicroActionType;
  isOpen: boolean;
  onClose: () => void;
  onActionCompleted: (xpEarned: number, actionName: string) => void;
  soundEnabled: boolean;
}

export const ImmediateActionModal: React.FC<ImmediateActionModalProps> = ({
  initialType = 'breathing',
  isOpen,
  onClose,
  onActionCompleted,
  soundEnabled,
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const [activeType, setActiveType] = useState<MicroActionType>(initialType);
  const [completed, setCompleted] = useState(false);

  // Breathing state: 4-7-8
  const [breathPhase, setBreathPhase] = useState<'idle' | 'inhale' | 'hold' | 'exhale'>('idle');
  const [breathSecondsLeft, setBreathSecondsLeft] = useState(4);
  const [breathCyclesDone, setBreathCyclesDone] = useState(0);
  const totalBreathCycles = 3;

  // Stretch state
  const [stretchSecondsLeft, setStretchSecondsLeft] = useState(60);
  const [isStretchActive, setIsStretchActive] = useState(false);
  const [currentStretchStep, setCurrentStretchStep] = useState(0);

  // Eye reset state
  const [eyeSecondsLeft, setEyeSecondsLeft] = useState(20);
  const [isEyeActive, setIsEyeActive] = useState(false);

  // Hydration state
  const [waterGlasses, setWaterGlasses] = useState(1);

  useEffect(() => {
    if (initialType) {
      setActiveType(initialType);
      setCompleted(false);
      resetAll();
    }
  }, [initialType, isOpen]);

  const resetAll = () => {
    setBreathPhase('idle');
    setBreathSecondsLeft(4);
    setBreathCyclesDone(0);
    setStretchSecondsLeft(60);
    setIsStretchActive(false);
    setCurrentStretchStep(0);
    setEyeSecondsLeft(20);
    setIsEyeActive(false);
    setWaterGlasses(1);
    setCompleted(false);
  };

  // Breathing timer loop
  useEffect(() => {
    if (activeType !== 'breathing' || breathPhase === 'idle' || completed) return;

    const interval = setInterval(() => {
      setBreathSecondsLeft((prev) => {
        if (prev > 1) return prev - 1;

        // Transition between phases
        if (breathPhase === 'inhale') {
          setBreathPhase('hold');
          return 7;
        } else if (breathPhase === 'hold') {
          setBreathPhase('exhale');
          playChime('breathOut', soundEnabled);
          return 8;
        } else if (breathPhase === 'exhale') {
          const nextCycles = breathCyclesDone + 1;
          setBreathCyclesDone(nextCycles);
          if (nextCycles >= totalBreathCycles) {
            handleCompleteAction(35, isEn ? '4-7-8 Breathing Reset' : 'Respiración Consciente 4-7-8');
            unlockBadge('badge_breath_master');
            return 0;
          } else {
            setBreathPhase('inhale');
            playChime('breathIn', soundEnabled);
            return 4;
          }
        }
        return 4;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeType, breathPhase, breathCyclesDone, completed, soundEnabled, isEn]);

  // Stretch timer loop
  useEffect(() => {
    if (activeType !== 'stretch' || !isStretchActive || completed) return;

    const interval = setInterval(() => {
      setStretchSecondsLeft((prev) => {
        if (prev <= 1) {
          handleCompleteAction(30, isEn ? '90s Posture Reset' : 'Estiramiento y Reset Postural');
          return 0;
        }
        const newSec = prev - 1;
        if (newSec === 40) setCurrentStretchStep(1);
        if (newSec === 20) setCurrentStretchStep(2);
        return newSec;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeType, isStretchActive, completed, isEn]);

  // Eye timer loop
  useEffect(() => {
    if (activeType !== 'eye' || !isEyeActive || completed) return;

    const interval = setInterval(() => {
      setEyeSecondsLeft((prev) => {
        if (prev <= 1) {
          handleCompleteAction(25, isEn ? '20-20-20 Eye Reset' : 'Detox Visual 20-20-20');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeType, isEyeActive, completed, isEn]);

  const handleStartBreathing = () => {
    setBreathCyclesDone(0);
    setBreathPhase('inhale');
    setBreathSecondsLeft(4);
    playChime('breathIn', soundEnabled);
  };

  const handleCompleteAction = (xp: number, name: string) => {
    setCompleted(true);
    addXp(xp, name);
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#0d9488', '#10b981', '#6366f1', '#f59e0b'],
      });
    } catch {
      // safe fallback
    }
    onActionCompleted(xp, name);
  };

  const handleCompleteHydration = () => {
    unlockBadge('badge_hydration_hero');
    handleCompleteAction(30, isEn ? 'Mindful Hydration' : 'Hidratación Consciente');
  };

  if (!isOpen) return null;

  const stretchSteps = isEn
    ? [
        { title: 'Neck & Trapezius Release', text: 'Gently tilt your head toward your right shoulder for 10s, then toward your left.' },
        { title: 'Open Chest & Roll Shoulders', text: 'Interlace fingers behind your back, pull down gently, and take 3 deep chest breaths.' },
        { title: 'Torso Twist & Spine Elongation', text: 'Sit upright, gently twist torso right looking back, hold 10s, then switch left.' },
      ]
    : [
        { title: 'Liberación de Cuello y Trapecios', text: 'Inclina suavemente la cabeza hacia el hombro derecho 10s, luego cambia al hombro izquierdo.' },
        { title: 'Apertura de Pecho y Hombros', text: 'Entrelaza las manos detrás de tu espalda, proyecta el pecho hacia adelante e inhala profundo.' },
        { title: 'Torsión Espinal Suave', text: 'Gira el tronco hacia la derecha mirando hacia atrás, mantén 10s y repite suavemente hacia la izquierda.' },
      ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl transition-all">
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
              {isEn ? 'Immediate Action · 60s Micro-Habit' : 'Acción Inmediata · Micro-Hábito de 60s'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Type Selector Tabs */}
        <div className="grid grid-cols-4 p-2 gap-1 bg-slate-100/70 dark:bg-slate-800/70 border-b border-slate-200/50 dark:border-slate-800 text-xs font-medium">
          <button
            onClick={() => {
              setActiveType('breathing');
              resetAll();
            }}
            className={`py-2 px-1 rounded-xl flex flex-col items-center gap-1 transition-all ${
              activeType === 'breathing'
                ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Brain className="w-4 h-4" />
            <span className="truncate">{isEn ? 'Breathe' : 'Respirar'}</span>
          </button>

          <button
            onClick={() => {
              setActiveType('hydration');
              resetAll();
            }}
            className={`py-2 px-1 rounded-xl flex flex-col items-center gap-1 transition-all ${
              activeType === 'hydration'
                ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Droplet className="w-4 h-4" />
            <span className="truncate">{isEn ? 'Water' : 'Agua'}</span>
          </button>

          <button
            onClick={() => {
              setActiveType('stretch');
              resetAll();
            }}
            className={`py-2 px-1 rounded-xl flex flex-col items-center gap-1 transition-all ${
              activeType === 'stretch'
                ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span className="truncate">{isEn ? 'Stretch' : 'Estirar'}</span>
          </button>

          <button
            onClick={() => {
              setActiveType('eye');
              resetAll();
            }}
            className={`py-2 px-1 rounded-xl flex flex-col items-center gap-1 transition-all ${
              activeType === 'eye'
                ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span className="truncate">{isEn ? 'Vision' : 'Vista'}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8">
          {completed ? (
            /* Completed Screen */
            <div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-2xl bg-teal-100 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto shadow-sm">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {isEn ? 'Micro-Action Completed!' : '¡Micro-Acción Realizada!'}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
                  {isEn
                    ? 'You broke mental inertia and took tangible action right now. Points and streak updated!'
                    : 'Has roto la inercia y tomado acción inmediata en tiempo real. ¡Puntos de experiencia sumados a tu nivel!'}
                </p>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-200 font-bold text-sm">
                <span>+35 XP</span>
                <span>·</span>
                <span>{isEn ? 'Active Action Streak' : 'Racha de Acción Activa'}</span>
              </div>
              <div className="pt-4 flex gap-2 justify-center">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white font-medium text-sm transition-all"
                >
                  {isEn ? 'Continue' : 'Continuar'}
                </button>
              </div>
            </div>
          ) : activeType === 'breathing' ? (
            /* Breathing Exercise */
            <div className="text-center space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {isEn ? 'Guided 4-7-8 Breathing' : 'Respiración Consciente 4-7-8'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                  {isEn
                    ? 'Inhale 4s, hold gently for 7s, exhale slowly for 8s. Resets heart rate and lowers cortisol.'
                    : 'Inhala 4s por la nariz, sostén 7s y exhala 8s suavemente por la boca. Calma el sistema nervioso en minutos.'}
                </p>
              </div>

              {/* Dynamic Breathing Circle */}
              <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
                <div
                  className={`absolute inset-0 rounded-full transition-all duration-1000 ease-in-out border-4 ${
                    breathPhase === 'inhale'
                      ? 'scale-110 border-teal-500 bg-teal-50/60 dark:bg-teal-950/40'
                      : breathPhase === 'hold'
                      ? 'scale-110 border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40'
                      : breathPhase === 'exhale'
                      ? 'scale-75 border-teal-400 bg-teal-50/20 dark:bg-teal-950/20'
                      : 'scale-90 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40'
                  }`}
                />
                <div className="relative z-10 space-y-1">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                    {breathPhase === 'idle' ? '4-7-8' : `${breathSecondsLeft}s`}
                  </span>
                  <span className="block text-xs uppercase tracking-wider font-bold text-teal-700 dark:text-teal-300">
                    {breathPhase === 'idle'
                      ? isEn
                        ? 'Ready'
                        : 'Listo'
                      : breathPhase === 'inhale'
                      ? isEn
                        ? 'Inhale'
                        : 'Inhala (Nariz)'
                      : breathPhase === 'hold'
                      ? isEn
                        ? 'Hold'
                        : 'Sostén'
                      : isEn
                      ? 'Exhale'
                      : 'Exhala (Boca)'}
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                {isEn ? 'Cycle' : 'Ciclo'} {Math.min(breathCyclesDone + 1, totalBreathCycles)} {isEn ? 'of' : 'de'}{' '}
                {totalBreathCycles}
              </div>

              <div className="pt-2">
                {breathPhase === 'idle' ? (
                  <button
                    onClick={handleStartBreathing}
                    className="w-full py-3 px-6 rounded-xl bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>{isEn ? 'Start Breathing Cycle (2 min)' : 'Comenzar Ejercicio Guiado'}</span>
                  </button>
                ) : (
                  <button
                    onClick={resetAll}
                    className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1 mx-auto"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Restart' : 'Reiniciar'}</span>
                  </button>
                )}
              </div>
            </div>
          ) : activeType === 'hydration' ? (
            /* Hydration Action */
            <div className="text-center space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {isEn ? 'Drink 1 Glass of Water Now' : 'Bebe 1 Vaso de Agua Ahora'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                  {isEn
                    ? 'Stand up, pour yourself a fresh 350-500 ml glass of water, and drink it mindfully.'
                    : 'Levántate de tu asiento, sírvete un vaso de agua fresca de 300-500 ml y bébelo con calma.'}
                </p>
              </div>

              <div className="w-32 h-44 mx-auto rounded-3xl border-4 border-teal-500/40 dark:border-teal-400/30 p-2 flex flex-col justify-end bg-slate-50 dark:bg-slate-800/40 relative overflow-hidden">
                <div className="w-full bg-teal-500/30 dark:bg-teal-500/40 rounded-2xl h-3/4 flex items-center justify-center text-teal-800 dark:text-teal-200 font-bold text-xs">
                  💧 ~350 ml
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xs mx-auto">
                {isEn
                  ? 'Hydration immediately improves cognitive speed and reduces mental fatigue.'
                  : 'La hidratación inmediata reactiva la oxigenación celular y combate el cansancio de pantalla.'}
              </p>

              <button
                onClick={handleCompleteHydration}
                className="w-full py-3 px-6 rounded-xl bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isEn ? "I drank it! Claim +30 XP" : '¡Ya me lo tomé! Reclamar +30 XP'}</span>
              </button>
            </div>
          ) : activeType === 'stretch' ? (
            /* Stretch Action */
            <div className="text-center space-y-5">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {isEn ? '60-Second Desk Posture Reset' : 'Reset Postural de 60 Segundos'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {isEn ? 'Follow 3 simple moves to decompress your spine.' : '3 movimientos sencillos para descontracturar hombros y columna.'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-left space-y-1">
                <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                  {isEn ? `Step ${currentStretchStep + 1} of 3` : `Paso ${currentStretchStep + 1} de 3`}
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {stretchSteps[currentStretchStep]?.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {stretchSteps[currentStretchStep]?.text}
                </p>
              </div>

              <div className="font-mono text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
                {stretchSecondsLeft}s
              </div>

              {!isStretchActive ? (
                <button
                  onClick={() => setIsStretchActive(true)}
                  className="w-full py-3 px-6 rounded-xl bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{isEn ? 'Start 60s Stretch Timer' : 'Comenzar 60s de Estiramiento'}</span>
                </button>
              ) : (
                <button
                  onClick={() => handleCompleteAction(30, isEn ? 'Desk Stretch' : 'Estiramiento')}
                  className="w-full py-2.5 px-4 rounded-xl border border-teal-600 text-teal-700 dark:text-teal-300 font-medium text-xs hover:bg-teal-50 dark:hover:bg-teal-950/40 transition-colors"
                >
                  {isEn ? 'I finished early! Claim +30 XP' : '¡Completé los estiramientos! Reclamar +30 XP'}
                </button>
              )}
            </div>
          ) : (
            /* Eye 20-20-20 */
            <div className="text-center space-y-5">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {isEn ? '20-20-20 Visual Rest' : 'Regla 20-20-20 de Descanso Ocular'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                  {isEn
                    ? 'Look away from all screens at an object at least 6 meters (20 feet) away for 20 seconds.'
                    : 'Aparta los ojos de la pantalla y mira a un objeto lejano (al menos a 6 metros o por una ventana) durante 20s.'}
                </p>
              </div>

              <div className="w-32 h-32 mx-auto rounded-full border-4 border-teal-500/40 flex items-center justify-center font-mono text-3xl font-bold text-teal-700 dark:text-teal-300 tabular-nums">
                {eyeSecondsLeft}s
              </div>

              {!isEyeActive ? (
                <button
                  onClick={() => setIsEyeActive(true)}
                  className="w-full py-3 px-6 rounded-xl bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{isEn ? 'Start 20s Eye Timer' : 'Comenzar 20s de Enfoque Lejano'}</span>
                </button>
              ) : (
                <button
                  onClick={() => handleCompleteAction(25, isEn ? 'Visual Rest' : 'Descanso Ocular')}
                  className="w-full py-2.5 px-4 rounded-xl border border-teal-600 text-teal-700 dark:text-teal-300 font-medium text-xs hover:bg-teal-50 dark:hover:bg-teal-950/40 transition-colors"
                >
                  {isEn ? 'Done! Claim +25 XP' : '¡Listo! Reclamar +25 XP'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
