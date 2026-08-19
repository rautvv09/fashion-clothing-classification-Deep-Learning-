import { useState } from "react";
import { BarChart3, Filter } from "lucide-react";

const CATEGORY_ICONS = {
  "T-shirt/top": "👕",
  "Trouser": "👖",
  "Pullover": "🧥",
  "Dress": "👗",
  "Coat": "🥼",
  "Sandal": "👡",
  "Shirt": "👔",
  "Sneaker": "👟",
  "Bag": "👜",
  "Ankle boot": "👢"
};

function ProbabilityChart({ probabilities }) {
  const [filterMode, setFilterMode] = useState("top3"); // 'top3' or 'all'

  if (!probabilities) return null;

  // Convert probabilities object into sorted array
  const entries = Object.entries(probabilities).map(([label, val]) => ({
    label,
    val: val * 100
  })).sort((a, b) => b.val - a.val);

  const displayedEntries = filterMode === "top3" ? entries.slice(0, 3) : entries;

  return (
    <div className="chart-card glass-panel">
      <div className="chart-header">
        <h3>Probability Distribution</h3>
        <div className="toggle-pills">
          <button
            className={`toggle-pill ${filterMode === "top3" ? "active" : ""}`}
            onClick={() => setFilterMode("top3")}
          >
            Top 3
          </button>
          <button
            className={`toggle-pill ${filterMode === "all" ? "active" : ""}`}
            onClick={() => setFilterMode("all")}
          >
            All 10
          </button>
        </div>
      </div>

      <div className="bars-list">
        {displayedEntries.map((item, index) => {
          const isTop = index === 0;
          const icon = CATEGORY_ICONS[item.label] || "👕";

          return (
            <div className="bar-row" key={item.label}>
              <div className="bar-meta">
                <div className="bar-name">
                  <span className={`bar-rank ${isTop ? "top" : ""}`}>#{index + 1}</span>
                  <span>{icon} {item.label}</span>
                </div>
                <span>{item.val.toFixed(2)}%</span>
              </div>
              <div className="bar-track">
                <div
                  className={`bar-fill ${isTop ? "" : "secondary"}`}
                  style={{ width: `${Math.max(item.val, 1.5)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProbabilityChart;