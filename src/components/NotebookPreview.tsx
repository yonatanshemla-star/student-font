import React, { useState } from 'react';
import { BookOpen, Sliders, Sparkles, Printer, CheckCircle2, FileText } from 'lucide-react';

interface NotebookPreviewProps {
  fontLoaded: boolean;
  fontFamily: string;
  onGenerateFont: () => void;
  drawnCharsCount: number;
}

export const NotebookPreview: React.FC<NotebookPreviewProps> = ({
  fontLoaded,
  fontFamily,
  onGenerateFont,
  drawnCharsCount,
}) => {
  const [paperStyle, setPaperStyle] = useState<'lined' | 'grid' | 'blank'>('lined');
  const [inkColor, setInkColor] = useState<string>('#1d4ed8'); // Classic blue pen
  const [fontSize, setFontSize] = useState<number>(24);
  const [lineHeight, setLineHeight] = useState<number>(36);
  const [letterSpacing, setLetterSpacing] = useState<number>(1);
  const [humanJitter, setHumanJitter] = useState<boolean>(true);
  const [copied, setCopied] = useState(false);

  const [text, setText] = useState<string>(
`מטלה 1 - הגשה שבועית
שם הסטודנט: יונתן
תאריך: 2 בנובמבר 2026

שאלה 1:
הסבירו בקצרה את עיקרון הפעולה של אלגוריתם חיפוש בינארי.

תשובה:
חיפוש בינארי הוא אלגוריתם יעיל למציאת איבר במערך ממוין.
בכל שלב באלגוריתם, אנו משווים את האיבר המבוקש לאיבר האמצעי:
1. אם האיבר שווה לאמצעי - מצאנו את האיבר והחיפוש מסתיים בהצלחה.
2. אם האיבר קטן מהאמצעי - ממשיכים לחפש רק בחצי השמאלי של המערך.
3. אם האיבר גדול מהאמצעי - ממשיכים לחפש רק בחצי הימני.

סיבוכיות זמן הריצה במקרה הגרוע היא O(log n).`
  );

  const sampleTexts = [
    {
      title: 'מטלה אקדמית (מדעי המחשב)',
      content: `מטלה 1 - מבני נתונים
שאלה 1: נתון עץ חיפוש בינארי מאוזן (AVL).
הוכיחו כי גובה העץ עבור n צמתים אינו עולה על 1.44 log n.
פתרון:
לפי הגדרת עץ AVL, לכל צומת בעץ, ההפרש בין גובה תת-העץ השמאלי לגובה תת-העץ הימני הוא לכל היותר 1.
נסמן ב-N(h) את מספר הצמתים המינימלי בעץ AVL שגובהו h.
מתקיים: N(h) = 1 + N(h-1) + N(h-2).
מפתרון נוסחת הנסיגה מקבלים חסם מעריכי תואם מספרי פיבונאצ'י, ומשם הגובה נחסם לוגריתמית.`,
    },
    {
      title: 'סיכום הרצאה (כלכלה)',
      content: `סיכום שיעור: מבוא למיקרו-כלכלה
נושא: שיווי משקל תחרותי ועקומת ביקוש והיצע.
נקודות מרכזיות:
- עקומת הביקוש יורדת משמאל לימין: ככל שהמחיר עולה, הכמות המבוקשת יורדת.
- עקומת ההיצע עולה משמאל לימין: יצרנים מוכנים לספק כמות גדולה יותר במחיר גבוה.
- נקודת המפגש מגדירה את מחיר שיווי המשקל ואת הכמות שתיוצר במשק.`,
    },
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Render text with organic jitter spans
  const renderJitteredContent = () => {
    if (!humanJitter) {
      return (
        <div
          style={{
            fontFamily: fontLoaded ? `'${fontFamily}', 'Rubik', sans-serif` : "'Rubik', sans-serif",
            fontSize: `${fontSize}px`,
            lineHeight: `${lineHeight}px`,
            letterSpacing: `${letterSpacing}px`,
            color: inkColor,
            whiteSpace: 'pre-wrap',
          }}
        >
          {text}
        </div>
      );
    }

    // Split by paragraphs/lines
    const lines = text.split('\n');
    return (
      <div
        style={{
          fontFamily: fontLoaded ? `'${fontFamily}', 'Rubik', sans-serif` : "'Rubik', sans-serif",
          fontSize: `${fontSize}px`,
          lineHeight: `${lineHeight}px`,
          letterSpacing: `${letterSpacing}px`,
          color: inkColor,
        }}
      >
        {lines.map((line, lineIndex) => {
          if (line.trim() === '') {
            return <div key={lineIndex} style={{ height: `${lineHeight}px` }}>&nbsp;</div>;
          }

          // Subtle organic baseline slant per line
          const lineSlant = ((lineIndex % 5) - 2) * 0.15; // -0.3deg to +0.3deg

          return (
            <div
              key={lineIndex}
              className="relative"
              style={{
                transform: `rotate(${lineSlant}deg)`,
                transformOrigin: 'right center',
                marginBottom: `${lineHeight - fontSize}px`,
              }}
            >
              {line.split('').map((char, charIndex) => {
                // Deterministic pseudo-random jitter based on indices
                const seed = (lineIndex * 37 + charIndex * 19) % 100;
                const rot = ((seed % 7) - 3) * 0.35; // -1 deg to +1 deg
                const offsetY = ((seed % 5) - 2) * 0.4; // -0.8px to +0.8px

                return (
                  <span
                    key={charIndex}
                    style={{
                      display: 'inline-block',
                      transform: `rotate(${rot}deg) translateY(${offsetY}px)`,
                      transformOrigin: 'bottom center',
                    }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Controls & Input Panel */}
      <div className="w-full lg:w-[380px] flex flex-col gap-4">
        {/* Font Status Card */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 backdrop-blur-md shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">סטטוס פונט כתב יד</span>
            {fontLoaded ? (
              <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-700/40 px-2 py-0.5 rounded-full font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                פונט פעיל ומוטען
              </span>
            ) : (
              <span className="text-xs text-amber-400 bg-amber-950/60 border border-amber-700/40 px-2 py-0.5 rounded-full font-medium">
                טרם הופק פונט
              </span>
            )}
          </div>

          <p className="text-xs text-slate-300 mb-3">
            {drawnCharsCount > 0
              ? `ציירת ${drawnCharsCount} תווים. לחץ על 'הפק פונט' כדי לעדכן את הדף בכתב שלך!`
              : 'כדי שהדף יוצג בכתב ידך, צייר מספר אותיות בלשונית הציור ולחץ על הפק פונט.'}
          </p>

          <button
            onClick={onGenerateFont}
            disabled={drawnCharsCount === 0}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm shadow-lg shadow-indigo-600/25 transition flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            הפק וטען פונט עכשיו
          </button>
        </div>

        {/* Text Input / Assignment Editor */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 backdrop-blur-md shadow-xl flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-bold text-white flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-indigo-400" />
              תוכן המטלה / העבודה:
            </label>
            <button
              onClick={handleCopy}
              className="text-xs text-slate-400 hover:text-slate-200 transition"
              title="העתק טקסט"
            >
              {copied ? 'הועתק!' : 'העתק'}
            </button>
          </div>

          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            rows={8}
            className="w-full bg-slate-900/80 border border-slate-700 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono resize-none"
            placeholder="הקלד כאן את תוכן המטלה שברצונך להפוך לכתב יד..."
          />

          {/* Quick presets */}
          <div className="mt-3">
            <span className="text-[11px] text-slate-400 block mb-1 font-medium">טקסטים לדוגמה:</span>
            <div className="flex flex-col gap-1.5">
              {sampleTexts.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => setText(sample.content)}
                  className="text-right text-xs bg-slate-700/50 hover:bg-slate-700 text-slate-300 p-2 rounded-xl transition border border-slate-600/40 truncate"
                >
                  {sample.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Notebook Style Settings */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 backdrop-blur-md shadow-xl">
          <h4 className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            הגדרות מחברת ודיו
          </h4>

          {/* Paper Style Selector */}
          <div className="mb-3">
            <span className="text-[11px] text-slate-400 block mb-1">סגנון דף:</span>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => setPaperStyle('lined')}
                className={`py-1.5 text-xs rounded-xl font-medium border transition ${
                  paperStyle === 'lined'
                    ? 'bg-indigo-600 border-indigo-400 text-white'
                    : 'bg-slate-700/60 border-slate-600/60 text-slate-300 hover:bg-slate-700'
                }`}
              >
                שורות מחברת
              </button>
              <button
                onClick={() => setPaperStyle('grid')}
                className={`py-1.5 text-xs rounded-xl font-medium border transition ${
                  paperStyle === 'grid'
                    ? 'bg-indigo-600 border-indigo-400 text-white'
                    : 'bg-slate-700/60 border-slate-600/60 text-slate-300 hover:bg-slate-700'
                }`}
              >
                משבצות
              </button>
              <button
                onClick={() => setPaperStyle('blank')}
                className={`py-1.5 text-xs rounded-xl font-medium border transition ${
                  paperStyle === 'blank'
                    ? 'bg-indigo-600 border-indigo-400 text-white'
                    : 'bg-slate-700/60 border-slate-600/60 text-slate-300 hover:bg-slate-700'
                }`}
              >
                דף חלק
              </button>
            </div>
          </div>

          {/* Ink Color Selector */}
          <div className="mb-3">
            <span className="text-[11px] text-slate-400 block mb-1">צבע עט ודיו:</span>
            <div className="flex items-center gap-2">
              {[
                { label: 'עט כחול', color: '#1d4ed8' },
                { label: 'כחול עמוק', color: '#172554' },
                { label: 'עט שחור', color: '#09090b' },
                { label: 'עיפרון', color: '#475569' },
                { label: 'עט ירוק', color: '#15803d' },
              ].map(ink => (
                <button
                  key={ink.color}
                  onClick={() => setInkColor(ink.color)}
                  className={`w-7 h-7 rounded-full border-2 transition ${
                    inkColor === ink.color ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: ink.color }}
                  title={ink.label}
                />
              ))}
            </div>
          </div>

          {/* Font Size & Line Height Sliders */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div>
              <span className="text-[11px] text-slate-400 block mb-0.5">גודל ({fontSize}px):</span>
              <input
                type="range"
                min={16}
                max={42}
                value={fontSize}
                onChange={e => setFontSize(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
              />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block mb-0.5">שורה ({lineHeight}px):</span>
              <input
                type="range"
                min={24}
                max={60}
                value={lineHeight}
                onChange={e => setLineHeight(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
              />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block mb-0.5">רווח ({letterSpacing}px):</span>
              <input
                type="range"
                min={0}
                max={8}
                value={letterSpacing}
                onChange={e => setLetterSpacing(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
              />
            </div>
          </div>

          {/* Jitter Mode Toggle */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-700/60">
            <div>
              <span className="text-xs font-semibold text-slate-200 block">אפקט כתב-יד אנושי (רעד עדין)</span>
              <span className="text-[10px] text-slate-400">שובר את המראה הרובוטי ומדמה כתיבה טבעית</span>
            </div>
            <button
              onClick={() => setHumanJitter(!humanJitter)}
              className={`w-11 h-6 rounded-full transition-colors p-0.5 ${
                humanJitter ? 'bg-indigo-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  humanJitter ? '-translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Realistic Notebook Sheet */}
      <div className="flex-1 flex flex-col items-center">
        {/* Sheet Top Action Bar */}
        <div className="w-full max-w-[760px] flex items-center justify-between mb-2 px-1">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span>תצוגת מחברת סטודנט להגשה (A4)</span>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition shadow-md"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>הדפס / שמור כ-PDF</span>
          </button>
        </div>

        {/* The Actual Sheet Paper */}
        <div
          id="student-notebook-page"
          className="w-full max-w-[760px] min-h-[920px] rounded-xl shadow-2xl p-10 relative overflow-hidden transition-all duration-200 select-text"
          style={{
            backgroundColor: '#fbfbfa',
            backgroundImage:
              paperStyle === 'lined'
                ? `linear-gradient(to bottom, transparent ${lineHeight - 1}px, #cbd5e1 ${lineHeight}px)`
                : paperStyle === 'grid'
                ? `linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)`
                : 'none',
            backgroundSize:
              paperStyle === 'lined'
                ? `100% ${lineHeight}px`
                : paperStyle === 'grid'
                ? `24px 24px`
                : 'auto',
            backgroundPosition: '0 40px',
            boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.4), 0 0 1px rgba(0,0,0,0.1)',
          }}
        >
          {/* Lined Notebook Red Margin Line */}
          {paperStyle === 'lined' && (
            <div
              className="absolute top-0 bottom-0 pointer-events-none"
              style={{
                right: '75px',
                width: '1.5px',
                backgroundColor: 'rgba(239, 68, 68, 0.45)', // Red margin line
              }}
            />
          )}

          {/* Paper Holes Simulation (Classic binder notebook punch holes) */}
          <div className="absolute right-3 top-20 flex flex-col gap-40 pointer-events-none opacity-40">
            <div className="w-4 h-4 rounded-full bg-slate-800/10 shadow-inner border border-slate-300" />
            <div className="w-4 h-4 rounded-full bg-slate-800/10 shadow-inner border border-slate-300" />
            <div className="w-4 h-4 rounded-full bg-slate-800/10 shadow-inner border border-slate-300" />
          </div>

          {/* Content Area with Margin Offset */}
          <div className={paperStyle === 'lined' ? 'pr-12' : ''}>
            {renderJitteredContent()}
          </div>
        </div>
      </div>
    </div>
  );
};
