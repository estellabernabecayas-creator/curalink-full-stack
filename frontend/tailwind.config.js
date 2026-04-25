/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      gridTemplateColumns:{
        'auto':'repeat(auto-fill, minmax(200px, 1fr))'
      },
      colors:{
        // Primary brand colors
        'primary': '#1E6FD9',
        'secondary': '#4CAF50',
        
        // Supporting colors
        'light-blue': '#4FC3F7',
        'soft-green': '#7ED957',
        
        // Background colors
        'bg-primary': '#FFFFFF',
        'bg-secondary': '#F5F7FA',
        'bg-dark-primary': '#0F172A',
        'bg-dark-secondary': '#1E293B',
        
        // Text colors
        'text-primary': '#1F2937',
        'text-secondary': '#6B7280',
        'text-dark-primary': '#FFFFFF',
        'text-dark-secondary': '#CBD5F5',
        
        // UI elements
        'border-light': '#E5E7EB',
        'border-dark': '#334155',
        
        // Legacy colors for backward compatibility
        'medical-blue': '#1E6FD9',
        'medical-teal': '#4CAF50',
        'dark-slate': '#1E293B',
        'dark-slate-light': '#334155',
        'dark-slate-lighter': '#475569'
      }
    },
  },
  plugins: [],
}