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
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
    'Electronics',
    50,
    'wireless-noise-cancelling-headphones'
  ),
  (
    'Mechanical Gaming Keyboard',
    'Compact TKL layout with tactile blue switches, per-key RGB backlighting, and aircraft-grade aluminum frame. Anti-ghosting for precise keystrokes in every session.',
    3499.00,
    'https://images.unsplash.com/photo-1601445638532-c90e31ece6e6?w=600&q=80',
    'Electronics',
    35,
    'mechanical-gaming-keyboard'
  ),
  (
    'Minimalist Leather Wallet',
    'Slim bifold wallet crafted from full-grain leather. Holds up to 8 cards plus cash. RFID-blocking lining protects your contactless cards from skimming.',
    899.00,
    'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80',
    'Accessories',
    120,
    'minimalist-leather-wallet'
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
    'Portable Bluetooth Speaker',
    'Compact 20W speaker with 360-degree sound, deep bass, and IPX7 waterproofing. Up to 12 hours of playback. Pair two speakers for stereo mode.',
    2199.00,
    'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80',
    'Electronics',
    60,
    'portable-bluetooth-speaker'
  ),
  (
    'Organic Cotton Tote Bag',
    'Durable 100% organic cotton canvas tote with reinforced handles and interior zip pocket. Perfect for grocery runs, beach days, or daily commutes.',
    599.00,
    'https://images.unsplash.com/photo-1597484661973-ee6cd0b6482c?w=600&q=80',
    'Lifestyle',
    300,
    'organic-cotton-tote-bag'
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
    'Ceramic Pour-Over Coffee Set',
    'Handcrafted ceramic dripper and server set for the perfect pour-over ritual. Includes reusable stainless steel filter. Holds 600ml, dishwasher-safe.',
    1799.00,
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80',
    'Kitchen',
    45,
    'ceramic-pour-over-coffee-set'
  );
