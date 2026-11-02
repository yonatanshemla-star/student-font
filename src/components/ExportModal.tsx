import React, { useState } from 'react';
import { X, Download, Upload, Sparkles } from 'lucide-react';
import type { CharacterData } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  fontBlobUrl: string | null;
  fontName: string;
  onFontNameChange: (name: string) => void;
  characters: Record<string, CharacterData>;
  onImportCharacters: (data: Record<string, CharacterData>) => void;
  onGenerateFont: () => void;
  strokeWidth: number;
  onStrokeWidthChange: (w: number) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  fontBlobUrl,
  fontName,
  onFontNameChange,
  characters,
  onImportCharacters,
  onGenerateFont,
  strokeWidth,
  onStrokeWidthChange,
}) => {
  if (!isOpen) return null;

  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(characters, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${fontName || 'my_handwriting'}_backup.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (typeof parsed === 'object') {
          onImportCharacters(parsed);
          setImportStatus('הנתונים יובאו בהצלחה!');
          setTimeout(() => setImportStatus(null), 3000);
        }
      } catch (err) {
        setImportStatus('שגיאה: קובץ JSON לא תקין');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-lg p-6 shadow-2xl relative text-right">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-white mb-1">הורדת הפונט ושמירת פרויקט</h3>
        <p className="text-xs text-slate-400 mb-6">
          הפק קובץ TTF לשימוש במחשב (Word, Photoshop, וכו') או גבה את האותיות שלך
        </p>

        {/* Font Details */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">שם הפונט:</label>
            <input
              type="text"
              value={fontName}
              onChange={e => onFontNameChange(e.target.value)}
              placeholder="למשל: MyHandwriting"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1">
              <span>עובי הקו בפונט ({strokeWidth}px)</span>
              <span className="text-slate-400 text-[11px]">קובע כמה עבה יהיה כתב היד שלך</span>
            </div>
            <input
              type="range"
              min={4}
              max={16}
              value={strokeWidth}
              onChange={e => onStrokeWidthChange(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
          </div>
        </div>

        {/* Action 1: Download TTF */}
        <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-700/40 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-sm font-bold text-white">קובץ פונט מלא (.TTF)</h4>
              <p className="text-xs text-indigo-300">תואם ל-Windows, Mac, Word וכל תוכנה</p>
            </div>
            <Sparkles className="w-5 h-5 text-indigo-400" />
          </div>

          {fontBlobUrl ? (
            <a
              href={fontBlobUrl}
              download={`${fontName || 'MyHandwriting'}.ttf`}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              הורד קובץ {fontName || 'MyHandwriting'}.ttf
            </a>
          ) : (
            <button
              onClick={onGenerateFont}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-sm transition flex items-center justify-center gap-2"
            >
              הפק פונט עכשיו
            </button>
          )}
        </div>

        {/* Action 2: Backup / Restore JSON */}
        <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700">
          <h4 className="text-xs font-bold text-slate-300 mb-2">גיבוי וטעינת אותיות (JSON)</h4>
          <p className="text-[11px] text-slate-400 mb-3">
            שמור קובץ גיבוי של כל האותיות שציירת כדי שתוכל להמשיך לערוך אותן בכל מחשב או דפדפן
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJson}
              className="flex-1 py-2 px-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold transition flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              שמור קובץ גיבוי
            </button>

            <label className="flex-1 py-2 px-3 rounded-xl bg-slate-700/70 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              טען מגיבוי
              <input
                type="file"
                accept=".json"
                onChange={handleImportJson}
                className="hidden"
              />
            </label>
          </div>

          {importStatus && (
            <p className="text-xs font-semibold text-emerald-400 mt-2 text-center">{importStatus}</p>
          )}
        </div>
      </div>
    </div>
  );
};
