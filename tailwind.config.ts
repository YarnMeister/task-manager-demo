import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Custom colors matching your specifications
        // Background: #2D2D2A (dark olive-gray)
        "dark-bg-primary": "#2D2D2A", // Main background
        // Row color: #4C4C47 (medium olive-gray)
        "dark-bg-secondary": "#4C4C47", // Cards and elevated surfaces (rows)
        "dark-bg-tertiary": "#5A5A54", // Input fields and interactive elements (slightly lighter)
        "dark-bg-quaternary": "#68685F", // Hover states (even lighter)

        // Text colors
        "dark-text-primary": "#ffffff", // Primary text
        "dark-text-secondary": "#b3b3b3", // Secondary text
        "dark-text-tertiary": "#808080", // Tertiary text/placeholders

        // Separator/border colors
        "dark-separator": "#505050",
        "dark-border": "#606060",

        // Accent colors from the image
        "accent-purple": "#8B5CF6", // Purple dot
        "accent-orange": "#F59E0B", // Orange/yellow dot
        "accent-cyan": "#06B6D4", // Cyan/teal dot
        "accent-blue": "#3B82F6", // Blue for icons

        // iOS System Colors - Light Mode
        "ios-background": "#F2F2F7",
        "ios-secondary-background": "#FFFFFF",
        "ios-tertiary-background": "#FFFFFF",
        "ios-grouped-background": "#F2F2F7",
        "ios-secondary-grouped-background": "#FFFFFF",
        "ios-tertiary-grouped-background": "#F2F2F7",

        // iOS Label Colors - Light Mode
        "ios-label": "#000000",
        "ios-secondary-label": "#3C3C43",
        "ios-tertiary-label": "#3C3C43",
        "ios-quaternary-label": "#3C3C43",
        "ios-placeholder": "#3C3C43",

        // iOS Separator Colors - Light Mode
        "ios-separator": "#C6C6C8",
        "ios-opaque-separator": "#C6C6C8",

        // iOS System Colors - Dark Mode (updated to match new colors)
        "ios-dark-background": "#2D2D2A",
        "ios-dark-secondary-background": "#4C4C47",
        "ios-dark-tertiary-background": "#5A5A54",
        "ios-dark-grouped-background": "#2D2D2A",
        "ios-dark-secondary-grouped-background": "#4C4C47",
        "ios-dark-tertiary-grouped-background": "#5A5A54",

        // iOS Label Colors - Dark Mode
        "ios-dark-label": "#ffffff",
        "ios-dark-secondary-label": "#b3b3b3",
        "ios-dark-tertiary-label": "#808080",
        "ios-dark-quaternary-label": "#666666",
        "ios-dark-placeholder": "#808080",

        // iOS Separator Colors - Dark Mode
        "ios-dark-separator": "#505050",
        "ios-dark-opaque-separator": "#606060",

        // iOS System Colors (updated to match the accent colors)
        "ios-blue": "#3B82F6",
        "ios-green": "#10B981",
        "ios-indigo": "#8B5CF6",
        "ios-orange": "#F59E0B",
        "ios-pink": "#EC4899",
        "ios-purple": "#8B5CF6",
        "ios-red": "#EF4444",
        "ios-teal": "#06B6D4",
        "ios-yellow": "#F59E0B",

        // iOS Gray Colors - Dark Mode (matching the new color scheme)
        "ios-dark-gray": "#808080",
        "ios-dark-gray2": "#666666",
        "ios-dark-gray3": "#68685F",
        "ios-dark-gray4": "#5A5A54",
        "ios-dark-gray5": "#4C4C47",
        "ios-dark-gray6": "#2D2D2A",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "12px", // iOS standard corner radius
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      screens: {
        xs: "390px", // iPhone 12 optimization
        "3xl": "1920px", // Large desktop optimization
        "4xl": "2560px", // 28" 4K optimization
      },
      fontFamily: {
        system: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "SF Pro Text",
          "Helvetica Neue",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        ios: "0 1px 3px 0 rgba(0, 0, 0, 0.5), 0 1px 2px 0 rgba(0, 0, 0, 0.3)",
        "ios-lg": "0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)",
        "dark-elevated": "0 4px 12px 0 rgba(0, 0, 0, 0.6), 0 2px 4px 0 rgba(0, 0, 0, 0.4)",
      },
      spacing: {
        "safe-top": "env(safe-area-inset-top, 12px)",
        "safe-bottom": "env(safe-area-inset-bottom, 12px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
