"use client";

import { useAuth } from "@/context/auth-context";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { user, isLoading } = useAuth();
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		// Skip redirect for login page
		if (pathname === "/admin/login") return;

		// Redirect to login if not authenticated and not loading
		if (!isLoading && !user) {
			router.push("/admin/login");
		}
	}, [user, isLoading, router, pathname]);

	// Show loading state
	// if (isLoading) {
	// 	return (
	// 		<div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
	// 			<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
	// 		</div>
	// 	);
	// }

	// If on login page or authenticated, show content
	if (pathname === "/admin/login" || user) {
		return children;
	}

	// Default loading state while redirecting
	return null;
}
