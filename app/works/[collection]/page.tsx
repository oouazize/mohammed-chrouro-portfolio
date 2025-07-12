"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { fetchCollections, type Collection } from "@/lib/data";
import { getImageIndex } from "@/lib/utils";

export default function CollectionPage() {
	const { collection: collectionId } = useParams();
	const [currentIndex, setCurrentIndex] = useState(0);
	const [collection, setCollection] = useState<Collection | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function loadCollectionImages() {
			setLoading(true);
			const collections = await fetchCollections();
			const foundCollection = collections.find((c) => c.id === collectionId);

			if (foundCollection) {
				setCollection(foundCollection);

				// Check for initial image index from sessionStorage
				const initialImageIndex = sessionStorage.getItem("initialImageIndex");
				if (initialImageIndex) {
					const index = parseInt(initialImageIndex, 10);
					if (index >= 0 && index < foundCollection.images.length) {
						setCurrentIndex(index);
					}
					// Clear the sessionStorage after using it
					sessionStorage.removeItem("initialImageIndex");
				}
			}
			setLoading(false);
		}

		loadCollectionImages();
	}, [collectionId]);

	const nextImage = () => {
		if (!collection || collection.images.length === 0) return;
		setCurrentIndex((prev) => (prev + 1) % collection.images.length);
	};

	const prevImage = () => {
		if (!collection || collection.images.length === 0) return;
		setCurrentIndex(
			(prev) => (prev - 1 + collection.images.length) % collection.images.length
		);
	};

	const handleLeftClick = () => {
		prevImage();
	};

	const handleRightClick = () => {
		nextImage();
	};

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "ArrowLeft") prevImage();
			if (e.key === "ArrowRight") nextImage();
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [collection?.images.length]);

	return (
		<div className="flex flex-col h-[calc(100dvh-64px)]">
			<div className="flex-1 flex items-center justify-center px-6 z-50">
				<div className="relative w-full h-full flex items-center justify-center">
					{loading ? (
						<div className="flex items-center justify-center h-full">
							<p>Loading images...</p>
						</div>
					) : !collection ? (
						<div className="flex items-center justify-center h-full">
							<p>Collection not found</p>
						</div>
					) : collection.images.length > 0 ? (
						<>
							{/* Clickable areas for navigation */}
							<div
								className="absolute left-0 top-0 w-1/2 h-full z-10 cursor-pointer"
								onClick={handleLeftClick}
							/>
							<div
								className="absolute right-0 top-0 w-1/2 h-full z-10 cursor-pointer"
								onClick={handleRightClick}
							/>

							<Image
								src={
									collection.images[currentIndex]?.image || "/placeholder.svg"
								}
								alt={collection.images[currentIndex]?.title || ""}
								width={600}
								height={800}
								className="object-contain w-full h-[70dvh]"
								priority
							/>
						</>
					) : (
						<div className="flex items-center justify-center h-full">
							<p>No images found in this collection</p>
						</div>
					)}
				</div>
			</div>

			{/* Bottom Navigation - Fixed at bottom */}
			{collection && collection.images.length > 0 && (
				<div className="flex justify-between items-center p-6 py-2 relative z-50">
					<button
						onClick={prevImage}
						className="hover:text-[#8f8f8f] transition-colors flex items-center space-x-1"
					>
						<span>Previous</span>
					</button>

					<div className="text-center">
						<span>
							{getImageIndex(currentIndex + 1)}.{" "}
							{collection.images[currentIndex]?.title}
						</span>
					</div>

					<button
						onClick={nextImage}
						className="hover:text-[#8f8f8f] transition-colors flex items-center space-x-1"
					>
						<span>Next</span>
					</button>
				</div>
			)}
		</div>
	);
}
