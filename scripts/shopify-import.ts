/*
 * Loads the lookbook catalogue (src/lib/mock-catalog.ts) into Shopify:
 * metafield definitions, 68 products with sizes and stock, and the category +
 * story collections — all published to the Headless channel.
 *
 *   bun scripts/shopify-import.ts --dry-run      # show what would be sent, no network
 *   bun scripts/shopify-import.ts                # create anything missing (safe to re-run)
 *   bun scripts/shopify-import.ts --force        # also overwrite products that already exist
 *     (--force also resets stock and photos to the mock values: never use it once real
 *      products, stock or orders are in Shopify.)
 *   bun scripts/shopify-import.ts --only=amaya-shirt,sora-dress
 *
 * Environment:
 *   SHOPIFY_STORE_DOMAIN                     e.g. ritual-era.myshopify.com
 *   SHOPIFY_CLIENT_ID, SHOPIFY_CLIENT_SECRET Dev Dashboard app installed on the store
 *                                            (scopes: products, inventory, publications,
 *                                            metaobjects, files; read locations)
 *   IMAGE_BASE_URL                           where Shopify downloads the photos from
 *                                            (default: the current live site)
 *   SHOPIFY_API_VERSION                      optional
 */
import { CATEGORIES, COLLECTIONS, MOCK_PRODUCTS } from "../src/lib/mock-catalog";
import { collectionInputs, productSetInput } from "../src/lib/shopify/import-payload";
import {
  COLLECTION_METAFIELDS,
  METAFIELD_NAMESPACE,
  PRODUCT_METAFIELDS,
} from "../src/lib/shopify/schema";

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const FORCE = args.includes("--force");
const ONLY = args
  .find((a) => a.startsWith("--only="))
  ?.slice("--only=".length)
  .split(",")
  .filter(Boolean);

const DOMAIN = (process.env["SHOPIFY_STORE_DOMAIN"] ?? "")
  .trim()
  .replace(/^https?:\/\//, "")
  .replace(/\/+$/, "");
const VERSION = process.env["SHOPIFY_API_VERSION"]?.trim() || "2026-07";
const IMAGE_BASE =
  process.env["IMAGE_BASE_URL"]?.trim() || "https://theritualerawebsite.lovable.app";

// Oldest first, so Shopify's "created" order matches the site's newest-first listings.
const products = [...MOCK_PRODUCTS]
  .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
  .filter((p) => !ONLY || ONLY.includes(p.slug));

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function accessToken(): Promise<string> {
  const id = process.env["SHOPIFY_CLIENT_ID"]?.trim();
  const secret = process.env["SHOPIFY_CLIENT_SECRET"]?.trim();
  if (!DOMAIN || !id || !secret) {
    throw new Error(
      "Set SHOPIFY_STORE_DOMAIN, SHOPIFY_CLIENT_ID and SHOPIFY_CLIENT_SECRET (or use --dry-run).",
    );
  }
  const res = await fetch(`https://${DOMAIN}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: id,
      client_secret: secret,
    }),
  });
  const body = (await res.json().catch(() => ({}))) as {
    access_token?: string;
    error_description?: string;
    error?: string;
  };
  if (!res.ok || !body.access_token) {
    throw new Error(
      `Could not get an Admin API token (${res.status}): ${body.error_description ?? body.error ?? "no token returned"}. Is the app installed on the store?`,
    );
  }
  return body.access_token;
}

let token = "";

async function admin<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(`https://${DOMAIN}/admin/api/${VERSION}/graphql.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": token },
      body: JSON.stringify({ query, variables }),
    });
    const json = (await res.json().catch(() => ({}))) as {
      data?: T;
      errors?: { message: string; extensions?: { code?: string } }[];
    };
    const throttled =
      res.status === 429 || json.errors?.some((e) => e.extensions?.code === "THROTTLED");
    if (throttled && attempt < 6) {
      await sleep(2000 * attempt);
      continue;
    }
    if (!res.ok || json.errors?.length || !json.data) {
      throw new Error(
        `Admin API ${res.status}: ${json.errors?.map((e) => e.message).join("; ") ?? "no data"}`,
      );
    }
    return json.data;
  }
}

type UserError = { field?: string[] | null; message: string; code?: string | null };
const describe = (errors: UserError[]) =>
  errors.map((e) => `${e.field?.join(".") ?? ""} ${e.message}`.trim()).join("; ");

async function ensureMetafieldDefinitions() {
  const groups = [
    { ownerType: "PRODUCT", fields: PRODUCT_METAFIELDS },
    { ownerType: "COLLECTION", fields: COLLECTION_METAFIELDS },
  ];
  for (const { ownerType, fields } of groups) {
    for (const f of fields) {
      const data = await admin<{ metafieldDefinitionCreate: { userErrors: UserError[] } }>(
        `mutation($d: MetafieldDefinitionInput!) { metafieldDefinitionCreate(definition: $d) { createdDefinition { id } userErrors { field message code } } }`,
        {
          d: {
            name: f.name,
            namespace: METAFIELD_NAMESPACE,
            key: f.key,
            type: f.type,
            ownerType,
            access: { storefront: "PUBLIC_READ" },
          },
        },
      );
      const errs = data.metafieldDefinitionCreate.userErrors.filter((e) => e.code !== "TAKEN");
      if (errs.length) throw new Error(`Metafield ${ownerType} ${f.key}: ${describe(errs)}`);
    }
  }
  console.log("✓ Metafield definitions ready (readable by the storefront)");
}

