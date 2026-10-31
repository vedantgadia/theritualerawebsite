-- App role enum
do $$ begin create type public.app_role as enum ('admin'); exception when duplicate_object then null; end $$;

-- Categories
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- Products
create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  category_id uuid references public.categories(id) on delete set null,
  price numeric(10,2) not null,
  compare_at_price numeric(10,2),
  images jsonb not null default '[]'::jsonb,
  fabric_notes text not null default '',
  fit_notes text not null default '',
  care_instructions text not null default '',
  shipping_returns text not null default '',
  limited_edition boolean not null default false,
  featured boolean not null default false,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

-- Stock per size
create table public.product_sizes (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  size text not null,
  stock int not null default 0,
  unique (product_id, size)
);

-- Profiles (account data)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text not null default '',
  phone text not null default '',
  created_at timestamptz not null default now()
);

-- Roles
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  unique (user_id, role)
);

-- Saved addresses
create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  label text not null default 'Home',
  full_name text not null,
  phone text not null,
  address_line text not null,
  city text not null,
  state text not null,
  pincode text not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

-- Orders (guest + registered)
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  user_id uuid references public.profiles(id) on delete set null,
  is_guest boolean not null default true,
  email text not null,
  phone text not null,
  full_name text not null,
  address_line text not null,
  city text not null,
  state text not null,
  pincode text not null,
  subtotal numeric(10,2) not null default 0,
  shipping_fee numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  status text not null default 'pending',
  razorpay_order_id text,
  razorpay_payment_id text,
  courier_name text,
  tracking_number text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  image_url text,
  size text not null,
  quantity int not null default 1,
  unit_price numeric(10,2) not null
);

-- Made-to-measure requests
create table public.mtm_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text not null,
  product_id uuid references public.products(id) on delete set null,
  bust text not null default '',
  waist text not null default '',
  hip text not null default '',
  shoulder text not null default '',
  length text not null default '',
  height text not null default '',
  notes text not null default '',
  image_url text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

-- Lookbook
create table public.lookbook_campaigns (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null default '',
  cover_image text not null default '',
  published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.lookbook_images (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.lookbook_campaigns(id) on delete cascade,
  image_url text not null,
  caption text not null default '',
  product_id uuid references public.products(id) on delete set null,
  sort_order int not null default 0
);

-- Pop-ups & events
create table public.popup_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  venue text not null,
  address text not null default '',
  maps_url text not null default '',
  event_date date not null,
  is_upcoming boolean not null default true,
  description text not null default '',
  published boolean not null default true,
  created_at timestamptz not null default now()
);

-- Editable site settings
create table public.site_settings (
  id int primary key default 1 check (id = 1),
  shipping_fee numeric(10,2) not null default 150,
  free_shipping_threshold numeric(10,2) not null default 5000,
  announcement text not null default '',
  updated_at timestamptz not null default now()
);

create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null default '',
  message text not null,
  created_at timestamptz not null default now()
);

-- ============ GRANTS (same migration) ============
grant select on public.categories to anon, authenticated;
grant all on public.categories to service_role;
grant select on public.products to anon, authenticated;
grant all on public.products to service_role;
grant select on public.product_sizes to anon, authenticated;
grant all on public.product_sizes to service_role;
grant select, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
grant all on public.addresses to authenticated;
grant all on public.addresses to service_role;
grant select on public.orders to authenticated;
grant all on public.orders to service_role;
grant select on public.order_items to authenticated;
grant all on public.order_items to service_role;
grant insert on public.mtm_requests to anon, authenticated;
grant all on public.mtm_requests to service_role;
grant insert on public.newsletter_subscribers to anon, authenticated;
grant all on public.newsletter_subscribers to service_role;
grant insert on public.contact_messages to anon, authenticated;
grant all on public.contact_messages to service_role;
grant select on public.lookbook_campaigns to anon, authenticated;
grant all on public.lookbook_campaigns to service_role;
grant select on public.lookbook_images to anon, authenticated;
grant all on public.lookbook_images to service_role;
grant select on public.popup_events to anon, authenticated;
grant all on public.popup_events to service_role;
grant select on public.site_settings to anon, authenticated;
grant all on public.site_settings to service_role;

-- ============ RLS ============
alter table public.categories enable row level security;
create policy "public read categories" on public.categories for select using (auth.uid() is not null or auth.uid() is null);
alter table public.products enable row level security;
create policy "public read published products" on public.products for select using (published = true);
alter table public.product_sizes enable row level security;
create policy "public read sizes of published products" on public.product_sizes for select
  using (exists (select 1 from public.products p where p.id = product_id and p.published));
alter table public.profiles enable row level security;
create policy "read own profile" on public.profiles for select using (id = auth.uid());
create policy "update own profile" on public.profiles for update using (id = auth.uid());
alter table public.user_roles enable row level security;
create policy "read own roles" on public.user_roles for select using (user_id = auth.uid());
alter table public.addresses enable row level security;
create policy "own addresses" on public.addresses for all using (user_id = auth.uid()) with check (user_id = auth.uid());
alter table public.orders enable row level security;
create policy "read own orders" on public.orders for select using (user_id = auth.uid());
alter table public.order_items enable row level security;
create policy "read items of own orders" on public.order_items for select
  using (exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()));
