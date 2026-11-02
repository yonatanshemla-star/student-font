import React, { useState, useEffect } from 'react';
import { PenTool, BookOpen, Sparkles, Settings, RefreshCw, Wand2, Info } from 'lucide-react';
import confetti from 'canvas-confetti';

import type { CharacterDef, CharacterData } from './types';
import { HEBREW_CHARACTERS } from './utils/characterSet';
import { DrawingCanvas } from './components/DrawingCanvas';
import { CharacterGrid } from './components/CharacterGrid';
import { NotebookPreview } from './components/NotebookPreview';
import { ExportModal } from './components/ExportModal';
import { buildFont, registerFontFace } from './utils/fontBuilder';
import { generateDemoCharacters } from './utils/demoHandwriting';

export const App: React.FC = () => {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<'studio' | 'notebook'>('studio');

  // Currently selected character in studio
  const [selectedChar, setSelectedChar] = useState<CharacterDef>(HEBREW_CHARACTERS[0]);

  // Characters data dictionary
  const [characters, setCharacters] = useState<Record<string, CharacterData>>(() => {
    try {
      const saved = localStorage.getItem('student_font_chars');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Font settings
  const [fontName, setFontName] = useState<string>('MyHandwriting');
  const [strokeWidth, setStrokeWidth] = useState<number>(8);
  const [fontBlobUrl, setFontBlobUrl] = useState<string | null>(null);
  const [fontLoaded, setFontLoaded] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Save characters to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('student_font_chars', JSON.stringify(characters));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [characters]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Generate Font Engine
  const handleGenerateFont = async () => {
    setIsGenerating(true);
    try {
      const drawnChars = Object.values(characters).filter(c => c.strokes && c.strokes.length > 0);
      if (drawnChars.length === 0) {
        showToast('עדיין לא ציירת אותיות! צייר לפחות אות אחת או לחץ על "טען כתב לדוגמה"');
        setIsGenerating(false);
        return;
      }

      // Build font via opentype.js
      const { arrayBuffer, blobUrl } = buildFont(characters, {
        familyName: fontName || 'MyHandwriting',
        strokeWidth,
      });

      // Register font directly into the browser
      await registerFontFace(fontName || 'MyHandwriting', arrayBuffer);

      setFontBlobUrl(blobUrl);
      setFontLoaded(true);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });

      showToast(`הפונט '${fontName}' הופק ומוכן לשימוש במחברת!`);
    } catch (err) {
      console.error('Font generation error:', err);
      showToast('אירעה שגיאה בעת הפקת הפונט.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Load preset demo characters
  const handleLoadDemo = () => {
    if (
      Object.keys(characters).length > 0 &&
      !window.confirm('טעינת כתב לדוגמה תעדכן את האותיות הקיימות. להמשיך?')
    ) {
      return;
    }

    const demo = generateDemoCharacters();
    setCharacters(demo);
    showToast('נטען כתב יד מלא לדוגמה (א-ת, סופיות, ספרות)!');

    // Auto generate font from demo immediately
    setTimeout(() => {
      try {
        const { arrayBuffer, blobUrl } = buildFont(demo, {
          familyName: fontName || 'MyHandwriting',
          strokeWidth,
        });
        registerFontFace(fontName || 'MyHandwriting', arrayBuffer);
        setFontBlobUrl(blobUrl);
        setFontLoaded(true);
      } catch (e) {
        console.error(e);
      }
    }, 100);
  };

  // Reset all
  const handleResetAll = () => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את כל האותיות ולהתחיל מחדש?')) {
      setCharacters({});
      setFontBlobUrl(null);
      setFontLoaded(false);
      localStorage.removeItem('student_font_chars');
      showToast('הנתונים אופסו בהצלחה');
    }
  };

  // Navigation between characters
  const currentIndex = HEBREW_CHARACTERS.findIndex(c => c.id === selectedChar.id);
  const hasNext = currentIndex < HEBREW_CHARACTERS.length - 1;
  const hasPrev = currentIndex > 0;

  const handleNext = () => {
    if (hasNext) setSelectedChar(HEBREW_CHARACTERS[currentIndex + 1]);
  };

  const handlePrev = () => {
    if (hasPrev) setSelectedChar(HEBREW_CHARACTERS[currentIndex - 1]);
  };

  const currentStrokes = characters[selectedChar.id]?.strokes || [];

  const handleStrokesChange = (newStrokes: any) => {
    setCharacters(prev => ({
      ...prev,
      [selectedChar.id]: {
        char: selectedChar.char,
        unicode: selectedChar.unicode,
        strokes: newStrokes,
        updatedAt: Date.now(),
      },
    }));
  };

  const drawnCharsCount = Object.values(characters).filter(c => c.strokes && c.strokes.length > 0).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans" dir="rtl">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-indigo-600 text-white font-medium px-5 py-2.5 rounded-2xl shadow-2xl border border-indigo-400/50 flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation Bar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-3">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-600/30 text-xl font-bold">
              ✍️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight text-white">סטודנט-פונט</h1>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-bold">
                  BETA
                </span>
              </div>
              <p className="text-xs text-slate-400">הפיכת כתב יד אישי לפונט ומחולל מטלות הגשה</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center bg-slate-800/80 p-1 rounded-2xl border border-slate-700/80">
            <button
              onClick={() => setActiveTab('studio')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'studio'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>סטודיו ציור אותיות</span>
            </button>

            <button
              onClick={() => setActiveTab('notebook')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'notebook'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>מחברת הגשת מטלות</span>
              {fontLoaded && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </button>
          </div>

          {/* Top Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleLoadDemo}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium transition"
              title="טען כתב לדוגמה מלא מוכן מראש"
            >
              <Wand2 className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">טען כתב לדוגמה</span>
            </button>

            <button
              onClick={handleGenerateFont}
              disabled={isGenerating || drawnCharsCount === 0}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isGenerating ? 'מפיק פונט...' : 'הפק פונט עכשיו'}</span>
            </button>

            <button
              onClick={handleResetAll}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-rose-400 transition"
              title="איפוס כל האותיות והתחלה מחדש"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsExportOpen(true)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition"
              title="הורדת TTF וגיבוי"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6">
        {activeTab === 'studio' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left/Middle Column: Drawing Studio */}
            <div className="lg:col-span-7 flex flex-col items-center">
              <DrawingCanvas
                character={selectedChar}
                strokes={currentStrokes}
                onStrokesChange={handleStrokesChange}
                onNext={handleNext}
                onPrev={handlePrev}
                hasNext={hasNext}
                hasPrev={hasPrev}
                strokeWidth={strokeWidth}
                onStrokeWidthChange={setStrokeWidth}
              />
            </div>

            {/* Right Column: Character Selection Grid & Instructions */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <CharacterGrid
                selectedCharId={selectedChar.id}
                onSelectChar={setSelectedChar}
                characters={characters}
              />

              {/* Tips for Students Card */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-xs text-slate-400 leading-relaxed">
                <div className="flex items-center gap-1.5 font-bold text-slate-200 mb-2">
                  <Info className="w-4 h-4 text-indigo-400" />
                  <span>טיפים לכתיבה טבעית ומדויקת:</span>
                </div>
                <ul className="list-disc list-inside space-y-1">
                  <li>צייר כל אות כך שתשב על <strong>הקו הכחול (קו הבסיס)</strong>.</li>
                  <li>באותיות סופיות (ן, ך, ף, ץ) ובאות ק', רד מתחת לקו הבסיס עד לקו הוורוד.</li>
                  <li>באות ל', עלה מעל הגובה הרגיל עד לקו התכלת העליון.</li>
                  <li>בכל רגע תוכל ללחוץ על <strong>'הפק פונט'</strong> כדי לבדוק איך הכתב שלך נראה במחברת!</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <NotebookPreview
            fontLoaded={fontLoaded}
            fontFamily={fontName || 'MyHandwriting'}
            onGenerateFont={handleGenerateFont}
            drawnCharsCount={drawnCharsCount}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-4 px-6 text-center text-xs text-slate-500">
        <span>פרויקט סטודנט-פונט • הפקת פונט אמיתי (TrueType .TTF) ישירות מהדפדפן</span>
      </footer>

      {/* Export / Settings Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        fontBlobUrl={fontBlobUrl}
        fontName={fontName}
        onFontNameChange={setFontName}
        characters={characters}
        onImportCharacters={setCharacters}
        onGenerateFont={handleGenerateFont}
        strokeWidth={strokeWidth}
        onStrokeWidthChange={setStrokeWidth}
      />
    </div>
  );
};

export default App;
