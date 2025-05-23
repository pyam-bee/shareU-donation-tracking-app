/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,html}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'charity-main': 'linear-gradient(135deg, #1A1A40 0%, #1F1C2C 50%, #3A0CA3 100%)',
        'charity-warm': 'linear-gradient(135deg, #111827 0%, #1F2937 50%, #111827 100%)',
        'admin-gradient': 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)',
      },
    },
  },
  plugins: [],
}