export type MathASTNode =
  | { type: 'char'; value: string }
  | { type: 'symbol'; symbol: string }
  | { type: 'frac'; num: MathASTNode[]; den: MathASTNode[] }
  | { type: 'sqrt'; body: MathASTNode[]; root?: MathASTNode[] }
  | { type: 'supsub'; base?: MathASTNode[]; sup?: MathASTNode[]; sub?: MathASTNode[] }
  | { type: 'operator'; op: string; lower?: MathASTNode[]; upper?: MathASTNode[] }
  | { type: 'accent'; accent: 'vec' | 'bar' | 'hat' | 'dot' | 'ddot'; body: MathASTNode[] }
  | { type: 'bracket'; left: string; right: string; body: MathASTNode[] }
  | { type: 'matrix'; rows: MathASTNode[][][] }
  | { type: 'space'; width: number };

export interface DocumentBlock {
  type: 'text' | 'inline-math' | 'display-math';
  content: string;
  mathAST?: MathASTNode[];
}

export const GREEK_AND_SYMBOLS: Record<string, string> = {
  alpha: 'α',
  beta: 'β',
  gamma: 'γ',
  delta: 'δ',
  epsilon: 'ε',
  varepsilon: 'ε',
  zeta: 'ζ',
  eta: 'η',
  theta: 'θ',
  vartheta: 'θ',
  iota: 'ι',
  kappa: 'κ',
  lambda: 'λ',
  mu: 'μ',
  nu: 'ν',
  xi: 'ξ',
  pi: 'π',
  rho: 'ρ',
  sigma: 'σ',
  tau: 'τ',
  upsilon: 'υ',
  phi: 'φ',
  varphi: 'φ',
  chi: 'χ',
  psi: 'ψ',
  omega: 'ω',
  Gamma: 'Γ',
  Delta: 'Δ',
  Theta: 'Θ',
  Lambda: 'Λ',
  Xi: 'Ξ',
  Pi: 'Π',
  Sigma: 'Σ',
  Phi: 'Φ',
  Psi: 'Ψ',
  Omega: 'Ω',
  times: '×',
  div: '÷',
  cdot: '•',
  pm: '±',
  mp: '∓',
  neq: '≠',
  ne: '≠',
  leq: '≤',
  le: '≤',
  geq: '≥',
  ge: '≥',
  approx: '≈',
  equiv: '≡',
  infty: '∞',
  partial: '∂',
  nabla: '∇',
  to: '→',
  rightarrow: '→',
  leftarrow: '←',
  Rightarrow: '⇒',
  Leftarrow: '⇐',
  Leftrightarrow: '⇔',
  in: '∈',
  notin: '∉',
  subset: '⊂',
  subseteq: '⊆',
  cup: '∪',
  cap: '∩',
  forall: '∀',
  exists: '∃',
  emptyset: '∅',
  ll: '≪',
  gg: '≫',
  propto: '∝',
  degree: '°',
  circ: '°',
  angle: '∠',
  prime: '′',
  dprime: '″',
  iint: '∬',
  iiint: '∭',
  oint: '∮',
  perp: '⊥',
  parallel: '∥',
  implies: '⇒',
  iff: '⇔',
};

export const SUPERSCRIPT_MAP: Record<string, string> = {
  '⁰': '0',
  '¹': '1',
  '²': '2',
  '³': '3',
  '⁴': '4',
  '⁵': '5',
  '⁶': '6',
  '⁷': '7',
  '⁸': '8',
  '⁹': '9',
  '⁺': '+',
  '⁻': '-',
  'ⁿ': 'n',
  'ⁱ': 'i',
};

export const SUBSCRIPT_MAP: Record<string, string> = {
  '₀': '0',
  '₁': '1',
  '₂': '2',
  '₃': '3',
  '₄': '4',
  '₅': '5',
  '₆': '6',
  '₇': '7',
  '₈': '8',
  '₉': '9',
  '₊': '+',
  '₋': '-',
};

