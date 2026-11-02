export interface Point {
  x: number;
  y: number;
  pressure?: number;
}

export type Stroke = Point[];

export interface CharacterDef {
  id: string;
  char: string;
  name: string;
  unicode: number;
  category: 'hebrew' | 'final' | 'number' | 'punct';
  sampleHint?: string;
  defaultAdvanceWidth?: number;
}

export interface CharacterData {
  char: string;
  unicode: number;
  strokes: Stroke[];
  advanceWidth?: number; // custom width if adjusted
  updatedAt: number;
}

export interface FontSettings {
  familyName: string;
  styleName: string;
  unitsPerEm: number;
  ascender: number;
  descender: number;
  strokeWidth: number;
}
