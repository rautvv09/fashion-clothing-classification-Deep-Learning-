import { useState, useRef } from "react";
import { Upload, Image as ImageIcon, X, Sparkles, RefreshCw, Zap } from "lucide-react";
import { SAMPLES, generateSampleImageFile } from "../utils/sampleGenerator";

function ImageUploader({ onPredict, loading }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [sampleSelected, setSampleSelected] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (file) => {
    if (!file) return;
    setSelectedImage(file);
    setPreview(URL.createObjectURL(file));
    setSampleSelected(null);
  };

  const handleInputChange = (event) => {
    const file = event.target.files[0];
    if (file) handleFileChange(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSelectSample = (sample) => {
    const { file, dataUrl } = generateSampleImageFile(sample.id);
    setSelectedImage(file);
    setPreview(dataUrl);
    setSampleSelected(sample.name);
  };

  const handleClear = () => {
    setSelectedImage(null);
    setPreview(null);
    setSampleSelected(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = () => {
    if (!selectedImage) return;
    onPredict(selectedImage);
  };

  return (
    <div className="upload-card glass-panel">
      {!preview ? (
        <div 
          className={`drop-zone ${isDragActive ? "active" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="upload-icon-wrapper">
            <Upload size={32} />
          </div>
          <h3>Upload Apparel Image</h3>
          <p>Drag & drop your clothing image here or click to browse</p>
          <span className="browse-btn">
            <ImageIcon size={18} /> Choose File
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            hidden
          />
        </div>
      ) : (
        <div className="preview-container">
          <div className="preview-frame">
            <img src={preview} alt="Selected Apparel" className="preview-image" />
            <button className="remove-btn" onClick={handleClear} title="Remove image">
              <X size={18} />
            </button>
          </div>
          <div className="preview-meta">
            <span>{sampleSelected ? `Sample: ${sampleSelected}` : selectedImage.name}</span>
            <span>•</span>
            <span>{sampleSelected ? '28×28 Scaled' : `${(selectedImage.size / 1024).toFixed(1)} KB`}</span>
          </div>
        </div>
      )}

      {/* Preset Samples Selector */}
      <div className="samples-selector">
        <div className="samples-title">⚡ Quick Test With Demo Apparel</div>
        <div className="samples-grid">
          {SAMPLES.map((sample) => (
            <button
              key={sample.id}
              className="sample-chip"
              onClick={() => handleSelectSample(sample)}
              type="button"
            >
              <span className="sample-icon">{sample.icon}</span>
              <span>{sample.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <div className="action-bar">
        <button
          className="predict-btn"
          onClick={handleSubmit}
          disabled={!selectedImage || loading}
        >
          {loading ? (
            <>
              <RefreshCw className="spinner" size={20} />
              <span>Analyzing with CNN...</span>
            </>
          ) : (
            <>
              <Zap size={20} />
              <span>Classify Apparel</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default ImageUploader;