import React from 'react';

interface MatrixDisplayProps {
  matrix: number[][];
  highlightLastCol?: boolean;
  label?: string;
}

export default function MatrixDisplay({ matrix, highlightLastCol = false, label }: MatrixDisplayProps) {
  if (!matrix || matrix.length === 0) return null;
  const cols = matrix[0].length;
  const dataColCount = highlightLastCol ? cols - 1 : cols;

  return (
    <div className="inline-block">
      {label && <div className="text-xs text-slate-500 mb-1">{label}</div>}
      <div
        className="matrix-grid"
        style={{ gridTemplateColumns: `repeat(${cols}, auto)` }}
      >
        {matrix.map((row, ri) =>
          row.map((val, ci) => (
            <div
              key={`${ri}-${ci}`}
              className={`matrix-cell ${
                highlightLastCol && ci === cols - 1 ? 'augment-col' : ''
              }`}
            >
              {Number.isFinite(val) ? (Math.abs(val) < 1e-10 ? '0' : +val.toFixed(4)) : '—'}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
