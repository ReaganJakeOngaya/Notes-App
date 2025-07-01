/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
      "!./node_modules/@fortawesome/**/*",
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: '#6d5dfc',
            hover: '#5b4bdf',
          },
          // Add your other custom colors here
        },
        // You can extend other theme values as needed
      },
    },
    plugins: [],
  }