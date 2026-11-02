import type { CharacterDef } from '../types';

export const HEBREW_CHARACTERS: CharacterDef[] = [
  // אותיות עבריות רגילות
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

  // אותיות סופיות
  { id: 'final_kaf', char: 'ך', name: 'כף סופית', unicode: 0x05DA, category: 'final', sampleHint: 'דרך' },
  { id: 'final_mem', char: 'ם', name: 'מם סופית', unicode: 0x05DD, category: 'final', sampleHint: 'שלום' },
  { id: 'final_nun', char: 'ן', name: 'נון סופית', unicode: 0x05DF, category: 'final', sampleHint: 'חלון' },
  { id: 'final_pe', char: 'ף', name: 'פא סופית', unicode: 0x05E3, category: 'final', sampleHint: 'חורף' },
  { id: 'final_tsadi', char: 'ץ', name: 'צדי סופית', unicode: 0x05E5, category: 'final', sampleHint: 'עץ' },

  // ספרות
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

  // סימני פיסוק בסיסיים
  { id: 'dot', char: '.', name: 'נקודה', unicode: 0x2E, category: 'punct' },
  { id: 'comma', char: ',', name: 'פסיק', unicode: 0x2C, category: 'punct' },
  { id: 'exclamation', char: '!', name: 'סימן קריאה', unicode: 0x21, category: 'punct' },
  { id: 'question', char: '?', name: 'סימן שאלה', unicode: 0x3F, category: 'punct' },
  { id: 'hyphen', char: '-', name: 'מקף', unicode: 0x2D, category: 'punct' },
  { id: 'colon', char: ':', name: 'נקודתיים', unicode: 0x3A, category: 'punct' },
  { id: 'quote', char: '"', name: 'גרשיים', unicode: 0x22, category: 'punct' },
  { id: 'apostrophe', char: "'", name: 'גרש', unicode: 0x27, category: 'punct' },
  { id: 'paren_open', char: '(', name: 'סוגר שמאלי', unicode: 0x28, category: 'punct' },
  { id: 'paren_close', char: ')', name: 'סוגר ימני', unicode: 0x29, category: 'punct' },
  { id: 'plus', char: '+', name: 'פלוס', unicode: 0x2B, category: 'punct' },
  { id: 'equals', char: '=', name: 'שווה', unicode: 0x3D, category: 'punct' },
];

export const CATEGORIES = [
  { id: 'all', label: 'הכל' },
  { id: 'hebrew', label: 'אותיות א-ת' },
  { id: 'final', label: 'אותיות סופיות' },
  { id: 'number', label: 'ספרות' },
  { id: 'punct', label: 'פיסוק וסימנים' },
] as const;
