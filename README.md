# Theritualerawebsite

Build a premium e-commerce website for "The Ritual Era", a ready-to-wear womenswear label from Mumbai. Tagline: "Her Forever Prêt." The site must feel like a quiet-luxury fashion house: editorial, calm, spacious and crafted. It should not feel like a generic Shopify template. Use Lovable Cloud for the database, auth, storage and server functions.

## 1. BRAND CONTEXT
The Ritual Era creates elevated everyday silhouettes with refined cuts, contemporary detailing and a distinctive edge that goes beyond trends. Denim is at the heart of the design language, reimagined through Indian textiles, rich textures and unexpected fabric pairings. Every piece is designed and made in-house in limited editions. Founder: Priyanka Bhartia, a Fashion Design graduate from De Montfort University. Brand line: "We don't design for a season. We design beyond it."
Brand concept: craftsmanship, slow design, timeless storytelling, sashiko-inspired stitching that stands for care and detail, mindful fashion.

## 2. VISUAL IDENTITY (follow strictly)
Colours:
- Ritual Indigo #1F3A5F (brand anchor, primary buttons, links)
- Ink Blue #0F2233 (headings and body text, never pure black)
- Deep Denim #2C3E50, Washed Indigo #5A6E7F (secondary text, borders, hover states)
- Soft Ivory #F5EFE8 (main page background, never pure white)
- Warm Sand #D6C6B8 (section backgrounds, cards)
- Blush #EFD3C7 (signature backdrop from the logo and hand tags; use for hero panels and feature sections)
- Stone Grey #9A9188, Earth Taupe #7A6A5F (muted text, dividers)
- Accents, used sparingly (badges, small highlights only): Antique Gold #E6C79A, Burnt Saffron #C46A2D, Rust Orange #C65D2E, Burnt Terracotta #A44A2F, Muted Ochre #C2A24D
Typography:
- Headings and display: "Playfair Display" (stand-in for Canela). Large, elegant, generous letter-spacing on uppercase eyebrow labels.
- Body, UI, labels, prices: "DM Sans" (stand-in for Maison Neue). Light and Regular weights, wide tracking on small uppercase labels.
- Script accent: "Mrs Saint Delafield". Use only for rare human-touch moments (founder signature, a word like "Ritual" in a section title, thank-you message). Never for UI.
Logo: use the uploaded logo file as-is. Do not recolour, crop, rotate, add shadows or effects, lower its opacity, or place it over busy imagery. Give it clear space on all sides.
Signature design motifs (use subtly, this is what makes the site feel like the brand):
- Sashiko stitching: a faint diagonal cross-hatch pattern of dashed lines, used as a very low-contrast texture on blush or sand sections.
- Dashed "thread" lines as section dividers, with a small four-point star ✦ in the centre (as on the hand tags and business card).
- A dashed thread line that draws itself on scroll in the hero or About section, like the thread running from the logo to the spool.
- Thin 1px hairline borders, square or barely rounded corners (max 2px), no heavy shadows, no gradients, no emojis.
Motion: slow, soft and minimal. Fade-and-rise on scroll, gentle image zoom on hover, smooth cart drawer. Nothing bouncy.
Layout: editorial magazine feel, big imagery, asymmetric grids, lots of whitespace. Mobile-first, since most traffic will come from Instagram.

