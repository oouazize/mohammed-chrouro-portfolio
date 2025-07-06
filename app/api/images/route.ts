import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/serverClient";

// Helper function to format collection name
function formatCollectionName(folderName: string): string {
	return folderName
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

// Helper function to format image title
function formatImageTitle(filename: string): string {
	// Remove file extension
	const nameWithoutExtension = filename.replace(/\.[^/.]+$/, "");

	// Split by hyphens and capitalize each word
	return nameWithoutExtension
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

export async function GET() {
	try {
		const supabase = await getSupabaseServerClient();

		// List all folders in the 'gallery' bucket
		const { data: folders, error: foldersError } = await supabase.storage
			.from("gallery")
			.list();

		if (foldersError) {
			throw foldersError;
		}

		// Create collections from folders
		const collections = [];
		let globalImageIndex = 0;

		for (const folder of folders) {
			// Skip files at root level or non-folder objects
			if (!folder.name || folder.name.includes(".")) continue;

			// List files in this folder
			const { data: files, error: filesError } = await supabase.storage
				.from("gallery")
				.list(folder.name);

			if (filesError) {
				console.error(`Error listing files in ${folder.name}:`, filesError);
				continue;
			}

			// Filter for image files only
			const validExtensions = [
				".jpg",
				".jpeg",
				".png",
				".gif",
				".webp",
				".svg",
			];
			const imageFiles = files.filter((file) => {
				const ext = "." + file.name.split(".").pop()?.toLowerCase();
				return validExtensions.includes(ext);
			});

			// Skip empty folders
			if (imageFiles.length === 0) continue;

			// Format the image data for this collection
			const images = imageFiles.map((file) => {
				globalImageIndex++;

				// Get public URL for the image
				const {
					data: { publicUrl },
				} = supabase.storage
					.from("gallery")
					.getPublicUrl(`${folder.name}/${file.name}`);

				return {
					id: `${globalImageIndex.toString().padStart(3, "0")}`,
					title: formatImageTitle(file.name),
					image: publicUrl,
				};
			});

			collections.push({
				id: folder.name.toLowerCase().replace(/\s+/g, "-"),
				name: formatCollectionName(folder.name),
				images,
			});
		}

		return NextResponse.json({ collections });
	} catch (error) {
		console.error("Error reading image directories:", error);
		return NextResponse.json(
			{ error: "Failed to read images" },
			{ status: 500 }
		);
	}
}
