
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
				'sans': ['Inter', 'system-ui', 'sans-serif'],
				'display': ['Poppins', 'Inter', 'sans-serif'],
				'body': ['Inter', 'system-ui', 'sans-serif'],
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
				// Dark theme colors
				dark: {
					bg: '#0a0a0a',
					surface: '#1a1a1a',
					border: '#333333',
					text: '#ffffff',
					'text-secondary': '#a1a1aa',
				},
				// Neon accent colors
				neon: {
					blue: '#00d4ff',
					purple: '#8b5cf6',
					magenta: '#ff0080',
					cyan: '#06b6d4',
				},
				// Light theme colors (cream-based)
				cream: {
					DEFAULT: '#F8F0E5',
					50: '#FEFCF9',
					100: '#F8F0E5',
					200: '#F2E5D5',
					300: '#E8D5BC',
					400: '#DFCAAE',
					500: '#D6BFA0',
					600: '#C9AF8B',
					700: '#BCA077',
					800: '#AE9064',
					900: '#95794F',
					950: '#7D6642',
				},
				pastel: {
					DEFAULT: '#E91E63',
					50: '#FCE4EC',
					100: '#F8BBD9',
					200: '#F48FB1',
					300: '#F06292',
					400: '#EC407A',
					500: '#E91E63',
					600: '#D81B60',
					700: '#C2185B',
					800: '#AD1457',
					900: '#880E4F',
					950: '#4A0E2F',
				},
				gray: {
					50: '#FAFAF9',
					100: '#F4F4F3',
					200: '#E5E5E2',
					300: '#D6D6D0',
					400: '#ABABAB',
					500: '#808080',
					600: '#666666',
					700: '#4D4D4D',
					800: '#333333',
					900: '#1A1A1A',
					950: '#0D0D0D',
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
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'pulse-gentle': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.8' }
				},
				'shimmer': {
					'0%': { backgroundPosition: '-500px 0' },
					'100%': { backgroundPosition: '500px 0' }
				},
				'glow': {
					'0%, 100%': { opacity: '0.8', transform: 'scale(1)' },
					'50%': { opacity: '1', transform: 'scale(1.05)' }
				},
				'rotate-slow': {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' }
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'slide-in-right': {
					'0%': { transform: 'translateX(100%)', opacity: '0' },
					'100%': { transform: 'translateX(0)', opacity: '1' }
				},
				'slide-out-left': {
					'0%': { transform: 'translateX(0)', opacity: '1' },
					'100%': { transform: 'translateX(-100%)', opacity: '0' }
				},
				'neon-glow': {
					'0%, 100%': { 
						boxShadow: '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor',
						opacity: '0.8'
					},
					'50%': { 
						boxShadow: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor',
						opacity: '1'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'float': 'float 6s ease-in-out infinite',
				'float-slow': 'float 10s ease-in-out infinite',
				'pulse-gentle': 'pulse-gentle 3s ease-in-out infinite',
				'shimmer': 'shimmer 2s linear infinite',
				'glow': 'glow 5s ease-in-out infinite',
				'rotate-slow': 'rotate-slow 10s linear infinite',
				'fade-in': 'fade-in 0.5s ease-out forwards',
				'slide-in-right': 'slide-in-right 0.5s ease-out forwards',
				'slide-out-left': 'slide-out-left 0.5s ease-out forwards',
				'neon-glow': 'neon-glow 2s ease-in-out infinite alternate',
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'glow-cream': 'radial-gradient(circle, rgba(248, 240, 229, 0.3) 0%, rgba(248, 240, 229, 0) 70%)',
				'glow-pastel': 'radial-gradient(circle, rgba(255, 202, 212, 0.2) 0%, rgba(255, 202, 212, 0) 70%)',
				'dark-radial': 'radial-gradient(circle at center, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
				'neon-gradient': 'linear-gradient(135deg, #00d4ff 0%, #8b5cf6 50%, #ff0080 100%)',
			},
			boxShadow: {
				'neumorphic': '0 8px 32px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.08)',
				'neumorphic-inset': 'inset 2px 2px 5px rgba(0, 0, 0, 0.05), inset -2px -2px 5px rgba(255, 255, 255, 0.7)',
				'elevated': '0 10px 40px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.06)',
				'glass': '0 8px 32px rgba(0, 0, 0, 0.37)',
				'glass-dark': '0 8px 32px rgba(0, 0, 0, 0.6)',
				'neon-glow': '0 0 20px rgba(0, 212, 255, 0.3), 0 0 40px rgba(139, 92, 246, 0.2)',
				'neon-glow-hover': '0 0 30px rgba(0, 212, 255, 0.5), 0 0 60px rgba(139, 92, 246, 0.3)',
			},
			backdropBlur: {
				'xs': '2px',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