## 3. PAGES
1. Home: full-bleed hero image with the tagline "Her Forever Prêt" and a "Shop the Collection" button. Then: a short brand statement, a featured collection grid, a "Denim, Reimagined" craft story block with the sashiko texture, a lookbook teaser, an upcoming pop-up card, an Instagram strip (@theritualera), and a footer.
2. Shop / Collection listing: filter by category, size and price, sort by newest or price. Product cards show 2 images (swap on hover), name, price in ₹, and badges such as "Limited Edition" or "Only 2 left". Categories (placeholders, editable in admin): Denim, Tops & Shirts, Dresses, Co-ords, Jackets.
3. Product page: large image gallery with zoom, name, price, size selector (XS, S, M, L, XL) with sold-out sizes disabled, quantity, "Add to Bag", "Size Guide" link that opens a drawer with a measurement chart, and accordions for Fabric & Craft, Fit Notes, Care Instructions, and Shipping & Returns. Add a "Request Made-to-Measure" button that opens the form described in section 5. Show "You may also like" products below.
4. Cart: slide-out drawer plus a full cart page showing a line items summary, subtotal, and a shipping estimate.
5. Checkout (see section 4).
6. Order confirmation page with order number and summary.
7. Track Your Order: guests enter their order number + email to see order status and tracking details.
8. Account (optional for customers): sign up and login (email OTP and Google), order history with status, saved addresses, and profile.
9. Lookbook: a list of campaigns. Each campaign has a full editorial photo story with captions and "Shop this look" links to products.
10. Pop-ups & Events: upcoming and past exhibitions, each with name, venue, date, address and a Google Maps link.
11. About: brand philosophy, founder story with Priyanka's photo and a script signature, and craft and denim philosophy.
12. Contact: WhatsApp button (+91 9769728791, link https://wa.me/919769728791), email theritualera.official@gmail.com, Mumbai, India, hours 10am–7pm (closed on public holidays), and a contact form.
13. Policy pages (required for Razorpay approval): Shipping Policy, Returns & Exchange Policy, Privacy Policy, Terms & Conditions. Fill them with sensible placeholder text that I will edit.
Global: a minimal header (logo centred or left, Shop / Lookbook / Pop-ups / About, plus search, account and bag icons) and a floating WhatsApp button on mobile. The footer has a newsletter signup, Track Your Order link, policy links, Instagram and Facebook (facebook.com/theritualera.official), and "© The Ritual Era".

## 4. PAYMENTS – RAZORPAY
- India only, prices in INR (₹), formatted as ₹4,500.
- Guest checkout is the default: customers can pay without an account. At the start of checkout, show two options side by side: "Continue as Guest" (email + phone only) and "Log in" (email OTP or Google) for returning customers with saved addresses.
- Collect the shipping address: name, phone, email, address, city, state, pincode. Logged-in customers can pick a saved address.
- After a guest order, show an optional "Create an account to track your orders" prompt on the confirmation page. If the guest later signs up with the same email, link their past guest orders to the new account.
- Payment flow: a server function creates a Razorpay order. It must calculate the amount on the server from database prices and stock, and never trust prices sent from the browser. The browser then opens Razorpay Checkout (UPI, cards, netbanking, wallets). A server function verifies the payment signature. Add a Razorpay webhook (payment.captured / payment.failed) as a backup.
- Mark the order as Paid and reduce stock per size only after payment is verified. If payment fails, show a friendly retry screen.
- Store RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET as secrets. Build in test mode first.
- Shipping: a flat rate and a free-shipping threshold, both editable in admin.
- Send an order confirmation email (with order number and a track-order link) to the customer, and a new-order alert email to the admin. Status-update emails go to guests too.

## 5. MADE-TO-MEASURE REQUESTS
A form on product pages with these fields: name, phone/WhatsApp, email, the product it relates to, measurements (bust, waist, hip, shoulder, length, height), notes, and an optional reference image upload. Save each submission to the database, show it in admin with a status (New / Contacted / Confirmed / Closed), and show the customer a confirmation message that says the team will reach out on WhatsApp.

## 6. ADMIN DASHBOARD (/admin, admin role only)
- Products: create and edit name, description, category, price, compare-at price, multiple images (drag to reorder), fabric and craft notes, fit notes, care instructions, stock per size, "Limited Edition" toggle, featured toggle, and published/draft status.
- Categories and collections management.
- Orders (guest and registered): list with filters, order detail, and a status flow Paid → Packed → Shipped (with courier name and tracking number) → Delivered, plus Cancelled and Refunded. Updating the status emails the customer.
- Customers list, including guest buyers by email.
- Made-to-measure requests.
- Lookbook campaigns and pop-up events (create, edit, delete).
- Settings: shipping rate, free-shipping threshold, announcement bar text.
- Simple dashboard: today's and this month's orders and revenue, plus low-stock alerts.
The admin can be cleaner and more functional than the storefront, but should still use the brand colours and fonts.

## 7. QUALITY
- Fully responsive with a polished mobile experience.
- Fast: optimised, lazy-loaded images.
- SEO: page titles, meta descriptions, Open Graph images, product structured data, clean URLs (/shop/denim, /product/indigo-patchwork-jacket).
- Accessible contrast and keyboard navigation.
- Seed the site with 8 placeholder products across the categories, using tasteful neutral fashion placeholder images, so the design can be reviewed right away.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://theritualerawebsite.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/8d06aa68-b9b6-4f92-85c1-79897cae4182).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
