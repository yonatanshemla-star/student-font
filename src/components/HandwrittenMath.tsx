import React from 'react';
import type { MathASTNode } from '../utils/latexParser';

interface HandwrittenMathProps {
  nodes: MathASTNode[];
  fontFamily: string;
  variantCount: number;
  fontSize: number;
  inkColor: string;
  isDisplay?: boolean;
}

export const HandwrittenMath: React.FC<HandwrittenMathProps> = ({
  nodes,
  fontFamily,
  variantCount,
  fontSize,
  inkColor,
  isDisplay = false,
}) => {
  return (
    <span
      className={`inline-flex items-center align-middle ${
        isDisplay ? 'justify-center my-3 w-full py-2' : 'mx-1'
      }`}
      style={{
        direction: 'ltr',
        color: inkColor,
        fontSize: `${fontSize}px`,
        lineHeight: 1.1,
      }}
    >
      {nodes.map((node, i) => (
        <MathNodeRenderer
          key={i}
          node={node}
          index={i}
          fontFamily={fontFamily}
          variantCount={variantCount}
          fontSize={fontSize}
          inkColor={inkColor}
          isDisplay={isDisplay}
        />
      ))}
    </span>
  );
};

interface NodeRendererProps {
  node: MathASTNode;
  index: number;
  fontFamily: string;
  variantCount: number;
  fontSize: number;
  inkColor: string;
  isDisplay?: boolean;
}

