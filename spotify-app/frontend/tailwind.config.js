import { mtConfig } from "@material-tailwind/react";

module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}',    "./node_modules/@material-tailwind/react/**/*.{js,ts,jsx,tsx}"
],
  theme: {
    extend: {},
  },
  plugins: [mtConfig],
}
