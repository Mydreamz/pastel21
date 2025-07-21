
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
				'playfair': ['"Playfair Display"', 'serif'], // Keep as optional for specific use cases
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
				// New Cream Color System
				cream: {
					DEFAULT: '37 20% 96%',    // #FAF7F2 - Very light cream
					50: '37 25% 98%',         // #FEFCFA - Ultra light cream
					100: '37 20% 96%',        // #FAF7F2 - Very light cream
					200: '37 25% 94%',        // #F8F4EE - Light cream
					300: '37 30% 90%',        // #F0EBE3 - Soft cream
					400: '37 35% 85%',        // #E8E4DC - Cream border
					500: '37 40% 80%',        // #E0D8CE - Medium cream
					600: '37 45% 75%',        // #D6CCC0 - Deeper cream
					700: '37 50% 70%',        // #CCC0B2 - Dark cream
					800: '37 55% 65%',        // #C2B4A4 - Darker cream
					900: '37 60% 60%',        // #B8A896 - Darkest cream
					950: '37 65% 55%',        // #AE9C88 - Deep cream
				},
				green: {
					DEFAULT: '146 50% 30%',   // #4A7C59 - Rich emerald
					50: '146 30% 85%',        // #D4E6D8 - Very light green
					100: '146 30% 75%',       // #B8D9BE - Light green
					200: '146 30% 65%',       // #9CCCA4 - Soft green
					300: '146 30% 55%',       // #80BF8A - Medium light green
					400: '146 30% 50%',       // #6B9080 - Sage green
					500: '146 40% 40%',       // #5A8068 - Medium green
					600: '146 50% 30%',       // #4A7C59 - Rich emerald
					700: '146 60% 25%',       // #3D6849 - Deep green
					800: '146 70% 20%',       // #2F5439 - Darker green
					900: '146 80% 15%',       // #2D5016 - Deep forest green
					950: '146 85% 12%',       // #1F3811 - Darkest green
				},
				// Enhanced gray scale with warm tones
				gray: {
					50: '37 15% 98%',         // #FAFAFA - Very light warm gray
					100: '37 15% 96%',        // #F4F4F5 - Light warm gray
					200: '37 10% 90%',        // #E4E4E7 - Medium light gray
					300: '37 10% 85%',        // #D4D4D8 - Medium gray
					400: '210 10% 65%',       // #A1A1AA - Medium dark gray
					500: '210 10% 45%',       // #71717A - Dark gray
					600: '210 15% 35%',       // #52525B - Darker gray
					700: '210 20% 25%',       // #3F3F46 - Very dark gray
					800: '210 25% 15%',       // #27272A - Almost black
					900: '210 30% 10%',       // #18181B - Near black
					950: '210 35% 5%',        // #09090B - Black
				},
				pastel: {
					DEFAULT: '146 50% 30%',   // #4A7C59 - Rich emerald
					50: '146 30% 85%',        // #D4E6D8 - Very light green
					100: '146 30% 75%',       // #B8D9BE - Light green
					200: '146 30% 65%',       // #9CCCA4 - Soft green
					300: '146 30% 55%',       // #80BF8A - Medium light green
					400: '146 30% 50%',       // #6B9080 - Sage green
					500: '146 50% 30%',       // #4A7C59 - Rich emerald
					600: '146 60% 25%',       // #3D6849 - Deep green
					700: '146 70% 20%',       // #2F5439 - Darker green
					800: '146 80% 15%',       // #2D5016 - Deep forest green
					900: '146 85% 12%',       // #1F3811 - Darkest green
					950: '146 90% 10%',       // #0F2008 - Ultra dark green
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
				'60': ['60px', { lineHeight: '75px' }], // Instrument Sans signature size
				'display-sm': ['48px', { lineHeight: '60px' }], // Scaled for tablet
				'display-xs': ['36px', { lineHeight: '45px' }], // Scaled for mobile
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
					'0%, 100%': { boxShadow: '0 0 20px hsl(146 50% 30% / 0.3)' },
					'50%': { boxShadow: '0 0 30px hsl(146 50% 30% / 0.5)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out forwards',
				'slide-up': 'slide-up 0.6s ease-out forwards',
				'glow': 'glow 2s ease-in-out infinite'
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'glass-gradient': 'linear-gradient(135deg, rgba(248,244,238,0.7) 0%, rgba(240,235,227,0.5) 100%)',
				'cream-gradient': 'linear-gradient(135deg, hsl(37 20% 96%), hsl(37 25% 92%))',
				'green-gradient': 'linear-gradient(135deg, hsl(146 50% 30%), hsl(146 80% 15%))',
				'cream-green-gradient': 'linear-gradient(135deg, hsl(37 20% 96%), hsl(146 30% 85%))',
				'glow-green': 'radial-gradient(circle, hsl(146 50% 30% / 0.4) 0%, transparent 70%)',
			},
			backdropBlur: {
				'xs': '2px',
			},
			boxShadow: {
				'glass': '0 8px 32px 0 rgba(74, 124, 89, 0.1)',
				'glass-lg': '0 25px 50px -12px rgba(74, 124, 89, 0.15)',
				'premium': '0 20px 40px rgba(74, 124, 89, 0.15)',
				'neumorphic': '8px 8px 16px rgba(74, 124, 89, 0.1), -8px -8px 16px rgba(255, 255, 255, 0.8)',
				'elevated': '0 20px 40px rgba(74, 124, 89, 0.2)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
