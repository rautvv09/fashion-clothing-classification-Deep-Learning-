import { useState, useEffect } from "react";
import { Sparkles, Sun, Moon, Server, Activity } from "lucide-react";
import axios from "axios";

function Navbar({ theme, onToggleTheme }) {
  const [backendOnline, setBackendOnline] = useState(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/health", { timeout: 3000 });
        if (res.data && res.data.status === "healthy") {
          setBackendOnline(true);
        } else {
          setBackendOnline(false);
        }
      } catch (err) {
        setBackendOnline(false);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="navbar glass-panel">
      <div className="nav-container">
        <a href="#home" className="brand">
          <div className="brand-icon">👗</div>
          <span className="brand-title">
            Fashion<span>AI</span>
          </span>
        </a>

        <ul className="nav-links">
          <li><a href="#home" className="nav-link">Home</a></li>
          <li><a href="#workspace" className="nav-link">Classifier</a></li>
          <li><a href="#categories" className="nav-link">Categories</a></li>
          <li><a href="#architecture" className="nav-link">Architecture</a></li>
        </ul>

        <div className="nav-actions">
          <div className="status-badge" title={backendOnline ? "Backend Flask API active at localhost:5000" : "Cannot reach localhost:5000"}>
            <span className={`status-dot ${backendOnline ? "" : "offline"}`} />
            <span>{backendOnline === null ? "Connecting..." : backendOnline ? "API Online" : "API Offline"}</span>
          </div>

          <button 
            className="theme-toggle-btn"
            onClick={onToggleTheme}
            aria-label="Toggle Theme"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
