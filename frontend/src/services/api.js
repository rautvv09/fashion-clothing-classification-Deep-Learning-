import axios from "axios";

const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    let url = import.meta.env.VITE_API_URL.trim().replace(/\/$/, "");
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = `https://${url}`;
    }
    return url.endsWith("/api") ? url : `${url}/api`;
  }

  // Auto-detect Render deployment URL if VITE_API_URL was omitted during static build
  if (typeof window !== "undefined" && window.location.hostname.includes("onrender.com")) {
    const backendHost = window.location.hostname.replace("-frontend", "-backend");
    return `https://${backendHost}/api`;
  }

  return "http://localhost:5000/api";
};

const API = axios.create({
  baseURL: getBaseURL(),
});

export const checkBackendHealth = async () => {
  try {
    const response = await API.get("/health", { timeout: 4000 });
    return response.data && response.data.status === "healthy";
  } catch (err) {
    return false;
  }
};

export const predictFashion = async (image) => {
  const formData = new FormData();

  formData.append("image", image);

  const response = await API.post(
    "/predict",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};