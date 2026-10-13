import React, { useState } from 'react';
import {
  BookOpen,
  Download,
  Copy,
  Check,
  Play,
  Flame,
  ShieldCheck,
  Award,
  Sparkles,
  Zap,
  ArrowRight,
  FileText,
  Clock,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface UserManualViewProps {
  onStartTest: () => void;
  onGoToQuests: () => void;
}

export const UserManualView: React.FC<UserManualViewProps> = ({
  onStartTest,
  onGoToQuests,
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState<'intro' | 'eval' | 'radar' | 'quests' | 'immediate' | 'pact' | 'shortcuts'>('intro');

  const manualMarkdownContent = `# Manual de Uso de Equilibria
### Evaluador y Entrenador de Buenos Hábitos Saludables

1. INTRODUCCIÓN Y PROPÓSITO
Equilibria es una plataforma interactiva, privada y gamificada diseñada para medir y transformar los hábitos diarios en los cuatro pilares fundamentales del bienestar:
- Sueño Reparador: 7 a 8 horas continuas, desconexión de pantallas.
- Alimentación Consciente: Comida fresca, hidratación abundante y moderación de ultraprocesados.
- Salud Mental & Calma: Pausas conscientes, lectura, vida social y equilibrio emocional.
- Ejercicio & Movimiento: 30+ minutos de movimiento agradable al día.

2. PRIVACIDAD LOCAL-FIRST
- Sin registros ni contraseñas obligatorias.
- Todos tus datos se almacenan exclusivamente en el almacenamiento local (localStorage) de tu navegador.

3. EVALUACIÓN Y ATAJOS
- 16 preguntas estructuradas (4 por pilar).
- Atajos de teclado: Pulsa 1, 2, 3 o 4 para seleccionar opción; Enter para avanzar; flecha izquierda para retroceder.
- Guardado automático: Puedes retomar un test en curso en cualquier momento.

4. DIAGNÓSTICO Y RADAR DE SIMETRÍA
- Visualiza tu simetría vital frente al estándar óptimo del 80%.
- Obtén tu Arquetipo de Bienestar, recomendaciones individualizadas y un plan de acción de 7 días.

5. CENTRO DE RETOS & GAMIFICACIÓN
- Sistema de niveles: 5 rangos de maestría desde Iniciado hasta Titán de la Longevidad.
- Racha activa diaria (fuego): Suma días consecutivos completando misiones.
- Acciones inmediatas de 60s: Respiración 4-7-8 guiada, hidratación consciente, estiramiento postural y descanso ocular 20-20-20.
- Pacto de honor: Contrato personal firmado con certificado exportable.`;

  const handleDownloadMd = () => {
    const blob = new Blob([manualMarkdownContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'MANUAL_DE_USO_EQUILIBRIA.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyMd = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(manualMarkdownContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      {/* Top Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
            <BookOpen className="w-4 h-4" />
            <span>{isEn ? 'Documentation & User Guide' : 'Documentación y Manual de Usuario'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {isEn ? 'Equilibria Official User Manual' : 'Manual de Uso de Equilibria'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
            {isEn
              ? 'Complete guide to the 4 pillars assessment, instant 60-second actions, gamified quests, and habit commitment contracts.'
              : 'Guía paso a paso para medir tus 4 pilares, activar micro-acciones de 60 segundos, sumar XP en retos diarios y sellar tu pacto de hábitos.'}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={handleDownloadMd}
            className="px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white font-medium text-xs sm:text-sm flex items-center gap-1.5 shadow-xs transition-all"
            title={isEn ? 'Download MANUAL_DE_USO.md file' : 'Descargar archivo MANUAL_DE_USO.md'}
          >
            <Download className="w-4 h-4" />
            <span>{isEn ? 'Download .md' : 'Descargar .md'}</span>
          </button>

          <button
            onClick={handleCopyMd}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-colors"
            title={isEn ? 'Copy markdown content' : 'Copiar texto en formato Markdown'}
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? (isEn ? 'Copied!' : '¡Copiado!') : isEn ? 'Copy Markdown' : 'Copiar Texto'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Quick Jump Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl overflow-x-auto text-xs font-medium scrollbar-none">
        <button
          onClick={() => setActiveSection('intro')}
          className={`px-3 py-2 rounded-xl whitespace-nowrap shrink-0 transition-all ${
            activeSection === 'intro'
              ? 'bg-white dark:bg-slate-900 text-teal-800 dark:text-teal-200 shadow-xs font-bold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          {isEn ? '1. Purpose & Pillars' : '1. Propósito y Pilares'}
        </button>

        <button
          onClick={() => setActiveSection('eval')}
          className={`px-3 py-2 rounded-xl whitespace-nowrap shrink-0 transition-all ${
            activeSection === 'eval'
              ? 'bg-white dark:bg-slate-900 text-teal-800 dark:text-teal-200 shadow-xs font-bold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          {isEn ? '2. Test & Shortcuts' : '2. Test y Atajos'}
        </button>

        <button
          onClick={() => setActiveSection('radar')}
          className={`px-3 py-2 rounded-xl whitespace-nowrap shrink-0 transition-all ${
            activeSection === 'radar'
              ? 'bg-white dark:bg-slate-900 text-teal-800 dark:text-teal-200 shadow-xs font-bold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          {isEn ? '3. Radar & Results' : '3. Radar y Resultados'}
        </button>

        <button
          onClick={() => setActiveSection('quests')}
          className={`px-3 py-2 rounded-xl whitespace-nowrap shrink-0 transition-all ${
            activeSection === 'quests'
              ? 'bg-white dark:bg-slate-900 text-teal-800 dark:text-teal-200 shadow-xs font-bold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          {isEn ? '4. Quests & Levels' : '4. Retos y Niveles'}
        </button>

        <button
          onClick={() => setActiveSection('immediate')}
          className={`px-3 py-2 rounded-xl whitespace-nowrap shrink-0 transition-all ${
            activeSection === 'immediate'
              ? 'bg-white dark:bg-slate-900 text-teal-800 dark:text-teal-200 shadow-xs font-bold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          {isEn ? '5. 60s Micro-Actions' : '5. Acciones 60s'}
        </button>

        <button
          onClick={() => setActiveSection('pact')}
          className={`px-3 py-2 rounded-xl whitespace-nowrap shrink-0 transition-all ${
            activeSection === 'pact'
              ? 'bg-white dark:bg-slate-900 text-teal-800 dark:text-teal-200 shadow-xs font-bold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          {isEn ? '6. Habit Contract' : '6. Pacto Personal'}
        </button>

        <button
          onClick={() => setActiveSection('shortcuts')}
          className={`px-3 py-2 rounded-xl whitespace-nowrap shrink-0 transition-all ${
            activeSection === 'shortcuts'
              ? 'bg-white dark:bg-slate-900 text-teal-800 dark:text-teal-200 shadow-xs font-bold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          {isEn ? '7. Summary Table' : '7. Tabla Resumen'}
        </button>
      </div>

      {/* Content Cards */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm transition-colors space-y-8">
        {/* Section 1: Introduction */}
        {activeSection === 'intro' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider">
                {isEn ? 'Section 1' : 'Sección 1'}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {isEn ? 'Foundations & The 4 Vital Pillars' : 'Fundamentos y los 4 Pilares Vitales'}
              </h2>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {isEn
                ? 'Equilibria evaluates health not as isolated numbers, but as an interconnected ecosystem. A deficiency in sleep sabotages nutrition, chronic anxiety drains energy for movement, and lack of exercise degrades mental calmness.'
                : 'Equilibria aborda la salud no como cifras aisladas, sino como un ecosistema interconectado. Un déficit de sueño deteriora las elecciones nutricionales; la ansiedad sostenida drena la energía para ejercitarse; y la falta de movimiento desestabiliza el descanso nocturno.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 space-y-1.5">
                <h3 className="font-bold text-sm text-indigo-950 dark:text-indigo-200">
                  {isEn ? '1. Restful Sleep' : '1. Sueño Reparador'}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isEn
                    ? 'Target: 7 to 8 hours of continuous rest. Restores cognitive clarity, regulates mood neurotransmitters, and prevents chronic fatigue.'
                    : 'Meta: 7 a 8 horas de descanso continuo. Regenera la memoria, equilibra los neurotransmisores del ánimo y previene el agotamiento crónico.'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-1.5">
                <h3 className="font-bold text-sm text-emerald-950 dark:text-emerald-200">
                  {isEn ? '2. Mindful Nutrition' : '2. Alimentación Consciente'}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isEn
                    ? 'Target: Real whole foods, clean protein, 50% vegetables per meal, and 2+ liters of daily hydration.'
                    : 'Meta: Alimentos frescos, proteínas limpias, mitad del plato verde en almuerzos/cenas e hidratación abundante sin azúcares líquidos.'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/60 space-y-1.5">
                <h3 className="font-bold text-sm text-teal-950 dark:text-teal-200">
                  {isEn ? '3. Mental Health & Calm' : '3. Salud Mental y Sosiego'}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isEn
                    ? 'Target: Mindful pauses, screen disengagement, reading, music, and high-quality human relationships.'
                    : 'Meta: Pausas de respiración, límites a la sobrecarga digital, lectura, música serena y vínculos afectivos enriquecedores.'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-1.5">
                <h3 className="font-bold text-sm text-amber-950 dark:text-amber-200">
                  {isEn ? '4. Exercise & Movement' : '4. Ejercicio y Movimiento'}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isEn
                    ? 'Target: 30+ daily minutes of enjoyable movement (walking, sports, dancing, strength training).'
                    : 'Meta: 30+ minutos diarios de movimiento disfrutable (caminatas vivas, deportes, baile o fuerza muscular).'}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                <span className="font-bold block text-slate-900 dark:text-white">
                  {isEn ? '100% Private Local Storage' : 'Privacidad Absoluta Local'}
                </span>
                <p>
                  {isEn
                    ? 'Your answers, streak, and notes are never sent to third-party databases. Everything stays on this browser.'
                    : 'Tus evaluaciones, racha y compromisos se guardan exclusivamente en tu navegador (localStorage). No hay servidores externos recopilando tus datos.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Section 2: Test & Shortcuts */}
        {activeSection === 'eval' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider">
                {isEn ? 'Section 2' : 'Sección 2'}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {isEn ? 'Taking the Test & Keyboard Acceleration' : 'Cómo Realizar el Test y Atajos de Teclado'}
              </h2>
            </div>

            <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
              <p>
                {isEn
                  ? 'The assessment consists of 16 research-grounded questions. Each question measures your frequency and quality of habits over the past 30 days.'
                  : 'La prueba consta de 16 preguntas estructuradas (4 por pilar). Cada opción evalúa tus hábitos de los últimos 30 días en una escala ponderada del 1 al 4.'}
              </p>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                  {isEn ? 'Keyboard Shortcuts Reference' : 'Atajos Rápidos de Teclado'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <span className="font-mono font-bold text-teal-700 dark:text-teal-400 block text-base">1, 2, 3, 4</span>
                    <span className="text-slate-500 mt-1 block">
                      {isEn ? 'Select corresponding option' : 'Selecciona la opción respectiva'}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <span className="font-mono font-bold text-teal-700 dark:text-teal-400 block text-base">Enter ↵</span>
                    <span className="text-slate-500 mt-1 block">
                      {isEn ? 'Advance to next question' : 'Avanza a la siguiente pregunta'}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <span className="font-mono font-bold text-teal-700 dark:text-teal-400 block text-base">← Flecha</span>
                    <span className="text-slate-500 mt-1 block">
                      {isEn ? 'Go back to previous question' : 'Regresa a la pregunta anterior'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-teal-900 dark:text-teal-200 block">
                    {isEn ? 'Ready to evaluate yourself?' : '¿Listo para realizar tu evaluación?'}
                  </span>
                  <span className="text-[11px] text-teal-800/80 dark:text-teal-300">
                    {isEn ? 'Takes only 3 to 4 minutes.' : 'Toma únicamente entre 3 y 4 minutos.'}
                  </span>
                </div>
                <button
                  onClick={onStartTest}
                  className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-medium text-xs flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isEn ? 'Start Test' : 'Iniciar Test'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Section 3: Radar & Results */}
        {activeSection === 'radar' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider">
                {isEn ? 'Section 3' : 'Sección 3'}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {isEn ? 'Interpreting Radar Charts & Archetypes' : 'Cómo Interpretar el Radar y tu Arquetipo'}
              </h2>
            </div>

            <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
              <p>
                {isEn
                  ? 'The Radial Vital Symmetry Chart compares your polygon against an optimal 80% circle benchmark. Symmetry is as vital as total score: having 95% in exercise but 20% in sleep produces systemic fatigue.'
                  : 'El Gráfico Radial de Simetría Vital compara tu figura frente a la circunferencia de referencia saludable del 80%. La simetría es tan importante como el puntaje total: tener 95% en ejercicio con un 25% en descanso nocturno genera fatiga compensatoria crónica.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                    {isEn ? 'Score Ranges' : 'Escala de Puntuaciones'}
                  </h3>
                  <ul className="text-xs space-y-1.5 text-slate-600 dark:text-slate-300">
                    <li><strong className="text-emerald-600">85% - 100%:</strong> {isEn ? 'Optimal & Thriving' : 'Rango Óptimo y Ejemplar'}</li>
                    <li><strong className="text-teal-600">70% - 84%:</strong> {isEn ? 'Healthy & Balanced' : 'Saludable y Equilibrado'}</li>
                    <li><strong className="text-amber-600">50% - 69%:</strong> {isEn ? 'Developing traction' : 'En Desarrollo y Mejora'}</li>
                    <li><strong className="text-rose-600">&lt; 50%:</strong> {isEn ? 'Immediate Priority Area' : 'Atención Prioritaria Inmediata'}</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                    {isEn ? 'Archetype & Reports' : 'Arquetipo y Descargas'}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {isEn
                      ? 'The system classifies your balance into 1 of 6 psychological archetypes. You can download a high-resolution PDF report or print directly via clean browser media styles.'
                      : 'El sistema sintetiza tus resultados en uno de seis arquetipos de bienestar. Puedes descargar tu diagnóstico en formato PDF maquetado o imprimirlo con estilos limpios de documento.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 4: Quests & Levels */}
        {activeSection === 'quests' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider">
                {isEn ? 'Section 4' : 'Sección 4'}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {isEn ? 'Gamified Action Hub & Daily Quests' : 'Centro de Retos y Sistema de Niveles'}
              </h2>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {isEn
                ? 'Passive advice is useless without execution. The Action Hub converts clinical advice into tangible daily quests with XP rewards and consecutive day streaks.'
                : 'El conocimiento sin acción no transforma la vida. La pestaña "Retos & Misiones" convierte el diagnóstico en misiones concretas con recompensas de puntos de experiencia (XP) y racha de constancia diaria.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-500">
                  <Flame className="w-4 h-4 fill-current" />
                  <span>{isEn ? 'Daily Streak (🔥)' : 'Racha Activa (🔥)'}</span>
                </div>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  {isEn
                    ? 'Increments each consecutive day you check in or complete a quest.'
                    : 'Aumenta con cada día consecutivo que registras o completas una misión.'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-teal-600">
                  <Zap className="w-4 h-4 fill-current" />
                  <span>{isEn ? 'XP & Mastery Tiers' : 'Puntos XP y Rangos'}</span>
                </div>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  {isEn
                    ? 'Earn XP to level up from Novice to Vital Master and Longevity Titan.'
                    : 'Suma XP para subir de rango desde Iniciado hasta Titán de la Longevidad.'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-indigo-600">
                  <Award className="w-4 h-4" />
                  <span>{isEn ? '8 Badges to Unlock' : '8 Medallas Reales'}</span>
                </div>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  {isEn
                    ? 'Unlock trophies by achieving 80%+ scores, streaks, and pledges.'
                    : 'Desbloquea medallas al alcanzar más del 80%, sostener 3 días de racha o firmar tu pacto.'}
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={onGoToQuests}
                className="px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-medium text-xs flex items-center gap-1.5 shadow-xs transition-all"
              >
                <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>{isEn ? 'Open Quests Hub' : 'Abrir Centro de Retos'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Section 5: Immediate 60s Actions */}
        {activeSection === 'immediate' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider">
                {isEn ? 'Section 5' : 'Sección 5'}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {isEn ? '60-Second Micro-Actions (Zero Inertia)' : 'Micro-Acciones de 60 Segundos (Cero Inercia)'}
              </h2>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {isEn
                ? 'Whenever you feel stuck, tired, or anxious, open the instant actions modal to reset your physiology immediately:'
                : 'Cuando sientas fatiga, desconcentración o tensión en el cuello, activa una micro-acción en pantalla para reiniciar tu fisiología en menos de un minuto:'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/60 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white block">
                  {isEn ? '🌬️ 4-7-8 Breathing Reset' : '🌬️ Respiración Consciente 4-7-8'}
                </span>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isEn
                    ? 'Inhale 4s through nose, hold 7s, exhale 8s through mouth. Stimulates the vagus nerve and drops cortisol.'
                    : 'Inhala 4s por la nariz, sostén 7s y exhala 8s suavemente por la boca. Estimula el nervio vago y reduce el pulso acelerado.'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white block">
                  {isEn ? '💧 Mindful Hydration Glass' : '💧 1 Vaso de Agua Ahora'}
                </span>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isEn
                    ? 'Stand up, pour 350-500ml water, and drink it calmly. Restores oxygenation and halts brain fog.'
                    : 'Levántate, sírvete 350-500 ml de agua fresca y bébelo despacio. Reactiva el riego sanguíneo cerebral y disipa la pesadez.'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white block">
                  {isEn ? '🤸 60s Posture & Spine Reset' : '🤸 Reset Postural de Silla 60s'}
                </span>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isEn
                    ? 'Guided stretch for neck, chest opening, and spinal twist with interactive countdown timer.'
                    : 'Secuencia interactiva de 3 estiramientos guiados con cronómetro para liberar trapecios, abrir el pecho y elongar la espalda.'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white block">
                  {isEn ? '👁️ 20-20-20 Eye Fatigue Detox' : '👁️ Regla 20-20-20 Ocular'}
                </span>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isEn
                    ? 'Look at an object 6 meters (20 feet) away for 20 seconds to relax ciliary eye muscles.'
                    : 'Aparta la vista de pantallas y enfoca un punto a 6 metros durante 20 segundos para distender los músculos ciliares de los ojos.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Section 6: Habit Contract */}
        {activeSection === 'pact' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider">
                {isEn ? 'Section 6' : 'Sección 6'}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {isEn ? 'The Personal Habit Commitment Contract' : 'El Pacto de Honor y Contrato Personal'}
              </h2>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {isEn
                ? 'Behavioral economists and psychologists confirm that signing an explicit pledge significantly enhances adherence. In Equilibria, you select your non-negotiable promises, sign digitally, and earn +75 XP plus an official pledge certificate.'
                : 'La economía conductual demuestra que firmar un compromiso explícito multiplica la tasa de permanencia y cumplimiento. En Equilibria, seleccionas tus promesas irrenunciables, ingresas tu firma y generas un Certificado Oficial de Compromiso Activo con sello digital.'}
            </p>

            <div className="p-5 rounded-2xl bg-gradient-to-r from-teal-50/70 via-emerald-50/50 to-slate-50 dark:from-teal-950/30 dark:via-emerald-950/20 dark:to-slate-900 border border-teal-200 dark:border-teal-800/60 text-xs space-y-2">
              <span className="font-bold text-teal-900 dark:text-teal-200 block text-sm">
                {isEn ? 'Steps to Sign Your Pact:' : 'Pasos para Firmar tu Pacto:'}
              </span>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-700 dark:text-slate-300">
                <li>{isEn ? 'Go to the "Quests & Actions" tab.' : 'Dirígete a la pestaña "Retos & Misiones".'}</li>
                <li>{isEn ? 'Scroll to "My Personal Healthy Habits Contract".' : 'Baja hasta la sección "Mi Pacto de Honor de Buenos Hábitos".'}</li>
                <li>{isEn ? 'Select 2 to 3 essential habit pledges.' : 'Selecciona de 2 a 3 compromisos prioritarios.'}</li>
                <li>{isEn ? 'Enter your name or alias and click "Sign Personal Contract".' : 'Escribe tu nombre o alias y pulsa "Firmar Mi Pacto de Honor (+75 XP)".'}</li>
                <li>{isEn ? 'Copy or download your signed certificate.' : 'Copia o comparte tu certificado de honor en vigor.'}</li>
              </ol>
            </div>
          </div>
        )}

        {/* Section 7: Summary Table */}
        {activeSection === 'shortcuts' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider">
                {isEn ? 'Section 7' : 'Sección 7'}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {isEn ? 'Quick Operational Reference Table' : 'Tabla Resumen Operativa'}
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                    <th className="py-2.5 px-3 font-semibold">{isEn ? 'Feature / Goal' : 'Función / Objetivo'}</th>
                    <th className="py-2.5 px-3 font-semibold">{isEn ? 'Location' : 'Ubicación'}</th>
                    <th className="py-2.5 px-3 font-semibold">{isEn ? 'Benefit' : 'Beneficio'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  <tr>
                    <td className="py-2.5 px-3 font-medium">{isEn ? 'Diagnostic Assessment' : 'Evaluación Inicial'}</td>
                    <td className="py-2.5 px-3">{isEn ? 'Tab "Habits Test"' : 'Pestaña "Test de Hábitos"'}</td>
                    <td className="py-2.5 px-3">{isEn ? 'Pillar radar & symmetry diagnosis' : 'Radar de simetría y diagnóstico 0-100%'}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-medium">{isEn ? 'Instant 60s Micro-Action' : 'Micro-Acción 60s'}</td>
                    <td className="py-2.5 px-3">{isEn ? 'Header streak button / Hero button' : 'Botón "Acción Inmediata 60s"'}</td>
                    <td className="py-2.5 px-3">{isEn ? 'Instant physiological reset & +XP' : 'Reset fisiológico inmediato y +30 XP'}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-medium">{isEn ? 'Daily Habit Quests' : 'Retos Diarios de Hábitos'}</td>
                    <td className="py-2.5 px-3">{isEn ? 'Tab "Quests & Actions"' : 'Pestaña "Retos & Misiones"'}</td>
                    <td className="py-2.5 px-3">{isEn ? 'Streaks, level progression, badges' : 'Racha de días, subida de nivel, medallas'}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-medium">{isEn ? 'Commitment Contract' : 'Pacto de Honor'}</td>
                    <td className="py-2.5 px-3">{isEn ? 'Bottom of Quests tab' : 'Centro de Retos'}</td>
                    <td className="py-2.5 px-3">{isEn ? 'Psychological accountability certificate' : 'Certificado oficial de constancia (+75 XP)'}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-medium">{isEn ? 'PDF Report' : 'Reporte en PDF'}</td>
                    <td className="py-2.5 px-3">{isEn ? 'Results overview page' : 'Pestaña "Resultados"'}</td>
                    <td className="py-2.5 px-3">{isEn ? 'High-resolution printable document' : 'Documento imprimible con gráficos'}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-medium">{isEn ? 'JSON Backup' : 'Copia de Seguridad'}</td>
                    <td className="py-2.5 px-3">{isEn ? 'Tab "History"' : 'Pestaña "Historial"'}</td>
                    <td className="py-2.5 px-3">{isEn ? 'Full privacy local JSON backup' : 'Exportación y respaldo local'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
