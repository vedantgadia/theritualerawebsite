/* Styling stories for the Style Notes page. Copy is written in the brand voice; edit freely. */

export interface StyleNote {
  slug: string;
  title: string;
  kicker: string;
  intro: string;
  image: string;
  detail: string;
  tips: { title: string; body: string }[];
  products: string[];
}

const img = (slug: string) => `/media/products/${slug}.webp`;

export const STYLE_NOTES: StyleNote[] = [
  {
    slug: "one-shirt-three-moods",
    title: "One denim shirt, three moods",
    kicker: "Desk · Weekend · Evening",
    intro: "A good denim shirt is the hardest-working piece in a wardrobe. Here's how we take the Striped Denim Shirt from a 9am meeting to a late dinner.",
    image: img("striped-denim-shirt"),
    detail: img("striped-denim-shirt-detail"),
    tips: [
      { title: "For the desk", body: "Tuck it fully into ivory linen trousers, button the cuffs and add loafers. Crisp, but never stiff." },
      { title: "For the weekend", body: "Push the sleeves up, half-tuck into wide-leg jeans and let the pinstripe panel do the talking." },
      { title: "For the evening", body: "Wear it open over a slip dress or black trousers, with gold hoops and a heeled mule." },
    ],
    products: ["striped-denim-shirt", "dune-shirt", "scout-shirt", "flare-shirt"],
  },
  {
    slug: "crochet-every-day",
    title: "Crochet, worn every day",
    kicker: "Texture without the fuss",
    intro: "Crochet isn't just for holidays. Set against crisp cotton, it becomes the detail that quietly lifts an everyday look.",
    image: img("amaya-shirt"),
    detail: img("amaya-shirt-detail"),
    tips: [
      { title: "Let it be the only texture", body: "Keep everything else smooth — plain trousers, simple shoes — so the crochet stays the focus." },
      { title: "Frame it with something dark", body: "Chocolate or dark-rinse bottoms make ivory and caramel crochet glow." },
      { title: "Layer the bibs", body: "Our bib tops sit beautifully over a white tee or a fine slip. Tie them loose for ease, snug for shape." },
    ],
    products: ["amaya-shirt", "mocha-shirt", "sienna-top", "bibb-top"],
  },
  {
    slug: "denim-on-denim",
    title: "Denim on denim, done softly",
    kicker: "The double-denim rule book",
    intro: "Double denim works when it feels considered. Play with washes, add warmth at the edges, and keep the silhouette easy.",
    image: "/media/products/editorial-3.webp",
    detail: img("feather-co-ord-set-detail"),
    tips: [
      { title: "Mix your washes", body: "Mid-indigo with dark rinse reads intentional; identical blues read like a uniform." },
      { title: "Break it up near the face", body: "An ecru tee, a pale scarf or pearl studs keep head-to-toe indigo from feeling heavy." },
      { title: "Warm the edges", body: "Tan sandals and a woven or leather bag bring the whole look back to earth." },
    ],
    products: ["feather-co-ord-set", "air-balloon-dress", "long-pocket-shirt-jacket", "cherie-pie-top"],
  },
  {
    slug: "co-ords-apart",
    title: "Co-ords, worn apart",
    kicker: "Two pieces, many looks",
    intro: "A co-ord is really two wardrobe staples that happen to match. Wear them together when you want ease — and apart when you want range.",
    image: img("bloom-co-ord"),
    detail: img("bloom-co-ord-detail"),
    tips: [
      { title: "The top, alone", body: "With white jeans or a denim skirt, a printed co-ord top becomes a weekend statement." },
      { title: "The trousers, alone", body: "Anchor them with a crisp white shirt or a fitted black tank for the office." },
      { title: "Together, two ways", body: "Flat sandals and a tote for day; swap to mules and a small bag after dark." },
    ],
    products: ["bloom-co-ord", "linear-co-ord", "linen-co-ord", "green-co-ord"],
  },
  {
    slug: "ajrakh-for-the-city",
    title: "Ajrakh for the city",
    kicker: "Heritage print, modern frame",
    intro: "Hand-block ajrakh carries centuries of craft. We like it best with clean lines and calm colours that let the print breathe.",
    image: img("ajrakh-jacket"),
    detail: img("ajrakh-jacket-detail"),
    tips: [
      { title: "One print per look", body: "Let the ajrakh piece lead and keep everything else solid — ivory, indigo or black." },
      { title: "Throw it over basics", body: "The Ajrakh Jacket over a white tee and straight trousers is our most-repeated outfit." },
      { title: "Choose leather and metal", body: "A structured leather bag and simple gold jewellery feel right next to the madder reds." },
    ],
    products: ["ajrakh-jacket", "soil-dress", "tie-shirt", "ajrakh-denim-shirt"],
  },
  {
    slug: "linen-in-the-heat",
    title: "Linen in the heat",
    kicker: "Dressing for Indian summers",
    intro: "Linen is made for our weather. Size for air, embrace a soft crease and keep accessories light.",
    image: img("elara-dress"),
    detail: img("elara-dress-detail"),
    tips: [
      { title: "Size for ease", body: "A little room lets linen move and breathe — that relaxed drape is the point." },
      { title: "Love the creases", body: "A lived-in crumple is part of linen's charm. Steam lightly; never press it flat." },
      { title: "Keep it light", body: "Woven bags, flat sandals and one pair of earrings. Let the fabric feel effortless." },
    ],
    products: ["elara-dress", "bloom-dress", "linen-printed-dress", "wave-collared-top"],
  },
];

export const CARE_NOTES: { fabric: string; body: string }[] = [
  { fabric: "Denim", body: "Wash less, cold and inside out. Indigo may bleed in the first washes — wash with darks, dry in the shade." },
  { fabric: "Silk & ajrakh", body: "Dry clean, or a gentle cold hand wash. Natural dyes soften with time; that patina is part of the piece." },
  { fabric: "Crochet & lace", body: "Hand wash cold and dry flat. Never wring or hang wet crochet — it loses its shape." },
  { fabric: "Linen", body: "Gentle machine wash, line dry, iron while slightly damp. Linen gets softer with every wear." },
  { fabric: "Chanderi", body: "Hand wash cold or dry clean. Iron on low heat, and store folded in a cotton bag." },
];
