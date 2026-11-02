import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  RotateCcw,
  Trash2,
  Eye,
  EyeOff,
  ChevronRight,
  ChevronLeft,
  Check,
  Plus,
  Copy,
  PenTool,
  ShieldAlert,
  Crop,
} from 'lucide-react';
import { getStroke } from 'perfect-freehand';
import type { CharacterDef, Point, Stroke } from '../types';
import {
  CANVAS_SIZE,
  CANVAS_BASELINE,
  CANVAS_CAP_HEIGHT,
  CANVAS_ASCENDER,
  CANVAS_DESCENDER,
  computeStrokesBoundingBox,
} from '../utils/fontBuilder';

interface DrawingCanvasProps {
  character: CharacterDef;
  variations: Stroke[][]; // 1 to 5 variations
  activeVariationIndex: number;
  onActiveVariationIndexChange: (idx: number) => void;
  onStrokesChange: (variationIndex: number, strokes: Stroke[]) => void;
  onAddVariation: () => void;
  onDeleteVariation: (idx: number) => void;
  onCopyFromVariation: (fromIdx: number, toIdx: number) => void;
  onNext: () => void;
  onPrev: () => void;
  hasNext: boolean;
  hasPrev: boolean;
  strokeWidth: number;
  onStrokeWidthChange: (w: number) => void;
}

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  character,
  variations,
  activeVariationIndex,
  onActiveVariationIndexChange,
  onStrokesChange,
  onAddVariation,
  onDeleteVariation,
  onCopyFromVariation,
  onNext,
  onPrev,
  hasNext,
  hasPrev,
  strokeWidth,
  onStrokeWidthChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStroke, setCurrentStroke] = useState<Stroke>([]);
  const [undoStack, setUndoStack] = useState<Stroke[][]>([]);
  const [redoStack, setRedoStack] = useState<Stroke[][]>([]);
  const [showGhost, setShowGhost] = useState(true);
  const [showBounds, setShowBounds] = useState(true);
  const [palmRejection, setPalmRejection] = useState(false); // iPad Apple Pencil Palm Rejection
  const [isPenDetected, setIsPenDetected] = useState(false);

  // Current active strokes
  const currentStrokes = variations[activeVariationIndex] || [];
  const currentBBox = computeStrokesBoundingBox(currentStrokes, strokeWidth);

  // Reset undo/redo when character or variation changes
  useEffect(() => {
    setUndoStack([]);
    setRedoStack([]);
    setCurrentStroke([]);
  }, [character.id, activeVariationIndex]);

  // Redraw canvas with silky-smooth perfect-freehand outlines
  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High-DPI support
    const dpr = window.devicePixelRatio || 1;
    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Background
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Subtle guidelines
    ctx.lineWidth = 1;

    // Ascender guide (ל)
    ctx.strokeStyle = '#38bdf8';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(30, CANVAS_ASCENDER);
    ctx.lineTo(CANVAS_SIZE - 30, CANVAS_ASCENDER);
    ctx.stroke();

    // Cap-height guide (Top of standard letters)
    ctx.strokeStyle = '#10b981';
    ctx.beginPath();
    ctx.moveTo(30, CANVAS_CAP_HEIGHT);
    ctx.lineTo(CANVAS_SIZE - 30, CANVAS_CAP_HEIGHT);
    ctx.stroke();

    // Baseline guide (Bottom of standard letters)
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(20, CANVAS_BASELINE);
    ctx.lineTo(CANVAS_SIZE - 20, CANVAS_BASELINE);
    ctx.stroke();

    // Descender guide (Bottom of ן, ך, ק)
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(30, CANVAS_DESCENDER);
    ctx.lineTo(CANVAS_SIZE - 30, CANVAS_DESCENDER);
    ctx.stroke();

    ctx.setLineDash([]);

    // Ghost letter (reference)
    if (showGhost && currentStrokes.length === 0 && currentStroke.length === 0) {
      ctx.font = '220px "Segoe UI", Rubik, Arial';
      ctx.fillStyle = 'rgba(148, 163, 184, 0.12)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText(character.char, CANVAS_SIZE / 2, CANVAS_BASELINE);
    }

    // Calligraphic smooth vector stroke renderer via perfect-freehand
    const drawStroke = (stroke: Stroke) => {
      if (!stroke || stroke.length === 0) return;

      const inputPoints = stroke.map(p => ({
        x: p.x,
        y: p.y,
        pressure: p.pressure !== undefined ? p.pressure : 0.5,
      }));

      const outline = getStroke(inputPoints, {
        size: strokeWidth,
        thinning: 0.35,
        smoothing: 0.65,
        streamline: 0.45,
        simulatePressure: false,
        start: { taper: 0, cap: true },
        end: { taper: 0, cap: true },
      });

      ctx.fillStyle = '#f8fafc';

      if (!outline || outline.length < 3) {
        if (stroke.length === 1) {
          ctx.beginPath();
          ctx.arc(stroke[0].x, stroke[0].y, Math.max(strokeWidth / 2, 2), 0, Math.PI * 2);
          ctx.fill();
        }
        return;
      }

      ctx.beginPath();
      const first = outline[0];
      ctx.moveTo(first[0], first[1]);
      for (let i = 0; i < outline.length; i++) {
        const [x0, y0] = outline[i];
        const [x1, y1] = outline[(i + 1) % outline.length];
        ctx.quadraticCurveTo(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      }
      ctx.closePath();
      ctx.fill();
    };

    // Draw saved strokes
    currentStrokes.forEach(drawStroke);

    // Draw active stroke
    if (currentStroke.length > 0) {
      drawStroke(currentStroke);
    }

    // Dynamic tight bounding box guidelines (Automatic kerning & bounds detection)
    const allStrokes = currentStroke.length > 0 ? [...currentStrokes, currentStroke] : currentStrokes;
    const bbox = computeStrokesBoundingBox(allStrokes, strokeWidth);
    if (showBounds && bbox && bbox.width > 2) {
      // Soft background tint for the detected glyph width
      ctx.fillStyle = 'rgba(56, 189, 248, 0.05)';
      ctx.fillRect(bbox.minX, 20, bbox.width, CANVAS_SIZE - 40);

      // Tight bounding dashed borders
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.55)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);

      ctx.beginPath();
      ctx.moveTo(bbox.minX, 15);
      ctx.lineTo(bbox.minX, CANVAS_SIZE - 15);
      ctx.moveTo(bbox.maxX, 15);
      ctx.lineTo(bbox.maxX, CANVAS_SIZE - 15);
      ctx.stroke();

      // Top and bottom boundary markers
      ctx.setLineDash([]);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
      ctx.lineWidth = 2;

      // Small tick marks at top left/right
      ctx.beginPath();
      ctx.moveTo(bbox.minX - 4, 15);
      ctx.lineTo(bbox.minX + 4, 15);
      ctx.moveTo(bbox.maxX - 4, 15);
      ctx.lineTo(bbox.maxX + 4, 15);
      ctx.stroke();
    }

    ctx.restore();
  }, [currentStrokes, currentStroke, showGhost, showBounds, strokeWidth, character]);

  // Canvas scaling
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = CANVAS_SIZE * dpr;
    canvas.height = CANVAS_SIZE * dpr;
    canvas.style.width = `${CANVAS_SIZE}px`;
    canvas.style.height = `${CANVAS_SIZE}px`;
    redraw();
  }, [redraw]);

  // Pointer position & pressure calculation
  const getCanvasPoint = (e: React.PointerEvent<HTMLCanvasElement> | PointerEvent): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_SIZE / rect.width;
    const scaleY = CANVAS_SIZE / rect.height;

    let pressure = e.pressure;
    if (e.pointerType === 'pen' && (pressure === undefined || pressure === 0)) {
      pressure = 0.5;
    }

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
      pressure: pressure !== undefined && pressure > 0 ? pressure : 0.5,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (palmRejection && e.pointerType === 'touch') {
      return;
    }

    if (e.pointerType === 'pen') {
      setIsPenDetected(true);
    }

    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setIsDrawing(true);
    const p = getCanvasPoint(e);
    setCurrentStroke([p]);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    if (palmRejection && e.pointerType === 'touch') return;

    // Use coalesced events if available for ultra-smooth iPad stylus polling
    const native = e.nativeEvent as PointerEvent;
    if (native && typeof native.getCoalescedEvents === 'function') {
      const coalesced = native.getCoalescedEvents();
      if (coalesced && coalesced.length > 0) {
        const points = coalesced.map(ev => getCanvasPoint(ev));
        setCurrentStroke(prev => [...prev, ...points]);
        return;
      }
    }

    const p = getCanvasPoint(e);
    setCurrentStroke(prev => [...prev, p]);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    setIsDrawing(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }

    if (currentStroke.length > 0) {
      const nextStrokes = [...currentStrokes, currentStroke];
      setUndoStack(prev => [...prev, currentStrokes]);
      setRedoStack([]);
      onStrokesChange(activeVariationIndex, nextStrokes);
      setCurrentStroke([]);
    }
  };

  const handleUndo = () => {
    if (undoStack.length === 0 && currentStrokes.length === 0) return;
    const previous = undoStack[undoStack.length - 1] || [];
    setRedoStack(prev => [...prev, currentStrokes]);
    setUndoStack(prev => prev.slice(0, -1));
    onStrokesChange(activeVariationIndex, previous);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setUndoStack(prev => [...prev, currentStrokes]);
    setRedoStack(prev => prev.slice(0, -1));
    onStrokesChange(activeVariationIndex, next);
  };

  const handleClear = () => {
    if (currentStrokes.length === 0) return;
    setUndoStack(prev => [...prev, currentStrokes]);
    setRedoStack([]);
    onStrokesChange(activeVariationIndex, []);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'Z'))) {
        e.preventDefault();
        handleRedo();
      } else if (e.key === 'ArrowLeft' && hasNext) {
        onNext();
      } else if (e.key === 'ArrowRight' && hasPrev) {
        onPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasNext, hasPrev, currentStrokes, undoStack, redoStack]);

  const isDrawn = currentStrokes.length > 0;
  const totalVariationsDrawn = variations.filter(v => v && v.length > 0).length;

  return (
    <div className="flex flex-col items-center select-none w-full max-w-[460px]">
      {/* Top Header Card */}
      <div className="w-full flex items-center justify-between bg-slate-800/90 border border-slate-700/80 px-4 py-2.5 rounded-2xl mb-3 backdrop-blur-md shadow-xl">
        <button
          onClick={onPrev}
          disabled={!hasPrev}
          className={`p-2 rounded-xl transition flex items-center gap-1 text-xs font-semibold ${
            hasPrev
              ? 'bg-slate-700 hover:bg-slate-600 text-slate-200'
              : 'opacity-40 cursor-not-allowed text-slate-500'
          }`}
          title="אות קודמת (חץ ימינה)"
        >
          <ChevronRight className="w-4 h-4" />
          <span>הקודם</span>
        </button>

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2">
            <span className="text-3xl font-extrabold text-white tracking-wide">{character.char}</span>
            <span className="text-xs font-bold text-indigo-400 bg-indigo-950/60 border border-indigo-700/50 px-2.5 py-0.5 rounded-full">
              {character.name}
            </span>
            {isDrawn && (
              <span className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-600/40 px-2 py-0.5 rounded-full">
                <Check className="w-3 h-3 stroke-[3]" />
                {totalVariationsDrawn} וריאציות
              </span>
            )}
            {isPenDetected && (
              <span className="text-[10px] text-sky-400 bg-sky-950/60 border border-sky-600/40 px-2 py-0.5 rounded-full font-medium">
                עט פעיל
              </span>
            )}
          </div>
          {character.sampleHint && (
            <span className="text-[11px] text-slate-400 mt-0.5">דוגמה למילה: <strong>{character.sampleHint}</strong></span>
          )}
        </div>

        <button
          onClick={onNext}
          disabled={!hasNext}
          className={`p-2 rounded-xl transition flex items-center gap-1 text-xs font-semibold ${
            hasNext
              ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20'
              : 'opacity-40 cursor-not-allowed text-slate-500'
          }`}
          title="אות הבאה (חץ שמאלה)"
        >
          <span>הבא</span>
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* 3-5 Variations Bar */}
      <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-2.5 mb-3 backdrop-blur-md">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
            <PenTool className="w-3.5 h-3.5 text-indigo-400" />
            <span>וריאציות כתב-יד לאות זו (3–5 מומלץ):</span>
          </div>

          {variations.length < 5 && (
            <button
              onClick={onAddVariation}
              className="text-[11px] flex items-center gap-1 px-2.5 py-1 bg-indigo-600/40 hover:bg-indigo-600 text-indigo-200 hover:text-white rounded-lg border border-indigo-500/40 transition font-medium"
              title="הוסף וריאציה נוספת (עד 5)"
            >
              <Plus className="w-3 h-3" />
              <span>הוסף וריאציה</span>
            </button>
          )}
        </div>

        {/* Variation Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {variations.map((vStrokes, idx) => {
            const isActive = idx === activeVariationIndex;
            const hasDrawing = vStrokes && vStrokes.length > 0;

            return (
              <div key={idx} className="flex items-center">
                <button
                  onClick={() => onActiveVariationIndexChange(idx)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                    isActive
                      ? 'bg-indigo-600 border-indigo-400 text-white shadow-md shadow-indigo-600/30 ring-2 ring-indigo-500/40'
                      : hasDrawing
                      ? 'bg-slate-800 border-emerald-600/40 text-emerald-300 hover:bg-slate-700'
                      : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  <span>גרסה {idx + 1}</span>
                  {hasDrawing && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  )}
                </button>

                {variations.length > 1 && (
                  <button
                    onClick={() => onDeleteVariation(idx)}
                    className="p-1 text-slate-500 hover:text-rose-400 transition mr-0.5"
                    title={`מחק וריאציה ${idx + 1}`}
                  >
                    ×
                  </button>
                )}
              </div>
            );
          })}

          {/* Duplicate/Copy option */}
          {activeVariationIndex > 0 && variations[0]?.length > 0 && (
            <button
              onClick={() => onCopyFromVariation(0, activeVariationIndex)}
              className="text-[11px] text-slate-400 hover:text-indigo-300 flex items-center gap-1 px-2 py-1 bg-slate-800/80 hover:bg-slate-800 rounded-lg border border-slate-700 transition"
              title="העתק מגרסה 1 ועשה שינוי קטן"
            >
              <Copy className="w-3 h-3" />
              <span>העתק מ-1</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Drawing Canvas Container */}
      <div className="relative group">
        <div className="p-1 rounded-3xl bg-gradient-to-b from-indigo-500/20 via-slate-700/40 to-slate-800/80 shadow-2xl">
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="touch-none rounded-2xl cursor-crosshair border border-slate-700/60 shadow-inner"
            style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}
          />
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-3 mt-2 text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-0.5 bg-sky-400 inline-block rounded" /> גובה ל'
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-0.5 bg-emerald-400 inline-block rounded" /> גובה רגיל
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-0.5 bg-indigo-500 inline-block rounded" /> קו בסיס
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-0.5 bg-rose-400 inline-block rounded" /> יורדות (ן,ך,ק)
          </span>
        </div>

        {/* Dynamic Tight Bounding Box Info Card */}
        {currentBBox && (
          <div className="flex items-center justify-between w-full mt-2.5 px-3.5 py-2 bg-slate-900/90 border border-sky-500/30 rounded-2xl text-[11px] text-slate-300 backdrop-blur-md shadow-md animate-fade-in">
            <div className="flex items-center gap-2">
              <Crop className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <div>
                <span className="font-bold text-sky-300 ml-1">זיהוי גבולות אוטומטי:</span>
                <span className="text-slate-300">
                  רוחב נטו {Math.round(currentBBox.width)}px
                </span>
              </div>
            </div>
            <span className="text-[10px] text-emerald-400 bg-emerald-950/70 border border-emerald-600/40 px-2 py-0.5 rounded-full font-medium">
              צמצום מרווח במילים פעיל
            </span>
          </div>
        )}
      </div>

      {/* Controls & iPad Palm Rejection Toolbar */}
      <div className="w-full flex items-center justify-between bg-slate-800/90 border border-slate-700/80 p-3 rounded-2xl mt-3 backdrop-blur-md">
        {/* Stroke Width Slider */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-300 font-medium">עובי:</span>
          <input
            type="range"
            min={3}
            max={18}
            value={strokeWidth}
            onChange={e => onStrokeWidthChange(Number(e.target.value))}
            className="w-20 accent-indigo-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
          />
          <span className="text-xs font-mono text-slate-400 w-4">{strokeWidth}</span>
        </div>

        {/* Stylus Palm Rejection Mode */}
        <button
          onClick={() => setPalmRejection(!palmRejection)}
          className={`px-2 py-1 rounded-xl text-[11px] font-semibold border flex items-center gap-1 transition ${
            palmRejection
              ? 'bg-amber-600/30 text-amber-300 border-amber-500/50 shadow-sm'
              : 'bg-slate-700/50 text-slate-400 border-transparent hover:bg-slate-700'
          }`}
          title="מניעת מגע כף יד (מושלם לאייפד עם Apple Pencil)"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>{palmRejection ? 'נעילת עט פעילה' : 'מניעת מגע יד'}</span>
        </button>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowBounds(!showBounds)}
            className={`p-2 rounded-xl transition ${
              showBounds ? 'bg-sky-600/30 text-sky-300 border border-sky-500/40' : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'
            }`}
            title={showBounds ? 'הסתר גבולות אות מחושבים' : 'הצג גבולות אות מחושבים וצמצום מרווחים'}
          >
            <Crop className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowGhost(!showGhost)}
            className={`p-2 rounded-xl transition ${
              showGhost ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40' : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'
            }`}
            title={showGhost ? 'הסתר אות רקע' : 'הצג אות רקע כהנחיה'}
          >
            {showGhost ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>

          <button
            onClick={handleUndo}
            disabled={undoStack.length === 0 && currentStrokes.length === 0}
            className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 transition"
            title="בטל קו אחרון (Ctrl+Z)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleClear}
            disabled={currentStrokes.length === 0}
            className="p-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 text-rose-300 disabled:opacity-40 disabled:cursor-not-allowed transition"
            title="נקה וריאציה זו"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
