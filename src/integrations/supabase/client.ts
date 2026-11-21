/*
 * Public Supabase client for the site's content tables (lookbook, pop-ups) and
 * forms (newsletter). It only ever uses the publishable key: row-level security
 * decides what visitors can read or insert. There are no Supabase logins —
 * customer accounts live in Shopify.
 *
 * Browser: VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY (from .env at build time).
 * Server:  SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY (Cloudflare Worker secrets).
 */
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/* Publishable keys (sb_publishable_…) are not JWTs, so they go in `apikey` only, never as a bearer token. */
function keyOnlyFetch(key: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== "undefined" && input instanceof Request ? input.headers : undefined,
    );
    if (init?.headers) new Headers(init.headers).forEach((value, name) => headers.set(name, value));
    if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`)
      headers.delete("Authorization");
    headers.set("apikey", key);
    return fetch(input, { ...init, headers });
  };
}

export function createPublicClient(url: string, key: string) {
  return createClient<Database>(url, key, {
    global: { fetch: keyOnlyFetch(key) },
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}

function fromEnv() {
  const url =
    import.meta.env["VITE_SUPABASE_URL"] ||
    (typeof process !== "undefined" ? process.env["SUPABASE_URL"] : undefined);
  const key =
    import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ||
    (typeof process !== "undefined" ? process.env["SUPABASE_PUBLISHABLE_KEY"] : undefined);
  if (!url || !key) throw new Error("Missing SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY");
  return createPublicClient(url, key);
}

let client: ReturnType<typeof createPublicClient> | undefined;

/** Lazily created so a missing key only fails the feature that needs it. */
export const supabase = new Proxy({} as ReturnType<typeof createPublicClient>, {
  get(_, prop, receiver) {
    client ??= fromEnv();
    return Reflect.get(client, prop, receiver);
  },
});
