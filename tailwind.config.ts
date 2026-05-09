import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--bg)",
        surface: {
          DEFAULT: "var(--surface-2)",
          1: "var(--surface-1)",
          2: "var(--surface-2)",
          3: "var(--surface-3)",
          4: "var(--surface-4)",
          warm: "var(--surface-3)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          dark: "var(--primary-dark)",
        },
        gold: "var(--gold)",
        sage: "var(--sage)",
        accent: "var(--accent)",
        peach: "var(--peach)",
        "text-primary":   "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-tertiary":  "var(--text-tertiary)",
        border: "var(--border)",
        error: "var(--error)",
      },
      fontFamily: {
        serif: ["var(--font-display)", "Georgia", "serif"],
        sans:  ["var(--font-body)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
        body:    ["var(--font-body)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "20px",
        "3xl": "24px",
      },
      maxWidth: {
        app: "430px",
      },
      boxShadow: {
        sm:      "var(--shadow-sm)",
        md:      "var(--shadow-md)",
        lg:      "var(--shadow-lg)",
        primary: "var(--shadow-primary)",
        gold:    "var(--shadow-gold)",
      },
    },
  },
  plugins: [],
};

export default config;
