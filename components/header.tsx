"use client";
import { artistInfo } from "@/lib/data";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function Header() {
	const pathname = usePathname();
	const isCollectionPage =
		pathname?.includes("/overview/") && pathname !== "/overview";
	const isAdminPage = pathname?.includes("/admin");

	return (
		<nav className="flex justify-between md:grid grid-cols-12 p-4 relative z-50">
			<Link
				href="/"
				className="font-medium text-[#8f8f8f] md:col-span-2 md:col-start-1"
			>
				{artistInfo.name}
			</Link>
			<Link
				href="/overview"
				className={`font-medium hover:text-[#8f8f8f] transition-colors md:col-span-2 md:col-start-5 ${
					isCollectionPage || isAdminPage ? "hidden" : ""
				}`}
			>
				Overview
			</Link>
			<Link
				href="/information"
				className={`font-medium hover:text-[#8f8f8f] transition-colors md:col-span-2 md:col-start-9 ${
					isCollectionPage || isAdminPage ? "hidden" : ""
				}`}
			>
				Information
			</Link>

			<Link
				href={isCollectionPage ? "/overview" : "/contact"}
				className={`font-medium md:ml-auto hover:text-[#8f8f8f] transition-colors md:col-span-2 md:col-start-11 ${
					isAdminPage ? "hidden" : ""
				}`}
			>
				{isCollectionPage ? "Close" : "Contact"}
			</Link>
		</nav>
	);
}