export const VULGAR_FRACTIONS: Record<string, [string, string]> = {
  '½': ['1', '2'],
  '⅓': ['1', '3'],
  '¼': ['1', '4'],
  '⅔': ['2', '3'],
  '¾': ['3', '4'],
  '⅕': ['1', '5'],
  '⅖': ['2', '5'],
  '⅗': ['3', '5'],
  '⅘': ['4', '5'],
  '⅙': ['1', '6'],
  '⅚': ['5', '6'],
  '⅛': ['1', '8'],
  '⅜': ['3', '8'],
  '⅝': ['5', '8'],
  '⅞': ['7', '8'],
};

/**
 * Tokenize a LaTeX string into basic tokens
 */
class LatexTokenizer {
  private pos = 0;
  private input: string;

  constructor(input: string) {
    this.input = input;
  }

  peek(): string {
    return this.input[this.pos] || '';
  }

  next(): string {
    return this.input[this.pos++] || '';
  }

  eof(): boolean {
    return this.pos >= this.input.length;
  }

  skipWhitespace(): void {
    while (!this.eof() && /\s/.test(this.peek())) {
      this.next();
    }
  }

  readCommand(): string {
    this.next(); // consume '\'
    let cmd = '';
    while (!this.eof() && /[a-zA-Z]/.test(this.peek())) {
      cmd += this.next();
    }
    return cmd;
  }

  readGroup(): string {
    this.skipWhitespace();
    if (this.peek() !== '{') {
      return this.next();
    }
    this.next(); // consume '{'
    let depth = 1;
    let content = '';
    while (!this.eof()) {
      const ch = this.next();
      if (ch === '{') {
        depth++;
        content += ch;
      } else if (ch === '}') {
        depth--;
        if (depth === 0) break;
        content += ch;
      } else {
        content += ch;
      }
    }
    return content;
  }

  readBracketGroup(): string {
    this.skipWhitespace();
    if (this.peek() !== '[') return '';
    this.next(); // consume '['
    let depth = 1;
    let content = '';
    while (!this.eof()) {
      const ch = this.next();
      if (ch === '[') {
        depth++;
        content += ch;
      } else if (ch === ']') {
        depth--;
        if (depth === 0) break;
        content += ch;
      } else {
        content += ch;
      }
    }
    return content;
  }

  readParenthesisGroup(): string {
    this.skipWhitespace();
    if (this.peek() !== '(') return '';
    this.next(); // consume '('
    let depth = 1;
    let content = '';
    while (!this.eof()) {
      const ch = this.next();
      if (ch === '(') {
        depth++;
        content += ch;
      } else if (ch === ')') {
        depth--;
        if (depth === 0) break;
        content += ch;
      } else {
        content += ch;
      }
    }
    return content;
  }
}

/**
 * Recursive Parser from LaTeX string to MathASTNode array
 */
