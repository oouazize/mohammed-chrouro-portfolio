import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const getImageIndex = (collectionId: number) => {
	if (collectionId < 10) {
		return "00" + collectionId;
	} else if (collectionId < 100) {
		return "0" + collectionId.toString();
	}
	return collectionId.toString();
};
