import { useState, useEffect } from "react";
import { BellCurve, CDFBars } from "./chats.jsx";
import { ZTest } from "./zst.jsx";
import { mean, stdev, normalCDF } from "../analysis/Stats.js";

function parseCSV(text) {
  const lines = text.trim().split("\n");
  const headers = lines[0]
    .split(",")
    .map(h => h.trim().toLowerCase().replace(/"/g, ""));

  return lines
    .slice(1)
    .map(line => {
      const vals = line.split(",");
      const row = {};
      headers.forEach((h, i) => {
        row[h] = parseFloat(vals[i]);
      });
      return row;
    })
    .filter(r => !isNaN(r.age));
}

export default function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/data/heart.csv")
      .then(r => {
        if (!r.ok) throw new Error("CSV not found");
        return r.text();
      })
      .then(parseCSV)
      .then(setData)
      .catch(e => setError(e.message));
  }, []);



  const ages = data ? data.map(r => r.age).filter(v => !isNaN(v)) : [];
  const chols = data ? data.map(r => r.chol).filter(v => !isNaN(v)) : [];
  const ageMu = ages.length ? mean(ages) : 54.4;
  const ageSig = ages.length > 1 ? stdev(ages) : 9.1;
  const cholMu = chols.length ? mean(chols) : 246.3;
  const cholSig = chols.length > 1 ? stdev(chols) : 51.8;



  const p55 = ages.length ? ((1 - normalCDF(55, ageMu, ageSig)) * 100).toFixed(1): "0.0";
  const p240 = chols.length ? ((1 - normalCDF(240, cholMu, cholSig)) * 100).toFixed(1) : "0.0";

  return (
    <div className="min-h-screen bg-white text-black p-4 space-y-4 font-mono">
      {error && (
        <div className="text-xs text-red-600 border border-red-300 p-2">
          {error}
        </div>
      )}


      {data && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border p-2">
          <div>
            <div className="text-xs text-gray-500">N</div>
            <div>{data.length}</div>
          </div>

          <div>
            <div className="text-xs text-gray-500">Age μ</div>
            <div>{ageMu.toFixed(1)}</div>
          </div>

          <div>
            <div className="text-xs text-gray-500">Chol μ</div>
            <div>{cholMu.toFixed(1)}</div>
          </div>

          <div>
            <div className="text-xs text-gray-500">P(age &gt; 55)</div>
            <div>{p55}%</div>
          </div>
        </div>
      )}

      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          <div className="border p-3">
            <div className="text-sm font-bold">Age Distribution</div>
            <BellCurve mu={ageMu} sigma={ageSig} />

            <div className="text-xs mt-2 text-gray-600">
              μ = {ageMu.toFixed(1)} · σ = {ageSig.toFixed(1)}
            </div>
          </div>

          <div className="border p-3">
            <div className="text-sm font-bold">Cholesterol CDF</div>
            <CDFBars mu={cholMu} sigma={cholSig} />

            <div className="text-xs mt-2 text-gray-600">
              P(chol &lt; 200): {(normalCDF(200, cholMu, cholSig) * 100).toFixed(1)}%
              <br />
              P(chol &gt; 240): {p240}%
            </div>
          </div>

        </div>
      )}

      {data && <ZTest data={data} />}

    </div>
  );
}