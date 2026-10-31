/*
 * Mock catalogue drawn from The Ritual Era lookbook.
 * Used while the real catalogue is being loaded into the database — flip
 * USE_MOCK_CATALOG in shop.functions.ts to switch back to Supabase.
 */

export interface MockCategory {
  slug: string;
  name: string;
  blurb: string;
  image: string;
}

export interface MockCollection {
  slug: string;
  name: string;
  tagline: string;
  story: string;
  coverImage: string;
}

export interface MockProduct {
  slug: string;
  name: string;
  category: string;
  fabric: string;
  colour: string;
  price: number;
  compareAtPrice?: number;
  description: string;
  details: string[];
  fit: string;
  collections: string[];
  isNew?: boolean;
  bestseller?: number;
  limited?: boolean;
  featured?: boolean;
  stock?: [number, number, number, number, number];
}

const img = (slug: string) => `/media/products/${slug}.webp`;

export const CATEGORIES: MockCategory[] = [
  { slug: "tops-shirts", name: "Tops & Shirts", blurb: "Everyday shirts with an unexpected panel, pocket or stitch.", image: img("striped-denim-shirt") },
  { slug: "dresses", name: "Dresses", blurb: "Easy silhouettes in silk, linen and hand-finished denim.", image: img("sora-dress") },
  { slug: "co-ord-sets", name: "Co-ord Sets", blurb: "Two pieces, one thought. Wear together or apart.", image: img("bloom-co-ord") },
  { slug: "denim", name: "Denim", blurb: "Our heart fabric, reimagined through Indian textiles.", image: img("dune-shirt") },
  { slug: "jackets", name: "Jackets", blurb: "Light layers that finish a look without weighing it down.", image: img("ajrakh-jacket") },
];

export const COLLECTIONS: MockCollection[] = [
  {
    slug: "denim-reimagined",
    name: "Denim, Reimagined",
    tagline: "Indigo, in conversation with Indian craft",
    story:
      "Denim sits at the heart of everything we make. Here it meets kantha-like running stitches, hakoba eyelets, crochet and hand-block prints — pieced, panelled and top-stitched until the familiar feels new again.",
    coverImage: "/media/products/editorial-3.webp",
  },
  {
    slug: "ajrakh-stories",
    name: "Ajrakh Stories",
    tagline: "Hand-block prints from Kutch, cut for the city",
    story:
      "Ajrakh is printed by hand in many stages of resist and dye. We let its deep madder reds and indigo blues lead, and pair them with clean silhouettes, washed denim and soft silks.",
    coverImage: img("soil-dress"),
  },
  {
    slug: "the-crochet-edit",
    name: "The Crochet Edit",
    tagline: "Lace and crochet, worn every day",
    story:
      "Floral crochet panels set into crisp cotton — on a sleeve, a yoke or a hem. Delicate enough to notice, sturdy enough to wear on an ordinary Tuesday.",
    coverImage: img("amaya-shirt"),
  },
  {
    slug: "little-blooms",
    name: "Little Blooms",
    tagline: "Embroidered denim with a sense of humour",
    story:
      "Tiny cherries, hearts, hot-air balloons and line-drawn lilies, embroidered by hand onto dark rinse denim. Small details that make you look twice.",
    coverImage: img("cherrie-pie-dress"),
  },
  {
    slug: "linen-days",
    name: "Linen Days",
    tagline: "Breathable pieces for long, warm afternoons",
    story:
      "Washed linens and cotton-linen blends in tie-dye pinks, sage and printed whites. Made to soften with every wear and every wash.",
    coverImage: "/media/products/editorial-2.webp",
  },
  {
    slug: "chanderi-hours",
    name: "Chanderi Hours",
    tagline: "Featherlight mul chanderi, from desk to dinner",
    story:
      "Sheer, light and quietly lustrous. Chanderi and mul chanderi shirts, tunics and dresses with thread-work and soft prints — the polish of occasionwear with the ease of a day shirt.",
    coverImage: img("flora-dress"),
  },
];