alter table public.mtm_requests enable row level security;
create policy "public can submit mtm" on public.mtm_requests for insert with check (length(email) > 0);
alter table public.newsletter_subscribers enable row level security;
create policy "public can subscribe" on public.newsletter_subscribers for insert with check (length(email) > 0);
alter table public.contact_messages enable row level security;
create policy "public can contact" on public.contact_messages for insert with check (length(email) > 0);
alter table public.lookbook_campaigns enable row level security;
create policy "public read published campaigns" on public.lookbook_campaigns for select using (published = true);
alter table public.lookbook_images enable row level security;
create policy "public read images of published campaigns" on public.lookbook_images for select
  using (exists (select 1 from public.lookbook_campaigns c where c.id = campaign_id and c.published));
alter table public.popup_events enable row level security;
create policy "public read published events" on public.popup_events for select using (published = true);
alter table public.site_settings enable row level security;
create policy "public read settings" on public.site_settings for select using (auth.uid() is not null or auth.uid() is null);

-- ============ FUNCTIONS & TRIGGERS ============
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''))
  on conflict (id) do nothing;
  return new;
end $$;

create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger orders_touch_updated_at before update on public.orders
for each row execute function public.touch_updated_at();

-- ============ SEED ============
insert into public.categories (name, slug, sort_order) values
  ('Denim','denim',1), ('Tops & Shirts','tops-shirts',2), ('Dresses','dresses',3),
  ('Co-ords','co-ords',4), ('Jackets','jackets',5);

insert into public.products (name, slug, description, category_id, price, compare_at_price, images, fabric_notes, fit_notes, care_instructions, limited_edition, featured)
select v.name, v.slug, v.description, c.id, v.price, v.compare_at, '[]'::jsonb, v.fabric, v.fit, v.care, v.limited, v.featured
from (values
  ('Indigo Patchwork Jacket','indigo-patchwork-jacket','A structured jacket cut from reclaimed indigo denim panels, hand-stitched with sashiko-inspired running stitches. Each panel placement is one of one.','jackets',8900,10400::numeric,'Washed 10oz and 12oz denim, hand-loomed cotton panels, kantha-stitched seams.','Relaxed boxy fit, drops slightly at the shoulder. Take your usual size for an oversized look.','Dry clean or gentle hand wash cold, dry in shade. The indigo will soften and settle beautifully with wear.',true,true),
  ('Kantha Wide-Leg Jeans','kantha-denim-wide-leg-jeans','Our signature wide-leg in a mid-wash denim, reworked with vintage kantha fabric insets along the side seams. Designed in-house, cut in small batches.','denim',6500,null::numeric,'Mid-wash 11oz stretch denim, vintage kantha cotton insets, tonal topstitch.','High rise, wide straight leg. True to size; size down for a snugger waist.','Machine wash cold inside out, line dry. Wash less, wear more.',true,true),
  ('Handloom Wrap Top','handloom-wrap-top','A soft wrap silhouette in hand-woven cotton with a raw-edge tie. Quiet, easy, everyday.','tops-shirts',3800,null::numeric,'Handloom khadi cotton, unlined, tie front.','Relaxed drape with a generous overlap. True to size.','Gentle hand wash, cool iron on reverse.',false,false),
  ('Mul Oversized Shirt','mul-oversized-shirt','An everyday shirt with dropped shoulders and a longer back hem, cut from airy mul cotton. The piece you reach for on repeat.','tops-shirts',3400,null::numeric,'Featherlight mul cotton, mother-of-pearl buttons.','Oversized with dropped shoulders. Size down for a classic fit.','Machine wash cold, tumble dry low or line dry.',false,false),
  ('Sashiko Straight Dress','sashiko-straight-dress','A column dress in deep indigo with tonal sashiko embroidery across the yoke. Quietly detailed, endlessly wearable.','dresses',5900,6900::numeric,'Medium-weight handloom cotton with silk-thread sashiko embroidery.','Straight cut, sits just below the knee. True to size.','Dry clean recommended to protect the embroidery; otherwise gentle hand wash cold.',true,true),
  ('Ivory Panelled Co-ord','ivory-panelled-co-ord','A two-piece in soft ivory with contrast indigo panels at the hem. Wear together or apart.','co-ords',7200,null::numeric,'Handloom cotton-silk blend, contrast indigo panel details.','Shirt fits relaxed; trousers sit high on the waist. True to size.','Dry clean preferred; gentle hand wash acceptable.',true,false),
  ('Rust Indigo Cropped Jacket','rust-indigo-cropped-jacket','A cropped jacket in terracotta and indigo in equal measure, finished with a hand-stitched collar.','jackets',7400,null::numeric,'Rust-dyed and indigo cotton twill, sashiko-stitched collar.','Cropped, slightly boxy. True to size.','Dry clean or spot clean only.',true,false),
  ('Ajrakh Denim Skirt','ajrakh-denim-skirt','A-line denim skirt panelled with block-printed ajrakh cotton at the hem. Old craft, new lines.','denim',4600,null::numeric,'Rigid 12oz denim, natural-dye ajrakh cotton panels.','Sits at natural waist, mid-calf length. True to size.','Machine wash cold separately for the first few washes.',false,false)
) as v(name, slug, description, cat, price, compare_at, fabric, fit, care, limited, featured)
join public.categories c on c.slug = v.cat;

