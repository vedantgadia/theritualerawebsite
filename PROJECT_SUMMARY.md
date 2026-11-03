# The Ritual Era — Website Project Summary

_Handover brief, written 2 November 2026. Paste this into a new Claude conversation to continue the work without the original chat._

---

## 0. How to use this document

- **What this is:** a complete record of what has been built for The Ritual Era website, why each decision was made, where everything lives in the code, and what is still to do.
- **Code:** GitHub repository **`vedantgadia/theritualerawebsite`** (branch **`main`** has everything below).
- **To continue in a new Claude account:** connect that account to GitHub (with access to the repository above), open a Claude Code session on the repository, and paste this document as your first message with a line like _"This is the project summary for my website — please read it and the repo, then help me with …"_.
- **Lovable:** the repository is connected to a Lovable project. Commits pushed to `main` sync into the Lovable editor. **The live site only updates after clicking _Publish → Update_ in Lovable.**
  - Lovable editor: https://lovable.dev/projects/8d06aa68-b9b6-4f92-85c1-79897cae4182
  - Live site: https://theritualerawebsite.lovable.app
- **Rule for any developer or AI working on the repo** (from `AGENTS.md`): never rewrite published git history (no force-push, no rebasing/amending/squashing pushed commits) — it breaks Lovable's history. Keep `main` in a working state.

---

## 1. The brand at a glance

| | |
|---|---|
| **Brand** | The Ritual Era — ready-to-wear womenswear label from Mumbai |
| **Tagline** | _Her Forever Prêt_ |
| **Brand line** | _"We don't design for a season. We design beyond it."_ |
| **Founder** | Priyanka Bhartia — Fashion Design graduate, De Montfort University |
| **Design language** | Denim at the heart, reimagined through Indian textiles (ajrakh, hakoba, chanderi, crochet, hand embroidery); sashiko-inspired stitching; limited editions made in-house |
| **Instagram** | @theritualera |
| **Facebook** | facebook.com/theritualera.official |
| **Email** | theritualera.official@gmail.com |
| **WhatsApp (used on site)** | +91 97697 28791 → https://wa.me/919769728791 |
| **Hours** | 10am–7pm, closed on public holidays |

> ⚠️ **Phone number mismatch to confirm:** the website uses **+91 97697 28791** (from the original project brief), but the business card in the brand deck shows **+91 74100 84301**. Confirm which is correct; the number is in `src/components/site/bits.tsx` (WhatsApp button), `footer.tsx`, `_site.product.$slug.tsx` and `_site.style-notes.tsx`.

**The feel the owner asked for** (with reference sites Nicobar, The Summer House "Indigo Stripe" page, and Aleia):
- Minimal but not boring
- Premium but approachable
- Let the garments and their details do the talking
- Easy to shop

---

## 2. Brand guidelines (from the Final Brand Deck by Kajal Patil)

### 2.1 Typography