export const PRODUCTS: MockProduct[] = [
  // ---------------------------------------------------------------- Tops & Shirts
  {
    slug: "bubblegum-shirt", name: "Bubblegum Shirt", category: "tops-shirts", fabric: "Cotton with Denim", colour: "Midnight / Rose",
    price: 4290, isNew: true, bestseller: 4, featured: true, collections: ["denim-reimagined"],
    description: "A midnight cotton shirt framed in rose denim: on the collar, the flap pockets, the cuffs and a deep hem band. Quietly sweet, never saccharine.",
    details: ["Rose denim collar, pocket flaps, cuffs and hem band", "Shell buttons", "Long sleeves with button cuffs"],
    fit: "Relaxed, slightly cropped boxy fit. Sits at the high hip.",
  },
  {
    slug: "mocha-shirt", name: "Mocha Shirt", category: "tops-shirts", fabric: "Cotton with Crochet", colour: "Mocha / Ecru",
    price: 4590, bestseller: 10, collections: ["the-crochet-edit"],
    description: "Fine-ribbed mocha cotton with full balloon sleeves of floral crochet lace. A concealed placket keeps the front clean so the sleeves can do the talking.",
    details: ["Floral crochet balloon sleeves", "Concealed button placket", "Deep cotton cuffs"],
    fit: "Straight, slightly cropped. True to size.",
  },
  {
    slug: "striped-denim-shirt", name: "Striped Denim Shirt", category: "tops-shirts", fabric: "Cotton with Denim", colour: "Mid-wash / Pinstripe",
    price: 4190, bestseller: 1, featured: true, collections: ["denim-reimagined"],
    description: "A classic mid-wash shirt split on a sweeping diagonal with indigo pinstripe cotton. Our most-loved shirt, and the one we reach for most.",
    details: ["Diagonal pieced front", "Pinstripe sleeves and back panel", "Shell buttons"],
    fit: "Relaxed and slightly oversized. Size down for a closer fit.",
  },
  {
    slug: "striped-tie-up-shirt", name: "Striped Tie-up Shirt", category: "tops-shirts", fabric: "Denim", colour: "Indigo stripe",
    price: 4490, isNew: true, collections: ["denim-reimagined"],
    description: "Soft, washed indigo-stripe denim with a self-fabric tie that cinches the waist. Wear it knotted, loose, or tucked.",
    details: ["Self-tie waist", "Button-through front", "Long sleeves with button cuffs"],
    fit: "Relaxed body; the tie creates shape at the waist.",
  },
  {
    slug: "orange-pop-shirt", name: "Orange Pop Shirt", category: "tops-shirts", fabric: "Mul Chanderi", colour: "Apricot / Floral",
    price: 4890, isNew: true, collections: ["chanderi-hours"],
    description: "Apricot mul chanderi with a cropped floral bib layered over the front — a shirt and vest in one.",
    details: ["Printed floral bib overlay", "Classic collar", "Featherlight, slightly sheer"],
    fit: "Relaxed fit through the body.",
  },
  {
    slug: "amaya-shirt", name: "Amaya Shirt", category: "tops-shirts", fabric: "Cotton with Crochet", colour: "Rust / Ecru",
    price: 4790, bestseller: 6, limited: true, collections: ["the-crochet-edit"],
    description: "Pin-tucked rust cotton with a deep band of floral crochet around the hem. Puffed sleeves and a concealed placket keep it polished.",
    details: ["Crochet lace hem panel", "Puffed shoulders", "Concealed placket"],
    fit: "A-line, easy through the hip.",
    stock: [0, 1, 1, 0, 0],
  },
  {
    slug: "the-veda-shirt", name: "The Veda Shirt", category: "tops-shirts", fabric: "Knitted with Denim", colour: "Indigo / Ecru",
    price: 4390, bestseller: 12, collections: ["denim-reimagined"],
    description: "A graphic indigo-and-ecru knit, finished with dark denim collar, placket, cuffs and two generous patch pockets.",
    details: ["Textured knit body", "Denim patch pockets with flaps", "Turned-back denim cuffs"],
    fit: "Boxy and cropped. Short sleeves.",
  },
  {
    slug: "blue-hues-shirt", name: "Blue Hues Shirt", category: "tops-shirts", fabric: "Cotton Linen", colour: "Indigo patchwork",
    price: 3790, collections: ["linen-days"],
    description: "Cotton-linen in a patchwork of indigo prints — dots, checks and florals pieced together like a well-loved quilt.",
    details: ["Patchwork print", "Camp collar", "Short sleeves"],
    fit: "Relaxed, straight hem.",
  },
  {
    slug: "threadwork-shirt", name: "Threadwork Shirt", category: "tops-shirts", fabric: "Chanderi with Satin", colour: "Mauve",
    price: 5490, limited: true, collections: ["chanderi-hours"],
    description: "Mauve chanderi and satin, pieced across the body and scattered with hand thread-work blooms set in small patches.",
    details: ["Hand thread-work patches", "Chanderi and satin panels", "Kimono sleeves, high-low hem"],
    fit: "Oversized and fluid.",
  },
  {
    slug: "scout-shirt", name: "Scout Shirt", category: "tops-shirts", fabric: "Cotton with Denim", colour: "Two-tone blue",
    price: 3990, bestseller: 14, collections: ["denim-reimagined"],
    description: "Colour-blocked chambray and denim with a contrast textured yoke. The shirt for long walks and longer weekends.",
    details: ["Two-tone colour blocking", "Textured cotton yoke", "Contrast inner cuffs"],
    fit: "Relaxed, longline.",
  },
  {
    slug: "marine-shirt", name: "Marine Shirt", category: "tops-shirts", fabric: "Cotton", colour: "Sky stripe",
    price: 3690, isNew: true, collections: [],
    description: "Sky-blue striped cotton embroidered with shells, starfish and seaweed. A little holiday, worn to class or the office.",
    details: ["Hand-embroidered sea motifs", "Contrast floral placket", "Long sleeves"],
    fit: "Relaxed and slightly oversized.",
  },
  {
    slug: "ajrakh-denim-shirt", name: "Ajrakh Denim Shirt", category: "tops-shirts", fabric: "Silk with Denim", colour: "Chambray / Madder",
    price: 4990, bestseller: 8, collections: ["ajrakh-stories", "denim-reimagined"],
    description: "A chambray yoke over a body of madder-red ajrakh silk. Two crafts, two textures, one easy shirt.",
    details: ["Hand-block ajrakh silk body", "Chambray yoke and sleeves", "Wooden buttons"],
    fit: "Boxy, with dropped shoulders.",
  },
  {
    slug: "dune-shirt", name: "Dune Shirt", category: "tops-shirts", fabric: "Denim", colour: "Mid indigo",
    price: 3890, bestseller: 2, featured: true, collections: ["denim-reimagined"],
    description: "Mid-indigo denim traced with rows of ecru top-stitching at the pockets and hem — a nod to sashiko, our favourite stitch.",
    details: ["Sashiko-inspired top-stitching", "Two patch pockets", "Camp collar"],
    fit: "Relaxed, short-sleeved.",
  },
  {
    slug: "midori-top", name: "Midori Top", category: "tops-shirts", fabric: "Textured Cotton", colour: "Lime / Charcoal",
    price: 3490, isNew: true, collections: [],
    description: "Lime, charcoal and ecru stripes in textured handloom cotton. Sleeveless, zip-front and cropped, with two utility pockets.",
    details: ["Front zip", "Chest pockets", "Cap sleeves"],
    fit: "Cropped, boxy fit.",
  },
  {
    slug: "sienna-top", name: "Sienna Top", category: "tops-shirts", fabric: "Crochet", colour: "Caramel",
    price: 3990, collections: ["the-crochet-edit"],
    description: "A caramel crochet vest edged in rust bias, buttoned down the front and tied at the sides.",
    details: ["Floral crochet lace", "Contrast bias binding", "Side ties"],
    fit: "Adjustable at the side ties.",
  },
  {
    slug: "tie-up-shirt-top", name: "Tie-up Shirt Top", category: "tops-shirts", fabric: "Denim", colour: "Chambray",
    price: 3790, collections: ["denim-reimagined"],
    description: "Light chambray denim with extended shoulders and a long self-tie belt that falls past the hip.",
    details: ["Self-tie belt", "Extended cap shoulders", "Shell buttons"],
    fit: "Relaxed, belted at the waist.",
  },
  {
    slug: "asymmetrical-top", name: "Asymmetrical Top", category: "tops-shirts", fabric: "Denim", colour: "Washed blue",
    price: 3590, collections: ["denim-reimagined"],
    description: "Feather-printed washed denim cut on a dramatic diagonal hem, with a single soft pleat at the neckline.",
    details: ["Asymmetric hem", "Front pleat", "Sleeveless"],
    fit: "Loose, falls longer on one side.",
  },
  {
    slug: "aqua-tunic", name: "Aqua Tunic", category: "tops-shirts", fabric: "Mul Chanderi", colour: "Indigo patchwork",
    price: 4190, collections: ["chanderi-hours"],
    description: "Indigo patchwork prints on featherlight mul chanderi, cut into a high-neck tunic with a pointed handkerchief hem.",
    details: ["Mandarin neck", "Handkerchief hem", "Sleeveless"],
    fit: "Relaxed, tunic length.",
  },
  {
    slug: "denim-vest-top", name: "Denim Vest Top", category: "tops-shirts", fabric: "Denim", colour: "Dark rinse",
    price: 4290, bestseller: 11, collections: ["denim-reimagined"],
    description: "Tailored dark-rinse denim with notched lapels, a double-breasted front and contrast top-stitching.",
    details: ["Notched lapels", "Double-breasted snap front", "Ecru top-stitching"],
    fit: "Fitted at the waist, cropped.",
  },
  {
    slug: "denim-saga-top", name: "Denim Saga Top", category: "tops-shirts", fabric: "Denim", colour: "Navy floral",
    price: 4190, collections: ["denim-reimagined"],
    description: "Navy denim panelled with a tonal floral print, finished with gold shank buttons and a single flap pocket.",
    details: ["Floral side panels", "Gold shank buttons", "Revere collar"],
    fit: "Straight, cap-sleeved.",
  },
  {
    slug: "sunflower-bib-top", name: "Sunflower Bib Top", category: "tops-shirts", fabric: "Crochet", colour: "Butter / Ivory",
    price: 3890, isNew: true, collections: ["the-crochet-edit"],
    description: "A butter-yellow crochet bib on an ivory base, with a band collar and long ties that wrap to the back.",
    details: ["Crochet lace bib", "Band collar", "Wrap ties"],
    fit: "Cropped; ties adjust the fit.",
  },
  {
    slug: "cherie-pie-top", name: "Cherie Pie Top", category: "tops-shirts", fabric: "Embroidered Denim", colour: "Dark rinse / Cherry",
    price: 3690, bestseller: 13, featured: true, collections: ["little-blooms", "denim-reimagined"],
    description: "Tiny cherries embroidered across dark-rinse denim, with white top-stitched panel lines and cap sleeves.",
    details: ["Hand-embroidered cherries", "Contrast top-stitching", "Back button closure"],
    fit: "Boxy and cropped.",
  },
  {
    slug: "chin-chin-top", name: "Chin Chin Top", category: "tops-shirts", fabric: "Embroidered Denim", colour: "Dark rinse / Pink",
    price: 3890, collections: ["little-blooms", "denim-reimagined"],
    description: "A camp-collar denim shirt scattered with tiny pink blossoms. Pairs with linen trousers and a sea view.",
    details: ["Hand-embroidered blossoms", "Camp collar", "Short sleeves"],
    fit: "Relaxed.",
  },
  {
    slug: "aroha-top", name: "Aroha Top", category: "tops-shirts", fabric: "Embroidered Denim", colour: "Dark rinse / Pink",
    price: 3490, isNew: true, collections: ["little-blooms", "denim-reimagined"],
    description: "A sleeveless round-neck shell in dark denim, sprinkled with tiny embroidered pink blooms and finished with a side slit.",
    details: ["Hand-embroidered blooms", "Side slits", "Sleeveless"],
    fit: "Straight and easy.",
  },
  {
    slug: "hakoba-kaftan", name: "Hakoba Kaftan", category: "tops-shirts", fabric: "Hakoba with Denim", colour: "Navy",
    price: 4490, collections: ["denim-reimagined"],
    description: "Navy cotton with a V-neck and kaftan sleeves, set into a lower panel of hakoba eyelet embroidered with sequinned florals.",
    details: ["Hakoba eyelet panel with sequin work", "V-neck", "Side slits"],
    fit: "Loose kaftan fit.",
  },
  {
    slug: "multi-polo-top", name: "Multi Polo Top", category: "tops-shirts", fabric: "Cotton with Knit", colour: "Berry / Olive / Stripe",
    price: 4390, collections: [],
    description: "A zig-zag knit in berry, olive and ecru, pieced with blue-stripe cotton sleeves and hem. A polo, reconsidered.",
    details: ["Zig-zag knit body", "Striped cotton sleeves and hem", "Polo collar and placket"],
    fit: "Relaxed, slightly cropped.",
  },
  {
    slug: "polka-top", name: "Polka Top", category: "tops-shirts", fabric: "Denim", colour: "Navy dot",
    price: 3990, collections: ["denim-reimagined"],
    description: "Navy pin-dot denim shirt with flap pockets and a soft peplum flounce at the hem.",
    details: ["Pin-dot print", "Peplum hem", "Flap pockets"],
    fit: "Fitted body, flared hem.",
  },
  {
    slug: "serrene-top", name: "Serrene Top", category: "tops-shirts", fabric: "Cotton Blend with Net", colour: "Sage / Lace",
    price: 4290, isNew: true, collections: ["the-crochet-edit"],
    description: "Sage cotton shirt patched with ivory lace and net, so no two panels look quite the same.",
    details: ["Lace and net patchwork", "Lace cuffs", "Wooden buttons"],
    fit: "Relaxed.",
  },
  {
    slug: "stripes-pocket-top", name: "Stripes Pocket Top", category: "tops-shirts", fabric: "Cotton", colour: "Sea stripe",
    price: 3290, collections: [],
    description: "Sea-green stripe cotton, with contrast blue-stripe sleeves and deep patch pockets set low at the hem.",
    details: ["Contrast stripe sleeves", "Low patch pockets", "High-low hem"],
    fit: "A-line, easy.",
  },
  {
    slug: "flare-shirt", name: "Flare Shirt", category: "tops-shirts", fabric: "Denim", colour: "Steel blue",
    price: 4190, collections: ["denim-reimagined"],
    description: "Steel-blue denim with inverted box pleats that release into a soft flare below the bust.",
    details: ["Inverted box pleats", "Concealed placket", "Long sleeves"],
    fit: "Fitted shoulder, flared body.",
  },
  {
    slug: "tie-shirt", name: "Tie Shirt", category: "tops-shirts", fabric: "Cotton", colour: "Navy / Ajrakh",
    price: 4290, collections: ["ajrakh-stories"],
    description: "Navy cotton framed with hand-block ajrakh panels at the front and cuffs, fastened with slim rouleau ties.",
    details: ["Ajrakh front panels and cuffs", "Rouleau tie fastening", "Long sleeves"],
    fit: "Relaxed.",
  },
  {
    slug: "textured-shirt", name: "Textured Shirt", category: "tops-shirts", fabric: "Cotton with Denim", colour: "Black / Lemon",
    price: 4490, limited: true, collections: ["denim-reimagined"],
    description: "Black cotton with lemon quilted-stitch panels at the chest and cuffs. Bold, graphic and surprisingly versatile.",
    details: ["Lemon stitched panels", "Flap chest pockets", "Long sleeves"],
    fit: "Relaxed, straight hem.",
  },
  {
    slug: "bibb-top", name: "Bibb Top", category: "tops-shirts", fabric: "Crochet", colour: "Lilac",
    price: 3690, collections: ["the-crochet-edit"],
    description: "Lilac floral crochet cut into a sleeveless bib with long side ties. Layer over a slip or a white tee.",
    details: ["Floral crochet lace", "Long side ties", "Curved hem"],
    fit: "Cropped; adjustable.",
  },
  {
    slug: "knit-shirt", name: "Knit Shirt", category: "tops-shirts", fabric: "Knitted", colour: "Black / Ecru",
    price: 4390, collections: [],
    description: "Bold black-and-ecru zig-zag knit with a solid black collar, placket and patch pocket.",
    details: ["Textured knit", "Solid contrast pocket and cuffs", "Long sleeves"],
    fit: "Relaxed.",
  },
  {
    slug: "wrap-top", name: "Wrap Top", category: "tops-shirts", fabric: "Hakoba with Silk", colour: "White / Ajrakh",
    price: 3990, bestseller: 15, collections: ["ajrakh-stories"],
    description: "White hakoba eyelet in a clean wrap shape, tied at the side with a long sash of ajrakh silk.",
    details: ["Hakoba eyelet cotton", "Ajrakh silk tie", "Cap sleeves"],
    fit: "Wrap; adjustable.",
  },
  {
    slug: "wave-collared-top", name: "Wave Collared Top", category: "tops-shirts", fabric: "Cotton Linen", colour: "Teal wave",
    price: 3790, collections: ["linen-days"],
    description: "Teal wave print on cotton linen, with a zip front, utility pockets and an elasticated hem.",
    details: ["Front zip", "Patch pockets", "Elasticated hem"],
    fit: "Cropped and blousy.",
  },
  {
    slug: "striped-pleated-top", name: "Striped Pleated Top", category: "tops-shirts", fabric: "Cotton", colour: "Coral stripe",
    price: 3290, collections: [],
    description: "Coral, ink and ecru stripes, gathered into soft pleats beneath a notched neckline.",
    details: ["Front pleats", "Notched neck", "Sleeveless"],
    fit: "Swingy A-line.",
  },
  {
    slug: "queen-of-hearts-top", name: "Queen of Hearts Top", category: "tops-shirts", fabric: "Denim", colour: "Dark rinse / Red",
    price: 4190, isNew: true, collections: ["little-blooms", "denim-reimagined"],
    description: "A zip-front denim waistcoat with a peplum hem and tumbling hand-embroidered red hearts.",
    details: ["Hand-embroidered hearts", "Front zip", "Peplum hem"],
    fit: "Fitted, waist-defining.",
  },

  // ---------------------------------------------------------------- Jackets
  {
    slug: "ajrakh-wrap", name: "Ajrakh Wrap", category: "jackets", fabric: "Silk", colour: "Madder red",
    price: 5490, limited: true, collections: ["ajrakh-stories"],
    description: "A sleeveless wrap layer in madder-red ajrakh silk with a single block-printed tree motif.",
    details: ["Hand-block ajrakh silk", "Block-printed tree motif", "Tie fastening"],
    fit: "Relaxed open layer.",
  },
  {
    slug: "long-pocket-shirt-jacket", name: "Long Pocket Shirt Jacket", category: "jackets", fabric: "Denim", colour: "Mid indigo",
    price: 4990, collections: ["denim-reimagined"],
    description: "A mid-indigo shirt jacket with long diagonal pockets traced in white top-stitching.",
    details: ["Diagonal seam pockets", "Contrast top-stitching", "Snap buttons"],
    fit: "Boxy, short-sleeved.",
  },
  {
    slug: "flora-jacket", name: "Flora Jacket", category: "jackets", fabric: "Printed Jute", colour: "Blush floral",
    price: 5290, isNew: true, collections: [],
    description: "Rose and blush florals printed on soft jute, with a zip front and gathered cuffs. Wear it over denim.",
    details: ["Printed jute", "Zip front", "Gathered cuffs"],
    fit: "Relaxed and slightly cropped.",
  },
  {
    slug: "aqua-jacket", name: "Aqua Jacket", category: "jackets", fabric: "Cotton with Hakoba", colour: "White / Blue stripe",
    price: 4790, collections: [],
    description: "An open jacket pieced from white hakoba and blue-stripe cotton. Light enough for air-conditioned offices.",
    details: ["Hakoba front panels", "Stripe sleeves and trims", "Open front"],
    fit: "Relaxed.",
  },
  {
    slug: "ajrakh-jacket", name: "Ajrakh Jacket", category: "jackets", fabric: "Silk", colour: "Blush / Madder",
    price: 6490, bestseller: 16, limited: true, collections: ["ajrakh-stories"],
    description: "Our statement bomber: blush ajrakh silk printed with oversized madder medallions, with contrast printed sleeves.",
    details: ["Hand-block ajrakh silk", "Zip front", "Elasticated hem and cuffs"],
    fit: "Relaxed bomber fit.",
    stock: [0, 1, 1, 0, 0],
  },
  {
    slug: "linen-wrap-jacket", name: "Linen Wrap Jacket", category: "jackets", fabric: "Linen", colour: "Teal wave",
    price: 5190, collections: ["linen-days"],
    description: "Teal wave-print linen in a sleeveless wrap jacket, cinched with a long self-tie belt.",
    details: ["Self-tie belt", "Wrap front", "Extended shoulders"],
    fit: "Wrap; adjustable.",
  },

  // ---------------------------------------------------------------- Dresses
  {
    slug: "ajrakh-dress", name: "Ajrakh Dress", category: "dresses", fabric: "Silk", colour: "Black / Olive",
    price: 6890, collections: ["ajrakh-stories"],
    description: "Black and olive ajrakh silk, smocked at the waist and finished with a deep border of block-printed checks.",
    details: ["Smocked waist", "Ajrakh border hem", "Striped collar and cuffs"],
    fit: "Fitted waist, flowing midi skirt.",
  },
  {
    slug: "air-balloon-dress", name: "Air Balloon Dress", category: "dresses", fabric: "Denim", colour: "Two-tone blue",
    price: 4990, isNew: true, bestseller: 9, collections: ["little-blooms", "denim-reimagined"],
    description: "A two-tone denim shirt dress with a trail of hand-printed hot-air balloons drifting up one side.",
    details: ["Hand-printed balloon motifs", "Concealed placket", "Short sleeves"],
    fit: "Straight, above the knee.",
  },
  {
    slug: "isha-dress", name: "Isha Dress", category: "dresses", fabric: "Cotton", colour: "Navy",
    price: 5490, collections: [],
    description: "A navy V-neck midi traced with ecru piping that curves into hidden pockets.",
    details: ["Contrast piping", "In-seam pockets", "Sleeveless"],
    fit: "Relaxed A-line midi.",
  },
  {
    slug: "miro-dress", name: "Miro Dress", category: "dresses", fabric: "Cotton", colour: "Navy",
    price: 5890, bestseller: 17, collections: [],
    description: "A zip-front navy utility dress with welt pockets and ecru top-stitching. Works from studio to supper.",
    details: ["Full-length zip", "Welt pockets", "Contrast top-stitching"],
    fit: "Fitted bodice, A-line midi skirt.",
  },
  {
    slug: "liora-dress", name: "Liora Dress", category: "dresses", fabric: "Chanderi", colour: "Mist / Ink",
    price: 5290, collections: ["chanderi-hours"],
    description: "Misty grey chanderi with fine ink brush-strokes, lace-trimmed sleeves and a shirt collar.",
    details: ["Brushstroke print", "Lace cuffs", "Button-through"],
    fit: "Relaxed, knee length.",
  },
  {
    slug: "textured-dress", name: "Textured Dress", category: "dresses", fabric: "Textured Linen Blend", colour: "Sage",
    price: 5690, collections: ["linen-days"],
    description: "A sleeveless sage shirt dress in textured linen blend, with a dropped waist and full gathered skirt.",
    details: ["Dropped waist", "Wooden buttons", "Gathered skirt"],
    fit: "Relaxed; midi length.",
  },
  {
    slug: "sora-dress", name: "Sora Dress", category: "dresses", fabric: "Silk", colour: "Teal floral",
    price: 6490, bestseller: 7, featured: true, collections: [],
    description: "Teal floral silk in an angrakha-inspired wrap, edged in ivory piping and tied at the waist.",
    details: ["Wrap front with ties", "Contrast piping", "Elbow sleeves"],
    fit: "Wrap; midi length.",
  },
  {
    slug: "elara-dress", name: "Elara Dress", category: "dresses", fabric: "Linen", colour: "Pink tie-dye",
    price: 5990, isNew: true, collections: ["linen-days"],
    description: "Hand tie-dyed linen in rose and coral, with a notched lapel and a self-tie belt.",
    details: ["Hand tie-dye — each piece unique", "Self-tie belt", "Sleeveless"],
    fit: "Relaxed; midi length.",
  },
  {
    slug: "linen-printed-dress", name: "Linen Printed Dress", category: "dresses", fabric: "Linen", colour: "Ivory / Charcoal",
    price: 4890, collections: ["linen-days"],
    description: "Ivory linen with a line-drawn leaf print, a zip front and a softly gathered waist.",
    details: ["Front zip", "Elasticated back waist", "Notched collar"],
    fit: "Fitted waist, above the knee.",
  },
  {
    slug: "floral-dress", name: "Floral Dress", category: "dresses", fabric: "Denim", colour: "Chambray",
    price: 4690, collections: ["little-blooms", "denim-reimagined"],
    description: "Light chambray with an elasticated waist and a cluster of embroidered line-flowers at the hem.",
    details: ["Tonal floral embroidery", "Elasticated waist", "Short sleeves"],
    fit: "Fit-and-flare, above the knee.",
  },
  {
    slug: "turquoise-dress", name: "Turquoise Dress", category: "dresses", fabric: "Silk Blend", colour: "Turquoise",
    price: 4790, collections: [],
    description: "Turquoise silk blend embroidered with white line-flowers, finished with lace frills at the shoulders.",
    details: ["Thread embroidery", "Lace shoulder frills", "Swing silhouette"],
    fit: "A-line mini.",
  },
  {
    slug: "denim-flower-dress", name: "Denim Flower Dress", category: "dresses", fabric: "Denim", colour: "Dark rinse",
    price: 5490, bestseller: 18, collections: ["little-blooms", "denim-reimagined"],
    description: "A dark-rinse shirt dress with oversized lilies embroidered in white across the shoulder and skirt.",
    details: ["White lily embroidery", "Concealed placket", "Short sleeves"],
    fit: "Straight, knee length.",
  },
  {
    slug: "textured-denim-dress", name: "Textured Denim Dress", category: "dresses", fabric: "Denim", colour: "Washed blue",
    price: 4990, collections: ["denim-reimagined"],
    description: "Feather-textured washed denim in a long-sleeved V-neck shift. Easy, unfussy, endlessly wearable.",
    details: ["Textured denim", "V-neck", "Long sleeves"],
    fit: "Straight shift, above the knee.",
  },
  {
    slug: "cherrie-pie-dress", name: "Cherrie Pie Dress", category: "dresses", fabric: "Denim", colour: "Dark rinse / Cherry",
    price: 5290, isNew: true, bestseller: 5, featured: true, collections: ["little-blooms", "denim-reimagined"],
    description: "Our cherries again, now on a half-zip denim midi with a stitched yoke and cap sleeves.",
    details: ["Hand-embroidered cherries", "Gold half-zip", "Stitched yoke"],
    fit: "Straight, below the knee.",
  },
  {
    slug: "bloom-dress", name: "Bloom Dress", category: "dresses", fabric: "Linen", colour: "Rose stripe",
    price: 4690, collections: ["linen-days"],
    description: "Rose-stripe linen with a crochet-lace yoke and a tiered, swingy skirt.",
    details: ["Lace yoke trim", "Tiered skirt", "Sleeveless"],
    fit: "Relaxed; above the knee.",
  },
  {
    slug: "dopamine-dress", name: "Dopamine Dress", category: "dresses", fabric: "Silk", colour: "Ecru / Fuchsia",
    price: 6290, limited: true, collections: [],
    description: "A graphic print of fuchsia blocks, teal and tiny trees on ecru silk. Exactly what it sounds like.",
    details: ["Graphic block print", "Notched collar", "Short sleeves"],
    fit: "Relaxed, midi.",
  },
  {
    slug: "simba-dress", name: "Simba Dress", category: "dresses", fabric: "Cotton", colour: "Madder / Indigo",
    price: 4590, collections: ["ajrakh-stories"],
    description: "Ajrakh-print front panel in madder red set against solid indigo sides. A short, swingy everyday dress.",
    details: ["Ajrakh front panel", "Indigo side panels", "Notched neck"],
    fit: "A-line, above the knee.",
  },
  {
    slug: "soil-dress", name: "Soil Dress", category: "dresses", fabric: "Silk", colour: "Madder / Black",
    price: 6690, collections: ["ajrakh-stories"],
    description: "Earthy madder-and-black ajrakh medallions on silk, cut as a long button-through shirt dress.",
    details: ["Hand-block ajrakh silk", "Button-through", "Turn-up sleeves"],
    fit: "Relaxed, midi.",
  },
  {
    slug: "flora-dress", name: "Flora Dress", category: "dresses", fabric: "Chanderi", colour: "Pistachio",
    price: 5490, isNew: true, collections: ["chanderi-hours"],
    description: "Pistachio chanderi with a delicate floral print, bell sleeves and a tiered skirt.",
    details: ["Floral print", "Bell sleeves", "Tiered hem"],
    fit: "Relaxed, above the knee.",
  },

  // ---------------------------------------------------------------- Co-ord Sets
  {
    slug: "bloom-co-ord", name: "Bloom Co-ord", category: "co-ord-sets", fabric: "Linen", colour: "Rose stripe",
    price: 6890, bestseller: 3, collections: ["linen-days"],
    description: "A sleeveless handkerchief-hem top and wide-leg trousers in rose-stripe linen.",
    details: ["Two pieces: top and trousers", "Handkerchief hem", "Elasticated waist trousers"],
    fit: "Relaxed top; wide-leg trousers.",
  },
  {
    slug: "feather-co-ord-set", name: "Feather Co-ord Set", category: "co-ord-sets", fabric: "Denim", colour: "Cobalt",
    price: 7490, isNew: true, limited: true, collections: ["denim-reimagined"],
    description: "Cobalt denim shirt and cropped wide trousers, embroidered with falling feathers along the placket and hems.",
    details: ["Two pieces: shirt and trousers", "Feather cut-work embroidery", "Pin-tucks at the placket"],
    fit: "Relaxed shirt; cropped wide-leg trousers.",
  },
  {
    slug: "linear-co-ord", name: "Linear Co-ord", category: "co-ord-sets", fabric: "Linen", colour: "Ivory / Olive",
    price: 6990, collections: ["linen-days"],
    description: "Ivory linen with a sketched line print, edged with olive braid on the vest and trousers.",
    details: ["Two pieces: vest and trousers", "Olive braid trims", "Straight-leg trousers"],
    fit: "Relaxed.",
  },
  {
    slug: "linen-co-ord", name: "Linen Co-ord", category: "co-ord-sets", fabric: "Linen", colour: "Sage squiggle",
    price: 6790, collections: ["linen-days"],
    description: "Sage linen printed with ecru squiggles — a side-buttoned V-neck top and easy straight trousers.",
    details: ["Two pieces: top and trousers", "Side fastening", "Elasticated waist"],
    fit: "Relaxed.",
  },
  {
    slug: "green-co-ord", name: "Green Co-ord", category: "co-ord-sets", fabric: "Mul Chanderi", colour: "Pistachio",
    price: 6490, isNew: true, collections: ["chanderi-hours"],
    description: "A pistachio buti-print peplum top with a tie front, worn with striped wide trousers.",
    details: ["Two pieces: top and trousers", "Tie-front peplum", "Striped trousers"],
    fit: "Relaxed.",
  },
];

