import React, { useEffect, useState } from "react";

export default function ThemeToggle(){
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') return true;
    return localStorage.getItem("ds_theme") !== "light";
  });

  useEffect(()=> {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("ds_theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("ds_theme", "light");
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="px-3 py-1 rounded-lg text-sm glass-card text-white/90 hover:scale-105 transition-transform"
      aria-label="Toggle theme"
    >
      {dark ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}