const MathNodeRenderer: React.FC<NodeRendererProps> = ({
  node,
  index,
  fontFamily,
  variantCount,
  fontSize,
  inkColor,
  isDisplay,
}) => {
  // Deterministic font variant
  const variantIdx = variantCount > 1 ? (index % variantCount) + 1 : 1;
  const charFont = `'${fontFamily}_V${variantIdx}', '${fontFamily}', 'Rubik', sans-serif`;

  switch (node.type) {
    case 'char':
    case 'symbol': {
      const val = node.type === 'char' ? node.value : node.symbol;
      const isOperator = ['+', '-', '=', '≠', '≤', '≥', '≈', '×', '•'].includes(val);

      return (
        <span
          className={isOperator ? 'mx-1' : ''}
          style={{
            fontFamily: charFont,
            display: 'inline-block',
          }}
        >
          {val}
        </span>
      );
    }

    case 'space': {
      return <span style={{ width: `${node.width}px`, display: 'inline-block' }} />;
    }

    // Fraction (\frac{num}{den})
    case 'frac': {
      const subFontSize = Math.max(14, Math.round(fontSize * 0.88));

      return (
        <span className="inline-flex flex-col items-center mx-1.5 align-middle">
          {/* Numerator */}
          <span className="px-1 text-center pb-0.5">
            <HandwrittenMath
              nodes={node.num}
              fontFamily={fontFamily}
              variantCount={variantCount}
              fontSize={subFontSize}
              inkColor={inkColor}
            />
          </span>

          {/* Hand-drawn Wobbly Fraction Bar (SVG) */}
          <svg
            className="w-full overflow-visible"
            height="4"
            style={{ minWidth: '24px' }}
          >
            <path
              d="M 1 2 Q 12 1.2, 24 2.2 T 48 2"
              fill="none"
              stroke={inkColor}
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>

          {/* Denominator */}
          <span className="px-1 text-center pt-0.5">
            <HandwrittenMath
              nodes={node.den}
              fontFamily={fontFamily}
              variantCount={variantCount}
              fontSize={subFontSize}
              inkColor={inkColor}
            />
          </span>
        </span>
      );
    }

    // Square Root (\sqrt[root]{body})
    case 'sqrt': {
      return (
        <span className="inline-flex items-center align-middle mx-1">
          {/* Root index if cube root \sqrt[3]{x} */}
          {node.root && (
            <span
              className="-mr-1 -mt-3 text-[11px] font-bold"
              style={{ fontSize: `${Math.round(fontSize * 0.55)}px` }}
            >
              <HandwrittenMath
                nodes={node.root}
                fontFamily={fontFamily}
                variantCount={variantCount}
                fontSize={Math.round(fontSize * 0.55)}
                inkColor={inkColor}
              />
            </span>
          )}

          {/* SVG Radical symbol with vinculum roof */}
          <span className="relative flex items-center">
            {/* Radical Left Tick */}
            <svg
              className="overflow-visible inline-block -mr-0.5"
              width="14"
              height={fontSize * 1.3}
              viewBox="0 0 14 36"
              preserveAspectRatio="none"
            >
              <path
                d="M 1 22 Q 4 20, 6 30 L 12 2"
                fill="none"
                stroke={inkColor}
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* Inner Body with top overbar */}
            <span
              className="px-1 border-t-2"
              style={{
                borderColor: inkColor,
                paddingTop: '2px',
                marginTop: '-2px',
              }}
            >
              <HandwrittenMath
                nodes={node.body}
                fontFamily={fontFamily}
                variantCount={variantCount}
                fontSize={fontSize}
                inkColor={inkColor}
              />
            </span>
          </span>
        </span>
      );
    }

    // Subscripts and Superscripts (x^2, x_i, x_i^2)
    case 'supsub': {
      const scriptFontSize = Math.max(12, Math.round(fontSize * 0.68));

      return (
        <span className="inline-flex items-baseline relative">
          {node.base && (
            <HandwrittenMath
              nodes={node.base}
              fontFamily={fontFamily}
              variantCount={variantCount}
              fontSize={fontSize}
              inkColor={inkColor}
            />
          )}

          {/* Scripts column */}
          <span className="inline-flex flex-col -space-y-1 align-baseline -mr-0.5">
            {node.sup && (
              <span
                className="transform -translate-y-2.5 font-medium"
                style={{ fontSize: `${scriptFontSize}px` }}
              >
                <HandwrittenMath
                  nodes={node.sup}
                  fontFamily={fontFamily}
                  variantCount={variantCount}
                  fontSize={scriptFontSize}
                  inkColor={inkColor}
                />
              </span>
            )}

            {node.sub && (
              <span
                className="transform translate-y-1.5 font-medium"
                style={{ fontSize: `${scriptFontSize}px` }}
              >
                <HandwrittenMath
                  nodes={node.sub}
                  fontFamily={fontFamily}
                  variantCount={variantCount}
                  fontSize={scriptFontSize}
                  inkColor={inkColor}
                />
              </span>
            )}
          </span>
        </span>
      );
    }

    // Big Operators (\int, \sum, \lim)
    case 'operator': {
      const isIntegral = node.op.includes('int');
      const opGlyph = isIntegral ? '∫' : node.op === 'sum' ? '∑' : node.op === 'prod' ? '∏' : node.op;
      const scriptFontSize = Math.max(11, Math.round(fontSize * 0.58));

      if (isDisplay) {
        // Display mode: Limits above and below
        return (
          <span className="inline-flex flex-col items-center mx-2 align-middle">
            {node.upper && (
              <span className="-mb-1">
                <HandwrittenMath
                  nodes={node.upper}
                  fontFamily={fontFamily}
                  variantCount={variantCount}
                  fontSize={scriptFontSize}
                  inkColor={inkColor}
                />
              </span>
            )}

            <span
              className="leading-none select-none font-light"
              style={{
                fontFamily: charFont,
                fontSize: `${Math.round(fontSize * 1.55)}px`,
              }}
            >
              {opGlyph}
            </span>

            {node.lower && (
              <span className="-mt-1">
                <HandwrittenMath
                  nodes={node.lower}
                  fontFamily={fontFamily}
                  variantCount={variantCount}
                  fontSize={scriptFontSize}
                  inkColor={inkColor}
                />
              </span>
            )}
          </span>
        );
      }

      // Inline mode: Limits beside operator
      return (
        <span className="inline-flex items-center mx-1 align-middle">
          <span
            className="leading-none select-none"
            style={{
              fontFamily: charFont,
              fontSize: `${Math.round(fontSize * 1.25)}px`,
            }}
          >
            {opGlyph}
          </span>

          <span className="inline-flex flex-col -space-y-1 text-[11px] -mr-0.5">
            {node.upper && (
              <span className="-translate-y-2">
                <HandwrittenMath
                  nodes={node.upper}
                  fontFamily={fontFamily}
                  variantCount={variantCount}
                  fontSize={scriptFontSize}
                  inkColor={inkColor}
                />
              </span>
            )}
            {node.lower && (
              <span className="translate-y-1.5">
                <HandwrittenMath
                  nodes={node.lower}
                  fontFamily={fontFamily}
                  variantCount={variantCount}
                  fontSize={scriptFontSize}
                  inkColor={inkColor}
                />
              </span>
            )}
          </span>
        </span>
      );
    }

    // Accents (\vec{v}, \bar{x}, \dot{x})
    case 'accent': {
      return (
        <span className="inline-flex flex-col items-center relative mx-0.5">
          <span className="-mb-1.5 text-xs select-none">
            {node.accent === 'vec' && '→'}
            {node.accent === 'bar' && '—'}
            {node.accent === 'hat' && '^'}
            {node.accent === 'dot' && '•'}
            {node.accent === 'ddot' && '••'}
          </span>
          <HandwrittenMath
            nodes={node.body}
            fontFamily={fontFamily}
            variantCount={variantCount}
            fontSize={fontSize}
            inkColor={inkColor}
          />
        </span>
      );
    }

    // Brackets (\left( \dots \right))
    case 'bracket': {
      return (
        <span className="inline-flex items-center align-middle mx-0.5">
          {node.left && (
            <span
              className="text-2xl font-light select-none -ml-0.5"
              style={{ fontFamily: charFont }}
            >
              {node.left}
            </span>
          )}
          <span className="px-1">
            <HandwrittenMath
              nodes={node.body}
              fontFamily={fontFamily}
              variantCount={variantCount}
              fontSize={fontSize}
              inkColor={inkColor}
            />
          </span>
          {node.right && (
            <span
              className="text-2xl font-light select-none -mr-0.5"
              style={{ fontFamily: charFont }}
            >
              {node.right}
            </span>
          )}
        </span>
      );
    }

    // Matrices / Cases
    case 'matrix': {
      return (
        <span className="inline-grid gap-x-3 gap-y-1 my-1 align-middle text-center">
          {node.rows.map((row, rIdx) => (
            <span key={rIdx} className="inline-flex items-center justify-around gap-3">
              {row.map((col, cIdx) => (
                <span key={cIdx} className="px-1 text-center">
                  <HandwrittenMath
                    nodes={col}
                    fontFamily={fontFamily}
                    variantCount={variantCount}
                    fontSize={Math.round(fontSize * 0.9)}
                    inkColor={inkColor}
                  />
                </span>
              ))}
            </span>
          ))}
        </span>
      );
    }

    default:
      return null;
  }
};
