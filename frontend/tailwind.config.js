/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ZAA Brand Colors (extracted from logo)
        zaa: {
          orange:        '#F4742B',
          'orange-vivid':'#FB7330',
          'orange-dark': '#D3763D',
          'orange-deep': '#C05E1E',
          amber:         '#F5A94C',
          'amber-light': '#FBCA7A',
          'amber-dark':  '#E08B2A',
          brown:         '#6B2F0F',
          'brown-dark':  '#3D1A0A',
        },
        // Keep "gold" as alias
        gold: {
          DEFAULT: '#F4742B',
          light:   '#F5A94C',
          dark:    '#D3763D',
        },
        // Backgrounds
        obsidian:    '#0D0B09',
        charcoal:    '#161210',
        surface:     '#1E1916',
        'surface-2': '#252018',
        // Text
        cream:       '#F5EDE0',
        secondary:   '#C4A882',
        muted:       '#7A6148',
      },
      fontFamily: {
        sans:    ['Montserrat', 'sans-serif'],
        serif:   ['Playfair Display', 'serif'],
        accent:  ['Cormorant Garamond', 'serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
      backgroundImage: {
        'zaa-gradient':      'linear-gradient(135deg, #F4742B 0%, #FB7330 35%, #F5A94C 65%, #D3763D 100%)',
        'zaa-gradient-dark': 'linear-gradient(135deg, #C05E1E 0%, #F4742B 50%, #F5A94C 100%)',
        'gold-gradient':     'linear-gradient(135deg, #F4742B 0%, #FB7330 35%, #F5A94C 65%, #D3763D 100%)',
        'zaa-radial':        'radial-gradient(ellipse at 20% 50%, rgba(244,116,43,0.1) 0%, transparent 65%)',
        'gold-radial':       'radial-gradient(ellipse at 20% 50%, rgba(244,116,43,0.08) 0%, transparent 60%)',
      },
      boxShadow: {
        zaa:    '0 0 40px rgba(244,116,43,0.2)',
        'zaa-lg': '0 12px 48px rgba(244,116,43,0.25)',
        gold:   '0 0 40px rgba(244,116,43,0.15)',
        deep:   '0 20px 60px rgba(0,0,0,0.6)',
      },
      borderColor: {
        DEFAULT:  'rgba(244,116,43,0.2)',
        zaa:      'rgba(244,116,43,0.3)',
        'zaa-soft':'rgba(244,116,43,0.12)',
      },
      animation: {
        float:       'float 4.5s ease-in-out infinite',
        shimmer:     'zaaShimmer 3.5s linear infinite',
        'fade-up':   'fadeInUp 0.65s ease forwards',
        'ken-burns': 'kenBurns 14s ease infinite',
        glow:        'zaaGlow 2.5s ease-in-out infinite',
        marquee:     'marquee 35s linear infinite',
        'marquee-reverse': 'marquee-reverse 40s linear infinite',
      },
    },
  },
  plugins: [],
};
