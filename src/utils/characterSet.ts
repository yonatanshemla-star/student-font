import type { CharacterDef } from '../types';

export interface CharacterPackage {
  id: string;
  title: string;
  description: string;
  icon: string;
  count: number;
  isLocked?: boolean;
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
    title: 'ספרות (0-9)',
    description: 'ספרות 0 עד 9 (10 תווים)',
    icon: '123',
    count: 10,
  },
  {
    id: 'punct',
    title: 'סימני פיסוק וסוגריים מורחבים',
    description: 'נקודה, פסיק, סוגריים, מרכאות, מקפים, נקודתיים, פסיק-נקודה (26 תווים)',
    icon: '?!',
    count: 26,
  },
  {
    id: 'english',
    title: 'אנגלית מלאה (A-Z, a-z)',
    description: 'אותיות קטנות וגדולות בלועזית למשתנים וטקסט (52 תווים)',
    icon: 'Aa',
    count: 52,
  },
  {
    id: 'math',
    title: 'מתמטיקה וחשבון להנדסה',
    description: 'כפל, חילוק, אינטגרלים, שורשים, נגזרות, אינסוף, אי-שוויונות וקטורים (38 תווים)',
    icon: '∑∫',
    count: 38,
  },
  {
    id: 'greek',
    title: 'אותיות יווניות להנדסה ופיזיקה',
    description: 'מאמצים, תדרים, זוויות, אוהם, שטף, נצילות (α, β, γ, δ, ε, θ, λ, μ, σ, τ, ω, Ω, Δ...)',
    icon: 'αΩ',
    count: 33,
  },
];