export function parseLatexMath(latex: string): MathASTNode[] {
  const tokenizer = new LatexTokenizer(latex.trim());
  const nodes: MathASTNode[] = [];

  while (!tokenizer.eof()) {
    tokenizer.skipWhitespace();
    if (tokenizer.eof()) break;

    const ch = tokenizer.peek();

    if (ch === '\\') {
      const cmd = tokenizer.readCommand();

      if (cmd === 'frac') {
        const numStr = tokenizer.readGroup();
        const denStr = tokenizer.readGroup();
        nodes.push({
          type: 'frac',
          num: parseLatexMath(numStr),
          den: parseLatexMath(denStr),
        });
      } else if (cmd === 'sqrt') {
        const rootStr = tokenizer.readBracketGroup();
        const bodyStr = tokenizer.readGroup();
        nodes.push({
          type: 'sqrt',
          body: parseLatexMath(bodyStr),
          root: rootStr ? parseLatexMath(rootStr) : undefined,
        });
      } else if (['sum', 'int', 'prod', 'lim', 'iint', 'iiint', 'oint'].includes(cmd)) {
        // Operators with sub/superscripts
        nodes.push({
          type: 'operator',
          op: cmd,
        });
      } else if (['vec', 'bar', 'hat', 'dot', 'ddot'].includes(cmd)) {
        const bodyStr = tokenizer.readGroup();
        nodes.push({
          type: 'accent',
          accent: cmd as any,
          body: parseLatexMath(bodyStr),
        });
      } else if (cmd === 'left') {
        tokenizer.skipWhitespace();
        const leftBracket = tokenizer.next();
        // Read until \right
        let inner = '';
        while (!tokenizer.eof()) {
          if (tokenizer.peek() === '\\') {
            const nextCmd = tokenizer.readCommand();
            if (nextCmd === 'right') {
              break;
            } else {
              inner += '\\' + nextCmd;
            }
          } else {
            inner += tokenizer.next();
          }
        }
        tokenizer.skipWhitespace();
        const rightBracket = tokenizer.next();
        nodes.push({
          type: 'bracket',
          left: leftBracket,
          right: rightBracket,
          body: parseLatexMath(inner),
        });
      } else if (cmd === 'quad' || cmd === 'qquad' || cmd === ',') {
        nodes.push({ type: 'space', width: cmd === 'qquad' ? 24 : cmd === 'quad' ? 14 : 6 });
      } else if (GREEK_AND_SYMBOLS[cmd]) {
        nodes.push({ type: 'symbol', symbol: GREEK_AND_SYMBOLS[cmd] });
      } else if (cmd === 'begin') {
        const env = tokenizer.readGroup();
        if (['matrix', 'pmatrix', 'bmatrix', 'cases'].includes(env)) {
          // Read until \end{env}
          let matrixContent = '';
          while (!tokenizer.eof()) {
            if (tokenizer.peek() === '\\') {
              const subCmd = tokenizer.readCommand();
              if (subCmd === 'end') {
                const endEnv = tokenizer.readGroup();
                if (endEnv === env) break;
                matrixContent += `\\end{${endEnv}}`;
              } else {
                matrixContent += '\\' + subCmd;
              }
            } else {
              matrixContent += tokenizer.next();
            }
          }

          // Parse rows & cols
          const rawRows = matrixContent.split('\\\\');
          const rows: MathASTNode[][][] = rawRows.map(rowStr => {
            const cols = rowStr.split('&');
            return cols.map(c => parseLatexMath(c));
          });

          const bracketMap: Record<string, [string, string]> = {
            pmatrix: ['(', ')'],
            bmatrix: ['[', ']'],
            cases: ['{', ''],
            matrix: ['', ''],
          };

          const [left, right] = bracketMap[env] || ['', ''];
          if (left || right) {
            nodes.push({
              type: 'bracket',
              left,
              right,
              body: [{ type: 'matrix', rows }],
            });
          } else {
            nodes.push({ type: 'matrix', rows });
          }
        } else {
          // generic environment
          nodes.push({ type: 'char', value: env });
        }
      } else {
        // Unknown command -> treat as symbol or text
        nodes.push({ type: 'symbol', symbol: cmd });
      }
    } else if (SUPERSCRIPT_MAP[ch]) {
      // Direct unicode superscript (², ³, ¹, etc.) -> converted to handwritten number in power
      const baseChar = SUPERSCRIPT_MAP[ch];
      tokenizer.next();
      const scriptNodes: MathASTNode[] = [{ type: 'char', value: baseChar }];
      const prev = nodes[nodes.length - 1];

      if (prev && prev.type === 'supsub') {
        prev.sup = scriptNodes;
      } else if (prev) {
        nodes.pop();
        nodes.push({
          type: 'supsub',
          base: [prev],
          sup: scriptNodes,
        });
      } else {
        nodes.push({
          type: 'supsub',
          sup: scriptNodes,
        });
      }
    } else if (SUBSCRIPT_MAP[ch]) {
      // Direct unicode subscript (₀, ₁, ₂, etc.)
      const baseChar = SUBSCRIPT_MAP[ch];
      tokenizer.next();
      const scriptNodes: MathASTNode[] = [{ type: 'char', value: baseChar }];
      const prev = nodes[nodes.length - 1];

      if (prev && prev.type === 'supsub') {
        prev.sub = scriptNodes;
      } else if (prev) {
        nodes.pop();
        nodes.push({
          type: 'supsub',
          base: [prev],
          sub: scriptNodes,
        });
      } else {
        nodes.push({
          type: 'supsub',
          sub: scriptNodes,
        });
      }
    } else if (VULGAR_FRACTIONS[ch]) {
      // Vulgar fractions (½, ⅓, ¼, etc.) -> converted to numerator and denominator
      const [numChar, denChar] = VULGAR_FRACTIONS[ch];
      tokenizer.next();
      nodes.push({
        type: 'frac',
        num: [{ type: 'char', value: numChar }],
        den: [{ type: 'char', value: denChar }],
      });
    } else if (ch === '√') {
      tokenizer.next();
      let bodyStr = '';
      if (tokenizer.peek() === '(') {
        bodyStr = tokenizer.readParenthesisGroup();
      } else if (tokenizer.peek() === '{') {
        bodyStr = tokenizer.readGroup();
      } else {
        bodyStr = tokenizer.next();
      }
      nodes.push({
        type: 'sqrt',
        body: parseLatexMath(bodyStr),
      });
    } else if (ch === '^' || ch === '_') {
      const isSup = ch === '^';
      tokenizer.next(); // consume '^' or '_'
      const scriptContent = tokenizer.readGroup();
      const scriptNodes = parseLatexMath(scriptContent);

      // Check if previous node can take scripts
      const prev = nodes[nodes.length - 1];

      if (prev && prev.type === 'operator') {
        if (isSup) {
          prev.upper = scriptNodes;
        } else {
          prev.lower = scriptNodes;
        }
      } else if (prev && prev.type === 'supsub') {
        if (isSup) {
          prev.sup = scriptNodes;
        } else {
          prev.sub = scriptNodes;
        }
      } else if (prev) {
        // Wrap previous into supsub
        nodes.pop();
        nodes.push({
          type: 'supsub',
          base: [prev],
          sup: isSup ? scriptNodes : undefined,
          sub: !isSup ? scriptNodes : undefined,
        });
      } else {
        nodes.push({
          type: 'supsub',
          sup: isSup ? scriptNodes : undefined,
          sub: !isSup ? scriptNodes : undefined,
        });
      }
    } else if (ch === '{') {
      const group = tokenizer.readGroup();
      nodes.push(...parseLatexMath(group));
    } else {
      nodes.push({ type: 'char', value: tokenizer.next() });
    }
  }

  // Resolve inline division slashes (1/2, a/b, d^2x/dt^2, \omega/2\pi) into fractions
  return resolveInlineFractions(nodes);
}

