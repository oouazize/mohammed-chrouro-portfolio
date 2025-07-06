"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
	fetchCollections,
	fetchImages,
	type Collection,
	type Image,
} from "@/lib/data";

type ImageContextType = {
	images: Image[];
	collections: Collection[];
	collectionPreviews: Collection[];
	isLoading: boolean;
	refetchData: () => Promise<void>;
};

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export function ImageProvider({ children }: { children: React.ReactNode }) {
	const [images, setImages] = useState<Image[]>([]);
	const [collections, setCollections] = useState<Collection[]>([]);
	const [collectionPreviews, setCollectionPreviews] = useState<Collection[]>(
		[]
	);
	const [isLoading, setIsLoading] = useState(true);

	const loadData = async () => {
		setIsLoading(true);
		try {
			const fetchedCollections = await fetchCollections();
			const fetchedImages = await fetchImages();

			setCollections(fetchedCollections);
			setImages(fetchedImages);

			// Create collection previews
			const previews = fetchedCollections.map((collection) => ({
				...collection,
				previewImage: collection.images[0],
			}));
			setCollectionPreviews(previews);
		} catch (error) {
			console.error("Error loading image data:", error);
		} finally {
			setIsLoading(false);
		}
	};

	// Load data on initial mount
	useEffect(() => {
		loadData();
	}, []);

	const value = {
		images,
		collections,
		collectionPreviews,
		isLoading,
		refetchData: loadData,
	};

	return (
		<ImageContext.Provider value={value}>{children}</ImageContext.Provider>
	);
}

export function useImages() {
	const context = useContext(ImageContext);
	if (context === undefined) {
		throw new Error("useImages must be used within an ImageProvider");
	}
	return context;
}
