import React from 'react';
import { CheckSquare, Flame, BarChart2, GitCompare, History, BookOpen } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface MobileBottomNavProps {
  currentTab: 'quiz' | 'quests' | 'results' | 'compare' | 'history' | 'guide' | 'manual';
  onSelectTab: (tab: 'quiz' | 'quests' | 'results' | 'compare' | 'history' | 'guide' | 'manual') => void;
  hasResults: boolean;
  historyCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onSelectTab,
  hasResults,
  historyCount,
}) => {
  const { t, language } = useLanguage();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="grid grid-cols-5 items-center h-16 max-w-md mx-auto px-1">
        <button
          onClick={() => onSelectTab('quiz')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
            currentTab === 'quiz'
              ? 'text-teal-700 dark:text-teal-300 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <CheckSquare className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">{language === 'en' ? 'Quiz' : 'Test'}</span>
        </button>

        <button
          onClick={() => onSelectTab('quests')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
            currentTab === 'quests'
              ? 'text-teal-700 dark:text-teal-300 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
          <span className="text-[10px] tracking-tight mt-1">{language === 'en' ? 'Quests' : 'Retos'}</span>
        </button>

        <button
          onClick={() => onSelectTab(hasResults ? 'results' : 'quiz')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
            currentTab === 'results'
              ? 'text-teal-700 dark:text-teal-300 font-semibold'
              : hasResults
              ? 'text-slate-500 dark:text-slate-400'
              : 'text-slate-300 dark:text-slate-600'
          }`}
        >
          <BarChart2 className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">{language === 'en' ? 'Results' : 'Resultados'}</span>
        </button>

        <button
          onClick={() => onSelectTab('compare')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
            currentTab === 'compare'
              ? 'text-teal-700 dark:text-teal-300 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <GitCompare className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">{language === 'en' ? 'Compare' : 'Comparar'}</span>
        </button>

        <button
          onClick={() => onSelectTab('history')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] relative transition-colors ${
            currentTab === 'history'
              ? 'text-teal-700 dark:text-teal-300 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <History className="w-5 h-5" />
            {historyCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-teal-600 text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                {historyCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-1">{language === 'en' ? 'History' : 'Historial'}</span>
        </button>
      </div>
    </nav>
  );
};