async function firstLocationId(): Promise<string> {
  const data = await admin<{
    locations: { nodes: { id: string; name: string; isActive: boolean }[] };
  }>(`{ locations(first: 10) { nodes { id name isActive } } }`);
  const loc = data.locations.nodes.find((l) => l.isActive) ?? data.locations.nodes[0];
  if (!loc) throw new Error("The store has no location to hold stock (Settings → Locations).");
  console.log(`✓ Stock will be held at "${loc.name}"`);
  return loc.id;
}

async function publicationIds(): Promise<string[]> {
  const data = await admin<{ publications: { nodes: { id: string; name: string }[] } }>(
    `{ publications(first: 30) { nodes { id name } } }`,
  );
  const pubs = data.publications.nodes;
  if (!pubs.some((p) => /headless/i.test(p.name))) {
    console.warn(
      "! No Headless publication found — install the Headless channel, or products won't show on the site.",
    );
  }
  console.log(`✓ Publishing to: ${pubs.map((p) => p.name).join(", ")}`);
  return pubs.map((p) => p.id);
}

async function publish(id: string, pubs: string[]) {
  const data = await admin<{ publishablePublish: { userErrors: UserError[] } }>(
    `mutation($id: ID!, $input: [PublicationInput!]!) { publishablePublish(id: $id, input: $input) { userErrors { field message } } }`,
    { id, input: pubs.map((publicationId) => ({ publicationId })) },
  );
  if (data.publishablePublish.userErrors.length)
    console.warn(`  ! publish ${id}: ${describe(data.publishablePublish.userErrors)}`);
}

async function findId(kind: "products" | "collections", handle: string): Promise<string | null> {
  const data = await admin<Record<string, { nodes: { id: string; handle: string }[] }>>(
    `query($q: String!) { ${kind}(first: 5, query: $q) { nodes { id handle } } }`,
    { q: `handle:${handle}` },
  );
  return data[kind]?.nodes.find((n) => n.handle === handle)?.id ?? null;
}

async function importProducts(locationId: string, pubs: string[]) {
  let created = 0;
  let updated = 0;
  let skipped = 0;
  const failed: string[] = [];
  for (const p of products) {
    try {
      const existing = await findId("products", p.slug);
      if (existing && !FORCE) {
        skipped++;
        continue;
      }
      const input = productSetInput(p, { imageBase: IMAGE_BASE, locationId });
      const data = await admin<{
        productSet: { product: { id: string } | null; userErrors: UserError[] };
      }>(
        `mutation($input: ProductSetInput!, $identifier: ProductSetIdentifiers) {
          productSet(synchronous: true, input: $input, identifier: $identifier) { product { id } userErrors { field message code } }
        }`,
        { input, identifier: existing ? { id: existing } : null },
      );
      const { product, userErrors } = data.productSet;
      if (!product || userErrors.length)
        throw new Error(describe(userErrors) || "no product returned");
      await publish(product.id, pubs);
      if (existing) updated++;
      else created++;
      console.log(`  ${existing ? "↻" : "+"} ${p.name}`);
    } catch (err) {
      failed.push(p.slug);
      console.error(`  ✗ ${p.name}: ${(err as Error).message}`);
    }
  }
  console.log(
    `✓ Products: ${created} created, ${updated} updated, ${skipped} already there${failed.length ? `, ${failed.length} failed (${failed.join(", ")})` : ""}`,
  );
  return failed.length;
}

async function importCollections(pubs: string[]) {
  let failed = 0;
  for (const input of collectionInputs(CATEGORIES, COLLECTIONS, IMAGE_BASE)) {
    try {
      if (await findId("collections", input.handle)) {
        console.log(`  = ${input.title} (already there)`);
        continue;
      }
      const data = await admin<{
        collectionCreate: { collection: { id: string } | null; userErrors: UserError[] };
      }>(
        `mutation($input: CollectionInput!) { collectionCreate(input: $input) { collection { id } userErrors { field message } } }`,
        { input },
      );
      const { collection, userErrors } = data.collectionCreate;
      if (!collection || userErrors.length)
        throw new Error(describe(userErrors) || "no collection returned");
      await publish(collection.id, pubs);
      console.log(`  + ${input.title}`);
    } catch (err) {
      failed++;
      console.error(`  ✗ ${input.title}: ${(err as Error).message}`);
    }
  }
  return failed;
}

async function main() {
  if (DRY_RUN) {
    const sample = products[0];
    console.log(
      `Dry run — would load ${products.length} products and ${CATEGORIES.length + COLLECTIONS.length} collections.`,
    );
    console.log(`Photos would be downloaded by Shopify from ${IMAGE_BASE}`);
    if (sample)
      console.log(
        "First product input:\n" +
          JSON.stringify(
            productSetInput(sample, {
              imageBase: IMAGE_BASE,
              locationId: "gid://shopify/Location/0",
            }),
            null,
            2,
          ),
      );
    return;
  }
  token = await accessToken();
  console.log(`Connected to ${DOMAIN} (Admin API ${VERSION})`);
  await ensureMetafieldDefinitions();
  const locationId = await firstLocationId();
  const pubs = await publicationIds();
  const productFailures = await importProducts(locationId, pubs);
  console.log("Collections:");
  const collectionFailures = await importCollections(pubs);
  if (productFailures || collectionFailures) process.exitCode = 1;
  console.log("Done. Photos finish processing in Shopify a minute or two after upload.");
}

main().catch((err) => {
  console.error(`✗ ${(err as Error).message}`);
  process.exit(1);
});
