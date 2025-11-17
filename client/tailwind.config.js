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
        'dark-gray': '#6B7280',
        'orange-dark': '#ED4122',
        'orange-light': '#FF8B67',
        'blue-dark': '#032746',
        'cinnebar-red': '#ED4122',
        'moonstone-blue': '#6CA6C1',
        'orange-dark-2' :'#E43F21',
        'ash-gray' : '#C6D8D3',
        'papaya-whip' : '#FDF0D5',
      },
      fontFamily: {
        'archivo': ['Archivo', 'sans-serif'],
        'roboto': ['Roboto', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
        'dm-sans': ['DM Sans', 'sans-serif'],
      },
      backgroundImage: {
        'soft-orange-fade': 'linear-gradient(136.4deg, rgba(248, 54, 0, 0.5) -52.28%, rgba(253, 240, 213, 0) 98.9%)',
        'orange-gradient': 'linear-gradient(90deg, #ED4122 0%, #FF8B67 100%)',
        'soft-gradient': 'linear-gradient(137.81deg, rgba(253, 240, 213, 0) -78.25%, rgba(198, 216, 211, 0.5) 107.1%)',
        'soft-blue-green': 'linear-gradient(180deg, rgba(230, 235, 226, 0.63) 0%, rgba(108, 166, 193, 0.63) 100%)',
        'light-gradient': 'linear-gradient(90deg, #FEF9F3 0%, rgba(245, 247, 246, 0.42) 100%)',
        'blue-gradient': 'linear-gradient(98.53deg, #032746 -0.65%, #6CA6C1 139.01%)',
        'bluewhite-gradient': 'linear-gradient(135deg, #6CA6C1 0%, #032746 100%)',
      },
      boxShadow: {
        'input': '0px 4px 6px -4px rgba(0, 0, 0, 0.1), 0px 10px 15px -3px rgba(0, 0, 0, 0.1)',
        'card': '6px 6px 54px 0px rgba(0, 0, 0, 0.05)',
        'card-sm': '0px 6px 54px 0px rgba(0, 0, 0, 0.05)',
        'summary': '0px 6px 40px rgba(3, 39, 70, 0.08)',
        'dashboard': '0px 6px 54px 0px rgba(0, 0, 0, 0.05)',
        'filter': '0px 8px 20px rgba(3, 39, 70, 0.05)',
        'filter-hover': '0px 8px 20px rgba(3, 39, 70, 0.08)',
        'filter-lg': '0px 10px 40px rgba(3, 39, 70, 0.08)',
        'small': '0px 0px 5px 0px rgba(0, 0, 0, 0.1)',
        'hover': '0px 12px 34px rgba(3, 39, 70, 0.08)',
        'empty': '0px 6px 24px rgba(0, 0, 0, 0.05)',
        'user-card': '0px 4px 18px rgba(3, 39, 70, 0.05)',
        'modal': '0px 24px 60px rgba(3, 39, 70, 0.08)',
        'dropdown': '0px 18px 45px rgba(3, 39, 70, 0.18)',
        'content': '2px 2px 10px 0px rgba(0, 0, 0, 0.05)',
        'button': '0px 6px 20px rgba(3, 39, 70, 0.08)',
        'footer': '0px -2px 10px 0px rgba(0, 0, 0, 0.05)',
        'header-dropdown': '0px 4px 6px -4px rgba(0, 0, 0, 0.10), 0px 10px 15px -3px rgba(0, 0, 0, 0.10)',
      },
      screens: {
        'mobile': '320px',
        'tablet': '640px',
        'laptop': '1024px',
        'desktop': '1920px',
        // Standard Tailwind breakpoints
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1400px', // Max width that works well on 1366px, 1440px, and 1920px
        },
      },
    },
  },
  plugins: [],
}

