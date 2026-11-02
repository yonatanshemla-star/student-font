import React, { useState } from 'react';
import type { CharacterDef, CharacterData } from '../types';
import { HEBREW_CHARACTERS, CATEGORIES } from '../utils/characterSet';
import { Check } from 'lucide-react';

interface CharacterGridProps {
  selectedCharId: string;
  onSelectChar: (char: CharacterDef) => void;
  characters: Record<string, CharacterData>;
}

export const CharacterGrid: React.FC<CharacterGridProps> = ({
  selectedCharId,
  onSelectChar,
  characters,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filtered = HEBREW_CHARACTERS.filter(
    c => activeCategory === 'all' || c.category === activeCategory
  );

  const completedCount = HEBREW_CHARACTERS.filter(
    c => characters[c.id]?.strokes?.length > 0
  ).length;

  const totalCount = HEBREW_CHARACTERS.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 backdrop-blur-md shadow-xl">
      {/* Header & Progress */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-base font-bold text-white">רשימת האותיות והתווים</h3>
          <p className="text-xs text-slate-400">בחר תו כדי לערוך את כתב היד שלו</p>
        </div>
        <div className="text-left">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-300">
              {completedCount} / {totalCount}
            </span>
            <span className="text-xs font-bold text-indigo-400">({progressPercent}%)</span>
          </div>
          <div className="w-28 h-2 bg-slate-700 rounded-full overflow-hidden mt-1">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1 text-xs font-medium rounded-xl whitespace-nowrap transition ${
              activeCategory === cat.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-700/60 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Character Grid */}
      <div className="grid grid-cols-6 sm:grid-cols-7 md:grid-cols-9 gap-2 max-h-[300px] overflow-y-auto pr-1">
        {filtered.map(charDef => {
          const isSelected = charDef.id === selectedCharId;
          const isDrawn = characters[charDef.id]?.strokes?.length > 0;

          return (
            <button
              key={charDef.id}
              onClick={() => onSelectChar(charDef)}
              className={`relative flex flex-col items-center justify-center p-2 rounded-xl transition border text-center aspect-square ${
                isSelected
                  ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-lg shadow-indigo-600/20 ring-2 ring-indigo-500/50'
                  : isDrawn
                  ? 'bg-slate-700/40 border-emerald-600/40 text-slate-100 hover:bg-slate-700/70'
                  : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
              }`}
            >
              <span className="text-xl font-bold leading-none">{charDef.char}</span>
              <span className="text-[10px] text-slate-400 mt-1 truncate max-w-full font-normal">
                {charDef.name}
              </span>

              {isDrawn && (
                <span className="absolute top-1 left-1 w-3.5 h-3.5 bg-emerald-500 rounded-full flex items-center justify-center text-[9px] text-slate-950 font-bold">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
