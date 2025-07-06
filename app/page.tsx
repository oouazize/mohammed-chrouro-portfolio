"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useImages } from "@/context/image-context";

export default function HomePage() {
	const [currentIndex, setCurrentIndex] = useState(0);
	const { images, isLoading } = useImages();

	const nextImage = () => {
		if (images.length === 0) return;
		setCurrentIndex((prev) => (prev + 1) % images.length);
	};

	const prevImage = () => {
		if (images.length === 0) return;
		setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
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
	}, [images.length]);

	return (
		<div className="flex flex-col h-[calc(100dvh-64px)]">
			<div className="flex-1 flex items-center justify-center px-6 z-50">
				<div className="relative w-full h-full flex items-center justify-center">
					{isLoading ? (
						<div className="flex items-center justify-center h-full">
							<p>Loading images...</p>
						</div>
					) : images.length > 0 ? (
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
								src={images[currentIndex]?.image || "/placeholder.svg"}
								alt={images[currentIndex]?.title || ""}
								fill
								className="object-contain"
								priority
							/>
						</>
					) : (
						<div className="flex items-center justify-center h-full">
							<p>No images found</p>
						</div>
					)}
				</div>
			</div>

			{/* Bottom Navigation - Fixed at bottom */}
			<div className="flex justify-between items-center p-6 py-2 text-sm relative z-50">
				<button
					onClick={prevImage}
					className="hover:text-[#8f8f8f] transition-colors flex items-center space-x-1"
				>
					<span>Previous</span>
				</button>

				<div className="text-center">
					{images.length > 0 && (
						<span>
							{images[currentIndex]?.id}. {images[currentIndex]?.title}
						</span>
					)}
				</div>

				<button
					onClick={nextImage}
					className="hover:text-[#8f8f8f] transition-colors flex items-center space-x-1"
				>
					<span>Next</span>
				</button>
			</div>
		</div>
	);
}
