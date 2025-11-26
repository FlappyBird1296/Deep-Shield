import React from "react";

export default function NeonLoader({ text = "Analyzing..." }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md bg-black/40">

      {/* Neon pulsing circle */}
      <div className="relative flex flex-col items-center">
        <div className="w-32 h-32 border-4 rounded-full border-purple-500/40 border-t-purple-400 animate-spin"></div>

        {/* Neon glow ring */}
        <div className="absolute w-40 h-40 rounded-full border border-purple-500/10 animate-pulse"></div>

        {/* Text */}
        <div className="mt-6 text-lg font-semibold text-white drop-shadow-[0_0_10px_rgba(124,77,255,0.8)]">
          {text}
        </div>
      </div>
    </div>
  );
}
