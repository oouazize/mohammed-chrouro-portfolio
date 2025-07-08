"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useImages } from "@/context/image-context";
import { type Collection } from "@/lib/data";
import { useRouter } from "next/navigation";

export default function OverviewPage() {
	const { collections, collectionPreviews, isLoading } = useImages();
	const [viewMode, setViewMode] = useState<"list" | "grid">(() => {
		// Initialize viewMode from sessionStorage or default to "list"
		if (typeof window !== "undefined") {
			const savedViewMode = sessionStorage.getItem("overviewViewMode");
			return (savedViewMode as "list" | "grid") || "list";
		}
		return "list";
	});
	const [hoveredCollection, setHoveredCollection] = useState<string | null>(
		null
	);
	const isHovered = useRef(false);
	const [slideshowIndex, setSlideshowIndex] = useState(0);

	// Save viewMode to sessionStorage whenever it changes
	useEffect(() => {
		sessionStorage.setItem("overviewViewMode", viewMode);
	}, [viewMode]);

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
								className={`${
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
											className={`${
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
											<span className="text-white transition-colors">
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
				<div className="p-6 pt-16 relative z-10">
					{/* Grid view with all images in a flat layout */}
					<div className="grid grid-cols-6 md:grid-cols-12 gap-10">
						{collections.flatMap((collection) =>
							collection.images.map((image, index) => (
								<React.Fragment key={`${collection.id}-${image.id}`}>
									{index === 0 && (
										<div
											key={`${collection.id}_collection`}
											className="space-y-2 col-span-2 h-auto"
										>
											<div className="text-gray-500 mb-1">{image.id}.</div>
											{collection.name && (
												<div className="text-gray-500">{collection.name}</div>
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
	const router = useRouter();

	const handleImageClick = () => {
		// Find the index of this image in the collection
		const imageIndex = collection.images.findIndex(
			(img: any) => img.id === image.id
		);

		// Store the initial image index in sessionStorage
		sessionStorage.setItem("initialImageIndex", imageIndex.toString());

		// Navigate to collection page using collection name
		router.push(`/overview/${collection.id}`);
	};

	return (
		<div
			key={`${collection.id}-${image.id}`}
			className="space-y-2 col-span-2 h-auto"
		>
			<div className="text-gray-500 mb-1">{image.id}.</div>
			<div className="w-auto h-40 md:h-48 lg:h-56 relative flex justify-start overflow-hidden">
				<div onClick={handleImageClick} className="cursor-pointer">
					<Image
						src={image.image}
						alt={image.title}
						fill
						className={`object-left-top object-contain transition-transform duration-300`}
					/>
				</div>
			</div>
		</div>
	);
};
