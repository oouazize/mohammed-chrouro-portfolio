"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import getSupabaseBrowserClient from "@/lib/supabase/browserClient";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Upload, Image, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";

interface Folder {
	name: string;
	id: string;
}

interface File {
	name: string;
	size: number;
	created_at: string;
	id: string;
}

export default function AdminDashboard() {
	const { user, signOut } = useAuth();
	const [folders, setFolders] = useState<Folder[]>([]);
	const [files, setFiles] = useState<File[]>([]);
	const [currentFolder, setCurrentFolder] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [newFolderName, setNewFolderName] = useState("");
	const [isCreatingFolder, setIsCreatingFolder] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const supabase = getSupabaseBrowserClient();

	// Fetch folders
	const fetchFolders = async () => {
		setIsLoading(true);
		setError(null);
		const { data, error } = await supabase.storage.from("gallery").list();

		if (error) {
			setError(`Error fetching folders: ${error.message}`);
			toast.error("Error fetching folders");
			setIsLoading(false);
			return;
		}

		// Filter out files at root level
		const folderList = data
			.filter((item: any) => !item.name.includes("."))
			.map((folder: any) => ({
				name: folder.name,
				id: folder.id,
			}));

		setFolders(folderList);
		setIsLoading(false);
	};

	// Fetch files in a folder
	const fetchFiles = async (folderName: string) => {
		setIsLoading(true);
		setError(null);
		const { data, error } = await supabase.storage
			.from("gallery")
			.list(folderName);

		if (error) {
			setError(`Error fetching files: ${error.message}`);
			toast.error("Error fetching files");
			setIsLoading(false);
			return;
		}

		setFiles(data);
		setCurrentFolder(folderName);
		setIsLoading(false);
	};

	// Create a new folder
	const createFolder = async () => {
		if (!newFolderName.trim()) {
			setError("Folder name cannot be empty");
			toast.error("Folder name cannot be empty");
			return;
		}

		setIsCreatingFolder(true);
		setError(null);

		// Create an empty file in the folder to create the folder
		const folderPath = `${newFolderName}/.placeholder`;
		const { error } = await supabase.storage
			.from("gallery")
			.upload(folderPath, new Blob([""]));

		if (error) {
			setError(`Error creating folder: ${error.message}`);
			toast.error("Error creating folder");
			setIsCreatingFolder(false);
			return;
		}

		toast.success(`Folder ${newFolderName} created successfully`);

		setNewFolderName("");
		setIsCreatingFolder(false);
		fetchFolders();
	};

	// Handle folder upload
	const handleFolderUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;

		setIsUploading(true);
		setError(null);

		// Get the folder name from the first file's webkitRelativePath
		const firstFile = files[0] as any;
		if (!firstFile.webkitRelativePath) {
			setError(
				"No folder structure detected. Please select a folder, not individual files."
			);
			toast.error(
				"No folder structure detected. Please select a folder, not individual files."
			);
			setIsUploading(false);
			return;
		}

		// Extract folder name from the path (first segment)
		const folderPath = firstFile.webkitRelativePath.split("/")[0];

		// Check if folder already exists
		const { data: existingFolders } = await supabase.storage
			.from("gallery")
			.list();
		const folderExists = existingFolders?.some(
			(item: any) => item.name === folderPath && !item.name.includes(".")
		);

		if (folderExists) {
			if (
				!confirm(
					`Folder "${folderPath}" already exists. Do you want to add these images to it?`
				)
			) {
				setIsUploading(false);
				return;
			}
		}

		// Filter for image files only
		const imageFiles = Array.from(files).filter((file) => {
			const fileType = file.type.toLowerCase();
			return fileType.startsWith("image/");
		});

		if (imageFiles.length === 0) {
			setError("No image files found in the selected folder.");
			toast.error("No image files found in the selected folder.");
			setIsUploading(false);
			return;
		}

		// Upload all image files
		const uploadPromises = imageFiles.map(async (file: any) => {
			// Get the relative path within the folder
			const relativePath = file.webkitRelativePath;
			// Upload to the same path in Supabase
			const { error } = await supabase.storage
				.from("gallery")
				.upload(relativePath, file);

			if (error) {
				toast.error(`Failed to upload ${file.name}: ${error.message}`);
				return false;
			}

			return true;
		});

		const results = await Promise.all(uploadPromises);
		const successCount = results.filter(Boolean).length;

		toast.success(
			`Successfully uploaded ${successCount} of ${imageFiles.length} images to "${folderPath}"`
		);

		setIsUploading(false);
		fetchFolders();

		// If the folder was newly created, select it
		if (!folderExists) {
			fetchFiles(folderPath);
		} else if (currentFolder === folderPath) {
			// Refresh the current folder if we added to it
			fetchFiles(folderPath);
		}
	};

	// Delete a folder
	const deleteFolder = async (folderName: string) => {
		if (
			!confirm(
				`Are you sure you want to delete the folder "${folderName}" and all its contents? This action cannot be undone.`
			)
		) {
			return;
		}

		setIsDeleting(true);
		setError(null);

		// First, list all files in the folder
		const { data: files, error: listError } = await supabase.storage
			.from("gallery")
			.list(folderName);

		if (listError) {
			setError(`Error listing files: ${listError.message}`);
			toast.error("Error listing files");
			setIsDeleting(false);
			return;
		}

		// Delete all files in the folder
		const filePaths = files.map((file: any) => `${folderName}/${file.name}`);

		if (filePaths.length > 0) {
			const { error: deleteError } = await supabase.storage
				.from("gallery")
				.remove(filePaths);

			if (deleteError) {
				setError(`Error deleting files: ${deleteError.message}`);
				toast.error("Error deleting files");
				setIsDeleting(false);
				return;
			}
		}

		toast.success(`Folder "${folderName}" deleted successfully`);

		setIsDeleting(false);
		setCurrentFolder(null);
		fetchFolders();
	};

	// Delete a file
	const deleteFile = async (fileName: string) => {
		if (!currentFolder) return;

		if (
			!confirm(
				`Are you sure you want to delete "${fileName}"? This action cannot be undone.`
			)
		) {
			return;
		}

		setIsDeleting(true);
		setError(null);

		const filePath = `${currentFolder}/${fileName}`;
		const { error } = await supabase.storage.from("gallery").remove([filePath]);

		if (error) {
			setError(`Error deleting file: ${error.message}`);
			toast.error("Error deleting file");
			setIsDeleting(false);
			return;
		}

		toast.success(`File "${fileName}" deleted successfully`);

		setIsDeleting(false);
		if (currentFolder) fetchFiles(currentFolder);
	};

	// Load folders on initial render
	useEffect(() => {
		fetchFolders();
	}, []);

	return (
		<div className="container mx-auto py-8 px-4">
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-2xl font-bold">Admin Dashboard</h1>
				<div className="flex items-center gap-4">
					<p className="text-gray-500">{user?.email}</p>
					<Button variant="outline" onClick={() => signOut()}>
						Sign Out
					</Button>
				</div>
			</div>

			{error && (
				<Alert variant="destructive" className="mb-6">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Error</AlertTitle>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			<Tabs defaultValue="folders" className="w-full">
				<TabsList className="mb-6">
					<TabsTrigger value="folders">Manage Collections</TabsTrigger>
					<TabsTrigger value="upload">Upload Collection</TabsTrigger>
				</TabsList>

				<TabsContent value="folders" className="space-y-6">
					<div className="grid md:grid-cols-5 gap-4">
						<div className="md:col-span-2 border rounded-lg p-4">
							<h2 className="font-medium mb-4">Collections</h2>
							{isLoading ? (
								<div className="flex justify-center py-8">
									<Loader2 className="h-8 w-8 animate-spin text-gray-400" />
								</div>
							) : folders.length === 0 ? (
								<p className="text-gray-500 text-center py-8">
									No collections found
								</p>
							) : (
								<ul className="space-y-2">
									{folders.map((folder) => (
										<li
											key={folder.id}
											className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
										>
											<button
												onClick={() => fetchFiles(folder.name)}
												className={`flex-1 text-left px-2 py-1 rounded ${
													currentFolder === folder.name
														? "bg-gray-100 font-medium"
														: ""
												}`}
											>
												{folder.name}
											</button>
											<Button
												variant="ghost"
												size="sm"
												onClick={() => deleteFolder(folder.name)}
												disabled={isDeleting}
											>
												<Trash2 className="h-4 w-4 text-red-500" />
											</Button>
										</li>
									))}
								</ul>
							)}
						</div>

						<div className="md:col-span-3 border rounded-lg p-4 max-h-96">
							<h2 className="font-medium mb-4">
								{currentFolder
									? `Images in "${currentFolder}"`
									: "Select a collection to view images"}
							</h2>
							{currentFolder ? (
								isLoading ? (
									<div className="flex justify-center py-8">
										<Loader2 className="h-8 w-8 animate-spin text-gray-400" />
									</div>
								) : files.length === 0 ? (
									<p className="text-gray-500 text-center py-8">
										No images found in this collection
									</p>
								) : (
									<div className="h-[calc(100%-3rem)] overflow-y-auto">
										<ul className="space-y-2">
											{files.map((file) => (
												<li
													key={file.id}
													className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
												>
													<div className="flex items-center gap-2 flex-1 max-w-[90%]">
														<Image className="h-4 w-4 text-gray-400" />
														<span className="truncate">{file.name}</span>
													</div>
													<Button
														variant="ghost"
														size="sm"
														onClick={() => deleteFile(file.name)}
														disabled={isDeleting}
													>
														<Trash2 className="h-4 w-4 text-red-500" />
													</Button>
												</li>
											))}
										</ul>
									</div>
								)
							) : (
								<p className="text-gray-500 text-center py-8">
									Select a collection to view images
								</p>
							)}
						</div>
					</div>
				</TabsContent>

				<TabsContent value="upload">
					<div className="border rounded-lg p-6">
						<h2 className="font-medium mb-4">Upload Collection Folder</h2>
						<div className="space-y-4">
							<Alert className="bg-blue-50 border-blue-200 mb-4">
								<AlertDescription>
									Upload an entire folder containing images. The folder name
									will become the collection name. Only image files will be
									uploaded.
								</AlertDescription>
							</Alert>
							<div className="border-2 border-dashed rounded-lg p-8 text-center">
								<Upload className="h-8 w-8 mx-auto mb-4 text-gray-400" />
								<p className="mb-2">
									Drag and drop a folder here, or click to select a folder
								</p>
								<p className="text-gray-500 mb-4">
									Supported image formats: JPG, PNG, WEBP, GIF
								</p>
								<div className="relative">
									<Button disabled={isUploading}>
										{isUploading ? (
											<>
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
												Uploading...
											</>
										) : (
											"Select Folder"
										)}
									</Button>
									<input
										type="file"
										// @ts-ignore
										webkitdirectory=""
										directory=""
										className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
										onChange={handleFolderUpload}
										disabled={isUploading}
									/>
								</div>
							</div>
						</div>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
