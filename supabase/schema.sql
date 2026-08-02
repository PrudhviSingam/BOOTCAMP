-- =============================================================
-- NexCart / CodeToCommerce — Supabase Schema + RLS + Seed Data
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- =============================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- =============================================================
-- TABLE: products
-- Publicly readable (no auth required)
-- =============================================================
create table if not exists products (
  id           uuid primary key default gen_random_uuid(),
  name         text         not null,
  description  text         not null,
  price        numeric(10,2) not null,
  image_url    text,
  category     text,
  stock        int          not null default 0,
  slug         text         unique not null,
  created_at   timestamptz  default now()
);

alter table products enable row level security;

-- Products are publicly readable
create policy "Public can read products"
  on products for select using (true);

-- =============================================================
-- TABLE: cart_items
-- Only the owning user can read/write their own rows
-- =============================================================
create table if not exists cart_items (
  id          uuid primary key default gen_random_uuid(),
  user_id     text         not null,
  product_id  uuid         not null references products(id) on delete cascade,
  quantity    int          not null default 1,
  created_at  timestamptz  default now()
);

alter table cart_items enable row level security;

create policy "Users can read own cart"
  on cart_items for select using (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

create policy "Users can insert own cart"
  on cart_items for insert with check (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

create policy "Users can update own cart"
  on cart_items for update using (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

create policy "Users can delete own cart"
  on cart_items for delete using (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- =============================================================
-- TABLE: orders
-- Only the owning user can read/write their own rows
-- =============================================================
create table if not exists orders (
  id                   uuid primary key default gen_random_uuid(),
  user_id              text         not null,
  status               text         not null default 'pending',
  total_amount         numeric(10,2) not null,
  shipping_name        text,
  shipping_address     text,
  shipping_city        text,
  shipping_postal_code text,
  shipping_phone       text,
  razorpay_order_id    text,
  razorpay_payment_id  text,
  created_at           timestamptz  default now()
);

alter table orders enable row level security;

create policy "Users can read own orders"
  on orders for select using (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

create policy "Users can insert own orders"
  on orders for insert with check (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

create policy "Users can update own orders"
  on orders for update using (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- =============================================================
-- TABLE: order_items
-- Accessible via the orders RLS (read through join in practice)
-- =============================================================
create table if not exists order_items (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid not null references orders(id) on delete cascade,
  product_id  uuid not null references products(id),
  quantity    int  not null,
  price       numeric(10,2) not null
);

alter table order_items enable row level security;

create policy "Users can read own order_items"
  on order_items for select
  using (
    exists (
      select 1 from orders o
      where o.id = order_items.order_id
        and o.user_id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

create policy "Users can insert own order_items"
  on order_items for insert
  with check (
    exists (
      select 1 from orders o
      where o.id = order_items.order_id
        and o.user_id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

-- =============================================================
-- SEED DATA: 8 realistic sample products
-- =============================================================
insert into products (name, description, price, image_url, category, stock, slug) values
  (
    'Wireless Noise-Cancelling Headphones',
    'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and studio-quality sound. Foldable design with plush ear cushions for all-day comfort.',
    4999.00,
    'https://m.media-amazon.com/images/I/31nvao7P-9L._SL500_.jpg',
    'Electronics',
    50,
    'wireless-noise-cancelling-headphones'
  ),
  (
    'Mechanical Gaming Keyboard',
    'Compact TKL layout with tactile blue switches, per-key RGB backlighting, and aircraft-grade aluminum frame. Anti-ghosting for precise keystrokes in every session.',
    3499.00,
    '/images/mechanical-keyboard.png',
    'Electronics',
    35,
    'mechanical-gaming-keyboard'
  ),
  (
    'Premium Wireless Mouse',
    'Ergonomic wireless gaming mouse with adjustable DPI, RGB lighting, and 50-hour battery life. Ultra-low latency connection for competitive gaming.',
    2999.00,
    'https://img.evetech.co.za/repository/ez/how-much-should-you-spend-on-a-wireless-gaming-mou-banner.webp',
    'Electronics',
    120,
    'premium-wireless-mouse'
  ),
  (
    'Stainless Steel Water Bottle',
    'Triple-insulated 750ml bottle keeps drinks cold for 24 hours or hot for 12 hours. BPA-free, leak-proof lid, and scratch-resistant powder coat finish.',
    1299.00,
    'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80',
    'Lifestyle',
    200,
    'stainless-steel-water-bottle'
  ),
  (
    'Marshall Portable Speaker',
    'Compact 20W speaker with 360-degree sound, deep bass, and IPX7 waterproofing. Up to 12 hours of playback. Pair two speakers for stereo mode.',
    21999.00,
    'https://images.ctfassets.net/javen7msabdh/7N04j6wBgof5Uw2e03iCc3/2f9dd0a80c40cbcd88303676eae0993b/01-middleton-front_side-desktop.jpeg',
    'Electronics',
    60,
    'marshall-portable-speaker'
  ),
  (
    'Premium Swing Study Lamp',
    'Adjustable metal swing arm desk lamp with heavy base and c-clamp. Features multiple brightness levels and eye-care LED technology for focused reading and studying.',
    1599.00,
    'https://m.media-amazon.com/images/I/71ey0OvpzcL._SL1500_.jpg',
    'Home',
    300,
    'premium-swing-study-lamp'
  ),
  (
    'Smart Fitness Tracker',
    'Slim wrist band with heart rate monitor, SpO2 sensor, sleep tracking, and 7-day battery. Compatible with iOS and Android. Water-resistant to 50m.',
    3999.00,
    'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600&q=80',
    'Electronics',
    80,
    'smart-fitness-tracker'
  ),
  (
    'HP Mini Printer',
    'Portable, lightweight mini printer perfect for travel or small workspaces. Features fast printing speeds, wireless connectivity, and high-quality photo prints on the go.',
    12999.00,
    'https://i.rtings.com/assets/products/OrmPKs2a/hp-officejet-250/design-medium.jpg',
    'Electronics',
    45,
    'hp-mini-printer'
  );
