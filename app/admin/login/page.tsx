"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth-context";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, startTransition] = useTransition();
	const { signIn, isLoading } = useAuth();
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		startTransition(async () => {
			try {
				const { error } = await signIn(email, password);
				if (error) {
					setError(error.message || "Failed to sign in");
				} else router.push("/admin/dashboard");
			} catch (error: any) {
				setError(error.message || "Failed to sign in");
			}
		});
	};

	return (
		<div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
			<div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow">
				<div className="text-center">
					<h1 className="text-2xl font-bold">Admin Login</h1>
					<p className="text-gray-500 mt-2">Sign in to manage your gallery</p>
				</div>

				{error && (
					<Alert variant="destructive">
						<AlertCircle className="h-4 w-4" />
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}

				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="space-y-2">
						<label htmlFor="email" className="text-sm font-medium">
							Email
						</label>
						<Input
							id="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							placeholder="admin@example.com"
						/>
					</div>

					<div className="space-y-2">
						<label htmlFor="password" className="text-sm font-medium">
							Password
						</label>
						<Input
							id="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							placeholder="••••••••"
						/>
					</div>

					<Button type="submit" className="w-full" disabled={loading}>
						{loading ? "Signing in..." : "Sign in"}
					</Button>
				</form>
			</div>
		</div>
	);
}
