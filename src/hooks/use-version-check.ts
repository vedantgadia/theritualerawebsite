import { useEffect } from "react";
import { useRouter } from "@tanstack/react-router";
import { BUILD_ID, VERSION_PATH } from "@/lib/build-id";

const CHECK_EVERY_MS = 5 * 60 * 1000;
const MIN_GAP_MS = 60 * 1000;
const RELOADED_FOR_KEY = "theritualera.reloaded-for";

/**
 * Keeps long-lived tabs on the latest deploy. When the server reports a newer build, the page
 * reloads at a quiet moment: on the next navigation, or straight away if the tab is in the background.
 */
export function useVersionCheck() {
  const router = useRouter();

  useEffect(() => {
    let stale = false;
    let lastCheck = 0;

    const reload = (href?: string) => {
      if (href) window.location.assign(href);
      else window.location.reload();
    };

    const check = async () => {
      if (stale || Date.now() - lastCheck < MIN_GAP_MS) return;
      lastCheck = Date.now();
      try {
        const res = await fetch(VERSION_PATH, { cache: "no-store" });
        if (!res.ok) return;
        const { id } = (await res.json()) as { id?: string };
        if (!id || id === BUILD_ID) return;
        // Guard against a reload loop if something upstream keeps serving the old page.
        try {
          if (sessionStorage.getItem(RELOADED_FOR_KEY) === id) return;
          sessionStorage.setItem(RELOADED_FOR_KEY, id);
        } catch {
          // Storage unavailable: still reload once for this page view.
        }
        stale = true;
        if (document.visibilityState === "hidden") reload();
      } catch {
        // Offline or blocked: try again later.
      }
    };

    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        if (stale) reload();
      } else {
        void check();
      }
    };

    const unsubscribe = router.subscribe("onBeforeNavigate", (event) => {
      if (stale && event.hrefChanged) reload(event.toLocation.href);
      else void check();
    });
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("focus", onVisibility);
    const timer = window.setInterval(() => void check(), CHECK_EVERY_MS);

    return () => {
      unsubscribe();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", onVisibility);
      window.clearInterval(timer);
    };
  }, [router]);
}