/**
 * Resolves inline slashes '/' into proper numerator/denominator fraction nodes
 * E.g.: "1/2", "d^2x/dt^2", "\omega/2\pi", "k/m", "(k/m)"
 */
export function resolveInlineFractions(nodes: MathASTNode[]): MathASTNode[] {
  const result: MathASTNode[] = [];

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];

    if (node.type === 'char' && node.value === '/') {
      let numStart = result.length - 1;
      while (numStart >= 0) {
        const prev = result[numStart];
        if (prev.type === 'char' && ['+', '-', '=', '≈', '≤', '≥', '≠', ','].includes(prev.value)) {
          numStart++;
          break;
        }
        if (numStart === 0) break;
        numStart--;
      }

      if (numStart < 0) numStart = 0;

      const numNodes = result.splice(numStart, result.length - numStart);

      const denNodes: MathASTNode[] = [];
      let j = i + 1;

      while (j < nodes.length && nodes[j].type === 'space') {
        j++;
      }

      while (j < nodes.length) {
        const next = nodes[j];
        if (next.type === 'bracket') {
          denNodes.push(next);
          j++;
          break;
        }
        if (next.type === 'char' && ['+', '-', '=', '≈', '≤', '≥', '≠', ','].includes(next.value)) {
          break;
        }
        if (next.type === 'space') {
          const peekNext = nodes[j + 1];
          if (peekNext && peekNext.type === 'char' && ['+', '-', '=', '≈', '≤', '≥', '≠', ','].includes(peekNext.value)) {
            break;
          }
        }
        denNodes.push(next);
        j++;
      }

      if (numNodes.length > 0 && denNodes.length > 0) {
        result.push({
          type: 'frac',
          num: numNodes,
          den: denNodes,
        });
        i = j - 1;
      } else {
        result.push(...numNodes, node);
      }
    } else {
      result.push(node);
    }
  }

  return result;
}

