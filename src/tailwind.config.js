// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'farm-dark': '#0A110D', // Very dark green/black background
        'farm-tan': '#DCC7A4',  // The main text color
        'farm-muted': '#A49988' // Muted tan for sub-headers
      },
      fontFamily: {
        // A super bold, condensed font like 'Oswald' or a custom 'Shamgod'
        'shamgod': ['Oswald', 'Impact', 'sans-serif'], 
        // A clean monospaced font
        'mono': ['IBM Plex Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}