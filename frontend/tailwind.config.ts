import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          primary: '#09090b', // Zinc 950 mais profundo
          secondary: '#18181b', // Zinc 900
          card: 'rgba(24, 24, 27, 0.7)', // Translúcido para glassmorphism
          hover: 'rgba(39, 39, 42, 0.8)', // Zinc 800 translúcido
        },
        accent: {
          DEFAULT: '#e50914',
          hover: '#f40612',
          glow: 'rgba(229, 9, 20, 0.5)',
        },
        text: {
          primary: '#fafafa', // Zinc 50
          secondary: '#a1a1aa', // Zinc 400
          muted: '#71717a', // Zinc 500
        },
      },
      boxShadow: {
        'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
        'neon': '0 0 15px rgba(229, 9, 20, 0.5)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(to top, #09090b 0%, transparent 100%)',
      }
    },
  },
  plugins: [],
};

export default config;
