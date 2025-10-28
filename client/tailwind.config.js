/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'oxford-blue': '#032746',
        'orange-dark': '#ED4122',
        'orange-light': '#FF8B67',
        'blue-dark': '#032746',
        'blue-light': '#6CA6C1',
        'cinnebar-red': '#ED4122',
        'moonstone-blue': '#6CA6C1',
        'orange-dark-2' :'#E43F21'
      },
      fontFamily: {
        'archivo': ['Archivo', 'sans-serif'],
        'roboto': ['Roboto', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'soft-orange-fade': 'linear-gradient(136.4deg, rgba(248, 54, 0, 0.5) -52.28%, rgba(253, 240, 213, 0) 98.9%)',
        'orange-gradient': 'linear-gradient(90deg, #ED4122 0%, #FF8B67 100%)',
        'soft-gradient': 'linear-gradient(137.81deg, rgba(253, 240, 213, 0) -78.25%, rgba(198, 216, 211, 0.5) 107.1%)',
        'soft-blue-green': 'linear-gradient(180deg, rgba(230, 235, 226, 0.63) 0%, rgba(108, 166, 193, 0.63) 100%)',
        'light-gradient': 'linear-gradient(90deg, #FEF9F3 0%, rgba(245, 247, 246, 0.42) 100%)',
        'blue-gradient': 'linear-gradient(98.53deg, #032746 -0.65%, #6CA6C1 139.01%)',
      },
      screens: {
        'mobile': '320px',
        'tablet': '640px',
        'laptop': '1024px',
        'desktop': '1920px',
      },
    },
  },
  plugins: [],
}

