import React, { useState } from 'react';
import {
  BookOpen,
  Sliders,
  Sparkles,
  Printer,
  CheckCircle2,
  FileText,
  Columns,
  FileUp,
  Sigma,
} from 'lucide-react';
import mammoth from 'mammoth';
import { parseDocumentBlocks, SUPERSCRIPT_MAP } from '../utils/latexParser';
import { HandwrittenMath } from './HandwrittenMath';

interface NotebookPreviewProps {
  fontLoaded: boolean;
  fontFamily: string;
  variantCount: number;
  onGenerateFont: () => void;
  drawnCharsCount: number;
}

export const NotebookPreview: React.FC<NotebookPreviewProps> = ({
  fontLoaded,
  fontFamily,
  variantCount,
  onGenerateFont,
  drawnCharsCount,
}) => {
  const [viewMode, setViewMode] = useState<'split' | 'notebook' | 'editor'>('split');
  const [paperStyle, setPaperStyle] = useState<'lined' | 'grid' | 'blank'>('lined');
  const [inkColor, setInkColor] = useState<string>('#1d4ed8'); // Classic blue pen
  const [fontSize, setFontSize] = useState<number>(24);
  const [lineHeight, setLineHeight] = useState<number>(36);
  const [letterSpacing, setLetterSpacing] = useState<number>(0);
  const [humanJitter, setHumanJitter] = useState<boolean>(true);
  const [copied, setCopied] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const [text, setText] = useState<string>(
`מטלה 2 - פיזיקה ומתמטיקה
שם הסטודנט: יונתן
תאריך הגשה: 2 בנובמבר 2026

שאלה 1: תנועה הרמונית ומשוואות דיפרנציאליות
נתון גוף בעל מסה m המחובר לקפיץ בעל קבוע k.
משוואת התנועה ההרמונית:
d²x/dt² + ω²x = 0  כאשר  ω = √(k/m)

פתרון המשוואה הכללי:
x(t) = A cos(ωt + φ)
תדירות התנודה: f = ω / 2π
אנרגיה כוללת במערכת:
E = ½ kA² = const

שאלה 2: אינטגרל מסלולי ומשפט גאוס
חשבו את השטף של השדה החשמלי דרך משטח סגור:
∮ E • dA = Q_in / ε₀`
  );

  const sampleTexts = [
    {
      title: 'תרגיל אינפי ב-LaTeX מלא (אינטגרלים, שברים ושורשים)',
      content: `תרגיל 1 - אינפי 2 (חשבון אינטגרלי)
שם הסטודנט: יונתן

שאלה 1:
חשבו את השטח $S$ של התחום החסום בין הפונקציות:
$$S = \\int_{0}^{1} \\left( \\sqrt{x} - x^2 \\right) dx$$

פתרון:
נבצע אינטגרציה איבר-איבר לפי נוסחאות יסוד:
$$\\int \\sqrt{x} dx = \\frac{2}{3} x^{\\frac{3}{2}}, \\qquad \\int x^2 dx = \\frac{x^3}{3}$$

נציב את גבולות האינטגרציה:
$$S = \\left[ \\frac{2}{3} x^{\\frac{3}{2}} - \\frac{x^3}{3} \\right]_0^1 = \\frac{2}{3} - \\frac{1}{3} = \\frac{1}{3}$$

משפט הגבול המרכזי:
$$\\lim_{n \\to \\infty} \\sum_{k=1}^n \\frac{1}{k} = \\infty$$`,
    },
    {
      title: 'פיזיקה וחשמל (משוואות מקסוול ווקטורים)',
      content: `מטלה 2 - אלקטרומגנטיות ופיזיקה
שאלה:
נסחו את חוק גאוס וחוק פאראדיי בצורה דיפרנציאלית:

פתרון:
$$\\nabla \\cdot \\vec{E} = \\frac{\\rho}{\\varepsilon_0}$$
$$\\nabla \\times \\vec{E} = -\\frac{\\partial \\vec{B}}{\\partial t}$$

כאשר $\\vec{E}$ הוא השדה החשמלי, ו-$\\vec{B}$ שדה מגנטי.`,
    },
    {
      title: 'מדעי המחשב (אלגוריתם חיפוש)',
      content: `מטלה 1 - מבני נתונים ואלגוריתמים
נושא: חיפוש בינארי בעץ AVL

תשובה:
חיפוש בינארי הוא אלגוריתם יעיל למציאת איבר במערך ממוין.
בכל שלב באלגוריתם, אנו משווים את האיבר המבוקש לאיבר האמצעי:
1. אם האיבר שווה לאמצעי - מצאנו את האיבר והחיפוש מסתיים.
2. אם האיבר קטן מהאמצעי - ממשיכים לחפש רק בחצי השמאלי.
3. אם האיבר גדול מהאמצעי - ממשיכים לחפש רק בחצי הימני.

סיבוכיות זמן הריצה במקרה הגרוע: O(log n).`,
    },
  ];

  // Handle Word (.docx) or Text file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportStatus('קורא קובץ...');
    try {
      if (file.name.endsWith('.docx')) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        if (result.value) {
          setText(result.value);
          setImportStatus(`מסמך Word נטען בהצלחה! (${file.name})`);
        }
      } else if (file.name.endsWith('.txt')) {
        const textContent = await file.text();
        setText(textContent);
        setImportStatus(`קובץ טקסט נטען בהצלחה! (${file.name})`);
      } else {
        setImportStatus('שגיאה: נא להעלות קובץ מסוג .docx (Word) או .txt');
      }
    } catch (err) {
      console.error(err);
      setImportStatus('שגיאה בעת קריאת קובץ ה-Word');
    } finally {
      setTimeout(() => setImportStatus(null), 3500);
      e.target.value = '';
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Render document blocks: Text with jitter + Full Handwritten LaTeX Math
  const renderJitteredContent = () => {
    const blocks = parseDocumentBlocks(text);

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
        {blocks.map((block, bIdx) => {
          if (block.type === 'display-math') {
            return (
              <div
                key={bIdx}
                className="my-3 py-1 flex justify-center w-full select-text"
                style={{ minHeight: `${lineHeight * 1.4}px` }}
              >
                <HandwrittenMath
                  nodes={block.mathAST || []}
                  fontFamily={fontFamily}
                  variantCount={variantCount}
                  fontSize={Math.round(fontSize * 1.15)}
                  inkColor={inkColor}
                  isDisplay={true}
                />
              </div>
            );
          }

          if (block.type === 'inline-math') {
            return (
              <HandwrittenMath
                key={bIdx}
                nodes={block.mathAST || []}
                fontFamily={fontFamily}
                variantCount={variantCount}
                fontSize={fontSize}
                inkColor={inkColor}
                isDisplay={false}
              />
            );
          }

          // Plain text block with organic human jitter & word-level binding
          if (block.content === '\n') {
            return <div key={bIdx} style={{ height: `${lineHeight}px` }}>&nbsp;</div>;
          }

          const lines = block.content.split('\n');

          return (
            <span key={bIdx}>
              {lines.map((line, lIdx) => {
                if (line === '' && lines.length > 1) {
                  return <div key={lIdx} style={{ height: `${lineHeight * 0.7}px` }}>&nbsp;</div>;
                }

                // Split line into words and whitespace separators
                const tokens = line.split(/(\s+)/);

                return (
                  <React.Fragment key={lIdx}>
                    {tokens.map((token, tIdx) => {
                      if (/^\s+$/.test(token)) {
                        // Word space separator: clear, dedicated spacing between separate words
                        return (
                          <span
                            key={tIdx}
                            style={{
                              display: 'inline-block',
                              width: `${Math.max(fontSize * 0.32, 7)}px`,
                            }}
                          >
                            &nbsp;
                          </span>
                        );
                      }

                      // Cohesive Word Container: Letters inside this word sit tightly together
                      return (
                        <span
                          key={tIdx}
                          className="inline-block whitespace-nowrap"
                          style={{
                            letterSpacing: `${letterSpacing}px`,
                          }}
                        >
                          {token.split('').map((char, charIndex) => {
                            const globalCharIdx = bIdx * 50 + lIdx * 20 + tIdx * 10 + charIndex;
                            const seed = (globalCharIdx * 19 + char.charCodeAt(0)) % 100;
                            const rot = humanJitter ? ((seed % 7) - 3) * 0.32 : 0;
                            const offsetY = humanJitter ? ((seed % 5) - 2) * 0.32 : 0;

                            const isSup = Boolean(SUPERSCRIPT_MAP[char]);
                            const actualChar = isSup ? SUPERSCRIPT_MAP[char] : char;

                            const variantIdx = variantCount > 1
                              ? (((seed * 31 + actualChar.charCodeAt(0)) % variantCount) + 1)
                              : 1;

                            const charFont = fontLoaded
                              ? `'${fontFamily}_V${variantIdx}', '${fontFamily}', 'Rubik', sans-serif`
                              : "'Rubik', sans-serif";

                            if (isSup) {
                              return (
                                <span
                                  key={charIndex}
                                  style={{
                                    display: 'inline-block',
                                    fontFamily: charFont,
                                    fontSize: '0.62em',
                                    transform: `translateY(-0.48em) rotate(${rot}deg)`,
                                    transformOrigin: 'bottom center',
                                    marginLeft: '1px',
                                  }}
                                >
                                  {actualChar}
                                </span>
                              );
                            }

                            return (
                              <span
                                key={charIndex}
                                style={{
                                  display: 'inline-block',
                                  fontFamily: charFont,
                                  transform: rot || offsetY ? `rotate(${rot}deg) translateY(${offsetY}px)` : undefined,
                                  transformOrigin: 'bottom center',
                                }}
                              >
                                {char}
                              </span>
                            );
                          })}
                        </span>
                      );
                    })}
                    {lIdx < lines.length - 1 && <br />}
                  </React.Fragment>
                );
              })}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Top View Mode Selector Bar */}
      <div className="flex items-center justify-between flex-wrap gap-2 bg-slate-900/80 border border-slate-800 p-2.5 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-slate-300 ml-2">מצב תצוגה:</span>
          <button
            onClick={() => setViewMode('split')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              viewMode === 'split'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>עורך דו-מצבי מפוצל</span>
          </button>

          <button
            onClick={() => setViewMode('notebook')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              viewMode === 'notebook'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>מחברת בלבד</span>
          </button>

          <button
            onClick={() => setViewMode('editor')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              viewMode === 'editor'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>עורך טקסט דפוס</span>
          </button>
        </div>

        {/* Word Document Upload Button */}
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition shadow-md shadow-blue-600/20 cursor-pointer">
            <FileUp className="w-3.5 h-3.5" />
            <span>העלה מסמך Word (.docx)</span>
            <input
              type="file"
              accept=".docx,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition shadow-md"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>הדפס / PDF</span>
          </button>
        </div>
      </div>

      {importStatus && (
        <div className="bg-indigo-950/80 border border-indigo-700/60 text-indigo-300 text-xs font-semibold px-4 py-2 rounded-xl text-center animate-fade-in">
          {importStatus}
        </div>
      )}

      {/* Main Container */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Column: Text Editor & Controls (Shown in 'split' or 'editor') */}
        {(viewMode === 'split' || viewMode === 'editor') && (
          <div className={`flex flex-col gap-4 w-full ${viewMode === 'split' ? 'lg:w-[420px]' : 'w-full max-w-3xl mx-auto'}`}>
            {/* Font Status Card */}
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 backdrop-blur-md shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400">סטטוס פונט כתב יד</span>
                {fontLoaded ? (
                  <div className="flex items-center gap-1.5">
                    {variantCount > 1 && (
                      <span className="text-[11px] text-indigo-300 bg-indigo-950/70 border border-indigo-700/50 px-2 py-0.5 rounded-full font-bold">
                        {variantCount} וריאציות פעילות
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-700/40 px-2 py-0.5 rounded-full font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      פעיל
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-amber-400 bg-amber-950/60 border border-amber-700/40 px-2 py-0.5 rounded-full font-medium">
                    טרם הופק פונט
                  </span>
                )}
              </div>

              <button
                onClick={onGenerateFont}
                disabled={drawnCharsCount === 0}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                רענן / הפק פונט מעודכן
              </button>
            </div>

            {/* Live Dual Editor */}
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 backdrop-blur-md shadow-xl flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-white flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  עורך תוכן (כתב דפוס הניתן לעריכה):
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
                rows={12}
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans leading-relaxed resize-none"
                placeholder="הקלד או הדבק כאן את תוכן המטלה..."
              />

              {/* Presets & Samples */}
              <div className="mt-3">
                <span className="text-[11px] text-slate-400 block mb-1 font-medium">מטלות ודוגמאות מוכנות:</span>
                <div className="flex flex-col gap-1.5">
                  {sampleTexts.map((sample, idx) => (
                    <button
                      key={idx}
                      onClick={() => setText(sample.content)}
                      className="text-right text-xs bg-slate-700/50 hover:bg-slate-700 text-slate-300 p-2 rounded-xl transition border border-slate-600/40 truncate flex items-center justify-between"
                    >
                      <span>{sample.title}</span>
                      <Sigma className="w-3 h-3 text-indigo-400 shrink-0 ml-1" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Paper Styling Settings */}
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
                    משבצות (מתמטיקה)
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

              {/* Font Sliders */}
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
                  <span className="text-[11px] text-slate-400 block mb-0.5">
                    צפיפות אותיות במילה ({letterSpacing > 0 ? `+${letterSpacing}` : letterSpacing}px):
                  </span>
                  <input
                    type="range"
                    min={-3}
                    max={5}
                    step={0.5}
                    value={letterSpacing}
                    onChange={e => setLetterSpacing(Number(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
                    title="שליטה במרווח בין אותיות בתוך מילה - ערך שלילי מצמיד את האותיות"
                  />
                </div>
              </div>

              {/* Jitter Mode Toggle */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-700/60">
                <div>
                  <span className="text-xs font-semibold text-slate-200 block">אפקט כתב-יד אנושי (רעד עדין)</span>
                  <span className="text-[10px] text-slate-400">שובר את המראה הרובוטי ומערבב וריאציות</span>
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
        )}

        {/* Right Column: Realistic Handwritten Notebook (Shown in 'split' or 'notebook') */}
        {(viewMode === 'split' || viewMode === 'notebook') && (
          <div className="flex-1 flex flex-col items-center w-full">
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
                    backgroundColor: 'rgba(239, 68, 68, 0.45)',
                  }}
                />
              )}

              {/* Paper Binder Holes */}
              <div className="absolute right-3 top-20 flex flex-col gap-40 pointer-events-none opacity-40">
                <div className="w-4 h-4 rounded-full bg-slate-800/10 shadow-inner border border-slate-300" />
                <div className="w-4 h-4 rounded-full bg-slate-800/10 shadow-inner border border-slate-300" />
                <div className="w-4 h-4 rounded-full bg-slate-800/10 shadow-inner border border-slate-300" />
              </div>

              {/* Handwritten Content */}
              <div className={paperStyle === 'lined' ? 'pr-12' : ''}>
                {renderJitteredContent()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
