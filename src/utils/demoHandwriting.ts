import type { CharacterDef, CharacterData, Stroke } from '../types';
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

function createVariant(baseStrokes: Stroke[], slant: number, scaleX: number, scaleY: number, wobbleSeed: number): Stroke[] {
  const cx = 200;
  const cy = 200;
  return baseStrokes.map(stroke => {
    return stroke.map((p, i) => {
      const dx = (p.x - cx) * scaleX;
      const dy = (p.y - cy) * scaleY;
      const slantedX = dx + dy * slant;
      const wobble = Math.sin((i + wobbleSeed) * 0.9) * 1.6;
      const pressWobble = ((i % 4) - 1.5) * 0.08;
      return {
        x: cx + slantedX + wobble,
        y: cy + dy + wobble * 0.4,
        pressure: Math.max(0.25, Math.min(0.9, (p.pressure || 0.5) + pressWobble)),
      };
    });
  });
}

export function generateDemoCharacters(): Record<string, CharacterData> {
  const now = Date.now();
  const demo: Record<string, CharacterData> = {};

  const add = (id: string, baseStrokes: Stroke[]) => {
    const def = HEBREW_CHARACTERS.find((c: CharacterDef) => c.id === id);
    if (!def) return;

    const var1 = baseStrokes;
    const var2 = createVariant(baseStrokes, 0.06, 0.97, 1.02, 3);
    const var3 = createVariant(baseStrokes, -0.05, 1.03, 0.98, 7);

    demo[id] = {
      char: def.char,
      unicode: def.unicode,
      strokes: var1,
      variations: [var1, var2, var3],
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
  add('num_6', [
    curve([230, 145], [145, 210], [155, 285]),
    curve([155, 285], [245, 285], [240, 215]),
    curve([240, 215], [175, 210], [155, 240]),
  ]);
  add('num_7', [
    line(155, 140, 245, 140),
    line(245, 140, 175, 285),
  ]);
  add('num_8', [
    curve([200, 140], [240, 175], [200, 210]),
    curve([200, 210], [150, 250], [200, 285]),
    curve([200, 285], [250, 250], [200, 210]),
    curve([200, 210], [160, 175], [200, 140]),
  ]);
  add('num_9', [
    curve([200, 210], [150, 210], [155, 150]),
    curve([155, 150], [240, 145], [240, 210]),
    line(240, 145, 185, 285),
  ]);

  // סימנים נוספים
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
  add('semicolon', [
    [{ x: 200, y: 195 }],
    curve([200, 280], [195, 305], [180, 315]),
  ]);
  add('paren_open', [
    curve([230, 130], [170, 210], [230, 290]),
  ]);
  add('paren_close', [
    curve([170, 130], [230, 210], [170, 290]),
  ]);
  add('bracket_open', [
    line(230, 135, 170, 135),
    line(170, 135, 170, 285),
    line(170, 285, 230, 285),
  ]);
  add('bracket_close', [
    line(170, 135, 230, 135),
    line(230, 135, 230, 285),
    line(230, 285, 170, 285),
  ]);
  add('slash', [
    line(160, 285, 240, 135),
  ]);
  add('pipe', [
    line(200, 125, 200, 295),
  ]);

  // מתמטיקה ופיזיקה להנדסה
  add('math_plus', [
    line(200, 160, 200, 260),
    line(150, 210, 250, 210),
  ]);
  add('math_minus', [
    line(150, 210, 250, 210),
  ]);
  add('math_times', [
    line(160, 170, 240, 250),
    line(240, 170, 160, 250),
  ]);
  add('math_cdot', [
    [{ x: 200, y: 210 }],
  ]);
  add('math_div', [
    line(150, 210, 250, 210),
    [{ x: 200, y: 175 }],
    [{ x: 200, y: 245 }],
  ]);
  add('math_equal', [
    line(150, 195, 250, 195),
    line(150, 225, 250, 225),
  ]);
  add('math_pm', [
    line(200, 150, 200, 225),
    line(160, 185, 240, 185),
    line(160, 250, 240, 250),
  ]);
  add('math_neq', [
    line(150, 195, 250, 195),
    line(150, 225, 250, 225),
    line(235, 160, 165, 260),
  ]);
  add('math_lt', [
    line(240, 160, 160, 210),
    line(160, 210, 240, 260),
  ]);
  add('math_gt', [
    line(160, 160, 240, 210),
    line(240, 210, 160, 260),
  ]);
  add('math_leq', [
    line(240, 155, 160, 200),
    line(160, 200, 240, 245),
    line(160, 265, 240, 265),
  ]);
  add('math_geq', [
    line(160, 155, 240, 200),
    line(240, 200, 160, 245),
    line(160, 265, 240, 265),
  ]);
  add('math_sum', [
    line(245, 140, 155, 140),
    line(155, 140, 210, 210),
    line(210, 210, 155, 285),
    line(155, 285, 245, 285),
  ]);
  add('math_int', [
    curve([230, 80], [190, 80], [195, 180]),
    curve([195, 180], [200, 320], [165, 330]),
  ]);
  add('math_sqrt', [
    line(145, 225, 165, 280),
    line(165, 280, 205, 130),
    line(205, 130, 265, 130),
  ]);
  add('math_partial', [
    curve([220, 145], [170, 140], [155, 210]),
    curve([155, 210], [150, 285], [215, 285]),
    curve([215, 285], [245, 240], [215, 195]),
    curve([215, 195], [155, 200], [180, 140]),
  ]);
  add('math_nabla', [
    line(150, 145, 250, 145),
    line(250, 145, 200, 280),
    line(200, 280, 150, 145),
  ]);
  add('math_infty', [
    curve([200, 210], [150, 170], [150, 250]),
    curve([150, 250], [200, 210], [250, 170]),
    curve([250, 170], [250, 250], [200, 210]),
  ]);

  // אותיות יווניות להנדסה ופיזיקה
  add('gr_alpha', [
    curve([245, 165], [155, 210], [155, 260]),
    curve([155, 260], [225, 275], [245, 210]),
    curve([245, 210], [210, 155], [165, 285]),
  ]);
  add('gr_beta', [
    line(165, 140, 165, 360),
    curve([165, 140], [240, 150], [205, 205]),
    curve([205, 205], [250, 230], [165, 285]),
  ]);
  add('gr_gamma', [
    line(155, 140, 200, 230),
    line(245, 140, 200, 230),
    line(200, 230, 200, 360),
  ]);
  add('gr_delta', [
    curve([230, 135], [175, 135], [155, 210]),
    curve([155, 210], [155, 285], [215, 285]),
    curve([215, 285], [240, 230], [200, 195]),
    curve([200, 195], [155, 210], [200, 145]),
  ]);
  add('gr_theta', [
    curve([200, 135], [245, 210], [200, 285]),
    curve([200, 285], [155, 210], [200, 135]),
    line(165, 210, 235, 210),
  ]);
  add('gr_lambda', [
    line(170, 140, 245, 285),
    line(220, 185, 155, 285),
  ]);
  add('gr_mu', [
    line(155, 210, 155, 360),
    curve([155, 210], [160, 285], [210, 285]),
    line(210, 210, 210, 285),
  ]);
  add('gr_pi', [
    line(145, 155, 255, 155),
    line(175, 155, 170, 285),
    line(225, 155, 230, 285),
  ]);
  add('gr_sigma', [
    line(155, 150, 240, 150),
    curve([240, 150], [155, 160], [155, 230]),
    curve([155, 230], [165, 285], [225, 285]),
    curve([225, 285], [245, 250], [235, 215]),
  ]);
  add('gr_tau', [
    line(150, 150, 250, 150),
    curve([200, 150], [200, 260], [225, 280]),
  ]);
  add('gr_omega', [
    curve([150, 220], [175, 285], [200, 220]),
    curve([200, 220], [225, 285], [250, 220]),
  ]);
  add('gr_Delta', [
    line(200, 130, 145, 285),
    line(145, 285, 255, 285),
    line(255, 285, 200, 130),
  ]);
  add('gr_Omega', [
    line(145, 285, 175, 285),
    curve([175, 285], [150, 180], [200, 135]),
    curve([200, 135], [250, 180], [225, 285]),
    line(225, 285, 255, 285),
  ]);

  // אנגלית (משתנים שכיחים בהנדסה)
  add('en_lower_x', [
    line(160, 160, 240, 285),
    line(240, 160, 160, 285),
  ]);
  add('en_lower_y', [
    line(160, 160, 200, 235),
    line(240, 160, 175, 360),
  ]);
  add('en_lower_z', [
    line(160, 160, 240, 160),
    line(240, 160, 160, 285),
    line(160, 285, 240, 285),
  ]);
  add('en_lower_t', [
    curve([200, 130], [200, 265], [230, 285]),
    line(165, 185, 235, 185),
  ]);
  add('en_lower_a', [
    curve([235, 195], [160, 165], [160, 250]),
    curve([160, 250], [170, 285], [235, 285]),
    line(235, 165, 235, 285),
  ]);
  add('en_lower_b', [
    line(160, 120, 160, 285),
    curve([160, 175], [245, 185], [240, 255]),
    curve([240, 255], [210, 285], [160, 285]),
  ]);
  add('en_lower_c', [
    curve([240, 175], [155, 180], [155, 265]),
    curve([155, 265], [195, 285], [240, 275]),
  ]);
  add('en_upper_A', [
    line(200, 120, 145, 285),
    line(200, 120, 255, 285),
    line(165, 225, 235, 225),
  ]);
  add('en_upper_B', [
    line(155, 125, 155, 285),
    curve([155, 125], [245, 135], [205, 205]),
    curve([205, 205], [250, 230], [155, 285]),
  ]);
  add('en_upper_C', [
    curve([250, 145], [145, 150], [145, 260]),
    curve([145, 260], [190, 285], [250, 270]),
  ]);
  add('en_upper_E', [
    line(155, 125, 155, 285),
    line(155, 125, 245, 125),
    line(155, 205, 230, 205),
    line(155, 285, 245, 285),
  ]);
  add('en_upper_F', [
    line(155, 125, 155, 285),
    line(155, 125, 245, 125),
    line(155, 205, 230, 205),
  ]);
  add('en_upper_M', [
    line(150, 285, 150, 125),
    line(150, 125, 200, 220),
    line(200, 220, 250, 125),
    line(250, 125, 250, 285),
  ]);
  add('en_upper_R', [
    line(155, 125, 155, 285),
    curve([155, 125], [245, 135], [205, 205]),
    line(155, 205, 205, 205),
    line(200, 205, 250, 285),
  ]);
  add('en_upper_T', [
    line(145, 125, 255, 125),
    line(200, 125, 200, 285),
  ]);
  add('en_upper_V', [
    line(150, 125, 200, 285),
    line(200, 285, 250, 125),
  ]);

  return demo;
}
