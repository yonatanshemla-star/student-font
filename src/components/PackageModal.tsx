import React from 'react';
import { X, Check, Layers, Sparkles } from 'lucide-react';
import { CHARACTER_PACKAGES } from '../utils/characterSet';

interface PackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  enabledPackages: string[];
  onTogglePackage: (pkgId: string) => void;
  totalActiveCharacters: number;
}

export const PackageModal: React.FC<PackageModalProps> = ({
  isOpen,
  onClose,
  enabledPackages,
  onTogglePackage,
  totalActiveCharacters,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-lg p-6 shadow-2xl relative text-right">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <Layers className="w-5 h-5 text-indigo-400" />
          <h3 className="text-xl font-bold text-white">בחירת חבילות תווים לפונט</h3>
        </div>
        <p className="text-xs text-slate-400 mb-5">
          בחר אילו סטים של תווים תרצה שיופיעו בפונט שלך. סטודנטים למדעים/הנדסה יכולים להפעיל מתמטיקה ויוונית, וסטודנטים אחרים יכולים להישאר עם עברית בלבד!
        </p>

        {/* Total Badge */}
        <div className="bg-indigo-950/60 border border-indigo-700/40 rounded-2xl p-3 mb-4 flex items-center justify-between">
          <span className="text-xs text-slate-300">סך הכל תווים שיופיעו באפליקציה:</span>
          <span className="text-sm font-black text-indigo-300 bg-indigo-900/80 px-3 py-0.5 rounded-full border border-indigo-600/40">
            {totalActiveCharacters} תווים
          </span>
        </div>

        {/* Packages List */}
        <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
          {CHARACTER_PACKAGES.map(pkg => {
            const isEnabled = enabledPackages.includes(pkg.id);

            return (
              <div
                key={pkg.id}
                onClick={() => !pkg.isLocked && onTogglePackage(pkg.id)}
                className={`p-3.5 rounded-2xl border transition flex items-center justify-between cursor-pointer ${
                  isEnabled
                    ? 'bg-slate-800/90 border-indigo-500/70 shadow-md shadow-indigo-950/30'
                    : 'bg-slate-800/40 border-slate-700/60 opacity-60 hover:opacity-100 hover:bg-slate-800/60'
                } ${pkg.isLocked ? 'cursor-default' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                      isEnabled
                        ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/50'
                        : 'bg-slate-700/50 text-slate-400 border border-slate-600/40'
                    }`}
                  >
                    {pkg.icon}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{pkg.title}</h4>
                      <span className="text-[10px] text-slate-400 font-medium">({pkg.count} תווים)</span>
                      {pkg.isLocked && (
                        <span className="text-[9px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded font-bold">
                          בסיס חובה
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{pkg.description}</p>
                  </div>
                </div>

                {/* Toggle Checkbox */}
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center border transition ${
                    isEnabled
                      ? 'bg-indigo-600 border-indigo-400 text-white'
                      : 'border-slate-600 bg-slate-700/40 text-transparent'
                  }`}
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            ניתן לשנות בכל שלב בלי לאבד אותיות שכבר ציירת
          </span>

          <button
            onClick={onClose}
            className="py-2 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition"
          >
            אישור וסגירה
          </button>
        </div>
      </div>
    </div>
  );
};
