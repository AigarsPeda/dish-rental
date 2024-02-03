import { type Config } from "tailwindcss";
import { withUt } from "uploadthing/tw";
// import { fontFamily } from "tailwindcss/defaultTheme";

export default withUt({
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}) satisfies Config;
