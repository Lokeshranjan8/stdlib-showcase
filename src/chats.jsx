import { normalPDF, normalCDF  } from "../analysis/Stats.js";
export { normalCDF };

export function BellCurve({ mu, sigma }) {
  const W = 460, H = 160, PL = 40, PR = 20, PT = 10, PB = 30;
  const iW = W - PL - PR, iH = H - PT - PB;
  const xMin = mu - 3.5 * sigma;
  const xMax = mu + 3.5 * sigma;

  const pts = [];
  for (let i = 0; i <= 100; i++) {
    const x = xMin + (i / 100) * (xMax - xMin);
    pts.push({ x, y: normalPDF(x, mu, sigma) });
  }

  const maxY = normalPDF(mu, mu, sigma);
  const sx = x => PL + ((x - xMin) / (xMax - xMin)) * iW;
  const sy = y => PT + iH - (y / maxY) * iH;
  const line = pts.map((p, i) =>
    `${i === 0 ? "M" : "L"}${sx(p.x).toFixed(1)},${sy(p.y).toFixed(1)}`
  ).join(" ");
  const ticks = [-2, -1, 0, 1, 2].map(k => mu + k * sigma);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      <line x1={PL} x2={W - PR} y1={sy(0)} y2={sy(0)} stroke="#666" strokeWidth="0.5" />
      <line x1={sx(mu)} x2={sx(mu)} y1={PT} y2={sy(0)} stroke="#333" strokeWidth="0.5" />
      <path d={line} fill="none" stroke="#000" strokeWidth="1" />
      {ticks.map(t => (
        <g key={t}>
          <line x1={sx(t)} x2={sx(t)} y1={sy(0)} y2={sy(0) + 3} stroke="#666" strokeWidth="0.5" />
          <text x={sx(t)} y={sy(0) + 12} textAnchor="middle" fill="#666" fontSize="9">
            {t.toFixed(0)}
          </text>
        </g>
      ))}
      <text x={sx(mu)} y={PT + 8} textAnchor="middle" fill="#333" fontSize="8">
        μ={mu.toFixed(1)}
      </text>
    </svg>
  );
}

export function CDFBars({ mu, sigma }) {
  const thresholds = [150, 175, 200, 220, 240, 260, 280, 300];
  const W = 460, H = 160, PL = 36, PR = 10, PT = 10, PB = 30;
  const iW = W - PL - PR;
  const iH = H - PT - PB;
  const bw = iW / thresholds.length;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {[0, 25, 50, 75, 100].map(v => {
        const y = PT + iH - (v / 100) * iH;
        return (
          <g key={v}>
            <line x1={PL} x2={W - PR} y1={y} y2={y} stroke="#e5e7eb" strokeWidth="0.5" />
            <text x={PL - 3} y={y + 3} textAnchor="end" fill="#9ca3af" fontSize="9" fontFamily="monospace">{v}%</text>
          </g>
        );
      })}
      {thresholds.map((t, i) => {
        const p  = normalCDF(t, mu, sigma);
        const bh = p * iH;
        const x  = PL + i * bw + 2;
        const y  = PT + iH - bh;
        return (
          <g key={t}>
            <rect x={x} y={y} width={bw - 4} height={bh}
              fill={t === 240 ? "#333" : "#ccc"} />
            <text x={x + (bw - 4) / 2} y={PT + iH + 12} textAnchor="middle"
              fill="#666" fontSize="8">{t}</text>
            <text x={x + (bw - 4) / 2} y={y - 2} textAnchor="middle"
              fill="#333" fontSize="7">{(p * 100).toFixed(0)}%</text>
          </g>
        );
      })} 

      <line x1={PL} x2={W - PR} y1={PT + iH} y2={PT + iH} stroke="#666" strokeWidth="0.5" /> 

    </svg>
  );
}

