import { createBrowserClient } from "@supabase/ssr";

let client: ReturnType<typeof createBrowserClient>;

/**
 * @name getSupabaseBrowserClient
 * @description Get a Supabase client for use in the Browser
 */
function getSupabaseBrowserClient() {
	if (client) {
		return client;
	}

	const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
	const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

	client = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);

	return client;
}

export default getSupabaseBrowserClient;
