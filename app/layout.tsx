import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { AuthProvider } from "@/context/auth-context";
import { ImageProvider } from "@/context/image-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Mohammed Chrouro - Artist Portfolio",
	description:
		"Multidisciplinary artist portfolio featuring portraits, abstract images, and fashion photography",
	generator: "v0.dev",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<AuthProvider>
					<ImageProvider>
						<Header />
						{children}
					</ImageProvider>
				</AuthProvider>
			</body>
		</html>
	);
}
