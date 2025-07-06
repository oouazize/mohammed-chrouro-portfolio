"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useImages } from "@/context/image-context";
import { type Collection } from "@/lib/data";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function OverviewPage() {
	const { collections, collectionPreviews, isLoading } = useImages();
	const [viewMode, setViewMode] = useState<"list" | "grid">("list");
	const [hoveredCollection, setHoveredCollection] = useState<string | null>(
		null
	);
	const [selectedCollection, setSelectedCollection] =
		useState<Collection | null>(null);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const isHovered = useRef(false);
	const [slideshowIndex, setSlideshowIndex] = useState(0);

	// Slideshow effect when no collection is hovered
	useEffect(() => {
		if (hoveredCollection) isHovered.current = true;
		else if (!hoveredCollection && collectionPreviews.length > 0) {
			const interval = setInterval(() => {
				setSlideshowIndex(
					(prevIndex) => (prevIndex + 1) % collectionPreviews.length
				);
			}, 3000); // Change image every 3 seconds

			return () => clearInterval(interval);
		}
	}, [hoveredCollection, collectionPreviews]);

	const openCollection = (collection: Collection) => {
		setSelectedCollection(collection);
		setCurrentImageIndex(0);
	};

	const closeCollection = () => {
		setSelectedCollection(null);
		setCurrentImageIndex(0);
	};

	const nextImage = () => {
		if (selectedCollection) {
			setCurrentImageIndex(
				(prev) => (prev + 1) % selectedCollection.images.length
			);
		}
	};

	const prevImage = () => {
		if (selectedCollection) {
			setCurrentImageIndex(
				(prev) =>
					(prev - 1 + selectedCollection.images.length) %
					selectedCollection.images.length
			);
		}
	};

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p>Loading collections...</p>
			</div>
		);
	}

	return (
		<div className="min-h-screen">
			<div className="grid grid-cols-5 md:grid-cols-12 z-10 relative">
				<div className="flex flex-col col-end-auto col-start-3 md:col-start-5 items-start space-y-2 mt-1 md:pl-2 text-xs">
					<button
						onClick={() => setViewMode("list")}
						className={`${
							viewMode === "list"
								? `${
										!isHovered.current || hoveredCollection
											? "text-white"
											: "text-gray-600"
								  } font-medium`
								: "hover:text-gray-600"
						} transition-colors`}
					>
						List
					</button>
					<button
						onClick={() => setViewMode("grid")}
						className={`${
							viewMode === "grid"
								? "text-gray-600 font-medium"
								: "hover:text-gray-600"
						} transition-colors`}
					>
						Grid
					</button>
				</div>
			</div>

			{/* Collection Modal */}
			{selectedCollection && (
				<div className="fixed inset-0 z-40">
					{/* Close Button */}
					<button
						onClick={closeCollection}
						className="absolute top-6 right-6 z-50 p-2 hover:bg-gray-200 rounded-full transition-colors"
					>
						<X size={20} />
					</button>

					{/* Collection Viewer */}
					<div className="flex flex-col items-center justify-center h-full px-6">
						<div className="relative max-w-2xl w-full">
							{/* Clickable areas for navigation */}
							<div
								className="absolute left-0 top-0 w-1/2 h-full z-10 cursor-pointer"
								onClick={prevImage}
							/>
							<div
								className="absolute right-0 top-0 w-1/2 h-full z-10 cursor-pointer"
								onClick={nextImage}
							/>

							<Image
								src={
									selectedCollection.images[currentImageIndex]?.image ||
									"/placeholder.svg"
								}
								alt={selectedCollection.images[currentImageIndex]?.title || ""}
								width={600}
								height={800}
								className="w-full h-96 object-cover"
								priority
							/>
						</div>

						{/* Collection Navigation */}
						<div className="flex justify-between items-center w-full max-w-2xl mt-6 text-sm">
							<button
								onClick={prevImage}
								className="hover:text-gray-600 transition-colors flex items-center space-x-1"
							>
								<ChevronLeft size={16} />
								<span>Previous</span>
							</button>

							<div className="text-center">
								<div className="font-medium">{selectedCollection.name}</div>
								<div className="text-xs mt-1">
									{selectedCollection.images[currentImageIndex]?.id}.{" "}
									{selectedCollection.images[currentImageIndex]?.title}
								</div>
								<div className="text-xs text-gray-500 mt-1">
									{currentImageIndex + 1} of {selectedCollection.images.length}
								</div>
							</div>

							<button
								onClick={nextImage}
								className="hover:text-gray-600 transition-colors flex items-center space-x-1"
							>
								<span>Next</span>
								<ChevronRight size={16} />
							</button>
						</div>
					</div>
				</div>
			)}

			{viewMode === "list" ? (
				<div className="relative">
					{/* Background Image */}
					{hoveredCollection && (
						<div className="fixed inset-0 z-0">
							<Image
								src={
									collectionPreviews.find((c) => c.id === hoveredCollection)
										?.images[0].image || ""
								}
								alt=""
								fill
								className="object-cover"
								priority
							/>
						</div>
					)}

					{!isHovered.current &&
						!hoveredCollection &&
						collectionPreviews.length > 0 && (
							<div className="fixed inset-0 z-0">
								<Image
									src={
										collectionPreviews[slideshowIndex]?.images[0].image || ""
									}
									alt=""
									fill
									className="object-cover transition-opacity duration-1000"
									priority
								/>
							</div>
						)}

					{/* Collection List */}
					<div className="grid grid-cols-5 md:grid-cols-12 relative z-10 p-4 pt-16">
						<div className="col-end-3 md:col-end-5 col-start-1">
							<span
								className={`text-sm ${
									!isHovered.current || hoveredCollection ? "text-white" : ""
								}`}
							>
								All projects ({collections.length})
							</span>
						</div>

						<div className="space-y-1 col-start-3 md:col-start-5 col-end-13 grid grid-cols-6">
							{collectionPreviews.map((collection, index) => (
								<React.Fragment key={collection.id}>
									<div
										className="cursor-pointer col-start-1 col-end-6 md:col-end-4"
										onMouseEnter={() => setHoveredCollection(collection.id)}
										onMouseLeave={() => setHoveredCollection(null)}
										key={collection.id}
									>
										<Link
											href={`/overview/${collection.id}`}
											className={`text-sm ${
												(!isHovered.current && slideshowIndex === index) ||
												hoveredCollection === collection.id
													? "text-white"
													: ""
											} hover:text-white transition-colors`}
										>
											{collection.name}
										</Link>
									</div>
									{((!isHovered.current && slideshowIndex === index) ||
										hoveredCollection === collection.id) && (
										<div className="hidden md:block col-start-4" key={index}>
											<span className="text-sm text-white transition-colors">
												{collection.images.length}
											</span>
										</div>
									)}
								</React.Fragment>
							))}
						</div>
					</div>
				</div>
			) : (
				<div className="p-6 relative z-10">
					{/* Grid view with all images in a flat layout */}
					<div className="grid grid-cols-3 md:grid-cols-6 gap-10 md:gap-16">
						{collections.flatMap((collection) =>
							collection.images.map((image, index) => (
								<React.Fragment key={`${collection.id}-${image.id}`}>
									{index === 0 && (
										<div
											key={`${collection.id}_collection`}
											className="space-y-2"
										>
											<div className="text-xs text-gray-500 mb-1">
												{image.id}.
											</div>
											{collection.name && (
												<div className="text-xs text-gray-500">
													{collection.name}
												</div>
											)}
										</div>
									)}
									<CollectionImage collection={collection} image={image} />
								</React.Fragment>
							))
						)}
					</div>
				</div>
			)}
		</div>
	);
}

const CollectionImage = ({
	collection,
	image,
}: {
	collection: any;
	image: any;
}) => {
	return (
		<div key={`${collection.id}-${image.id}`} className="space-y-2">
			<div className="text-xs text-gray-500 mb-1">{image.id}.</div>
			<div className="aspect-[3/4] relative overflow-hidden">
				<Image
					src={image.image}
					alt={image.title}
					fill
					className={`object-cover hover:scale-105 transition-transform duration-300`}
				/>
			</div>
		</div>
	);
};
