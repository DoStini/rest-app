/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    'node_modules/preline/dist/*.js',
  ],
  theme: {
    colors: {
        primary: "#372F22",
        secondary: "#FFEDD8",
        tertiary: "#96744E",
        textPrimary: "#000000",
        textSecondary: "#ffffff",
        separator: "#A5A5A5",
        warning: "#C33A3A",
        success: "#34A300",
        white: "#ffffff"
    },
    fontFamily: {
        extend: {
            fontFamily: {
              sans: ['var(--font-lato)']
            }
        }
    }
  },
  plugins: [
    require('preline/plugin'),
  ],
}
