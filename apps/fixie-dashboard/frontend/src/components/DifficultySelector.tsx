import React from 'react';
import type { RideDifficulty } from '../../types';
import { useTranslation } from '../../context/LanguageContext';

interface DifficultySelectorProps {
  selectedDifficulty: RideDifficulty;
  onDifficultyChange: (difficulty: RideDifficulty) => void;
  isDisabled: boolean;
}

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  selectedDifficulty,
  onDifficultyChange,
  isDisabled,
}) => {
  const { t } = useTranslation();
  
  const difficulties: RideDifficulty[] = ['Easy', 'Medium', 'Hard'];
  const difficultyStyles: Record<RideDifficulty, string> = {
    Easy: 'bg-green-500/20 text-green-400 border-green-500/50',
    Medium: 'bg-amber-500/20 text-amber-400 border-amber-500/50',
    Hard: 'bg-red-500/20 text-red-400 border-red-500/50',
  };
  const activeStyles = 'ring-2 ring-brand-cyan scale-105';

  return (
    <div className="bg-brand-surface rounded-xl border border-gray-700/50 shadow-lg p-6">
      <h3 className="text-lg font-bold mb-4">{t('dashboard.difficulty.title')}</h3>
      <div className="grid grid-cols-3 gap-4">
        {difficulties.map(diff => (
          <button
            key={diff}
            onClick={() => onDifficultyChange(diff)}
            disabled={isDisabled}
            className={`p-3 rounded-lg border text-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${difficultyStyles[diff]} ${selectedDifficulty === diff ? activeStyles : 'hover:bg-white/5'}`}
          >
            <span className="font-bold text-base sm:text-lg">
              {t(`dashboard.difficulty.${diff.toLowerCase()}`)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};