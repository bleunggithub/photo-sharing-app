module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    backgroundColor: {
      'white': {
        0: '#ffffff00',
        50: '#ffffff80',
        80: '#ffffffCC',
        100: '#ffffff',
      },
      'accent': {
        40: '#ff474766',
        50: '#ff474780',
        60: '#ff474799',
        100: '#ff4747',
      },
      'grey': {
        40: '#d3d3d366',
        50: '#d3d3d380',
        60: '#d3d3d399',
      }
    },
    borderColor: {
      'lightGrey':'#d3d3d3',
      'accent': '#ff4747',
    },
    textColor: {
      'accent':'#ff4747',
      'red': '#ff0000',
      'white': '#fff',
      'normal': '#2c2c2c',
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
