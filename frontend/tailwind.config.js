export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class", // <-- enable class-based dark mode
  theme: {
    extend: {
      colors: {
        'deep-purple': '#0f0726',
        'neon-purple': '#7c4dff',
        'neon-blue': '#3dd5ff',
        'glass': 'rgba(255,255,255,0.06)'
      },
      boxShadow: {
        'neon-lg': '0 10px 30px rgba(124,77,255,0.14), 0 0 40px rgba(61,213,255,0.06)',
      }
    }
  },
  plugins: [],
}
