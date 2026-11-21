/*
 * Store policies (shipping, returns, privacy, terms) are written in Shopify
 * admin → Settings → Policies and shown on the site's policy pages.
 * This file is pure (no network) so it can be unit tested; the fetch lives in
 * shopify/storefront.server.ts and the server function in policies.functions.ts.
 */

export const POLICY_KINDS = ["shipping", "returns", "privacy", "terms"] as const;
export type PolicyKind = (typeof POLICY_KINDS)[number];

/* Which Storefront API `shop` field holds each page's policy. */
export const POLICY_FIELDS: Record<PolicyKind, string> = {
  shipping: "shippingPolicy",
  returns: "refundPolicy",
  privacy: "privacyPolicy",
  terms: "termsOfService",
};

export const POLICIES_QUERY = `
  query Policies {
    shop {
      ${Object.values(POLICY_FIELDS)
        .map((f) => `${f} { title body }`)
        .join("\n      ")}
    }
  }
`;

export interface Policy {
  title: string;
  /** Sanitised HTML, safe to render. */
  html: string;
}

export type PolicyMap = Partial<Record<PolicyKind, Policy>>;

type RawPolicy = { title?: string | null; body?: string | null } | null | undefined;

export function mapPolicies(shop: Record<string, RawPolicy>): PolicyMap {
  const out: PolicyMap = {};
  for (const kind of POLICY_KINDS) {
    const raw = shop[POLICY_FIELDS[kind]];
    const html = sanitizePolicyHtml(raw?.body ?? "");
    if (html.replace(/<[^>]*>/g, "").trim()) out[kind] = { title: raw?.title?.trim() ?? "", html };
  }
  return out;
}

/*
 * Policy bodies come from the store owner's own Shopify admin, but they are
 * still rendered as HTML, so keep only simple formatting: an allowlist of
 * tags, no attributes except a safe href on links, and no scripts or styles.
 */
const ALLOWED = new Set([
  "p",
  "br",
  "h2",
  "h3",
  "h4",
  "ul",
  "ol",
  "li",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "a",
  "blockquote",
]);
/* Headings and containers Shopify's editor produces, mapped onto the allowlist. */
const RENAME: Record<string, string> = { h1: "h2", h5: "h4", h6: "h4" };
const DROP_WITH_CONTENT =
  /<(script|style|iframe|object|embed|template|noscript|svg|math)\b[\s\S]*?<\/\1\s*>/gi;

const safeHref = (raw: string) => {
  const href = raw.trim().replace(/&amp;/g, "&");
  if (/^(https?:|mailto:|tel:)/i.test(href) || href.startsWith("/") || href.startsWith("#"))
    return href.replace(/"/g, "&quot;");
  return null;
};

export function sanitizePolicyHtml(input: string): string {
  return input
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(DROP_WITH_CONTENT, "")
    .replace(
      /<\s*(\/?)\s*([a-zA-Z][a-zA-Z0-9]*)([^>]*)>/g,
      (_m, close: string, rawTag: string, attrs: string) => {
        const name = rawTag.toLowerCase();
        const tag = RENAME[name] ?? name;
        if (!ALLOWED.has(tag)) return "";
        if (close) return tag === "br" ? "" : `</${tag}>`;
        if (tag === "a") {
          const m = /\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i.exec(attrs);
          const href = m ? safeHref(m[1] ?? m[2] ?? m[3] ?? "") : null;
          if (!href) return "<a>";
          const external = /^https?:/i.test(href);
          return `<a href="${href}"${external ? ' target="_blank" rel="noopener noreferrer"' : ""}>`;
        }
        return `<${tag}>`;
      },
    )
    .replace(/<\s*[^a-zA-Z/][^>]*>/g, "")
    .trim();
}
