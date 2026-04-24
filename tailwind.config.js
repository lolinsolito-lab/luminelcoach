/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    // Dark mode completely disabled - Light mode only
    theme: {
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
                // Luminel Luxury Wellness Palette
                luminel: {
                    porcelain: "var(--luminel-porcelain)",
                    champagne: "var(--luminel-champagne)",
                    gold: {
                        soft: "var(--luminel-gold-soft)",
                        DEFAULT: "var(--luminel-gold-soft)",
                    },
                    smoke: "var(--luminel-smoke)",
                    taupe: "var(--luminel-taupe)",

                    // Legacy Support
                    lavender: {
                        50: "var(--luminel-lavender-50)",
                        100: "var(--luminel-lavender-100)",
                        500: "var(--luminel-lavender-500)",
                        600: "var(--luminel-lavender-600)",
                    },
                    sage: {
                        50: "#E8F5E9",
                        100: "#C8E6C9",
                        600: "#43A047",
                        700: "#388E3C",
                    },
                    pearl: "var(--luminel-pearl)",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            boxShadow: {
                luminel: "var(--shadow-luminel)",
            },
            fontFamily: {
                sans: ["Inter", "sans-serif"],
                serif: ["DM Serif Display", "Playfair Display", "serif"],
                display: ["Playfair Display", "serif"],
            },
        },
    },
    plugins: [],
}