| Role | Brand deck | Website uses | Why |
|---|---|---|---|
| Headings, titles, brand moments | **Canela** (editorial serif); deck lists **Noe Display** and **Playfair Display** as accessible alternatives | **Playfair Display** | It is the deck's own named alternative |
| Body, labels, prices, UI | **Maison Neue** (deck lists Suisse Int'l, Söhne, Neue Montreal, Akkurat, Graphik, Circular, Brown, GT America… as similar) | **Albert Sans** (weights 300/400/500/600) | Closest free match, chosen by rendering candidates side by side with the deck's specimen (DM Sans, Inter, Hanken Grotesk, Instrument Sans, Figtree, Albert Sans, Work Sans, Schibsted Grotesk). Includes the ₹ glyph |
| Accent script — tags, signatures, rare moments | **Quentin Script** (or similar) | **Ms Madi** | Closest free monoline signature script; ~20 scripts compared against the deck's "Ritual" sample |

- All fonts load from Google Fonts in `src/routes/__root.tsx`; the font tokens are at the top of `src/styles.css` (`--font-display`, `--font-sans`, `--font-script`).
- **To use the exact brand fonts:** buy web licences for Canela (Commercial Type), Maison Neue (Milieu Grotesque) and Quentin Script, add the font files to the repo (e.g. `public/fonts/`) with `@font-face` rules, and point the three tokens at them.
- Earlier versions used DM Sans and Mrs Saint Delafield — those were replaced after feedback that the fonts didn't match the brand guideline.

### 2.2 Colour palette (exact hex values from the deck)

**Primary — core identity**
- Ritual Indigo `#1F3A5F` — brand anchor (buttons, links, headings accent)
- Deep Denim `#2C3E50` — garment base
- Washed Indigo `#5A6E7F` — layering tone (secondary text)
- Ink Blue `#0F2233` — typography / depth (body text — never pure black)

**Secondary — neutral base**
- Soft Ivory `#F5EFE8` — base surfaces (page background — never pure white)
- Warm Sand `#D6C6B8` — backgrounds
- Stone Grey `#9A9188` — balance tones
- Earth Taupe `#7A6A5F` — layering neutrals

**Signature accents**
- Indigo Core `#0B2C4A` — brand depth / identity anchor (not yet used on the site)
- Antique Gold `#E6C79A` — craft highlight / logo accent
- Burnt Saffron `#C46A2D` — editorial / campaign pop

**Accent palette — use sparingly**
- Rust Orange `#C65D2E`, Burnt Terracotta `#A44A2F`, Muted Ochre `#C2A24D`, "Craft multicolor" (embroidery imagery only)

**Logo / backdrop pink:** the blush behind the logo ≈ `#EFD3C7` (site token "blush"; the logo artwork's fabric measures ≈ `#F0D8D8`).

All palette colours are defined as Tailwind tokens in `src/styles.css` (`ritual`, `ink`, `deep-denim`, `washed`, `ivory`, `sand`, `blush`, `stone`, `taupe`, `gold`, `saffron`, `rust`, `terracotta`, `ochre`).

### 2.3 Logo

- "THE / RIT**UAL** / – ERA –" with "RIT" solid, "UAL" stitched in dashed line with a needle eye, a thread running from the L down to a **cotton spool**, and a divider with a four-point star ✦ beneath.
- Logo ink colour: **`#07228F`** (deep royal blue — brighter than the site's Ritual Indigo; intentional, it's the logo's own colour).
- **Deck rules:** do not change the colour (use palette colours), do not crop, do not add shadows/effects, do not rotate, do not place over another illustration/busy imagery, do not use tint or opacity. Give it clear space.
- **On the website:** `public/brand/logo.svg` — a vector trace of the supplied logo artwork (traced from the high-resolution image with the original ink colour) so it is crisp at any size. An earlier raster cut-out looked blurred and was replaced.
- `public/brand/logo-fabric.webp` — the original square logo artwork on pink stitched fabric (kept as a brand asset).
- **Best next step:** ask the designer for the **original vector logo file** (SVG / AI / PDF) and replace `public/brand/logo.svg` with it — the trace is very close but the original is definitive.

### 2.4 Brand motifs used on the site

- **Sashiko / stitched diamond lattice** — the double dashed-line diamond pattern from the logo fabric and hand tags. CSS classes `.stitch-lattice` (blush) and `.stitch-lattice-ink` (indigo) in `src/styles.css`.
- **Dashed "thread" dividers with a ✦ star** — `StitchDivider` (animated "sewing" stitches) in `src/components/site/motion.tsx`; older static `ThreadDivider` in `bits.tsx`.
- **Arch-shaped image frames** — echoing the arched photo on the lookbook cover.
- **Ivory name labels over photos** — echoing the lookbook's garment labels.
- **Thread-to-spool line drawing** in the home hero, echoing the logo.
- Hairline 1px borders, square/near-square corners (max 2px), no gradients, no heavy shadows, no emojis.

### 2.5 Brand copy (from the lookbook's closing page — used on About Us)

> **HER FOREVER PRET** — At The Ritual Era, we believe getting dressed is one of the first rituals of the day, a quiet moment that sets the tone for everything that follows. It's a chance to express who you are, how you feel, and how you choose to show up in the world. Born from a desire to create clothing that feels as effortless as it is intentional, The Ritual Era designs timeless everyday wear for the modern woman. We focus on elevated essentials that blend comfort, versatility, and thoughtful craftsmanship, creating pieces that move seamlessly through every part of your day. In a world driven by fast-changing trends, we choose longevity over excess. Our collections are designed to be worn, repeated, and reimagined, becoming a lasting part of your wardrobe rather than a passing moment in fashion. Because we believe true style isn't about constantly becoming someone new. It's about returning to yourself, every single day. And that's where every ritual begins.

**Brand concept (deck):** a contemporary fashion and lifestyle brand inspired by craftsmanship, slow design and timeless storytelling; sashiko-inspired stitching symbolises care, detail and the journey behind every creation; earthy tones and deep indigo accents; quiet luxury and mindful fashion.

---

## 3. Technology

| | |
|---|---|
| Framework | **TanStack Start** (React 19, file-based routing via TanStack Router, server functions) |
| Build | Vite 8 via `@lovable.dev/vite-tanstack-config` (don't add plugins it already includes — see comment in `vite.config.ts`) |
| Styling | Tailwind CSS v4 (tokens and custom CSS in `src/styles.css`) |
| Data fetching | Route `loader`s calling server functions; TanStack Query for a few client queries |
| Backend | **Lovable Cloud / Supabase** (database, auth, storage) — schema + seed in `drizzle/migrations/0000_ritual_era_schema_seed.sql` (15 tables: products, categories, product sizes, orders, made-to-measure requests, lookbook, pop-ups, settings, roles, newsletter, …) |
| Hosting | Lovable (Cloudflare Workers via Nitro) |
| Package manager | bun (`bun.lock`); `npm` scripts: `dev`, `build`, `test`, `lint` |
| Tests | Vitest (`src/test/app-routing.test.tsx`) |

**Routing conventions** (see `src/routes/README.md`): `src/routes/_site.tsx` is the shared layout (header, footer, bag drawer, WhatsApp button). Pages are `_site.<name>.tsx`. Use `_site.<name>.index.tsx` when a page has child routes (e.g. `_site.shop.index.tsx` + `_site.shop.$category.tsx`) — otherwise the parent swallows the child. `src/routeTree.gen.ts` is auto-generated by the dev server/build; don't edit it by hand.

### 3.1 Target architecture (decided 3 November 2026)

The owner chose **Shopify as the shop's back office, with the existing custom site as the front end ("headless")**, and to stop using Lovable. All coding happens in Claude Code.

| What | Where it will live | Managed by |
|---|---|---|
| Website (design, pages, motion) | GitHub → **Cloudflare** (free plan); every push to `main` deploys automatically | Claude Code |
| Products, prices, sizes, stock | **Shopify admin** | Owner |
| Bag, guest checkout, payments (**Razorpay**, via Shopify payment settings) | **Shopify** (Storefront API cart → Shopify checkout) | Shopify |
| Order emails, order status/tracking, customer accounts (email code) | **Shopify** | Shopify |
| Shipping (₹150, free ≥ ₹5,000), GST (prices include tax), policies | Shopify settings | Owner |
| Lookbook, Pop-ups, made-to-measure requests | Shopify metaobjects | Owner |
| Newsletter | Shopify customers with marketing consent | Owner |
| Supabase / Lovable Cloud, Lovable hosting | **To be removed** once the above works | — |

**Why:** the site never handles money, card data or stock, so price tampering and data-leak risks sit with Shopify, not custom code. The admin, orders, inventory and emails come ready-built. Alternatives considered and rejected: staying on Lovable + Supabase (we would build and secure admin/orders/payments ourselves; Lovable apps have a history of misconfigured row-level security), Lovable's free plan (no custom domain, public projects), Medusa (Razorpay only via community plugins), Zoho Commerce (not built for custom front ends), WooCommerce (self-maintained WordPress).

**Cost (approx., confirm on providers' pages):** Shopify Basic ≈ ₹1,499/month + Shopify's 2% third-party-gateway fee (1% on Grow) + Razorpay ≈ 2.36%; Cloudflare free; domain renewal.

**Domain:** owned, registered at **GoDaddy**. Plan: keep it registered at GoDaddy but move its DNS (nameservers) to Cloudflare. Main domain → website on Cloudflare; `checkout.<domain>` → Shopify checkout (watch for Shopify primary-domain pitfalls with headless — don't make the checkout subdomain the Shopify primary domain without testing).

**Keys the code will read** (store in the cloud environment's settings and later in Cloudflare — never in the repo or chat):
`SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_PRIVATE_TOKEN` (Headless channel), `SHOPIFY_CLIENT_ID` + `SHOPIFY_CLIENT_SECRET` (Dev Dashboard app; exchanged for 24-hour Admin API tokens via the client-credentials grant — Shopify stopped issuing copyable admin tokens for new custom apps on 1 Jan 2026). The cloud environment must allow `*.myshopify.com` under network access.

**Migration steps:**
1. Owner sets up the Shopify store, Headless channel and Dev Dashboard app (step-by-step given in chat, 3 Nov 2026). ⏳ *waiting on owner*
2. Load the 68 mock products into Shopify by script. ✅ *script written* (`scripts/shopify-import.ts`), ⏳ *not yet run* — needs the store keys.
3. Site reads from Shopify; Checkout sends shoppers to Shopify checkout. ✅ *built* — switches on automatically when the keys are set.
4. Build Lookbook, Pop-ups, Track Order, Account, Contact and policy pages on Shopify data.
5. Connect Razorpay (test mode) and place end-to-end test orders, including a failed payment and a refund.
6. Deploy to Cloudflare, move the domain's DNS from GoDaddy to Cloudflare, add the checkout subdomain.
7. Go live: real products and photos, Razorpay live mode, Basic plan; remove Lovable and Supabase code.

### 3.2 Shopify connection (built 3 November 2026, not yet connected to a real store)

**How it switches on:** `src/lib/shop.functions.ts` serves products from Shopify when `SHOPIFY_STORE_DOMAIN` and `SHOPIFY_STOREFRONT_PRIVATE_TOKEN` are set, otherwise from the mock catalogue. Nothing else needs changing. This replaces the old `USE_MOCK_CATALOG` switch, and the unused Supabase product queries are gone. Lookbook and pop-ups still read Supabase until they move to Shopify metaobjects.

**Files:**
- `src/lib/catalog.ts`: shared product types, listing filter/sort, and bag shipping numbers (`SHIPPING_FEE`, `FREE_SHIPPING_THRESHOLD`). Keep these in step with Shopify's shipping settings, which decide what checkout actually charges.
- `src/lib/shopify/schema.ts`: **how products are stored in Shopify** (read this before editing products by hand).
- `src/lib/shopify/map.ts`: Storefront API queries and the Shopify → site mapping.
- `src/lib/shopify/storefront.server.ts`: server-only client (private token). The whole catalogue is cached for 60 seconds; if Shopify fails, the last good copy is served.
- `src/lib/checkout.ts` + `src/lib/checkout.functions.ts` + `src/components/site/checkout-button.tsx`: Checkout sends product + size + quantity to the server. The server re-reads stock and variants from Shopify, creates a Shopify cart and redirects to Shopify checkout. The bag empties itself on the next visit once Shopify reports that cart as completed. While Shopify isn't connected, Checkout goes to the placeholder `/checkout` page.
- `src/lib/shopify/import-payload.ts` + `scripts/shopify-import.ts`: one-off loader for the 68 pieces and 11 collections.
- `src/test/shopify.test.ts`: round-trip test (mock product → Shopify input → Storefront response → site product, for all 68 pieces), listing parity, checkout line checks, and the client with simulated Shopify responses.

**How the owner edits products in Shopify** (conventions from `schema.ts`):
| On the site | In the Shopify product |
|---|---|
| Name, description, photos | Title, Description, Media |
| Price / strike-through price | Variant price / Compare-at price |
| Sizes and stock | Option "Size" (XS–XL); stock per variant |
| Primary category (breadcrumb) | Product type, e.g. `Tops & Shirts` |
| Listed under a category | Tag `category:<slug>`, e.g. `category:denim` |
| In a story collection | Tag `collection:<slug>`, e.g. `collection:ajrakh-stories` |
| New / Limited edition / Featured badges | Tags `new`, `limited-edition`, `featured` |
| Bestsellers page order | Metafield "Bestseller rank" (1 = top; empty = not listed) |
| Fabric, Colour, Fabric & craft, Fit notes, Care | Metafields with those names |

Categories and story collections are automated Shopify collections (rule: product tag equals `category:<slug>` / `collection:<slug>`). The handle is the URL slug. Metafields: "Kind" (`category` or `story`), "Tagline", "Menu position".

**Running the import** (from a session whose environment has the keys and allows `*.myshopify.com`):
`bun scripts/shopify-import.ts --dry-run`, then `bun scripts/shopify-import.ts`. It is safe to re-run, because it skips what already exists. **Never use `--force` once real stock or products exist**: it resets them to the mock values. Shopify downloads the photos from `IMAGE_BASE_URL` (default: the live Lovable site), so that site must stay up until the import has run.

**Not verified yet:** nothing has run against a real Shopify store. Expect small fixes on the first run (exact API field names, permissions). Check in particular:
- Storefront `quantityAvailable` needs the Headless channel's inventory permission. Without it, sizes show only in stock / sold out.
- Whether a completed checkout's cart really disappears, which is what empties the bag.

---

## 4. What has been built — page by page

### Navigation (header)
`src/components/site/header.tsx`
- Logo centred (vector logo), search on the left, account + bag icons on the right.
- Main menu: **New Arrivals · Clothing ▾ · Collections ▾ · Bestsellers · Style Notes · About Us**.
- **Clothing** and **Collections** open full-width dropdown panels with pictures (desktop). Mobile has a slide-in drawer with expandable sections.
- Rotating announcement bar (4 messages) at the very top — edit the `ANNOUNCEMENTS` array in `header.tsx`.
- Header tucks away when scrolling down, returns when scrolling up, and shrinks slightly after scrolling.
- Search overlay searches product name, description, fabric and colour.

### Home — `src/routes/_site.index.tsx`
In order:
1. **Hero** on the blush stitched lattice: headline "Her Forever _Prêt_", a dashed thread that draws itself into a wobbling spool, two buttons (Shop new arrivals / Explore collections). Right side: an **arched slideshow** of 5 looks with a slow zoom, a smaller close-up of the same garment that drifts on scroll, a "Now wearing" card (name, fabric, price) and slide progress bars. Looks are set in `HERO_LOOKS`.
2. **Ticker** — indigo band scrolling "Denim, Reimagined ✦ Made in-house in Mumbai ✦ Crochet ✦ Ajrakh ✦ …".
3. **Manifesto** — "Getting dressed is one of the first rituals of the day…" lights up word by word as you scroll.
4. **Shop by category** — 5 category tiles.
5. **New Arrivals** carousel with arrow buttons and a progress line.
6. **Denim, Reimagined** story on the stitched lattice — arched photo with pulsing "+" shop-the-look hotspots, text, and three close-up product crops.
7. **"Made with _intention_"** (the brand's unique selling points, without using the word "USP") — sticky heading + hand-stitching photo + "by hand" badge; six numbered points with line icons: _Denim, at the heart · Made in our Mumbai studio · Limited by design · Craft you notice up close · Made to your measure · Designed beyond a season._ Edit the `DIFFERENCE` array.
8. **Bestsellers** — top 4, numbered 01–04.
9. **Collections showcase** (indigo lattice) — hover a collection name to swap the arched picture (desktop); swipeable cards on mobile.
10. **Lookbook strip** — continuously moving row of photos linking to products; pauses on hover; @theritualera link.
11. **Service row** — Free shipping (over ₹5,000) · Easy exchanges (7 days) · Secure payments · WhatsApp help.

### Listing pages — shared component `src/components/site/product-listing.tsx`
- **New Arrivals** `/new-arrivals` — 16 pieces flagged new, sorted newest first.
- **Bestsellers** `/bestsellers` — 18 pieces in ranked order.
- **Clothing** `/shop` — all 68 pieces, with category tabs.
- **Category pages** `/shop/<category>` — `tops-shirts`, `dresses`, `co-ord-sets`, `denim`, `jackets`.
- Each listing: stitched-lattice header, category tabs, filter bar (size XS–XL, price band, sort: featured / newest / price), product grid with staggered fade-in.

### Collections
- `/collections` — index of 6 collections (staggered two-column layout with image unveil).
- `/collections/<slug>` — hero (title, tagline, story, arched cover image) + product grid + "Continue the story" links.

### Product page — `src/routes/_site.product.$slug.tsx`
- Gallery: full look + close-up detail crop (thumbnails + hover zoom on desktop, swipe on mobile).
- Badges (New / Limited Edition / Only N left), name, fabric · colour, price (₹, "inclusive of all taxes"), description.
- Size selector XS–XL with sold-out sizes struck through, low-stock note, **Add to bag** (opens the bag drawer).
- **Request made-to-measure** → opens WhatsApp with a prefilled message.
- Size guide drawer (bust / waist / hip / shoulder in inches).
- Accordions: Fabric & craft, Fit notes, Care, Shipping & exchanges.
- "Part of <collection>" links and "You may also like" (4 related pieces).

### Product cards — `src/components/site/product-card.tsx`
- Hover swaps to the garment close-up and shows available sizes (sold-out struck through).
- Name, price, fabric line, badges.

### Style Notes (styling tips) — `/style-notes`
`src/routes/_site.style-notes.tsx`, content in **`src/lib/style-notes.ts`** (easy to edit).
- Six stories, each with a big photo, drifting close-up, three numbered tips and a "Shop the look" row:
  1. One denim shirt, three moods (desk / weekend / evening)
  2. Crochet, worn every day
  3. Denim on denim, done softly
  4. Co-ords, worn apart
  5. Ajrakh for the city
  6. Linen in the heat
- **Care rituals** grid: Denim, Silk & ajrakh, Crochet & lace, Linen, Chanderi.
- "Need a second opinion?" → WhatsApp styling help.

### About Us — `/about`
- Logo "stitching itself in" on the blush lattice, then "Her Forever Prêt".
- Manifesto lighting up word by word; philosophy text with two lookbook photos (one drifting).
- **Founder section**: Priyanka's real studio portrait (`public/media/founder-priyanka.webp` — at her desk in front of the denim swatch wall with "The Ritual Era" sign), bio, quote, script signature "Priyanka".
- Three pillars (Denim at the heart / Made in-house / Longevity over excess) beside the sashiko hand-stitching photo.
- Owner chose the studio portrait over a garden photo because its ivory/indigo palette and denim swatch wall match the brand and read as "founder at work".

### Bag
- Slide-out bag drawer (`cart-drawer.tsx`) and a full bag page `/cart` with subtotal, shipping (₹150, free above ₹5,000) and total. Bag is stored in the browser (`localStorage`, `src/lib/cart.tsx`).

### Footer — `src/components/site/footer.tsx`
- Blush stitched band with the large logo and newsletter sign-up ("Letters from the studio"; saves to Supabase `newsletter_subscribers`).
- Columns: Shop (New arrivals, Bestsellers, Collections, Style notes, All clothing, each category), Care, Fine print (policies, Instagram, Facebook), WhatsApp link.

---

## 5. Product data (currently mock data)

**The site currently shows a mock catalogue built from the lookbook (`FINAL LOOK BOOK.pdf`)**, not the database. This was requested so the owner could see the feel of the site.

- File: **`src/lib/mock-catalog.ts`** — all products, categories and collections.
- Switch: the site uses Shopify automatically once its keys are set (see 3.2); otherwise this mock catalogue.
- **68 products** — every garment in the lookbook, with its real name and fabric from the lookbook labels (two typos corrected: "Air Bollon" → Air Balloon Dress, "Denim Flower Dreaa" → Denim Flower Dress).
  - By type: Tops & Shirts 38 · Dresses 19 · Jackets 6 · Co-ord Sets 5. **Denim** is both a category and a fabric: the 26 denim pieces also appear under their garment type.
- **Invented for the mock (must be replaced with real data):** prices (₹3,290–₹7,490), descriptions, detail bullet points, fit notes, stock per size, "new" (16), bestseller ranks (18), "limited edition" (7) flags, colour names. Care text is generated per fabric.
- **Categories** (owner-specified): Tops & Shirts, Dresses, Co-ord Sets, Denim, Jackets.
- **Collections** (created from the lookbook's fabrics/themes — rename or replace freely):
  - _Denim, Reimagined_ — indigo in conversation with Indian craft
  - _Ajrakh Stories_ — hand-block prints from Kutch, cut for the city
  - _The Crochet Edit_ — lace and crochet, worn every day
  - _Little Blooms_ — embroidered denim with a sense of humour (cherries, hearts, balloons, lilies)
  - _Linen Days_ — breathable pieces for long, warm afternoons
  - _Chanderi Hours_ — featherlight mul chanderi, desk to dinner
- **Images:** extracted from the lookbook PDF (the clean photos, without the printed labels). Per product: `public/media/products/<slug>.webp` (full look, 800×1000) and `<slug>-detail.webp` (garment close-up used for hover and gallery). Plus `hero-cover.webp` (lookbook cover) and `editorial-1…4.webp`. ~10 MB total.
- The Supabase seed has its own 8 placeholder products and placeholder images (`public/media/product-1…8.jpg`, `hero.jpg`, `craft.jpg`, `lookbook-1.jpg`, `founder.jpg`). `craft.jpg` (hands sashiko-stitching denim) is used on the home page and About; `founder.jpg` is no longer used.

**How to edit common things**
| To change… | Edit |
|---|---|
| A product's price, name, description, flags | Shopify admin once connected (see 3.2); `src/lib/mock-catalog.ts` while on mock data |
| Collection names / stories | `COLLECTIONS` in `mock-catalog.ts` |
| Hero slideshow looks | `HERO_LOOKS` in `src/routes/_site.index.tsx` |
| "Made with intention" points | `DIFFERENCE` in `_site.index.tsx` |
| Style Notes stories and care notes | `src/lib/style-notes.ts` |
| Announcement bar messages | `ANNOUNCEMENTS` in `src/components/site/header.tsx` |
| Shipping fee / free threshold shown in the bag | `SHIPPING_FEE` / `FREE_SHIPPING_THRESHOLD` in `src/lib/catalog.ts` (checkout charges what's in Shopify's shipping settings) |
| Fonts | `src/routes/__root.tsx` (Google Fonts link) + tokens in `src/styles.css` |
| Colours, textures, animations | `src/styles.css` |

---

## 6. Motion and interaction system

All movement is subtle and slow, and **switches off automatically for visitors who prefer reduced motion**.

- `src/components/site/motion.tsx`: `Logo`, `Marquee` (infinite ticker), `Parallax` (drift on scroll), `ScrollWords` (words light up on scroll), `StitchDivider` (sewing stitches), `Spool` (spool icon), `useCycle` (slideshow timer).
- `src/hooks/use-reveal.ts` + CSS classes: `.reveal` (fade-and-rise when scrolled into view), `.reveal-img` (image unveils upwards — clip is on the children, because a fully clipped element never registers as visible), `.thread-draw`.
- CSS keyframes in `src/styles.css`: marquee, kenburns (slow zoom), stitch-march, thread-in, spool wobble, stitch-reveal (logo wipe), pulse-ring (hotspots), rise-in, page-in (soft page fade).

---

## 7. Caching / "people see the old version" fix

Problem reported: visitors were seeing old versions after updates.

What was done (`src/server.ts`, `src/lib/build-id.ts`, `src/hooks/use-version-check.ts`, `vite.config.ts`):
1. **Page HTML** is sent with `Cache-Control: no-cache, must-revalidate` so browsers always fetch fresh HTML. Built JS/CSS files in `/assets/` have unique hashed names per deploy and keep a long "immutable" cache.
2. Every build gets a **build ID**; `GET /__version` returns it (never cached).
3. **Open tabs check for a new deploy** on tab focus, on navigation, and every 5 minutes. If one is live, the page reloads on the next click (or immediately if the tab is in the background). A session guard prevents reload loops. The shopping bag survives reloads.

**Most important:** the live site only changes after **Publish → Update in Lovable**. If visitors see an old version, first check it was published.

---

## 8. Decision log (chronological)

1. **Mock catalogue + full storefront** — lookbook products as mock data; categories, collections, listing/product/about/bag pages; nav restructured to New Arrivals · Clothing · Collections · Bestsellers · About Us. Fixed a routing bug where `/shop/<category>` could never render (parent route had no outlet → moved to `_site.shop.index.tsx`).
2. **Design overhaul with movement** (owner: "looking very static") — added the logo, the stitched lattice texture, hero slideshow, ticker, scroll-lit text, carousel, hotspots, hover collections list, lookbook strip, image unveils, hide-on-scroll header, rotating announcements. Replaced a gradient with ivory caption blocks (brand rule: no gradients).
3. **Founder photo** — chose the studio portrait (see About above).
4. **Logo quality** (owner: logo looks blurred) — replaced the raster cut-out with a vector trace (`logo.svg`).
5. **Fonts aligned to brand deck** — DM Sans → Albert Sans, Mrs Saint Delafield → Ms Madi; Playfair kept (deck's alternative).
6. **Feedback round** (from a reviewer):
   1. "Make the fonts the same as the brand guideline" → done as in item 5; exact fonts require licences.
   2. "Logo at the centre top should be the actual logo" → already the actual logo artwork (feedback likely referred to the very first version, which had a typed wordmark). Confirm with the reviewer.
   3. "Add a section in the middle highlighting the USP without saying USP" → "Made with _intention_" section.
   4. "Maybe add a styling tips page" → Style Notes page.
7. **Cache fix** — see section 7.

---

## 9. Still to do (roadmap)

**Content and data**
- [ ] Replace mock data with real products: prices, descriptions, fit/fabric notes, sizes and stock, real "new"/bestseller/limited flags — in the Shopify admin once the store is connected (see 3.2).
- [ ] Real product photography: ideally 3–5 images per product (front, back, detail, on-model), replacing the lookbook crops.
- [ ] Confirm collection names/stories (they were invented from the lookbook themes).
- [ ] Confirm the correct phone number (see section 1).
- [ ] Original vector logo file from the designer.
- [ ] Optional: licensed Canela / Maison Neue / Quentin web fonts.
- [ ] Policy texts (Shipping, Returns & Exchange, Privacy, Terms) — pages exist with placeholder text; needed for Razorpay approval.

**Pages still placeholders** (they render "This page is being dressed"):
- [ ] Checkout (guest checkout default + login option, address form, Razorpay)
- [ ] Order confirmation, Track Your Order
- [ ] Account / sign-in (email OTP + Google), order history, saved addresses
- [ ] Contact page (WhatsApp, email, Mumbai, hours, contact form)
- [ ] Lookbook list + campaign pages (note: `_site.lookbook.tsx` has the same parent-route issue the shop had — rename to `_site.lookbook.index.tsx` when building it)
- [ ] Pop-ups & Events

**Functionality from the original brief (README.md sections 4–6)**
- [ ] **Razorpay** payments: server-side order creation priced from the database (never trust browser prices), signature verification, webhook backup, mark paid and reduce stock only after verification, retry screen. Needs `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` (test mode first).
- [ ] Emails: order confirmation, admin new-order alert, status updates.
- [ ] Made-to-measure request form (currently a WhatsApp link) saved to the database with statuses New / Contacted / Confirmed / Closed.
- [ ] **Admin dashboard** (`/admin`): products (images, sizes/stock, flags, drafts), categories & collections, orders with status flow, customers, made-to-measure requests, lookbook & pop-ups, settings (shipping, announcement), sales overview and low-stock alerts.
- [ ] SEO: product structured data, Open Graph images per page (basic titles/descriptions exist).

**Technical housekeeping**
- [ ] `npm run lint` reports many Prettier formatting errors across the codebase (pre-existing style); type checks and the build are clean.
- [ ] Unused placeholder images in `public/media/` can be removed once the Supabase seed is replaced.

---

## 10. Working notes for whoever continues

- Run locally: `bun install` (or `npm i`), then `npm run dev`. Type check: `npx tsc --noEmit`. Build: `npm run build`. Tests: `npm test`.
- Visual check approach used so far: run the dev server and screenshot desktop (1440px) and mobile (390px) with Playwright, scrolling the page so scroll animations trigger.
- The `.reveal` / `.reveal-img` animations only fire when elements scroll into view — full-page screenshots taken without scrolling show those sections blank; that is expected.
- When adding a page with child routes, use an `.index.tsx` file for the parent page.
- Keep to the brand rules: ivory not white, ink not black, no gradients, hairline borders, corners ≤ 2px (the arch frames are the deliberate exception), motion slow and soft, the script font only for rare human moments, never alter the logo.
- Workflow used so far: develop on a feature branch, then fast-forward `main` when the owner approves, then Publish in Lovable.
