import React, { useState } from 'react';
import type { CharacterDef, CharacterData } from '../types';
import { Check, Settings2 } from 'lucide-react';

interface CharacterGridProps {
  selectedCharId: string;
  onSelectChar: (char: CharacterDef) => void;
  characters: Record<string, CharacterData>;
  activeCharacters: CharacterDef[];
  onOpenPackageModal: () => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  all: 'הכל',
  hebrew: 'עברית א-ת',
  final: 'סופיות',
  number: 'ספרות',
  punct: 'פיסוק וסוגריים',
  math: 'מתמטיקה',
  greek: 'יוונית',
  english: 'אנגלית',
};

export const CharacterGrid: React.FC<CharacterGridProps> = ({
  selectedCharId,
  onSelectChar,
  characters,
  activeCharacters,
  onOpenPackageModal,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Available categories present in activeCharacters
  const availableCategories = ['all', ...Array.from(new Set(activeCharacters.map(c => c.category)))];

  const filtered = activeCharacters.filter(
    c => activeCategory === 'all' || c.category === activeCategory
  );

  const getVariationCount = (id: string): number => {
    const data = characters[id];
    if (!data) return 0;
    if (data.variations && data.variations.length > 0) {
      return data.variations.filter(v => v && v.length > 0).length;
    }
    return data.strokes && data.strokes.length > 0 ? 1 : 0;
  };

  const completedCount = activeCharacters.filter(
    c => getVariationCount(c.id) > 0
  ).length;

  const totalCount = activeCharacters.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 backdrop-blur-md shadow-xl">
      {/* Header & Progress */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white">רשימת האותיות והתווים</h3>
            <button
              onClick={onOpenPackageModal}
              className="flex items-center gap-1 text-[11px] font-semibold text-indigo-300 bg-indigo-950/70 hover:bg-indigo-900 border border-indigo-700/50 px-2 py-0.5 rounded-lg transition"
              title="הוסף או הסר חבילות של מתמטיקה, יוונית ואנגלית"
            >
              <Settings2 className="w-3 h-3" />
              <span>חבילות</span>
            </button>
          </div>
          <p className="text-xs text-slate-400">בחר תו לעריכת 3–5 וריאציות כתב-יד</p>
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
        {availableCategories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1 text-xs font-medium rounded-xl whitespace-nowrap transition ${
              activeCategory === cat
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-700/60 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {CATEGORY_LABELS[cat] || cat}
          </button>
        ))}
      </div>

      {/* Character Grid */}
      <div className="grid grid-cols-6 sm:grid-cols-7 md:grid-cols-9 gap-2 max-h-[320px] overflow-y-auto pr-1">
        {filtered.map(charDef => {
          const isSelected = charDef.id === selectedCharId;
          const vCount = getVariationCount(charDef.id);
          const isDrawn = vCount > 0;

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
                <span
                  className={`absolute top-1 left-1 px-1 min-w-[15px] h-[15px] rounded-full flex items-center justify-center text-[9px] font-black ${
                    vCount >= 3
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-amber-500 text-slate-950'
                  }`}
                  title={`${vCount} וריאציות צוירו לאות זו`}
                >
                  {vCount > 1 ? vCount : <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
