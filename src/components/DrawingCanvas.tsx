import React, { useRef, useEffect, useState, useCallback } from 'react';
import { RotateCcw, Trash2, Eye, EyeOff, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import type { CharacterDef, Point, Stroke } from '../types';
import {
  CANVAS_SIZE,
  CANVAS_BASELINE,
  CANVAS_CAP_HEIGHT,
  CANVAS_ASCENDER,
  CANVAS_DESCENDER,
} from '../utils/fontBuilder';

interface DrawingCanvasProps {
  character: CharacterDef;
  strokes: Stroke[];
  onStrokesChange: (strokes: Stroke[]) => void;
  onNext: () => void;
  onPrev: () => void;
  hasNext: boolean;
  hasPrev: boolean;
  strokeWidth: number;
  onStrokeWidthChange: (w: number) => void;
}

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  character,
  strokes,
  onStrokesChange,
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

  // Redraw canvas whenever strokes, currentStroke, or ghost toggle changes
  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High-DPI support
    const dpr = window.devicePixelRatio || 1;
    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Clear background
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Grid lines (subtle)
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);

    // Ascender guide (ל)
    ctx.strokeStyle = '#38bdf8'; // Sky blue
    ctx.beginPath();
    ctx.moveTo(30, CANVAS_ASCENDER);
    ctx.lineTo(CANVAS_SIZE - 30, CANVAS_ASCENDER);
    ctx.stroke();

    // Cap-height guide (Top of standard letters)
    ctx.strokeStyle = '#10b981'; // Emerald
    ctx.beginPath();
    ctx.moveTo(30, CANVAS_CAP_HEIGHT);
    ctx.lineTo(CANVAS_SIZE - 30, CANVAS_CAP_HEIGHT);
    ctx.stroke();

    // Baseline guide (Bottom of standard letters)
    ctx.strokeStyle = '#6366f1'; // Indigo
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(20, CANVAS_BASELINE);
    ctx.lineTo(CANVAS_SIZE - 20, CANVAS_BASELINE);
    ctx.stroke();

    // Descender guide (Bottom of ן, ך, ק)
    ctx.strokeStyle = '#f43f5e'; // Rose
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(30, CANVAS_DESCENDER);
    ctx.lineTo(CANVAS_SIZE - 30, CANVAS_DESCENDER);
    ctx.stroke();

    // Reset line dash
    ctx.setLineDash([]);

    // Ghost letter (reference)
    if (showGhost && strokes.length === 0 && currentStroke.length === 0) {
      ctx.font = '220px "Segoe UI", Rubik, Arial';
      ctx.fillStyle = 'rgba(148, 163, 184, 0.12)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText(character.char, CANVAS_SIZE / 2, CANVAS_BASELINE);
    }

    // Helper to render a stroke
    const drawStroke = (stroke: Stroke) => {
      if (stroke.length === 0) return;
      ctx.beginPath();
      ctx.strokeStyle = '#f8fafc';
      ctx.fillStyle = '#f8fafc';
      ctx.lineWidth = strokeWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (stroke.length === 1) {
        ctx.arc(stroke[0].x, stroke[0].y, strokeWidth / 2, 0, Math.PI * 2);
        ctx.fill();
        return;
      }

      ctx.moveTo(stroke[0].x, stroke[0].y);
      for (let i = 1; i < stroke.length; i++) {
        ctx.lineTo(stroke[i].x, stroke[i].y);
      }
      ctx.stroke();
    };

    // Draw completed strokes
    strokes.forEach(drawStroke);

    // Draw active stroke
    if (currentStroke.length > 0) {
      drawStroke(currentStroke);
    }

    ctx.restore();
  }, [strokes, currentStroke, showGhost, strokeWidth, character]);

  // Setup canvas high-DPI scaling
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

  // Get pointer coordinates relative to canvas
  const getCanvasPoint = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_SIZE / rect.width;
    const scaleY = CANVAS_SIZE / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
      pressure: e.pressure || 0.5,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setIsDrawing(true);
    const p = getCanvasPoint(e);
    setCurrentStroke([p]);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
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
      const nextStrokes = [...strokes, currentStroke];
      setUndoStack(prev => [...prev, strokes]);
      setRedoStack([]); // Clear redo
      onStrokesChange(nextStrokes);
      setCurrentStroke([]);
    }
  };

  const handleUndo = () => {
    if (undoStack.length === 0 && strokes.length === 0) return;
    const previous = undoStack[undoStack.length - 1] || [];
    setRedoStack(prev => [...prev, strokes]);
    setUndoStack(prev => prev.slice(0, -1));
    onStrokesChange(previous);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setUndoStack(prev => [...prev, strokes]);
    setRedoStack(prev => prev.slice(0, -1));
    onStrokesChange(next);
  };

  const handleClear = () => {
    if (strokes.length === 0) return;
    setUndoStack(prev => [...prev, strokes]);
    setRedoStack([]);
    onStrokesChange([]);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If user is typing in an input or textarea, don't trigger canvas shortcuts
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
  }, [hasNext, hasPrev, strokes, undoStack, redoStack]);

  const isDrawn = strokes.length > 0;

  return (
    <div className="flex flex-col items-center select-none">
      {/* Top Header Card */}
      <div className="w-full max-w-[440px] flex items-center justify-between bg-slate-800/90 border border-slate-700/80 px-4 py-3 rounded-2xl mb-4 backdrop-blur-md shadow-xl">
        <button
          onClick={onPrev}
          disabled={!hasPrev}
          className={`p-2 rounded-xl transition flex items-center gap-1 text-sm font-medium ${
            hasPrev
              ? 'bg-slate-700 hover:bg-slate-600 text-slate-200'
              : 'opacity-40 cursor-not-allowed text-slate-500'
          }`}
          title="אות קודמת (חץ ימינה)"
        >
          <ChevronRight className="w-5 h-5" />
          <span>הקודם</span>
        </button>

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2">
            <span className="text-3xl font-extrabold text-white tracking-wide">{character.char}</span>
            <span className="text-sm font-semibold text-indigo-400 bg-indigo-950/60 border border-indigo-700/50 px-2.5 py-0.5 rounded-full">
              {character.name}
            </span>
            {isDrawn && (
              <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-600/40 px-2 py-0.5 rounded-full">
                <Check className="w-3.5 h-3.5" />
                צויר
              </span>
            )}
          </div>
          {character.sampleHint && (
            <span className="text-xs text-slate-400 mt-0.5">דוגמה למילה: <strong>{character.sampleHint}</strong></span>
          )}
        </div>

        <button
          onClick={onNext}
          disabled={!hasNext}
          className={`p-2 rounded-xl transition flex items-center gap-1 text-sm font-medium ${
            hasNext
              ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20'
              : 'opacity-40 cursor-not-allowed text-slate-500'
          }`}
          title="אות הבאה (חץ שמאלה)"
        >
          <span>הבא</span>
          <ChevronLeft className="w-5 h-5" />
        </button>
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

        {/* Legend of Guidelines */}
        <div className="flex items-center justify-center gap-3 mt-3 text-[11px] text-slate-400">
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
            <span className="w-2.5 h-0.5 bg-rose-400 inline-block rounded" /> אותיות יורדות (ן, ך, ק)
          </span>
        </div>
      </div>

      {/* Controls Toolbar */}
      <div className="w-full max-w-[440px] flex items-center justify-between bg-slate-800/90 border border-slate-700/80 p-3 rounded-2xl mt-4 backdrop-blur-md">
        {/* Stroke Width Slider */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-300 font-medium">עובי עט:</span>
          <input
            type="range"
            min={3}
            max={18}
            value={strokeWidth}
            onChange={e => onStrokeWidthChange(Number(e.target.value))}
            className="w-24 accent-indigo-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
          />
          <span className="text-xs font-mono text-slate-400 w-4">{strokeWidth}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
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
            disabled={undoStack.length === 0 && strokes.length === 0}
            className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 transition"
            title="בטל קו אחרון (Ctrl+Z)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleClear}
            disabled={strokes.length === 0}
            className="p-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 text-rose-300 disabled:opacity-40 disabled:cursor-not-allowed transition"
            title="נקה את כל האות"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