/* Denim is a category of its own as well as a fabric: every denim piece also lives here. */
export function categoriesFor(p: MockProduct): string[] {
  const cats = [p.category];
  if (p.category !== "denim" && /denim/i.test(p.fabric)) cats.push("denim");
  return cats;
}

export function imagesFor(p: MockProduct): string[] {
  return [img(p.slug), img(`${p.slug}-detail`)];
}

const FABRIC_CARE: [RegExp, string][] = [
  [/silk|satin/i, "Dry clean recommended. If hand washing, use cold water and a mild detergent; do not wring. Dry flat in the shade. Ajrakh and natural dyes may soften with time — that is part of their charm."],
  [/chanderi/i, "Gentle hand wash in cold water or dry clean. Do not wring. Dry in the shade and iron on low heat while slightly damp."],
  [/crochet|net|lace/i, "Hand wash cold, inside out. Do not wring or tumble dry. Dry flat to keep the crochet in shape."],
  [/denim/i, "Wash cold, inside out, with similar colours. Indigo may bleed in the first few washes. Line dry in the shade. Warm iron on the reverse."],
  [/linen|jute/i, "Machine wash cold on a gentle cycle, or hand wash. Line dry in the shade. Iron while slightly damp; linen softens with every wash."],
];

export function careFor(p: MockProduct): string {
  return (
    FABRIC_CARE.find(([re]) => re.test(p.fabric))?.[1] ??
    "Machine wash cold on a gentle cycle with similar colours. Line dry in the shade. Warm iron."
  );
}

/* Stock per XS–XL. Deterministic so pages don't flicker between renders. */
export function stockFor(p: MockProduct, index: number): number[] {
  if (p.stock) return p.stock;
  return [0, 1, 2, 3, 4].map((i) => {
    const v = (index * 7 + i * 3) % 9;
    return v === 0 && i !== 2 ? 0 : v + 1;
  });
}

/* Newest pieces first: new arrivals land in October 2026, the rest spread over the year. */
export function createdAtFor(p: MockProduct, index: number): string {
  const day = p.isNew ? 28 - (index % 25) : 1 + (index % 27);
  const month = p.isNew ? 10 : 1 + (index % 8);
  return new Date(Date.UTC(2026, month - 1, day)).toISOString();
}
