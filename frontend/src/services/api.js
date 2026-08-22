import axios from "axios";

export const getBaseURL = () => {
  let envUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.trim() : "";

  if (envUrl) {
    let url = envUrl.replace(/\/+$/, "");
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = `https://${url}`;
    }
    return url.endsWith("/api") ? url : `${url}/api`;
  }

  // Auto-detect Render deployment URL if VITE_API_URL was omitted during static build
  if (typeof window !== "undefined" && window.location.hostname.includes("onrender.com")) {
    const currentHost = window.location.hostname;
    let backendHost = currentHost;
    if (currentHost.includes("-frontend")) {
      backendHost = currentHost.replace("-frontend", "-backend");
    }
    return `https://${backendHost}/api`;
  }

  return "http://localhost:5000/api";
};

const API = axios.create({
  baseURL: getBaseURL(),
});

export const checkBackendHealth = async () => {
  try {
    const response = await API.get("/health", { timeout: 15000 });
    return response.data && response.data.status === "healthy";
  } catch (err) {
    return false;
  }
};

export const predictFashion = async (image) => {
  const formData = new FormData();
  formData.append("image", image);

  // Send FormData directly without manual Content-Type header so Axios/browser sets boundary automatically
  const response = await API.post("/predict", formData, {
    timeout: 60000, // 60 seconds tolerance for free-tier spin-up
  });

  return response.data;
};