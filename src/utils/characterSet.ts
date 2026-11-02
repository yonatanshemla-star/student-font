import type { CharacterDef } from '../types';

export interface CharacterPackage {
  id: string;
  title: string;
  description: string;
  icon: string;
  count: number;
  isLocked?: boolean; // Hebrew is always required
}

export const CHARACTER_PACKAGES: CharacterPackage[] = [
  {
    id: 'hebrew',
    title: 'עברית בסיסית',
    description: 'אותיות א עד ת (22 אותיות)',
    icon: 'א',
    count: 22,
    isLocked: true,
  },
  {
    id: 'final',
    title: 'אותיות סופיות',
    description: 'ך, ם, ן, ף, ץ (5 אותיות)',
    icon: 'ם',
    count: 5,
  },
  {
    id: 'number',
    title: 'ספרות',
    description: 'ספרות 0 עד 9 (10 תווים)',
    icon: '123',
    count: 10,
  },
  {
    id: 'punct',
    title: 'פיסוק וסוגריים',
    description: 'נקודה, פסיק, סימני שאלה, סוגריים וכו׳',
    icon: '?!',
    count: 12,
  },
  {
    id: 'english',
    title: 'אנגלית (A-Z, a-z)',
    description: 'אותיות קטנות וגדולות בלועזית (52 תווים)',
    icon: 'ABC',
    count: 52,
  },
  {
    id: 'math',
    title: 'מתמטיקה ופיזיקה',
    description: 'אינטגרל, סכום, שורש, אינסוף, אי-שוויון, נגזרת חלקית (∑, ∫, √, ∂, ∞...)',
    icon: '∑∫',
    count: 14,
  },
  {
    id: 'greek',
    title: 'אותיות יווניות',
    description: 'אלפא, בטא, גמא, למדא, פאי, דלתא, אומגה (α, β, γ, λ, π, Δ, Ω...)',
    icon: 'αβ',
    count: 18,
  },
];

