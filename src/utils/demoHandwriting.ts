import type { CharacterData, Stroke } from '../types';
import { HEBREW_CHARACTERS } from './characterSet';

// Helper to smooth / interpolate a few points
function line(fromX: number, fromY: number, toX: number, toY: number, steps = 12): Stroke {
  const stroke: Stroke = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    // Add tiny human wobble
    const wobbleX = Math.sin(t * Math.PI) * ((i % 3) - 1) * 0.8;
    const wobbleY = Math.cos(t * Math.PI) * ((i % 2) - 0.5) * 0.8;
    stroke.push({
      x: fromX + (toX - fromX) * t + wobbleX,
      y: fromY + (toY - fromY) * t + wobbleY,
      pressure: 0.5 + Math.sin(t * Math.PI) * 0.2,
    });
  }
  return stroke;
}

function curve(
  p0: [number, number],
  p1: [number, number],
  p2: [number, number],
  steps = 18
): Stroke {
  const stroke: Stroke = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const inv = 1 - t;
    const x = inv * inv * p0[0] + 2 * inv * t * p1[0] + t * t * p2[0];
    const y = inv * inv * p0[1] + 2 * inv * t * p1[1] + t * t * p2[1];
    stroke.push({
      x,
      y,
      pressure: 0.5 + Math.sin(t * Math.PI) * 0.25,
    });
  }
  return stroke;
}

export function generateDemoCharacters(): Record<string, CharacterData> {
  const now = Date.now();
  const demo: Record<string, CharacterData> = {};

  const add = (id: string, strokes: Stroke[]) => {
    const def = HEBREW_CHARACTERS.find(c => c.id === id);
    if (!def) return;
    demo[id] = {
      char: def.char,
      unicode: def.unicode,
      strokes,
      updatedAt: now,
    };
  };

  // א
  add('aleph', [
    line(265, 135, 135, 285),
    line(140, 140, 200, 205),
    line(200, 205, 265, 285),
  ]);

  // ב
  add('bet', [
    curve([135, 145], [260, 135], [260, 200]),
    curve([260, 200], [265, 285], [125, 285]),
  ]);

  // ג
  add('gimel', [
    curve([250, 135], [235, 210], [225, 285]),
    line(230, 225, 270, 285),
  ]);

  // ד
  add('dalet', [
    line(135, 140, 260, 140),
    line(260, 140, 255, 285),
  ]);

  // ה
  add('he', [
    line(135, 140, 260, 140),
    line(260, 140, 255, 285),
    line(160, 195, 160, 285),
  ]);

  // ו
  add('vav', [
    line(210, 135, 205, 285),
  ]);

  // ז
  add('zayin', [
    line(160, 135, 240, 135),
    line(215, 135, 190, 285),
  ]);

  // ח
  add('het', [
    line(150, 285, 150, 140),
    line(150, 140, 250, 140),
    line(250, 140, 250, 285),
  ]);

  // ט
  add('tet', [
    curve([160, 150], [145, 285], [205, 285]),
    curve([205, 285], [255, 285], [255, 185]),
    line(255, 185, 210, 185),
  ]);

  // י
  add('yod', [
    curve([210, 135], [220, 160], [205, 185]),
  ]);

  // כ
  add('kaf', [
    curve([245, 140], [145, 140], [145, 215]),
    curve([145, 215], [145, 285], [245, 285]),
  ]);

  // ל
  add('lamed', [
    line(205, 60, 200, 185),
    line(200, 185, 255, 185),
    curve([255, 185], [255, 285], [150, 285]),
  ]);

  // מ
  add('mem', [
    curve([150, 160], [245, 135], [250, 285]),
    line(250, 285, 145, 285),
    line(145, 285, 145, 190),
  ]);

  // נ
  add('nun', [
    line(235, 140, 230, 285),
    line(230, 285, 155, 285),
  ]);

  // ס
  add('samekh', [
    curve([200, 135], [265, 210], [200, 285]),
    curve([200, 285], [135, 210], [200, 135]),
  ]);

  // ע
  add('ayin', [
    curve([145, 140], [180, 220], [215, 285]),
    curve([255, 135], [220, 210], [185, 235]),
  ]);

  // פ
  add('pe', [
    curve([245, 140], [150, 140], [150, 285]),
    line(150, 285, 245, 285),
    line(205, 140, 205, 205),
  ]);

  // צ
  add('tsadi', [
    curve([170, 140], [245, 240], [160, 285]),
    line(245, 175, 205, 220),
  ]);

  // ק
  add('qof', [
    line(160, 140, 245, 140),
    line(245, 140, 245, 285),
    line(175, 165, 175, 360),
  ]);

  // ר
  add('resh', [
    line(145, 140, 250, 140),
    line(250, 140, 245, 285),
  ]);

  // ש
  add('shin', [
    curve([140, 140], [145, 285], [200, 285]),
    curve([200, 285], [255, 285], [255, 140]),
    line(198, 140, 198, 285),
  ]);

  // ת
  add('tav', [
    line(145, 140, 250, 140),
    line(250, 140, 245, 285),
    curve([145, 140], [140, 220], [125, 285]),
  ]);

  // סופיות
  add('final_kaf', [
    line(155, 140, 245, 140),
    line(245, 140, 245, 360),
  ]);

  add('final_mem', [
    line(145, 140, 250, 140),
    line(250, 140, 250, 285),
    line(250, 285, 145, 285),
    line(145, 285, 145, 140),
  ]);

  add('final_nun', [
    line(205, 135, 200, 360),
  ]);

  add('final_pe', [
    line(245, 140, 160, 140),
    line(160, 140, 160, 360),
    line(210, 140, 210, 205),
  ]);

  add('final_tsadi', [
    curve([165, 140], [210, 220], [235, 360]),
    line(240, 175, 195, 235),
  ]);

  // ספרות
  add('num_0', [
    curve([200, 135], [255, 210], [200, 285]),
    curve([200, 285], [145, 210], [200, 135]),
  ]);
  add('num_1', [
    line(175, 165, 210, 135),
    line(210, 135, 205, 285),
    line(165, 285, 245, 285),
  ]);
  add('num_2', [
    curve([155, 165], [210, 125], [245, 165]),
    line(245, 165, 155, 285),
    line(155, 285, 250, 285),
  ]);
  add('num_3', [
    curve([155, 150], [245, 150], [205, 205]),
    curve([205, 205], [255, 230], [155, 285]),
  ]);
  add('num_4', [
    line(225, 135, 145, 225),
    line(145, 225, 255, 225),
    line(225, 180, 225, 285),
  ]);
  add('num_5', [
    line(240, 140, 160, 140),
    line(160, 140, 155, 200),
    curve([155, 200], [255, 195], [155, 285]),
  ]);

  // סימנים
  add('dot', [
    [{ x: 200, y: 285 }],
  ]);
  add('comma', [
    curve([200, 280], [195, 305], [180, 315]),
  ]);
  add('exclamation', [
    line(200, 135, 200, 245),
    [{ x: 200, y: 285 }],
  ]);
  add('question', [
    curve([155, 160], [220, 125], [235, 175]),
    curve([235, 175], [215, 215], [200, 245]),
    [{ x: 200, y: 285 }],
  ]);
  add('hyphen', [
    line(150, 215, 250, 215),
  ]);
  add('colon', [
    [{ x: 200, y: 195 }],
    [{ x: 200, y: 285 }],
  ]);
  add('quote', [
    line(185, 135, 185, 165),
    line(215, 135, 215, 165),
  ]);

  return demo;
}
