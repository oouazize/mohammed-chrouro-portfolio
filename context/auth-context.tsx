"use client";

import getSupabaseBrowserClient from "@/lib/supabase/browserClient";
import { Session, User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
	user: User | null;
	session: Session | null;
	isLoading: boolean;
	signIn: (email: string, password: string) => any;
	signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [session, setSession] = useState<Session | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();
	const supabase = getSupabaseBrowserClient();

	useEffect(() => {
		const getSession = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession();
			setSession(session);
			setUser(session?.user ?? null);
			setIsLoading(false);
		};

		getSession();

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event: any, session: any) => {
			setSession(session);
			setUser(session?.user ?? null);
			setIsLoading(false);
		});

		return () => {
			subscription.unsubscribe();
		};
	}, [supabase.auth]);

	const signIn = async (email: string, password: string) => {
		return await supabase.auth.signInWithPassword({
			email,
			password,
		});
	};

	const signOut = async () => {
		await supabase.auth.signOut();
		router.refresh();
		router.push("/");
	};

	const value = {
		user,
		session,
		isLoading,
		signIn,
		signOut,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
