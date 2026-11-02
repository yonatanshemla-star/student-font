import opentype from 'opentype.js';
import { getStroke } from 'perfect-freehand';
import type { CharacterData, FontSettings, Stroke } from '../types';

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
 * Converts strokes to a silky-smooth OpenType Path using perfect-freehand outline contours
 */
export function strokesToOpenTypePath(
  strokes: Stroke[],
  baseStrokeWidth: number,
  scale: number,
  minX: number,
  leftBearing: number
): opentype.Path {
  const path = new opentype.Path();
  const toFontX = (x: number) => (x - minX) * scale + leftBearing;
  const toFontY = (y: number) => (CANVAS_BASELINE - y) * scale;

  for (const rawStroke of strokes) {
    if (!rawStroke || rawStroke.length === 0) continue;

    const inputPoints = rawStroke.map(p => ({
      x: p.x,
      y: p.y,
      pressure: p.pressure !== undefined ? p.pressure : 0.5,
    }));

    // Generate calligraphic fluid outline
    const outline = getStroke(inputPoints, {
      size: baseStrokeWidth,
      thinning: 0.35,
      smoothing: 0.6,
      streamline: 0.45,
      simulatePressure: false,
      start: { taper: 0, cap: true },
      end: { taper: 0, cap: true },
    });

    if (!outline || outline.length < 3) continue;

    const [fx0, fy0] = outline[0];
    path.moveTo(toFontX(fx0), toFontY(fy0));

    for (let i = 0; i < outline.length; i++) {
      const [x0, y0] = outline[i];
      const [x1, y1] = outline[(i + 1) % outline.length];
      const midX = (x0 + x1) / 2;
      const midY = (y0 + y1) / 2;
      path.quadraticCurveTo(toFontX(x0), toFontY(y0), toFontX(midX), toFontY(midY));
    }
    path.close();
  }

  return path;
}

/**
 * Creates .notdef glyph (a clean empty box)
 */
function createNotdefGlyph(): opentype.Glyph {
  const path = new opentype.Path();
  path.moveTo(100, 0);
  path.lineTo(100, 700);
  path.lineTo(550, 700);
  path.lineTo(550, 0);
  path.close();

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
 * Extract strokes for a specific variation index (0 to 4), with fallback to other variations
 */
export function getStrokesForVariation(charData: CharacterData, variationIndex: number): Stroke[] {
  if (charData.variations && charData.variations.length > 0) {
    if (charData.variations[variationIndex] && charData.variations[variationIndex].length > 0) {
      return charData.variations[variationIndex];
    }
    // Fallback to first available variation
    for (let i = 0; i < charData.variations.length; i++) {
      if (charData.variations[i] && charData.variations[i].length > 0) {
        return charData.variations[i];
      }
    }
  }
  return charData.strokes || [];
}

/**
 * Build a TrueType font for a specific variation index
 */
export function buildFont(
  characters: Record<string, CharacterData>,
  customSettings?: Partial<FontSettings>,
  variationIndex = 0
): { font: opentype.Font; arrayBuffer: ArrayBuffer; blobUrl: string } {
  const settings: FontSettings = { ...DEFAULT_SETTINGS, ...customSettings };
  const scale = 580 / (CANVAS_BASELINE - CANVAS_CAP_HEIGHT);

  const glyphs: opentype.Glyph[] = [createNotdefGlyph(), createSpaceGlyph()];

  for (const charData of Object.values(characters)) {
    const strokes = getStrokesForVariation(charData, variationIndex);
    if (!strokes || strokes.length === 0) continue;

    // Find bounding box
    let minX = Infinity;
    let maxX = -Infinity;

    for (const stroke of strokes) {
      for (const p of stroke) {
        if (p.x < minX) minX = p.x;
        if (p.x > maxX) maxX = p.x;
      }
    }

    if (!isFinite(minX) || !isFinite(maxX)) continue;

    const leftBearing = 60;
    const rightBearing = 60;
    const drawnWidth = (maxX - minX) * scale;
    const advanceWidth = Math.max(320, Math.round(drawnWidth + leftBearing + rightBearing));

    const path = strokesToOpenTypePath(
      strokes,
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
 * Builds and registers all available variations (up to 5) into the browser document fonts
 */
export async function buildAndRegisterAllVariants(
  characters: Record<string, CharacterData>,
  baseFamilyName: string,
  strokeWidth: number,
  maxVariations = 5
): Promise<{ variantCount: number; blobUrls: string[] }> {
  const blobUrls: string[] = [];

  let activeVariants = 1;
  for (const charData of Object.values(characters)) {
    const vCount = charData.variations ? charData.variations.filter(v => v && v.length > 0).length : (charData.strokes?.length ? 1 : 0);
    if (vCount > activeVariants) {
      activeVariants = Math.min(vCount, maxVariations);
    }
  }

  for (let i = 0; i < activeVariants; i++) {
    const variantFamily = i === 0 ? baseFamilyName : `${baseFamilyName}_V${i + 1}`;
    const { arrayBuffer, blobUrl } = buildFont(
      characters,
      { familyName: variantFamily, strokeWidth },
      i
    );
    blobUrls.push(blobUrl);

    await registerFontFace(variantFamily, arrayBuffer);
    if (i === 0) {
      await registerFontFace(`${baseFamilyName}_V1`, arrayBuffer);
    }
  }

  return { variantCount: activeVariants, blobUrls };
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
