import type React from "react";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/header";
import { AuthProvider } from "@/context/auth-context";
import { ImageProvider } from "@/context/image-context";

const marionStandart = localFont({
	src: "../public/Marion Standart.otf",
	display: "swap",
	variable: "--font-marion-standart",
});

export const metadata: Metadata = {
	title: "Mohammed Chrouro - Artist Portfolio",
	description:
		"Multidisciplinary artist portfolio featuring portraits, abstract images, and fashion photography",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body
				className={`${marionStandart.variable} ${marionStandart.className}`}
			>
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
