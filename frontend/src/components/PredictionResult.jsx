import { CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";

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

function PredictionResult({ result }) {
  if (!result) return null;

  const { prediction } = result;
  const confidencePercent = (prediction.confidence * 100).toFixed(1);
  const icon = CATEGORY_ICONS[prediction.class] || "👕";

  return (
    <div className="result-card glass-panel">
      <div className="category-avatar">
        {icon}
      </div>

      <div className="result-label-tag">
        <Sparkles size={14} style={{ display: 'inline', marginRight: 4 }} />
        Top Predicted Category
      </div>

      <h2 className="result-title">{prediction.class}</h2>

      <div className="confidence-box">
        <div className="confidence-label">
          <ShieldCheck size={18} style={{ display: 'inline', marginRight: 6, color: '#10b981' }} />
          Prediction Confidence
        </div>
        <div className="confidence-value">{confidencePercent}%</div>
      </div>
    </div>
  );
}

export default PredictionResult;