export const ALL_CHARACTERS: CharacterDef[] = [
  // 1. אותיות עבריות רגילות (22)
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

  // 2. אותיות סופיות (5)
  { id: 'final_kaf', char: 'ך', name: 'כף סופית', unicode: 0x05DA, category: 'final', sampleHint: 'דרך' },
  { id: 'final_mem', char: 'ם', name: 'מם סופית', unicode: 0x05DD, category: 'final', sampleHint: 'שלום' },
  { id: 'final_nun', char: 'ן', name: 'נון סופית', unicode: 0x05DF, category: 'final', sampleHint: 'חלון' },
  { id: 'final_pe', char: 'ף', name: 'פא סופית', unicode: 0x05E3, category: 'final', sampleHint: 'חורף' },
  { id: 'final_tsadi', char: 'ץ', name: 'צדי סופית', unicode: 0x05E5, category: 'final', sampleHint: 'עץ' },

  // 3. ספרות (10)
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

  // 4. סימני פיסוק וסוגריים מורחבים (26)
  { id: 'dot', char: '.', name: 'נקודה', unicode: 0x2E, category: 'punct' },
  { id: 'comma', char: ',', name: 'פסיק', unicode: 0x2C, category: 'punct' },
  { id: 'exclamation', char: '!', name: 'סימן קריאה', unicode: 0x21, category: 'punct' },
  { id: 'question', char: '?', name: 'סימן שאלה', unicode: 0x3F, category: 'punct' },
  { id: 'colon', char: ':', name: 'נקודתיים', unicode: 0x3A, category: 'punct' },
  { id: 'semicolon', char: ';', name: 'נקודה פסיק', unicode: 0x3B, category: 'punct' },
  { id: 'hyphen', char: '-', name: 'מקף', unicode: 0x2D, category: 'punct' },
  { id: 'underscore', char: '_', name: 'קו תחתון', unicode: 0x5F, category: 'punct' },
  { id: 'quote', char: '"', name: 'גרשיים', unicode: 0x22, category: 'punct' },
  { id: 'apostrophe', char: "'", name: 'גרש', unicode: 0x27, category: 'punct' },
  { id: 'slash', char: '/', name: 'לוכסן', unicode: 0x2F, category: 'punct' },
  { id: 'backslash', char: '\\', name: 'לוכסן שמאלי', unicode: 0x5C, category: 'punct' },
  { id: 'pipe', char: '|', name: 'קו ישר (ערך מוחלט)', unicode: 0x7C, category: 'punct' },
  { id: 'paren_open', char: '(', name: 'סוגר פותח', unicode: 0x28, category: 'punct' },
  { id: 'paren_close', char: ')', name: 'סוגר סוגר', unicode: 0x29, category: 'punct' },
  { id: 'bracket_open', char: '[', name: 'סוגר מרובע פותח', unicode: 0x5B, category: 'punct' },
  { id: 'bracket_close', char: ']', name: 'סוגר מרובע סוגר', unicode: 0x5D, category: 'punct' },
  { id: 'brace_open', char: '{', name: 'סוגר מסולסל פותח', unicode: 0x7B, category: 'punct' },
  { id: 'brace_close', char: '}', name: 'סוגר מסולסל סוגר', unicode: 0x7D, category: 'punct' },
  { id: 'angle_open', char: '⟨', name: 'סוגר זוויתי פותח', unicode: 0x27E8, category: 'punct' },
  { id: 'angle_close', char: '⟩', name: 'סוגר זוויתי סוגר', unicode: 0x27E9, category: 'punct' },
  { id: 'ellipsis', char: '…', name: 'שלוש נקודות', unicode: 0x2026, category: 'punct' },
  { id: 'at_sign', char: '@', name: 'שטרודל', unicode: 0x40, category: 'punct' },
  { id: 'hash', char: '#', name: 'סולמית', unicode: 0x23, category: 'punct' },
  { id: 'percent', char: '%', name: 'אחוז', unicode: 0x25, category: 'punct' },
  { id: 'ampersand', char: '&', name: 'וגם (&)', unicode: 0x26, category: 'punct' },

  // 5. מתמטיקה וחשבון להנדסה (38)
  { id: 'math_plus', char: '+', name: 'חיבור (+)', unicode: 0x2B, category: 'math' },
  { id: 'math_minus', char: '−', name: 'חיסור (−)', unicode: 0x2212, category: 'math' },
  { id: 'math_times', char: '×', name: 'כפל (×)', unicode: 0x00D7, category: 'math' },
  { id: 'math_cdot', char: '•', name: 'כפל סקלרי / נקודה (•)', unicode: 0x2022, category: 'math' },
  { id: 'math_div', char: '÷', name: 'חילוק (÷)', unicode: 0x00F7, category: 'math' },
  { id: 'math_equal', char: '=', name: 'שווה (=)', unicode: 0x3D, category: 'math' },
  { id: 'math_pm', char: '±', name: 'פלוס-מינוס (±)', unicode: 0x00B1, category: 'math' },
  { id: 'math_mp', char: '∓', name: 'מינוס-פלוס (∓)', unicode: 0x2213, category: 'math' },
  { id: 'math_neq', char: '≠', name: 'שונה (≠)', unicode: 0x2260, category: 'math' },
  { id: 'math_lt', char: '<', name: 'קטן מ- (<)', unicode: 0x3C, category: 'math' },
  { id: 'math_gt', char: '>', name: 'גדול מ- (>)', unicode: 0x3E, category: 'math' },
  { id: 'math_leq', char: '≤', name: 'קטן שווה (≤)', unicode: 0x2264, category: 'math' },
  { id: 'math_geq', char: '≥', name: 'גדול שווה (≥)', unicode: 0x2265, category: 'math' },
  { id: 'math_approx', char: '≈', name: 'בקירוב (≈)', unicode: 0x2248, category: 'math' },
  { id: 'math_equiv', char: '≡', name: 'זהותי / שקול (≡)', unicode: 0x2261, category: 'math' },
  { id: 'math_prop', char: '∝', name: 'פרופורציונלי (∝)', unicode: 0x221D, category: 'math' },
  { id: 'math_ll', char: '≪', name: 'קטן בהרבה (≪)', unicode: 0x226A, category: 'math' },
  { id: 'math_gg', char: '≫', name: 'גדול בהרבה (≫)', unicode: 0x226B, category: 'math' },
  { id: 'math_sum', char: '∑', name: 'סכום סיגמא (∑)', unicode: 0x2211, category: 'math' },
  { id: 'math_prod', char: '∏', name: 'מכפלה פאי (∏)', unicode: 0x220F, category: 'math' },
  { id: 'math_int', char: '∫', name: 'אינטגרל (∫)', unicode: 0x222B, category: 'math' },
  { id: 'math_iint', char: '∬', name: 'אינטגרל כפול (∬)', unicode: 0x222C, category: 'math' },
  { id: 'math_iiint', char: '∭', name: 'אינטגרל משולש (∭)', unicode: 0x222D, category: 'math' },
  { id: 'math_oint', char: '∮', name: 'אינטגרל מסלולי סגור (∮)', unicode: 0x222E, category: 'math' },
  { id: 'math_sqrt', char: '√', name: 'שורש (√)', unicode: 0x221A, category: 'math' },
  { id: 'math_cbrt', char: '∛', name: 'שורש שלישי (∛)', unicode: 0x221B, category: 'math' },
  { id: 'math_partial', char: '∂', name: 'נגזרת חלקית (∂)', unicode: 0x2202, category: 'math' },
  { id: 'math_nabla', char: '∇', name: 'נבלה / גרדיאנט (∇)', unicode: 0x2207, category: 'math' },
  { id: 'math_infty', char: '∞', name: 'אינסוף (∞)', unicode: 0x221E, category: 'math' },
  { id: 'math_prime', char: '′', name: 'תג נגזרת (′)', unicode: 0x2032, category: 'math' },
  { id: 'math_dprime', char: '″', name: 'תגיים נגזרת שנייה (″)', unicode: 0x2033, category: 'math' },
  { id: 'math_in', char: '∈', name: 'שייך (∈)', unicode: 0x2208, category: 'math' },
  { id: 'math_notin', char: '∉', name: 'לא שייך (∉)', unicode: 0x2209, category: 'math' },
  { id: 'math_to', char: '→', name: 'שואף ל- / חץ (→)', unicode: 0x2192, category: 'math' },
  { id: 'math_implies', char: '⇒', name: 'גורר (⇒)', unicode: 0x21D2, category: 'math' },
  { id: 'math_iff', char: '⇔', name: 'אם ורק אם (⇔)', unicode: 0x21D4, category: 'math' },
  { id: 'math_deg', char: '°', name: 'מעלות (°)', unicode: 0x00B0, category: 'math' },
  { id: 'math_angle', char: '∠', name: 'זווית (∠)', unicode: 0x2220, category: 'math' },

  // 6. אותיות יווניות להנדסה ופיזיקה (33)
  { id: 'gr_alpha', char: 'α', name: 'אלפא (תאוצה זוויתית/התפשטות)', unicode: 0x03B1, category: 'greek' },
  { id: 'gr_beta', char: 'β', name: 'בטא (זווית/מקדם)', unicode: 0x03B2, category: 'greek' },
  { id: 'gr_gamma', char: 'γ', name: 'גמא (קיבול חום/עיבור גזירה)', unicode: 0x03B3, category: 'greek' },
  { id: 'gr_delta', char: 'δ', name: 'דלתא (שקיעה/דלתא דיראק)', unicode: 0x03B4, category: 'greek' },
  { id: 'gr_epsilon', char: 'ε', name: 'אפסילון (עיבור/מקדם דיאלקטרי)', unicode: 0x03B5, category: 'greek' },
  { id: 'gr_zeta', char: 'ζ', name: 'זטא (מקדם ריסון בבקרה)', unicode: 0x03B6, category: 'greek' },
  { id: 'gr_eta', char: 'η', name: 'אטא (נצילות/צמיגות)', unicode: 0x03B7, category: 'greek' },
  { id: 'gr_theta', char: 'θ', name: 'תטא (זווית/טמפרטורה)', unicode: 0x03B8, category: 'greek' },
  { id: 'gr_kappa', char: 'κ', name: 'קפא (מוליכות תרמית/עקמומיות)', unicode: 0x03BA, category: 'greek' },
  { id: 'gr_lambda', char: 'λ', name: 'למדא (אורך גל/ערך עצמי)', unicode: 0x03BB, category: 'greek' },
  { id: 'gr_mu', char: 'μ', name: 'מיו (חיכוך/מיקרו/פרמאביליות)', unicode: 0x03BC, category: 'greek' },
  { id: 'gr_nu', char: 'ν', name: 'נו (יחס פואסון/תדר)', unicode: 0x03BD, category: 'greek' },
  { id: 'gr_xi', char: 'ξ', name: 'קסי (משתנה מצב)', unicode: 0x03BE, category: 'greek' },
  { id: 'gr_pi', char: 'π', name: 'פאי (3.14159)', unicode: 0x03C0, category: 'greek' },
  { id: 'gr_rho', char: 'ρ', name: 'רו (צפיפות/התנגדות סגולית)', unicode: 0x03C1, category: 'greek' },
  { id: 'gr_sigma', char: 'σ', name: 'סיגמא (מאמץ נורמלי/מוליכות)', unicode: 0x03C3, category: 'greek' },
  { id: 'gr_tau', char: 'τ', name: 'טאו (מאמץ גזירה/מומנט/קבוע זמן)', unicode: 0x03C4, category: 'greek' },
  { id: 'gr_phi', char: 'φ', name: 'פי (הפרש מופע/פוטנציאל)', unicode: 0x03C6, category: 'greek' },
  { id: 'gr_chi', char: 'χ', name: 'כי (סוספטיביליות)', unicode: 0x03C7, category: 'greek' },
  { id: 'gr_psi', char: 'ψ', name: 'פסי (פונקציית גל)', unicode: 0x03C8, category: 'greek' },
  { id: 'gr_omega', char: 'ω', name: 'אומגה (מהירות/תדר זוויתי rad/s)', unicode: 0x03C9, category: 'greek' },
  { id: 'gr_Gamma', char: 'Γ', name: 'גמא גדולה (סירקולציה/מומנט)', unicode: 0x0393, category: 'greek' },
  { id: 'gr_Delta', char: 'Δ', name: 'דלתא גדולה (הפרש/לפלסיאן)', unicode: 0x0394, category: 'greek' },
  { id: 'gr_Theta', char: 'Θ', name: 'תטא גדולה (טמפרטורה)', unicode: 0x0398, category: 'greek' },
  { id: 'gr_Lambda', char: 'Λ', name: 'למדא גדולה (מטריצת ערכים עצמיים)', unicode: 0x039B, category: 'greek' },
  { id: 'gr_Xi', char: 'Ξ', name: 'קסי גדולה', unicode: 0x039E, category: 'greek' },
  { id: 'gr_Pi', char: 'Π', name: 'פאי גדולה (מכפלה)', unicode: 0x03A0, category: 'greek' },
  { id: 'gr_Sigma', char: 'Σ', name: 'סיגמא גדולה (סכום)', unicode: 0x03A3, category: 'greek' },
  { id: 'gr_Phi', char: 'Φ', name: 'פי גדולה (שטף מגנטי/חשמלי)', unicode: 0x03A6, category: 'greek' },
  { id: 'gr_Psi', char: 'Ψ', name: 'פסי גדולה (פוטנציאל זרימה)', unicode: 0x03A8, category: 'greek' },
  { id: 'gr_Omega', char: 'Ω', name: 'אומגה גדולה (התנגדות אוהם Ohm)', unicode: 0x03A9, category: 'greek' },

  // 7. אנגלית מלאה (52: a-z, A-Z)
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

// Backwards compatibility alias
export const HEBREW_CHARACTERS = ALL_CHARACTERS;

// Helper to filter characters based on active packages
export function getActiveCharacters(enabledPackageIds: string[]): CharacterDef[] {
  return ALL_CHARACTERS.filter(c => enabledPackageIds.includes(c.category));
}
