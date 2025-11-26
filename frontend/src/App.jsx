import React, { useState } from "react";
import Home from "./components/Home";
import UploadCard from "./components/UploadCard";
import ResultCard from "./components/ResultCard";
import BGmark from "./components/BGmark";
import { analyzeImage, analyzeVideo } from "./api";

export default function App() {
  const [screen, setScreen] = useState("home");  // home | upload | result
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleAnalyze(file, type) {
    setLoading(true);
    setScreen("loading");
    setResult(null);

    try {
      const res = type === "image" ? await analyzeImage(file) : await analyzeVideo(file);
      setResult(res);
      setScreen("result");
    } catch (e) {
      setResult({ success: false, error: e.message });
      setScreen("result");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen dark:bg-deep-purple text-white relative">

      {screen === "home" && <Home onStart={() => setScreen("upload")} />}

      {screen === "upload" && <UploadCard onAnalyze={handleAnalyze} />}

      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="glass-card p-6 rounded-xl">
            <div className="loader w-16 h-16 rounded-full animate-spin"></div>
            <div className="mt-4 text-lg">Analyzing…</div>
          </div>
        </div>
      )}

      {screen === "result" && !loading && (
        <ResultCard
          result={result}
          onReset={() => setScreen("upload")}
        />
      )}
    </div>
  );
}
