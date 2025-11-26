import React, { useState } from "react";
import { FiUploadCloud, FiVideo, FiImage } from "react-icons/fi";

export default function UploadCard({ onAnalyze }) {
    const [file, setFile] = useState(null);
    const [type, setType] = useState("video");

    function handleFile(e) {
        setFile(e.target.files[0]);
    }

    function handleAnalyze() {
        if (!file) return alert("Please select a file.");
        onAnalyze(file, type);
    }

    return (
        <div className="max-w-2xl mx-auto p-8 glass-card rounded-2xl shadow-neon-lg border border-white/6">

            <h1 className="text-4xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
                DeepShield AI
            </h1>
            <p className="text-center mb-6">Detect manipulated media quickly and explainably.</p>

            <div className="flex justify-center gap-4 mb-6">
                <button
                    onClick={() => setType("video")}
                    className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all
      ${type === "video"
                            ? "bg-gradient-to-r from-purple-600 to-purple-400 text-white shadow-neon-lg"
                            : "bg-white/10 text-white/60 hover:text-white hover:bg-white/20 border border-white/10"
                        }`}
                >
                    <FiVideo size={20} />
                    Video
                </button>

                <button
                    onClick={() => setType("image")}
                    className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all
      ${type === "image"
                            ? "bg-gradient-to-r from-purple-600 to-purple-400 text-white shadow-neon-lg"
                            : "bg-white/10 text-white/60 hover:text-white hover:bg-white/20 border border-white/10"
                        }`}
                >
                    <FiImage size={20} />
                    Image
                </button>
            </div>


            <label className="
  block border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer
  border-purple-400 dark:border-purple-500
  hover:border-purple-600 hover:shadow-[0_0_25px_rgba(168,85,247,0.6)]
  bg-white/5 dark:bg-black/20
  transition-all
">

                <FiUploadCloud size={48} className="mx-auto text-purple-600" />
                <div className="mt-3">Click to upload your {type} or drag & drop</div>
                <input type="file" accept={type === "video" ? "video/*" : "image/*"} onChange={handleFile} className="hidden" />
            </label>

            {file && <p className="mt-4 text-center text-sm">Selected: <strong>{file.name}</strong></p>}

            <div className="mt-6">
                <button onClick={handleAnalyze} className="w-full py-3 rounded-xl btn-neon font-semibold">Analyze</button>
            </div>
        </div>
    );
}
