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
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'sans': ['"Instrument Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"'],
				'display': ['"Instrument Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"'],
				'body': ['"Instrument Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"'],
				'mooxy': ['"Mochiy Pop One"', 'sans-serif'],
				'playfair': ['"Playfair Display"', 'serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				'high-contrast': 'hsl(var(--text-high-contrast))',
				'medium-contrast': 'hsl(var(--text-medium-contrast))',
				'readable': 'hsl(var(--text-readable))',
				cream: {
					DEFAULT: '37 25% 92%',
					50: '37 30% 95%',
					100: '37 25% 92%',
					200: '37 30% 88%',
					300: '37 35% 82%',
					400: '37 40% 78%',
					500: '37 45% 72%',
					600: '37 50% 68%',
					700: '37 55% 62%',
					800: '37 60% 58%',
					900: '37 65% 52%',
					950: '37 70% 48%',
				},
				green: {
					DEFAULT: '158 65% 25%',
					50: '158 35% 80%',
					100: '158 40% 70%',
					200: '158 45% 60%',
					300: '158 50% 50%',
					400: '158 45% 40%',
					500: '158 55% 35%',
					600: '158 65% 25%',
					700: '158 70% 20%',
					800: '158 75% 15%',
					900: '158 80% 12%',
					950: '158 85% 8%',
				},
				gray: {
					50: '37 15% 98%',
					100: '37 15% 96%',
					200: '37 10% 90%',
					300: '37 10% 85%',
					400: '210 10% 60%',
					500: '210 10% 40%',
					600: '210 15% 30%',
					700: '210 20% 20%',
					800: '210 25% 15%',
					900: '210 30% 10%',
					950: '210 35% 5%',
				},
				pastel: {
					DEFAULT: 'hsl(var(--primary))',
					50: 'hsl(158 35% 80%)',
					100: 'hsl(158 40% 70%)',
					200: 'hsl(158 45% 60%)',
					300: 'hsl(158 50% 50%)',
					400: 'hsl(158 45% 40%)',
					500: 'hsl(var(--primary))',
					600: 'hsl(158 70% 20%)',
					700: 'hsl(158 75% 15%)',
					800: 'hsl(158 80% 12%)',
					900: 'hsl(158 85% 8%)',
					950: 'hsl(158 90% 5%)',
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			fontSize: {
				'xs': ['0.75rem', { lineHeight: '1rem' }],
				'sm': ['0.875rem', { lineHeight: '1.25rem' }],
				'base': ['1rem', { lineHeight: '1.5rem' }],
				'lg': ['1.125rem', { lineHeight: '1.75rem' }],
				'xl': ['1.25rem', { lineHeight: '1.75rem' }],
				'2xl': ['1.5rem', { lineHeight: '2rem' }],
				'3xl': ['1.875rem', { lineHeight: '2.25rem' }],
				'4xl': ['2.25rem', { lineHeight: '2.5rem' }],
				'5xl': ['3rem', { lineHeight: '1' }],
				'6xl': ['3.75rem', { lineHeight: '1' }],
				'60': ['60px', { lineHeight: '75px' }],
				'display-sm': ['48px', { lineHeight: '60px' }],
				'display-xs': ['36px', { lineHeight: '45px' }],
			},
			spacing: {
				'18': '4.5rem',
				'88': '22rem',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'slide-up': {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'glow': {
					'0%, 100%': { boxShadow: '0 0 20px hsl(158 65% 25% / 0.3)' },
					'50%': { boxShadow: '0 0 30px hsl(158 65% 25% / 0.5)' }
				},
				'heading-gradient': {
					'0%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' },
					'100%': { backgroundPosition: '0% 50%' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out forwards',
				'slide-up': 'slide-up 0.6s ease-out forwards',
				'glow': 'glow 2s ease-in-out infinite',
				'heading-gradient': 'heading-gradient 3s ease infinite'
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'glass-gradient': 'linear-gradient(135deg, rgba(244,240,232,0.9) 0%, rgba(224,215,199,0.8) 100%)',
				'cream-gradient': 'linear-gradient(135deg, hsl(37 25% 92%), hsl(37 30% 85%))',
				'green-gradient': 'linear-gradient(135deg, hsl(158 65% 25%), hsl(158 80% 12%))',
				'cream-green-gradient': 'linear-gradient(135deg, hsl(37 25% 92%), hsl(158 35% 80%))',
				'glow-green': 'radial-gradient(circle, hsl(158 65% 25% / 0.4) 0%, transparent 70%)',
			},
			backdropBlur: {
				'xs': '2px',
			},
			boxShadow: {
				'glass': '0 8px 32px 0 rgba(45, 107, 66, 0.1)',
				'glass-lg': '0 25px 50px -12px rgba(45, 107, 66, 0.15)',
				'premium': '0 20px 40px rgba(45, 107, 66, 0.15)',
				'neumorphic': '8px 8px 16px rgba(45, 107, 66, 0.1), -8px -8px 16px rgba(255, 255, 255, 0.8)',
				'elevated': '0 20px 40px rgba(45, 107, 66, 0.2)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
