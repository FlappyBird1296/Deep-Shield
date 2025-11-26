import React from "react";
import BGmark from "./BGmark";

export default function Home({ onStart }) {
  return (
    <div className="relative text-white min-h-screen flex flex-col items-center justify-center overflow-hidden px-6">

      {/* Neon animated background */}
      <div className="neon-bg" />

      {/* Top Right Branding */}
      <div className="absolute top-4 right-4 z-40">
        <BGmark />
      </div>

      {/* Hero Section */}
      <div className="z-30 text-center max-w-3xl">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 
          bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 drop-shadow-xl">
          DeepShield AI
        </h1>

        <p className="text-subtle text-lg mb-8 leading-relaxed">
          Real-time deepfake detection using EfficientNet-B0.<br />
          Fast • Explainable • Secure.
        </p>

        {/* Start Button */}
        <button
          onClick={onStart}
          className="btn-neon px-8 py-3 rounded-xl text-xl font-semibold shadow-neon-lg hover:scale-105 transition-transform"
        >
          Start Analysis
        </button>
      </div>

      {/* Features */}
      <div className="z-30 grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-5xl">
        <div className="glass-card p-6 rounded-2xl border border-white/10 shadow-lg text-center">
          <div className="text-xl font-semibold mb-2">Real-Time Detection</div>
          <p className="text-subtle text-sm">Analyze images or videos with lightning-fast processing.</p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-white/10 shadow-lg text-center">
          <div className="text-xl font-semibold mb-2">Statistical Insights</div>
          <p className="text-subtle text-sm">Stability score, standard deviation, media quality & more.</p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-white/10 shadow-lg text-center">
          <div className="text-xl font-semibold mb-2">Explainable AI</div>
          <p className="text-subtle text-sm">Per-frame breakdown and highest-risk frame identification.</p>
        </div>
      </div>

      {/* Footer */}
      <div className="z-30 mt-16 text-subtle text-xs opacity-70">
        © 2025 DeepShield AI — Regional AI Hackathon
      </div>
    </div>
  );
}
