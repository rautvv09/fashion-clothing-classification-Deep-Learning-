import { useState, useEffect, useRef } from "react";
import { Sparkles, AlertCircle, Cpu, Zap, Target } from "lucide-react";

import Navbar from "../components/Navbar";
import ImageUploader from "../components/ImageUploader";
import PredictionResult from "../components/PredictionResult";
import ProbabilityChart from "../components/ProbabilityChart";
import CategoryShowcase from "../components/CategoryShowcase";
import ModelStats from "../components/ModelStats";
import Footer from "../components/Footer";

import { predictFashion } from "../services/api";
import { generateSampleImageFile } from "../utils/sampleGenerator";

function Home() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("fashion_ai_theme") || "dark";
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const uploaderSectionRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("fashion_ai_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handlePrediction = async (image) => {
    try {
      setLoading(true);
      setError("");
      setResult(null);

      const data = await predictFashion(image);
      if (data && data.success) {
        setResult(data);
      } else if (data && data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch (err) {
      console.error("Prediction failed:", err);

      let errorMsg = "";
      if (err.response) {
        // Response received from server with error status code (e.g. 400, 500)
        const data = err.response.data;
        if (data && typeof data === "object" && data.error) {
          errorMsg = data.error;
        } else if (data && typeof data === "object" && data.message) {
          errorMsg = data.message;
        } else if (typeof data === "string" && data.trim()) {
          errorMsg = data;
        } else {
          errorMsg = `Server returned status ${err.response.status}: ${err.response.statusText || "Error"}`;
        }
      } else if (err.request) {
        // Request made but no response received (CORS error, network error, or spin-up timeout)
        errorMsg =
          "Unable to connect to the prediction server. If deploying on Render free tier, the backend instance may take up to 50 seconds to spin up on initial request. Please wait a moment and try again.";
      } else {
        errorMsg = err.message || "An error occurred while sending the prediction request.";
      }

      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCategorySample = (sampleId) => {
    if (uploaderSectionRef.current) {
      uploaderSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
    const { file } = generateSampleImageFile(sampleId);
    handlePrediction(file);
  };

  return (
    <div className="home-wrapper">
      <Navbar theme={theme} onToggleTheme={toggleTheme} />

      <main>
        {/* Hero Section */}
        <section className="hero-section" id="home">
          <div className="hero-badge">
            <Sparkles size={16} />
            <span>AI-Powered Fashion Classification</span>
          </div>

          <h1 className="hero-title">
            Classify Apparel with <span className="gradient-text">Deep Learning</span>
          </h1>

          <p className="hero-subtitle">
            Upload any fashion clothing image or try our demo samples. Our Convolutional Neural Network (CNN) 
            instantly classifies apparel into 10 Fashion-MNIST categories with full probability analytics.
          </p>

          <div className="hero-features">
            <div className="feature-pill">
              <Zap size={16} />
              <span>Real-Time Inference</span>
            </div>
            <div className="feature-pill">
              <Target size={16} />
              <span>High Precision CNN</span>
            </div>
            <div className="feature-pill">
              <Cpu size={16} />
              <span>TensorFlow & Keras Engine</span>
            </div>
          </div>
        </section>

        {/* Classifier Workspace */}
        <section className="workspace-section" id="workspace" ref={uploaderSectionRef}>
          <div className="workspace-grid">
            <ImageUploader onPredict={handlePrediction} loading={loading} />

            {error && (
              <div className="error-card">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            {result && (
              <div className="results-container">
                <PredictionResult result={result} />
                <ProbabilityChart probabilities={result.prediction?.probabilities} />
              </div>
            )}
          </div>
        </section>

        {/* Categories Showcase */}
        <CategoryShowcase onSelectCategory={handleSelectCategorySample} />

        {/* Model Architecture & Performance */}
        <ModelStats />
      </main>

      <Footer />
    </div>
  );
}

export default Home;