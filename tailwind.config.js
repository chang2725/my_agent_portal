// tailwind.config.js
module.exports = {
  content: [
    "./public/**/*.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // this is your custom “display” font for big headings
        display: ['Anton', 'sans-serif'],
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar-hide"),
  ],
}

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        peach: '#fff6e8',
        darkgray: '#202020',
        coral: '#ff8383',
        bright: '#ffffff',
        sun: '#f9e959', 
      },
    },
  },
  plugins: [],
};
