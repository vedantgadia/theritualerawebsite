import { describe, expect, it } from "vitest";
import { POLICIES_QUERY, mapPolicies, sanitizePolicyHtml } from "@/lib/policies";

describe("sanitizePolicyHtml", () => {
  it("keeps simple formatting and drops wrappers and attributes", () => {
    expect(
      sanitizePolicyHtml(
        '<div class="x"><h1 style="color:red">Title</h1><p>Hi <strong>there</strong></p><ul><li>One</li></ul></div>',
      ),
    ).toBe("<h2>Title</h2><p>Hi <strong>there</strong></p><ul><li>One</li></ul>");
  });

  it("removes scripts, styles, event handlers and comments", () => {
    const out = sanitizePolicyHtml(
      '<p onclick="steal()">A</p><script>alert(1)</script><style>p{}</style><!-- c --><img src=x onerror=alert(1)><iframe src="//e"></iframe>',
    );
    expect(out).toBe("<p>A</p>");
  });

  it("only keeps safe link targets", () => {
    expect(sanitizePolicyHtml('<a href="javascript:alert(1)">x</a>')).toBe("<a>x</a>");
    expect(sanitizePolicyHtml('<a href="mailto:info@example.com" onclick="x()">mail</a>')).toBe(
      '<a href="mailto:info@example.com">mail</a>',
    );
    expect(sanitizePolicyHtml("<a href='https://shopify.com/privacy'>p</a>")).toBe(
      '<a href="https://shopify.com/privacy" target="_blank" rel="noopener noreferrer">p</a>',
    );
  });
});

describe("mapPolicies", () => {
  it("maps Storefront fields to the site's pages and skips empty policies", () => {
    const shop = {
      shippingPolicy: { title: "Shipping policy", body: "<p>Free over ₹5,000</p>" },
      refundPolicy: { title: "Refund policy", body: "<div> </div>" },
      privacyPolicy: null,
      termsOfService: { title: "Terms", body: "<h2>1.</h2><p>Hello</p>" },
    };
    const out = mapPolicies(shop);
    expect(Object.keys(out).sort()).toEqual(["shipping", "terms"]);
    expect(out.shipping?.html).toBe("<p>Free over ₹5,000</p>");
  });

  it("asks Shopify for every policy the site shows", () => {
    for (const f of ["shippingPolicy", "refundPolicy", "privacyPolicy", "termsOfService"])
      expect(POLICIES_QUERY).toContain(`${f} { title body }`);
  });
});
