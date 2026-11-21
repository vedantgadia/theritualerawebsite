-- Applied to Supabase project ptucruamzupfitpxocxa (the-ritual-era, ap-south-1) on 21 Nov 2026.
-- Content and forms for The Ritual Era site. Products, orders and customers live in Shopify;
-- product links here are Shopify product handles (the site's product slugs).
-- Replaces the Lovable Cloud schema in drizzle/migrations/0000_ritual_era_schema_seed.sql.

create table public.lookbook_campaigns (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null default '',
  cover_image text not null default '',
  published boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.lookbook_images (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.lookbook_campaigns(id) on delete cascade,
  image_url text not null,
  caption text not null default '',
  product_slug text,
  sort_order int not null default 0
);
create index lookbook_images_campaign_idx on public.lookbook_images (campaign_id, sort_order);

create table public.popup_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  venue text not null,
  address text not null default '',
  maps_url text not null default '',
  event_date date not null,
  is_upcoming boolean not null default true,
  description text not null default '',
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null check (length(email) between 3 and 320 and position('@' in email) > 1),
  created_at timestamptz not null default now()
);
create unique index newsletter_subscribers_email_key on public.newsletter_subscribers (lower(email));

create table public.mtm_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(name) between 1 and 200),
  phone text not null check (length(phone) between 5 and 30),
  email text not null check (length(email) between 3 and 320),
  product_slug text,
  bust text not null default '',
  waist text not null default '',
  hip text not null default '',
  shoulder text not null default '',
  length text not null default '',
  height text not null default '',
  notes text not null default '' check (length(notes) <= 5000),
  image_url text,
  status text not null default 'new' check (status in ('new','contacted','confirmed','closed')),
  created_at timestamptz not null default now()
);

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(name) between 1 and 200),
  email text not null check (length(email) between 3 and 320),
  phone text not null default '' check (length(phone) <= 30),
  message text not null check (length(message) between 1 and 5000),
  created_at timestamptz not null default now()
);

-- Row level security: visitors can read published content and submit forms, nothing else.
alter table public.lookbook_campaigns enable row level security;
alter table public.lookbook_images enable row level security;
alter table public.popup_events enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.mtm_requests enable row level security;
alter table public.contact_messages enable row level security;

create policy "read published campaigns" on public.lookbook_campaigns
  for select to anon, authenticated using (published);
create policy "read images of published campaigns" on public.lookbook_images
  for select to anon, authenticated
  using (exists (select 1 from public.lookbook_campaigns c where c.id = campaign_id and c.published));
create policy "read published events" on public.popup_events
  for select to anon, authenticated using (published);
create policy "subscribe" on public.newsletter_subscribers
  for insert to anon, authenticated with check (true);
create policy "submit made-to-measure request" on public.mtm_requests
  for insert to anon, authenticated with check (status = 'new');
create policy "send contact message" on public.contact_messages
  for insert to anon, authenticated with check (true);

-- Table privileges match the policies (the service role keeps full access for the admin).
revoke all on public.lookbook_campaigns, public.lookbook_images, public.popup_events,
  public.newsletter_subscribers, public.mtm_requests, public.contact_messages from anon, authenticated;
grant select on public.lookbook_campaigns, public.lookbook_images, public.popup_events to anon, authenticated;
grant insert on public.newsletter_subscribers, public.mtm_requests, public.contact_messages to anon, authenticated;
grant all on public.lookbook_campaigns, public.lookbook_images, public.popup_events,
  public.newsletter_subscribers, public.mtm_requests, public.contact_messages to service_role;
