declare const __BUILD_ID__: string | undefined;

/** Unique per production build (injected in vite.config.ts); "dev" when not injected, e.g. in tests. */
export const BUILD_ID: string = typeof __BUILD_ID__ !== "undefined" ? __BUILD_ID__ : "dev";

export const VERSION_PATH = "/__version";
