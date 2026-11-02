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

  return nodes;
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
        blocks.push({
          type: 'text',
          content: part,
        });
      }
    }

    // Add newline marker between paragraphs
    if (l < lines.length - 1) {
      blocks.push({ type: 'text', content: '\n' });
    }
  }

  return blocks;
}