insert into public.product_sizes (product_id, size, stock)
select p.id, s.size, s.stock
from public.products p
join (values
  ('indigo-patchwork-jacket','XS',1),('indigo-patchwork-jacket','S',2),('indigo-patchwork-jacket','M',2),('indigo-patchwork-jacket','L',1),('indigo-patchwork-jacket','XL',0),
  ('kantha-denim-wide-leg-jeans','XS',2),('kantha-denim-wide-leg-jeans','S',3),('kantha-denim-wide-leg-jeans','M',3),('kantha-denim-wide-leg-jeans','L',2),('kantha-denim-wide-leg-jeans','XL',1),
  ('handloom-wrap-top','XS',3),('handloom-wrap-top','S',4),('handloom-wrap-top','M',4),('handloom-wrap-top','L',3),('handloom-wrap-top','XL',2),
  ('mul-oversized-shirt','XS',4),('mul-oversized-shirt','S',5),('mul-oversized-shirt','M',4),('mul-oversized-shirt','L',3),('mul-oversized-shirt','XL',2),
  ('sashiko-straight-dress','XS',1),('sashiko-straight-dress','S',2),('sashiko-straight-dress','M',1),('sashiko-straight-dress','L',0),('sashiko-straight-dress','XL',0),
  ('ivory-panelled-co-ord','XS',2),('ivory-panelled-co-ord','S',2),('ivory-panelled-co-ord','M',2),('ivory-panelled-co-ord','L',1),('ivory-panelled-co-ord','XL',1),
  ('rust-indigo-cropped-jacket','XS',0),('rust-indigo-cropped-jacket','S',1),('rust-indigo-cropped-jacket','M',1),('rust-indigo-cropped-jacket','L',0),('rust-indigo-cropped-jacket','XL',0),
  ('ajrakh-denim-skirt','XS',2),('ajrakh-denim-skirt','S',3),('ajrakh-denim-skirt','M',2),('ajrakh-denim-skirt','L',2),('ajrakh-denim-skirt','XL',1)
) as s(slug, size, stock) on s.slug = p.slug;

insert into public.site_settings (id, shipping_fee, free_shipping_threshold, announcement)
values (1, 150, 5000, 'Limited editions, cut and sewn in-house in Mumbai. New pieces drop every few weeks.')
on conflict (id) do nothing;

insert into public.lookbook_campaigns (title, slug, description, cover_image, sort_order) values
  ('The First Thread','the-first-thread','Our debut campaign — everyday silhouettes in indigo, ivory and rust, photographed in a Mumbai courtyard.','',1),
  ('Indigo Diaries','indigo-diaries','A study of blues: denim reimagined through Indian textiles, from dawn to dusk.','',2);

insert into public.lookbook_images (campaign_id, image_url, caption, sort_order)
select c.id, '', i.caption, i.ord
from public.lookbook_campaigns c
join (values
  ('the-first-thread','Morning light in the courtyard',1),
  ('the-first-thread','The wrap top, worn open',2),
  ('the-first-thread','Indigo at rest',3),
  ('indigo-diaries','Deep wash, first wear',1),
  ('indigo-diaries','Kantha insets at the seam',2),
  ('indigo-diaries','Dusk, patchwork jacket',3)
) as i(slug, caption, ord) on i.slug = c.slug;

update public.lookbook_images li set product_id = p.id
from public.products p
where (li.caption = 'The wrap top, worn open' and p.slug = 'handloom-wrap-top')
   or (li.caption = 'Kantha insets at the seam' and p.slug = 'kantha-denim-wide-leg-jeans')
   or (li.caption = 'Dusk, patchwork jacket' and p.slug = 'indigo-patchwork-jacket');

insert into public.popup_events (title, venue, address, event_date, is_upcoming, description) values
  ('The Ritual Era — Monsoon Edit Pop-Up','The Loft, Bandra West','The Loft, 3rd Floor, Waterfield Road, Bandra West, Mumbai 400050', '2026-11-21', true, 'Two days of the Monsoon Edit, try-ons and made-to-measure conversations with the studio team.'),
  ('Slow Fashion Night','Method Kala Ghoda','Method, Churchgate Road, Kala Ghoda, Fort, Mumbai 400001', '2026-08-14', false, 'An evening of craft conversations with fellow slow-design studios.');
