import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Scatter, ScatterChart,
  ComposedChart, Legend
} from 'recharts';

interface CurvePoint { x: number; y: number; }
interface DataPoint { x: number; y: number; }

interface Props {
  curve?: CurvePoint[];
  dataPoints?: DataPoint[];
  fittedCurve?: CurvePoint[];
  xLabel?: string;
  yLabel?: string;
  title?: string;
  height?: number;
  referenceX?: number;
  referenceY?: number;
}

const TOOLTIP_STYLE = {
  backgroundColor: '#1e2640',
  border: '1px solid #3d4e72',
  borderRadius: '8px',
  color: '#e2e8f0',
  fontSize: '12px',
  fontFamily: 'JetBrains Mono, monospace',
};

export default function ChartView({
  curve, dataPoints, fittedCurve,
  xLabel = 'x', yLabel = 'y',
  title, height = 280, referenceX, referenceY
}: Props) {
  if (!curve && !dataPoints) return null;

  // Merge curve + scatter for ComposedChart
  const curveData = curve?.map(p => ({ x: p.x, curve_y: p.y })) ?? [];
  const fittedData = fittedCurve?.map(p => ({ x: p.x, fitted_y: p.y })) ?? [];
  const scatterData = dataPoints?.map(p => ({ x: p.x, scatter_y: p.y })) ?? [];

  return (
    <div className="w-full">
      {title && <p className="text-xs text-slate-500 mb-2">{title}</p>}
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#253048" />
          <XAxis
            dataKey="x"
            type="number"
            domain={['auto', 'auto']}
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            label={{ value: xLabel, position: 'insideBottomRight', fill: '#64748b', fontSize: 11 }}
          />
          <YAxis
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            label={{ value: yLabel, angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 11 }}
          />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            formatter={(v: number) => [typeof v === 'number' ? v.toFixed(6) : v]}
          />
          <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />

          {curve && curve.length > 0 && (
            <Line
              data={curveData}
              type="monotone"
              dataKey="curve_y"
              name="f(x)"
              stroke="#3b82f6"
              dot={false}
              strokeWidth={2}
            />
          )}
          {fittedCurve && fittedCurve.length > 0 && (
            <Line
              data={fittedData}
              type="monotone"
              dataKey="fitted_y"
              name="Fitted"
              stroke="#a78bfa"
              dot={false}
              strokeWidth={2}
              strokeDasharray="5 3"
            />
          )}
          {dataPoints && dataPoints.length > 0 && (
            <Scatter
              data={scatterData}
              dataKey="scatter_y"
              name="Data points"
              fill="#f59e0b"
              stroke="#f59e0b"
              r={5}
            />
          )}

          {referenceX !== undefined && (
            <ReferenceLine x={referenceX} stroke="#ef4444" strokeDasharray="4 2" />
          )}
          {referenceY !== undefined && (
            <ReferenceLine y={referenceY} stroke="#10b981" strokeDasharray="4 2" />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
