import { mean_arr, ttest2 } from "../analysis/Stats.js";

export function Ttest({ data }) {
  const diseaseGroup = data.filter(r => r.target === 1);
  const healthyGroup = data.filter(r => r.target === 0);
  const disease_chol = diseaseGroup.map(r => r.chol).filter(v => !isNaN(v));
  const healthy_chol = healthyGroup.map(r => r.chol).filter(v => !isNaN(v));
  const n1 = disease_chol.length;
  const n2 = healthy_chol.length;
  const mean1 = mean_arr(disease_chol);
  const mean2 = mean_arr(healthy_chol);


  const result = n1 && n2 ? ttest2(disease_chol, healthy_chol) : {statistic: 0, pValue: 1, rejected: false};
  const rejected = result.pValue < 0.05;

  return (
    <div className="p-3 border border-gray-400 rounded">
      <div className="text-lg font-bold mb-2">Ttest: Disease vs Healthy</div>
      <div className="text-sm text-gray-800 mb-3 space-y-1">
        <div>H0: mean chol disease = healthy</div>
        <div>H1: mean chol disease ≠ healthy (two-sided)</div>
      </div>


      <div className="grid grid-cols-2 gap-1 text-xs mb-3">
        {[
          ["disease group size", n1],
          ["disease mean", `${mean1.toFixed(1)} mg/dl`],
          ["healthy group size", n2],
          ["healthy mean", `${mean2.toFixed(1)} mg/dl`],
          ["t-stat", result.statistic.toFixed(3)],
          ["p-value", result.pValue < 0.000001 ? "<0.000001" : result.pValue.toFixed(5)],
        ].map(([key, val]) => (
          <div key={key} className="p-3 bg-gray-50 border border-gray-200 rounded-sm">
            <div className="text-gray-600 text-xs uppercase tracking-wide">{key}</div>
            <div className="text-sm font-mono font-bold text-gray-900">{val}</div>
          </div>
        ))}
      </div>


      <div className={`text-sm p-2 rounded font-medium ${rejected ? "bg-blue-20 border border-blue-200 text-blue-800" : "bg-gray-50 border border-gray-200 text-gray-800"}`}>
        {rejected ? `REJECT H0 (p=${result.pValue.toFixed(6)} < 0.05)` : `FAIL TO REJECT H0`}
        <br />
        {rejected ? `Disease patients have ${mean1 > mean2 ? 'higher' : 'lower'} cholesterol (${mean1.toFixed(1)} vs ${mean2.toFixed(1)} mg/dl)` : "No significant difference"}
      </div>
    </div>
  );
}

