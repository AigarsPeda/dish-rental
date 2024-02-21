import { type Config } from "tailwindcss";
import { withUt } from "uploadthing/tw";

export default withUt({
  content: [
    "./src/**/*.{js,jsx,ts,tsx,mdx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  darkMode: "class",
}) satisfies Config;
