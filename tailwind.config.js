/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			container: {
				center: true,
				screens: {
					// sm: "640px",
					// md: "768px",
					// lg: "1024px",
					xl: "calc(100% - 2rem)",
					"2xl": "2100px",
				},
			},

			colors: {
				// Add custom colors here
				primary: "#FFDC58", // Gold
				secondary: "#1B97D8", // Dodger Blue
				accent: "#304750", // Orange Red
				sidebar: "#F1E9C8",
			},
		},
	},
	plugins: [],
};
