// frontend/src/components/ResultCard.jsx
import React from "react";
import { FiArrowLeftCircle, FiDownload, FiExternalLink } from "react-icons/fi";

/*
  Enhanced ResultCard for DeepShield (dark neon theme)
  - Shows threat level, confidence breakdown, stats grid
  - Shows per-frame bar chart (simple CSS bars)
  - Download JSON report button
  - Link to local inference file (developer/debug) - path below
*/

// LOCAL FILE PATH (developer/debug). The environment will transform this path to a URL when needed.
const INFERENCE_SOURCE_URL = "/mnt/data/inference.py";

export default function ResultCard({ result, onReset }) {
  if (!result) return null;

  if (!result.success) {
    return (
      <div className="max-w-3xl mx-auto p-6 glass-card rounded-xl border border-red-600/10 text-red-300">
        <h2 className="text-xl font-semibold mb-2">Analysis Failed</h2>
        <p className="text-subtle">{result.error || "Unknown error"}</p>
        <div className="mt-4">
          <button onClick={onReset} className="btn-neon px-4 py-2 rounded-md">Try Again</button>
        </div>
      </div>
    );
  }

  const r = result.result;

  // safeties for keys that might be missing
  const finalScore = Math.round((r.final_score ?? (1 - (r.prob_fake ?? 0)) * 100));
  const fakeProbPct = Math.round((r.prob_fake ?? 0) * 100);
  const realProbPct = 100 - fakeProbPct;
  const frameProbs = Array.isArray(r.frame_probs) && r.frame_probs.length ? r.frame_probs.map(p => Math.round(p * 100)) : null;
  const framesAnalyzed = r.frames_analyzed ?? r.frame_count ?? (frameProbs ? frameProbs.length : 1);
  const facesDetected = r.faces_detected ?? (framesAnalyzed - (r.frames_skipped ?? 0));
  const stdDev = typeof r.std_dev !== "undefined" ? Number(r.std_dev).toFixed(3) : "-";
  const stability = r.stability_score ?? "-";
  const confidenceDelta = r.confidence_delta ?? (frameProbs ? Math.max(...frameProbs) - Math.min(...frameProbs) : 0);
  const quality = r.media_quality_score ?? "-";
  const inferenceTime = r.inference_time_sec ?? "-";
  const highestIdx = typeof r.highest_risk_frame !== "undefined" ? r.highest_risk_frame : (frameProbs ? frameProbs.indexOf(Math.max(...frameProbs)) : 0);

  // threat mapping
  let threat = "Unknown";
  let threatClass = "text-white";
  if (finalScore > 85) { threat = "Safe"; threatClass = "text-green-400"; }
  else if (finalScore > 60) { threat = "Low Risk"; threatClass = "text-lime-300"; }
  else if (finalScore > 40) { threat = "Uncertain"; threatClass = "text-yellow-300"; }
  else if (finalScore > 15) { threat = "High Risk"; threatClass = "text-orange-400"; }
  else { threat = "Deepfake Likely"; threatClass = "text-red-400"; }

  function downloadReport() {
    const payload = {
      meta: {
        timestamp: new Date().toISOString(),
        final_score: finalScore,
        label: r.label,
      },
      stats: {
        frames_analyzed: framesAnalyzed,
        faces_detected: facesDetected,
        frames_skipped: r.frames_skipped ?? 0,
        avg_fake_prob: r.prob_fake ?? null,
        frame_probs: r.frame_probs ?? null,
        std_dev: r.std_dev ?? null,
        stability_score: r.stability_score ?? null,
        confidence_delta: r.confidence_delta ?? null,
        media_quality_score: r.media_quality_score ?? null,
        inference_time_sec: r.inference_time_sec ?? null
      },
      explanation: r.explanation ?? []
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `deepshield_report_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="max-w-4xl mx-auto p-8 glass-card rounded-2xl shadow-neon-lg border border-white/8 text-white">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-4">
            <div className={`w-36 h-36 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-2xl
              ${finalScore > 70 ? 'bg-gradient-to-br from-green-600 to-green-400' :
                finalScore > 40 ? 'bg-gradient-to-br from-yellow-500 to-yellow-400' :
                'bg-gradient-to-br from-red-600 to-red-400'}`}>
              {finalScore}%
            </div>

            <div>
              <h2 className="text-2xl font-bold">{r.label}</h2>
              <div className="mt-2">
                <span className={`inline-block px-3 py-1 rounded-md text-sm font-semibold ${threatClass} bg-white/5 border border-white/6`}>
                  Threat: {threat}
                </span>
              </div>

              <div className="mt-3 text-subtle text-sm">
                <div>Inference time: <strong>{inferenceTime}s</strong></div>
                <div>Media quality: <strong>{quality}/100</strong></div>
              </div>
            </div>
          </div>

          {/* Confidence bars */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Confidence Breakdown</h3>
            <div className="w-full bg-white/6 rounded-full h-4 overflow-hidden">
              <div style={{ width: `${realProbPct}%` }} className="h-full bg-gradient-to-r from-neon-purple to-neon-blue"></div>
            </div>
            <div className="flex justify-between text-sm text-subtle mt-2">
              <span>Real: <strong>{realProbPct}%</strong></span>
              <span>Fake: <strong>{fakeProbPct}%</strong></span>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="p-4 neon-outline rounded-lg">
              <div className="text-subtle text-xs">Frames Analyzed</div>
              <div className="text-xl font-semibold">{framesAnalyzed}</div>
            </div>

            <div className="p-4 neon-outline rounded-lg">
              <div className="text-subtle text-xs">Faces Detected</div>
              <div className="text-xl font-semibold">{facesDetected}</div>
            </div>

            <div className="p-4 neon-outline rounded-lg">
              <div className="text-subtle text-xs">Frames Skipped</div>
              <div className="text-xl font-semibold">{r.frames_skipped ?? 0}</div>
            </div>

            <div className="p-4 neon-outline rounded-lg">
              <div className="text-subtle text-xs">Std Dev (fake prob)</div>
              <div className="text-xl font-semibold">{stdDev}</div>
            </div>

            <div className="p-4 neon-outline rounded-lg">
              <div className="text-subtle text-xs">Confidence Δ</div>
              <div className="text-xl font-semibold">{confidenceDelta}%</div>
            </div>

            <div className="p-4 neon-outline rounded-lg">
              <div className="text-subtle text-xs">Stability Score</div>
              <div className="text-xl font-semibold">{stability}</div>
            </div>
          </div>
        </div>

        {/* Right column: Frame insights & example */}
        <div className="w-80">
          <div className="mb-4">
            <h4 className="text-sm text-subtle mb-2">Highest-risk frame</h4>
            {r.example_frame ? (
              <div className="rounded-lg overflow-hidden neon-outline border border-white/6">
                <img src={r.example_frame} alt="suspicious" className="w-full h-48 object-cover" />
                <div className="p-2 text-xs text-subtle">
                  Frame #{highestIdx} • Fake Prob: {frameProbs ? `${frameProbs[highestIdx]}%` : `${Math.round((r.prob_fake ?? 0) * 100)}%`}
                </div>
              </div>
            ) : (
              <div className="rounded-lg p-4 glass-card text-subtle">No frame available</div>
            )}
          </div>

          {/* Per-frame bar chart */}
          <div className="mb-4">
            <h4 className="text-sm text-subtle mb-2">Per-frame Probabilities</h4>
            <div className="space-y-2">
              {frameProbs ? (
                frameProbs.map((p, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs">
                    <div className="w-8 text-subtle">#{idx+1}</div>
                    <div className="flex-1 h-4 bg-white/6 rounded overflow-hidden">
                      <div style={{ width: `${p}%` }} className="h-full bg-red-500"></div>
                    </div>
                    <div className="w-10 text-right">{p}%</div>
                  </div>
                ))
              ) : (
                <div className="text-subtle text-sm">No per-frame data</div>
              )}
            </div>
          </div>

          {/* Explanation */}
          <div className="mb-4">
            <h4 className="text-sm text-subtle mb-2">AI Explanation</h4>
            <ul className="text-sm text-subtle space-y-1">
              {(r.explanation || []).map((e, i) => <li key={i}>• {e}</li>)}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <button onClick={downloadReport} className="w-full py-2 rounded-md btn-neon flex items-center justify-center gap-2">
              <FiDownload /> Download JSON Report
            </button>

            {/* <a href={INFERENCE_SOURCE_URL} className="w-full inline-flex items-center justify-center gap-2 py-2 rounded-md glass-card border border-white/6 text-sm" target="_blank" rel="noreferrer">
              <FiExternalLink /> View inference.py
            </a> */}

            <button onClick={onReset} className="w-full py-2 rounded-md bg-white/6 text-sm">Try Another</button>
          </div>
        </div>
      </div>
    </div>
  );
}
