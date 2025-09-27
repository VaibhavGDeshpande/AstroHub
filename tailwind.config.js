module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      cursor: {
        'star': 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\'><path fill=\'%23FFD700\' d=\'M12 2l2.09 6.26L20 10l-5.91 1.74L12 18l-2.09-5.26L4 10l5.91-2.74L12 2z\'/></svg>") 12 12, pointer',
        
        'planet': 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\'><circle cx=\'12\' cy=\'12\' r=\'8\' fill=\'%234F46E5\' stroke=\'%23818CF8\' stroke-width=\'2\'/><circle cx=\'10\' cy=\'10\' r=\'2\' fill=\'%23C7D2FE\'/></svg>") 12 12, pointer',
        
        'rocket': 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\'><path fill=\'%23EF4444\' d=\'M12 2l-2 8-2-1v3l2 1-2 8c0 0 1-1 2-1s2 1 2 1l-2-8 2-1v-3l-2 1 2-8z\'/><circle cx=\'12\' cy=\'8\' r=\'1.5\' fill=\'%23FCD34D\'/></svg>") 12 4, pointer',
        
        'galaxy': 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\'><circle cx=\'12\' cy=\'12\' r=\'10\' fill=\'%23312E81\' opacity=\'0.8\'/><circle cx=\'8\' cy=\'8\' r=\'1\' fill=\'%23FBBF24\'/><circle cx=\'16\' cy=\'10\' r=\'0.5\' fill=\'%23F3F4F6\'/><circle cx=\'10\' cy=\'16\' r=\'0.7\' fill=\'%23DBEAFE\'/><circle cx=\'15\' cy=\'15\' r=\'0.3\' fill=\'%23FBBF24\'/></svg>") 12 12, pointer',
        
        'moon': 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\'><path fill=\'%23F3F4F6\' d=\'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.19 0 2.34-.21 3.41-.6-2.85-1.2-4.84-4.01-4.84-7.4 0-4.39 3.56-7.95 7.95-7.95.93 0 1.82.16 2.65.45C19.42 3.7 16.04 2 12 2z\'/><circle cx=\'8\' cy=\'8\' r=\'1\' fill=\'%23D1D5DB\'/><circle cx=\'10\' cy=\'14\' r=\'0.7\' fill=\'%23D1D5DB\'/></svg>") 12 12, pointer'
      }
    },
  },
  plugins: [],
}
