import opentype from 'opentype.js';
import type { CharacterData, FontSettings, Point, Stroke } from '../types';

export const CANVAS_SIZE = 400;
export const CANVAS_BASELINE = 290;
export const CANVAS_CAP_HEIGHT = 120;
export const CANVAS_ASCENDER = 60;
export const CANVAS_DESCENDER = 360;

const DEFAULT_SETTINGS: FontSettings = {
  familyName: 'כתב יד אישי',
  styleName: 'Regular',
  unitsPerEm: 1000,
  ascender: 800,
  descender: -250,
  strokeWidth: 8,
};

/**
 * Approximate a circle contour centered at (cx, cy) with radius R
 */
function addCircleToPath(path: opentype.Path, cx: number, cy: number, r: number) {
  const k = r * 0.55228475; // Cubic bezier constant for circular arc
  path.moveTo(cx + r, cy);
  path.bezierCurveTo(cx + r, cy + k, cx + k, cy + r, cx, cy + r);
  path.bezierCurveTo(cx - k, cy + r, cx - r, cy + k, cx - r, cy);
  path.bezierCurveTo(cx - r, cy - k, cx - k, cy - r, cx, cy - r);
  path.bezierCurveTo(cx + k, cy - r, cx + r, cy - k, cx + r, cy);
  path.close();
}

/**
 * Converts a sequence of strokes on canvas into an OpenType Path
 */
export function strokesToOpenTypePath(
  strokes: Stroke[],
  strokeWidth: number,
  scale: number,
  minX: number,
  leftBearing: number
): opentype.Path {
  const path = new opentype.Path();
  const radius = (strokeWidth / 2) * scale;

  // Coordinate transform helpers
  const toFontX = (x: number) => (x - minX) * scale + leftBearing;
  const toFontY = (y: number) => (CANVAS_BASELINE - y) * scale;

  for (const rawStroke of strokes) {
    if (!rawStroke || rawStroke.length === 0) continue;

    // Filter consecutive duplicate / very close points
    const pts: Point[] = [];
    for (const p of rawStroke) {
      if (pts.length === 0) {
        pts.push(p);
      } else {
        const last = pts[pts.length - 1];
        const distSq = (p.x - last.x) ** 2 + (p.y - last.y) ** 2;
        if (distSq >= 2) {
          pts.push(p);
        }
      }
    }

    if (pts.length === 0) continue;

    // Single point (dot / point)
    if (pts.length === 1) {
      const fx = toFontX(pts[0].x);
      const fy = toFontY(pts[0].y);
      addCircleToPath(path, fx, fy, Math.max(radius, 12));
      continue;
    }

    // Polyline stroke -> Closed polygon ribbon with round caps
    const n = pts.length;
    const fontPts = pts.map(p => ({ x: toFontX(p.x), y: toFontY(p.y) }));

    const leftBoundary: Point[] = [];
    const rightBoundary: Point[] = [];

    for (let i = 0; i < n; i++) {
      let dx = 0;
      let dy = 0;

      if (i === 0) {
        dx = fontPts[1].x - fontPts[0].x;
        dy = fontPts[1].y - fontPts[0].y;
      } else if (i === n - 1) {
        dx = fontPts[n - 1].x - fontPts[n - 2].x;
        dy = fontPts[n - 1].y - fontPts[n - 2].y;
      } else {
        dx = fontPts[i + 1].x - fontPts[i - 1].x;
        dy = fontPts[i + 1].y - fontPts[i - 1].y;
      }

      const len = Math.hypot(dx, dy) || 1;
      const nx = -dy / len;
      const ny = dx / len;

      const p = fontPts[i];
      leftBoundary.push({ x: p.x + nx * radius, y: p.y + ny * radius });
      rightBoundary.push({ x: p.x - nx * radius, y: p.y - ny * radius });
    }

    // Begin path outline: start cap -> left side -> end cap -> right side -> close
    path.moveTo(leftBoundary[0].x, leftBoundary[0].y);

    for (let i = 1; i < leftBoundary.length; i++) {
      path.lineTo(leftBoundary[i].x, leftBoundary[i].y);
    }

    // End cap (semicircle around last point)
    const endCenter = fontPts[n - 1];
    const endRight = rightBoundary[n - 1];
    
    // Middle point of end semicircle
    const endDirX = (fontPts[n - 1].x - fontPts[n - 2].x);
    const endDirY = (fontPts[n - 1].y - fontPts[n - 2].y);
    const endLen = Math.hypot(endDirX, endDirY) || 1;
    const endTipX = endCenter.x + (endDirX / endLen) * radius;
    const endTipY = endCenter.y + (endDirY / endLen) * radius;

    path.bezierCurveTo(endTipX, endTipY, endTipX, endTipY, endRight.x, endRight.y);

    // Return along right boundary
    for (let i = rightBoundary.length - 1; i >= 0; i--) {
      path.lineTo(rightBoundary[i].x, rightBoundary[i].y);
    }

    // Start cap (semicircle around first point back to leftBoundary[0])
    const startCenter = fontPts[0];
    const startDirX = (fontPts[0].x - fontPts[1].x);
    const startDirY = (fontPts[0].y - fontPts[1].y);
    const startLen = Math.hypot(startDirX, startDirY) || 1;
    const startTipX = startCenter.x + (startDirX / startLen) * radius;
    const startTipY = startCenter.y + (startDirY / startLen) * radius;

    path.bezierCurveTo(startTipX, startTipY, startTipX, startTipY, leftBoundary[0].x, leftBoundary[0].y);

    path.close();
  }

  return path;
}