export const ALL_CHARACTERS: CharacterDef[] = [
  // 1. אותיות עבריות רגילות
  { id: 'aleph', char: 'א', name: 'אלף', unicode: 0x05D0, category: 'hebrew', sampleHint: 'אבא' },
  { id: 'bet', char: 'ב', name: 'בית', unicode: 0x05D1, category: 'hebrew', sampleHint: 'בית' },
  { id: 'gimel', char: 'ג', name: 'גימל', unicode: 0x05D2, category: 'hebrew', sampleHint: 'גמל' },
  { id: 'dalet', char: 'ד', name: 'דלת', unicode: 0x05D3, category: 'hebrew', sampleHint: 'דלת' },
  { id: 'he', char: 'ה', name: 'הא', unicode: 0x05D4, category: 'hebrew', sampleHint: 'הר' },
  { id: 'vav', char: 'ו', name: 'וו', unicode: 0x05D5, category: 'hebrew', sampleHint: 'וילון' },
  { id: 'zayin', char: 'ז', name: 'זין', unicode: 0x05D6, category: 'hebrew', sampleHint: 'זברה' },
  { id: 'het', char: 'ח', name: 'חית', unicode: 0x05D7, category: 'hebrew', sampleHint: 'חתול' },
  { id: 'tet', char: 'ט', name: 'טית', unicode: 0x05D8, category: 'hebrew', sampleHint: 'טלפון' },
  { id: 'yod', char: 'י', name: 'יוד', unicode: 0x05D9, category: 'hebrew', sampleHint: 'ילד' },
  { id: 'kaf', char: 'כ', name: 'כף', unicode: 0x05DB, category: 'hebrew', sampleHint: 'כדור' },
  { id: 'lamed', char: 'ל', name: 'למד', unicode: 0x05DC, category: 'hebrew', sampleHint: 'לימון' },
  { id: 'mem', char: 'מ', name: 'מם', unicode: 0x05DE, category: 'hebrew', sampleHint: 'מים' },
  { id: 'nun', char: 'נ', name: 'נון', unicode: 0x05E0, category: 'hebrew', sampleHint: 'נר' },
  { id: 'samekh', char: 'ס', name: 'סמך', unicode: 0x05E1, category: 'hebrew', sampleHint: 'סוס' },
  { id: 'ayin', char: 'ע', name: 'עין', unicode: 0x05E2, category: 'hebrew', sampleHint: 'עין' },
  { id: 'pe', char: 'פ', name: 'פא', unicode: 0x05E4, category: 'hebrew', sampleHint: 'פרח' },
  { id: 'tsadi', char: 'צ', name: 'צדי', unicode: 0x05E6, category: 'hebrew', sampleHint: 'צב' },
  { id: 'qof', char: 'ק', name: 'קוף', unicode: 0x05E7, category: 'hebrew', sampleHint: 'קוף' },
  { id: 'resh', char: 'ר', name: 'ריש', unicode: 0x05E8, category: 'hebrew', sampleHint: 'ראש' },
  { id: 'shin', char: 'ש', name: 'שין', unicode: 0x05E9, category: 'hebrew', sampleHint: 'שמש' },
  { id: 'tav', char: 'ת', name: 'תו', unicode: 0x05EA, category: 'hebrew', sampleHint: 'תפוח' },

  // 2. אותיות סופיות
  { id: 'final_kaf', char: 'ך', name: 'כף סופית', unicode: 0x05DA, category: 'final', sampleHint: 'דרך' },
  { id: 'final_mem', char: 'ם', name: 'מם סופית', unicode: 0x05DD, category: 'final', sampleHint: 'שלום' },
  { id: 'final_nun', char: 'ן', name: 'נון סופית', unicode: 0x05DF, category: 'final', sampleHint: 'חלון' },
  { id: 'final_pe', char: 'ף', name: 'פא סופית', unicode: 0x05E3, category: 'final', sampleHint: 'חורף' },
  { id: 'final_tsadi', char: 'ץ', name: 'צדי סופית', unicode: 0x05E5, category: 'final', sampleHint: 'עץ' },

  // 3. ספרות
  { id: 'num_0', char: '0', name: '0', unicode: 0x30, category: 'number' },
  { id: 'num_1', char: '1', name: '1', unicode: 0x31, category: 'number' },
  { id: 'num_2', char: '2', name: '2', unicode: 0x32, category: 'number' },
  { id: 'num_3', char: '3', name: '3', unicode: 0x33, category: 'number' },
  { id: 'num_4', char: '4', name: '4', unicode: 0x34, category: 'number' },
  { id: 'num_5', char: '5', name: '5', unicode: 0x35, category: 'number' },
  { id: 'num_6', char: '6', name: '6', unicode: 0x36, category: 'number' },
  { id: 'num_7', char: '7', name: '7', unicode: 0x37, category: 'number' },
  { id: 'num_8', char: '8', name: '8', unicode: 0x38, category: 'number' },
  { id: 'num_9', char: '9', name: '9', unicode: 0x39, category: 'number' },

  // 4. סימני פיסוק
  { id: 'dot', char: '.', name: 'נקודה', unicode: 0x2E, category: 'punct' },
  { id: 'comma', char: ',', name: 'פסיק', unicode: 0x2C, category: 'punct' },
  { id: 'exclamation', char: '!', name: 'סימן קריאה', unicode: 0x21, category: 'punct' },
  { id: 'question', char: '?', name: 'סימן שאלה', unicode: 0x3F, category: 'punct' },
  { id: 'hyphen', char: '-', name: 'מקף', unicode: 0x2D, category: 'punct' },
  { id: 'colon', char: ':', name: 'נקודתיים', unicode: 0x3A, category: 'punct' },
  { id: 'quote', char: '"', name: 'גרשיים', unicode: 0x22, category: 'punct' },
  { id: 'apostrophe', char: "'", name: 'גרש', unicode: 0x27, category: 'punct' },
  { id: 'paren_open', char: '(', name: 'סוגר פותח', unicode: 0x28, category: 'punct' },
  { id: 'paren_close', char: ')', name: 'סוגר סוגר', unicode: 0x29, category: 'punct' },
  { id: 'bracket_open', char: '[', name: 'סוגר מרובע פותח', unicode: 0x5B, category: 'punct' },
  { id: 'bracket_close', char: ']', name: 'סוגר מרובע סוגר', unicode: 0x5D, category: 'punct' },

  // 5. מתמטיקה ופיזיקה
  { id: 'math_plus', char: '+', name: 'פלוס', unicode: 0x2B, category: 'math' },
  { id: 'math_minus', char: '-', name: 'מינוס', unicode: 0x2212, category: 'math' },
  { id: 'math_equal', char: '=', name: 'שווה', unicode: 0x3D, category: 'math' },
  { id: 'math_pm', char: '±', name: 'פלוס מינוס', unicode: 0x00B1, category: 'math' },
  { id: 'math_neq', char: '≠', name: 'לא שווה', unicode: 0x2260, category: 'math' },
  { id: 'math_leq', char: '≤', name: 'קטן שווה', unicode: 0x2264, category: 'math' },
  { id: 'math_geq', char: '≥', name: 'גדול שווה', unicode: 0x2265, category: 'math' },
  { id: 'math_approx', char: '≈', name: 'בקירוב', unicode: 0x2248, category: 'math' },
  { id: 'math_sum', char: '∑', name: 'סכום (סיגמא)', unicode: 0x2211, category: 'math' },
  { id: 'math_int', char: '∫', name: 'אינטגרל', unicode: 0x222B, category: 'math' },
  { id: 'math_sqrt', char: '√', name: 'שורש', unicode: 0x221A, category: 'math' },
  { id: 'math_partial', char: '∂', name: 'נגזרת חלקית', unicode: 0x2202, category: 'math' },
  { id: 'math_nabla', char: '∇', name: 'נבלה / גרדיאנט', unicode: 0x2207, category: 'math' },
  { id: 'math_infty', char: '∞', name: 'אינסוף', unicode: 0x221E, category: 'math' },

  // 6. אותיות יווניות (מדעי הטבע, הנדסה, פיזיקה)
  { id: 'gr_alpha', char: 'α', name: 'אלפא', unicode: 0x03B1, category: 'greek' },
  { id: 'gr_beta', char: 'β', name: 'בטא', unicode: 0x03B2, category: 'greek' },
  { id: 'gr_gamma', char: 'γ', name: 'גמא', unicode: 0x03B3, category: 'greek' },
  { id: 'gr_delta', char: 'δ', name: 'דלתא קטנה', unicode: 0x03B4, category: 'greek' },
  { id: 'gr_epsilon', char: 'ε', name: 'אפסילון', unicode: 0x03B5, category: 'greek' },
  { id: 'gr_theta', char: 'θ', name: 'תטא', unicode: 0x03B8, category: 'greek' },
  { id: 'gr_lambda', char: 'λ', name: 'למדא', unicode: 0x03BB, category: 'greek' },
  { id: 'gr_mu', char: 'μ', name: 'מיו', unicode: 0x03BC, category: 'greek' },
  { id: 'gr_pi', char: 'π', name: 'פאי', unicode: 0x03C0, category: 'greek' },
  { id: 'gr_rho', char: 'ρ', name: 'רו', unicode: 0x03C1, category: 'greek' },
  { id: 'gr_sigma', char: 'σ', name: 'סיגמא', unicode: 0x03C3, category: 'greek' },
  { id: 'gr_tau', char: 'τ', name: 'טאו', unicode: 0x03C4, category: 'greek' },
  { id: 'gr_phi', char: 'φ', name: 'פי', unicode: 0x03C6, category: 'greek' },
  { id: 'gr_psi', char: 'ψ', name: 'פסי', unicode: 0x03C8, category: 'greek' },
  { id: 'gr_omega', char: 'ω', name: 'אומגה קטנה', unicode: 0x03C9, category: 'greek' },
  { id: 'gr_Delta', char: 'Δ', name: 'דלתא גדולה', unicode: 0x0394, category: 'greek' },
  { id: 'gr_Sigma', char: 'Σ', name: 'סיגמא גדולה', unicode: 0x03A3, category: 'greek' },
  { id: 'gr_Omega', char: 'Ω', name: 'אומגה גדולה', unicode: 0x03A9, category: 'greek' },

  // 7. אנגלית (אותיות קטנות וגדולות)
  ...Array.from({ length: 26 }, (_, i) => {
    const char = String.fromCharCode(97 + i); // a-z
    return {
      id: `en_lower_${char}`,
      char,
      name: `אנגלית ${char}`,
      unicode: 97 + i,
      category: 'english' as const,
    };
  }),
  ...Array.from({ length: 26 }, (_, i) => {
    const char = String.fromCharCode(65 + i); // A-Z
    return {
      id: `en_upper_${char}`,
      char,
      name: `אנגלית ${char} (גדולה)`,
      unicode: 65 + i,
      category: 'english' as const,
    };
  }),
];

// Export backwards-compatible alias
export const HEBREW_CHARACTERS = ALL_CHARACTERS;

// Helper to filter characters based on active packages
export function getActiveCharacters(enabledPackageIds: string[]): CharacterDef[] {
  return ALL_CHARACTERS.filter(c => enabledPackageIds.includes(c.category));
}
