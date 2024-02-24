/** @type {import('tailwindcss').Config} */
export const content = ["./*.{html,js}"];
export const theme = {
	extend: {},
	fontFamily: {
		poppin: ['"Poppins", sans-serif;'],
	},
};
export const plugins = [require("daisyui")];
