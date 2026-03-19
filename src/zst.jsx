import { mean, stdev, zScore, zPValue } from "../analysis/Stats.js";

export function ZTest({ data }) {
  if (!data) return null;

  const chol = data.map(r => r.chol).filter(v => !isNaN(v));
  const n = chol.length;
  const mu = mean(chol);
  const sig = stdev(chol);
  const mu0 = 200;
  const z = zScore(mu, mu0, sig, n);  
  const pVal = zPValue(z);              
  const rejected = pVal < 0.05;

  return (
    <div className="p-3 border border-gray-400 rounded">
      <p className="text-sm text-gray-600 mb-1">z-test stdlib/stats-ztest</p>
      <div className="text-lg font-bold mb-2">Z-Test Cholesterol</div>



      <div className="text-sm text-gray-800 mb-3 space-y-1">
        <div>H0: mean = {mu0} mg/dl (healthy)</div>
        <div>H1: mean greater {mu0} mg/dl (elevated)</div>
      </div>
      

      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
        {[
          ["sample mean", `${mu.toFixed(1)} mg/dl`],["n patients", n],
          ["z-stat", z.toFixed(3)], ["p-value", pVal < 0.000001 ? "<0.000001" : pVal.toFixed(5)],
        ].map(([label, val]) => (
          <div key={label} className="p-2 bg-gray-50">
            <div className="text-gray-600 text-xs uppercase">{label}</div>
            <div className="font-mono font-bold">{val}</div>
          </div>
        ))}
      </div>

      <div className={`text-sm p-2 rounded font-medium ${rejected ? "bg-red-100 border border-red-300 text-red-800" : "bg-green-100 border border-green-300"}`}>
        {rejected ? `REJECT H0 (p=${pVal.toFixed(6)} < 0.05)` : `FAIL TO REJECT H0`}
        <br />
        
        {rejected ? `High cholesterol detected: ${mu.toFixed(1)} mg/dl` : "Normal cholesterol levels"}
      </div>
    </div>
  );
}