/**
 * Detects if a text token or phrase contains mathematical expressions
 */
export function containsMath(text: string): boolean {
  return /[=^²³¹⁰⁴⁵⁶⁷⁸⁹⁺⁻ⁿ½⅓¼⅔¾√∫∮∑∏∂∇±≈≠≤≥]|(\b[a-zA-Zα-ωΑ-Ω]\b\s*[\^/_])|(\d+\s*[\^/_]\s*\d+)|(\\[a-zA-Z]+)|(\b(sin|cos|tan|cot|lim|log|ln|exp|const)\b)/.test(
    text
  );
}

/**
 * Splits a line without explicit $ signs into alternating Hebrew text and handwritten Math blocks
 */
export function autoSegmentLine(line: string): DocumentBlock[] {
  // If the line has no math indicators at all, return as plain text
  if (!containsMath(line)) {
    return [{ type: 'text', content: line }];
  }

  // Split on Hebrew text segments
  const tokens = line.split(/([\u0590-\u05FF][\u0590-\u05FF0-9\s:,'"-]*[\u0590-\u05FF:])/g);
  const blocks: DocumentBlock[] = [];

  for (const token of tokens) {
    if (!token) continue;

    if (/[\u0590-\u05FF]/.test(token)) {
      blocks.push({ type: 'text', content: token });
    } else {
      const trimmed = token.trim();
      if (trimmed.length > 0 && containsMath(trimmed)) {
        blocks.push({
          type: 'inline-math',
          content: trimmed,
          mathAST: parseLatexMath(trimmed),
        });
      } else if (token.length > 0) {
        blocks.push({ type: 'text', content: token });
      }
    }
  }

  return blocks.length > 0 ? blocks : [{ type: 'text', content: line }];
}

/**
 * Splits document into text, inline math ($...$), and display math ($$...$$)
 */
export function parseDocumentBlocks(docText: string): DocumentBlock[] {
  const blocks: DocumentBlock[] = [];
  const lines = docText.split('\n');

  let inDisplayMath = false;
  let displayMathAcc = '';

  for (let l = 0; l < lines.length; l++) {
    const line = lines[l];

    // Check if line is purely a display math equation: $$ ... $$ or \[ ... \]
    const trimmed = line.trim();

    if (trimmed.startsWith('$$') && trimmed.endsWith('$$') && trimmed.length > 2) {
      const math = trimmed.slice(2, -2).trim();
      blocks.push({
        type: 'display-math',
        content: math,
        mathAST: parseLatexMath(math),
      });
      continue;
    }

    if (trimmed.startsWith('\\[') && trimmed.endsWith('\\]')) {
      const math = trimmed.slice(2, -2).trim();
      blocks.push({
        type: 'display-math',
        content: math,
        mathAST: parseLatexMath(math),
      });
      continue;
    }

    if (trimmed === '$$') {
      if (inDisplayMath) {
        blocks.push({
          type: 'display-math',
          content: displayMathAcc,
          mathAST: parseLatexMath(displayMathAcc),
        });
        displayMathAcc = '';
        inDisplayMath = false;
      } else {
        inDisplayMath = true;
      }
      continue;
    }

    if (inDisplayMath) {
      displayMathAcc += (displayMathAcc ? '\n' : '') + line;
      continue;
    }

    // Normal line: Parse inline math ($...$) vs text
    // E.g: "נחשב את השטח כאשר $f(x) = \frac{1}{x}$ בתחום המוגדר"
    const parts = line.split(/(\$[^\$]+\$)/g);

    for (const part of parts) {
      if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
        const math = part.slice(1, -1);
        blocks.push({
          type: 'inline-math',
          content: math,
          mathAST: parseLatexMath(math),
        });
      } else if (part.length > 0) {
        // Automatically extract math expressions (powers, fractions) even without $
        const subBlocks = autoSegmentLine(part);
        blocks.push(...subBlocks);
      }
    }

    // Add newline marker between paragraphs
    if (l < lines.length - 1) {
      blocks.push({ type: 'text', content: '\n' });
    }
  }

  return blocks;
}
