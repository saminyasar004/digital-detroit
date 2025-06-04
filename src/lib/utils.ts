import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function truncateToFullSentence(
	text: string,
	maxLength: number
): string {
	// Convert text to string and handle edge cases
	if (!text || maxLength <= 0) return "";
	const str = text.toString();

	// If string is shorter than maxLength, return it
	if (str.length <= maxLength) return str;

	// Find the last sentence-ending punctuation within maxLength
	const sentenceEndings = [".", "!", "?"];
	let lastSentenceEnd = 0;

	for (let i = 0; i < maxLength && i < str.length; i++) {
		if (sentenceEndings.includes(str[i])) {
			lastSentenceEnd = i + 1; // Include the punctuation
		}
	}

	// If no sentence ending found, return empty string
	if (lastSentenceEnd === 0) {
		return "";
	}

	// Return the substring up to the last sentence ending
	return str.substring(0, lastSentenceEnd).trim();
}
