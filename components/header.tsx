"use client";
import { artistInfo } from "@/lib/data";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function Header() {
	const pathname = usePathname();
	const isCollectionPage =
		pathname?.includes("/works/") && pathname !== "/works";
	const isAdminPage = pathname?.includes("/admin");

	return (
		<nav className="grid grid-cols-16 md:grid-cols-12 p-4 relative z-40">
			<Link
				href="/"
				className="font-medium text-[#8f8f8f] col-span-2 col-start-1 col-end-5"
			>
				{artistInfo.name}
			</Link>
			<Link
				href="/works"
				className={`font-medium hover:text-[#8f8f8f] transition-colors col-span-2 col-start-5 ${
					isCollectionPage || isAdminPage ? "hidden" : ""
				}`}
			>
				Works
			</Link>
			<Link
				href="/biography"
				className={`font-medium hover:text-[#8f8f8f] transition-colors col-span-2 col-start-9 ${
					isCollectionPage || isAdminPage ? "hidden" : ""
				}`}
			>
				Biography
			</Link>

			<Link
				href={isCollectionPage ? "/works" : "/contact"}
				className={`font-medium ml-auto hover:text-[#8f8f8f] transition-colors col-span-2 col-start-11 ${
					isAdminPage ? "hidden" : ""
				}`}
			>
				{isCollectionPage ? "Close" : "Contact"}
			</Link>
		</nav>
	);
}