/**
 * Creates .notdef glyph (a clean empty box)
 */
function createNotdefGlyph(): opentype.Glyph {
  const path = new opentype.Path();
  // Outer rectangle
  path.moveTo(100, 0);
  path.lineTo(100, 700);
  path.lineTo(550, 700);
  path.lineTo(550, 0);
  path.close();

  // Inner cutout
  path.moveTo(150, 50);
  path.lineTo(500, 50);
  path.lineTo(500, 650);
  path.lineTo(150, 650);
  path.close();

  return new opentype.Glyph({
    name: '.notdef',
    unicode: 0,
    advanceWidth: 650,
    path,
  });
}

/**
 * Creates space glyph
 */
function createSpaceGlyph(width = 380): opentype.Glyph {
  return new opentype.Glyph({
    name: 'space',
    unicode: 32,
    advanceWidth: width,
    path: new opentype.Path(),
  });
}

/**
 * Build a full TrueType/OpenType font from recorded characters
 */
export function buildFont(
  characters: Record<string, CharacterData>,
  customSettings?: Partial<FontSettings>
): { font: opentype.Font; arrayBuffer: ArrayBuffer; blobUrl: string } {
  const settings: FontSettings = { ...DEFAULT_SETTINGS, ...customSettings };

  // Calculate target scale from canvas coordinates to Font units
  // Canvas cap height difference is (290 - 120) = 170px.
  // Standard font cap height is around 580 units.
  const scale = 580 / (CANVAS_BASELINE - CANVAS_CAP_HEIGHT);

  const glyphs: opentype.Glyph[] = [createNotdefGlyph(), createSpaceGlyph()];

  for (const charData of Object.values(characters)) {
    if (!charData.strokes || charData.strokes.length === 0) continue;

    // Find bounding box
    let minX = Infinity;
    let maxX = -Infinity;

    for (const stroke of charData.strokes) {
      for (const p of stroke) {
        if (p.x < minX) minX = p.x;
        if (p.x > maxX) maxX = p.x;
      }
    }

    if (!isFinite(minX) || !isFinite(maxX)) continue;

    const leftBearing = 60; // Padding on right/left
    const rightBearing = 60;
    const drawnWidth = (maxX - minX) * scale;
    const advanceWidth = Math.max(320, Math.round(drawnWidth + leftBearing + rightBearing));

    const path = strokesToOpenTypePath(
      charData.strokes,
      settings.strokeWidth,
      scale,
      minX,
      leftBearing
    );

    const glyphName = `uni${charData.unicode.toString(16).toUpperCase().padStart(4, '0')}`;

    const glyph = new opentype.Glyph({
      name: glyphName,
      unicode: charData.unicode,
      advanceWidth: charData.advanceWidth || advanceWidth,
      path,
    });

    glyphs.push(glyph);
  }

  // Generate ASCII font name for metadata
  const font = new opentype.Font({
    familyName: settings.familyName || 'MyHandwriting',
    styleName: settings.styleName || 'Regular',
    unitsPerEm: settings.unitsPerEm,
    ascender: settings.ascender,
    descender: settings.descender,
    glyphs,
  });

  const arrayBuffer = font.toArrayBuffer();
  const blob = new Blob([arrayBuffer], { type: 'font/ttf' });
  const blobUrl = URL.createObjectURL(blob);

  return { font, arrayBuffer, blobUrl };
}

/**
 * Dynamically register a generated font into the browser's Document fonts
 */
export async function registerFontFace(fontFamily: string, arrayBuffer: ArrayBuffer): Promise<void> {
  try {
    const fontFace = new FontFace(fontFamily, arrayBuffer);
    const loadedFace = await fontFace.load();
    document.fonts.add(loadedFace);
  } catch (err) {
    console.error('Failed to load font face into document:', err);
    throw err;
  }
}
