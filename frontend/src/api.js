import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function analyzeImage(file) {
  const form = new FormData();
  form.append("file", file);
  const resp = await axios.post(`${API_BASE}/analyze/image`, form, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 120000
  });
  return resp.data;
}

export async function analyzeVideo(file) {
  const form = new FormData();
  form.append("file", file);
  const resp = await axios.post(`${API_BASE}/analyze/video`, form, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 180000
  });
  return resp.data;
}
