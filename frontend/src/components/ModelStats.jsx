import { useState } from "react";
import { Database, Layers, Eye, Cpu, Image as ImageIcon } from "lucide-react";

function ModelStats() {
  const [showMatrix, setShowMatrix] = useState(false);

  return (
    <section className="architecture-section" id="architecture">
      <div className="section-header">
        <h2>Model Architecture & Stats</h2>
        <p>Convolutional Neural Network built with TensorFlow/Keras</p>
      </div>

      <div className="stats-grid">
        <div className="stat-box glass-panel">
          <div className="stat-icon">
            <Database size={26} />
          </div>
          <div>
            <div className="stat-number">60,000</div>
            <div className="stat-label">Training Images</div>
          </div>
        </div>

        <div className="stat-box glass-panel">
          <div className="stat-icon">
            <Layers size={26} />
          </div>
          <div>
            <div className="stat-number">10,000</div>
            <div className="stat-label">Test Images</div>
          </div>
        </div>

        <div className="stat-box glass-panel">
          <div className="stat-icon">
            <ImageIcon size={26} />
          </div>
          <div>
            <div className="stat-number">28×28</div>
            <div className="stat-label">Grayscale Preprocessing</div>
          </div>
        </div>

        <div className="stat-box glass-panel">
          <div className="stat-icon">
            <Cpu size={26} />
          </div>
          <div>
            <div className="stat-number">CNN Model</div>
            <div className="stat-label">Conv2D + MaxPool + Dense</div>
          </div>
        </div>
      </div>

      <div className="matrix-container glass-panel">
        <h3>Evaluation Metrics & Confusion Matrix</h3>
        <p style={{ color: 'var(--text-secondary)', marginTop: 8, marginBottom: 20 }}>
          View the complete evaluation matrix showing accuracy breakdown across all 10 categories.
        </p>

        <button
          className="browse-btn"
          onClick={() => setShowMatrix(!showMatrix)}
          style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}
        >
          <Eye size={18} />
          <span>{showMatrix ? "Hide Confusion Matrix" : "View Confusion Matrix"}</span>
        </button>

        {showMatrix && (
          <div className="matrix-preview-box">
            <img 
              src="/confusion_matrix.png" 
              alt="Model Confusion Matrix" 
              className="matrix-img" 
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>
    </section>
  );
}

export default ModelStats;
