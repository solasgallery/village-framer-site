import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#F7F4EF',
        charcoal: '#1C1C1A',
        stone: '#C4AE8A',
        deep: '#111110',
        // Village Framer gets a slightly warmer accent
        walnut: '#8B7355',
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'serif'],
        body: ['Jost', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
