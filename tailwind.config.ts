
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
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
				// Primary Color Palette
				primary: {
					deep: "#1a2332", // Primary Deep Blue
					DEFAULT: "#2d3748", // Primary Blue
					light: "#4a5568", // Cool Gray
				},
				luxury: {
					gold: "#f6ad55", // Luxury Gold
					goldHover: "#ed8936", // Warning Primary
					goldActive: "#dd6b20",
				},
				background: {
					soft: "#fafafa", // Soft White
					pure: "#ffffff", // Pure White
					ultra: "#f7fafc", // Ultra Light Gray
				},
				text: {
					warm: "#718096", // Warm Gray
					cool: "#4a5568", // Cool Gray
					muted: "#a0aec0",
				},
				border: {
					light: "#e2e8f0", // Light Gray
					ultra: "#f1f5f9",
				},
				
				// Functional Colors
				success: {
					DEFAULT: "#38a169", // Success Primary
					light: "#9ae6b4", // Success Light
					dark: "#276749", // Success Dark
				},
				warning: {
					DEFAULT: "#ed8936", // Warning Primary
					light: "#fbd38d", // Warning Light
					dark: "#c05621", // Warning Dark
				},
				error: {
					DEFAULT: "#e53e3e", // Error Primary
					light: "#feb2b2", // Error Light
					dark: "#c53030", // Error Dark
				},
				info: {
					DEFAULT: "#3182ce", // Info Primary
					light: "#90cdf4", // Info Light
					dark: "#2c5282", // Info Dark
				},

				// Legacy colors for backward compatibility
				electric: {
					blue: "#1a2332",
					purple: "#2d3748",
				},
				neon: {
					purple: "#4a5568",
					red: "#e53e3e",
				},
				matrix: {
					green: "#38a169",
				},
				gold: "#f6ad55",
				charcoal: "#2d3748",
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
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
				"fade-in": {
					"0%": { opacity: "0", transform: "translateY(10px)" },
					"100%": { opacity: "1", transform: "translateY(0)" },
				},
				"slide-in": {
					"0%": { transform: "translateX(-100%)" },
					"100%": { transform: "translateX(0)" },
				},
				"pulse-glow": {
					"0%, 100%": { opacity: "1" },
					"50%": { opacity: "0.5" },
				},
				"gradient-shift": {
					"0%, 100%": { backgroundPosition: "0% 50%" },
					"50%": { backgroundPosition: "100% 50%" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"fade-in": "fade-in 0.5s ease-out",
				"slide-in": "slide-in 0.3s ease-out",
				"pulse-glow": "pulse-glow 2s ease-in-out infinite",
				"gradient-shift": "gradient-shift 3s ease infinite",
			},
			backgroundImage: {
				"gradient-primary": "linear-gradient(135deg, #1a2332 0%, #2d3748 100%)",
				"gradient-secondary": "linear-gradient(135deg, #fafafa 0%, #ffffff 100%)",
				"gradient-accent": "linear-gradient(135deg, #f6ad55 0%, #ed8936 100%)",
				"gradient-subtle": "linear-gradient(180deg, #fafafa 0%, #f7fafc 100%)",
			},
			boxShadow: {
				"small": "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
				"medium": "0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)",
				"large": "0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)",
				"extra-large": "0 25px 50px rgba(0, 0, 0, 0.15), 0 10px 20px rgba(0, 0, 0, 0.1)",
				"glow": "0 0 20px rgba(246, 173, 85, 0.3)",
				"glow-strong": "0 0 30px rgba(246, 173, 85, 0.5)",
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
