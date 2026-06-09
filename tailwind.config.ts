import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "Noto Sans",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
        serif: ["Georgia", "Times New Roman", "Times", "ui-serif", "serif"],
      },
      colors: {
        manus: {
          "bg-gray": "#f8f8f7",
          "bg-white": "#ffffff",
          "bg-nav": "#ebebeb",
          "text-primary": "#34322d",
          "text-secondary": "#5e5e5b",
          "text-tertiary": "#7f7f7f",
          "text-disable": "#b9b9b7",
          "border-main": "rgba(0,0,0,0.06)",
          "border-dark": "rgba(0,0,0,0.12)",
          "button-black": "#1a1a19",
        },
      },
      maxWidth: {
        manus: "1080px",
      },
    },
  },
  plugins: [],
};
export default config;
