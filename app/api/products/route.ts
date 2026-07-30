import { NextResponse } from 'next/server';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  slug: string;
}

const placeholderProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Noise-Cancelling Headphones',
    description: 'Experience premium sound quality with active noise cancellation and 30-hour battery life.',
    price: 299.99,
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    category: 'Electronics',
    slug: 'wireless-noise-cancelling-headphones'
  },
  {
    id: '2',
    name: 'Minimalist Leather Wallet',
    description: 'Slim, durable genuine leather wallet with RFID protection and space for 6 cards.',
    price: 45.00,
    image_url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80',
    category: 'Accessories',
    slug: 'minimalist-leather-wallet'
  },
  {
    id: '3',
    name: 'Smart Fitness Watch',
    description: 'Track your health metrics, heart rate, and workouts with this water-resistant smartwatch.',
    price: 199.50,
    image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    category: 'Electronics',
    slug: 'smart-fitness-watch'
  },
  {
    id: '4',
    name: 'Ceramic Coffee Dripper',
    description: 'Pour-over coffee maker crafted from high-quality ceramic for the perfect brew every time.',
    price: 35.00,
    image_url: 'https://images.unsplash.com/photo-1544243615-5e6a9dc572cc?w=800&q=80',
    category: 'Home & Kitchen',
    slug: 'ceramic-coffee-dripper'
  },
  {
    id: '5',
    name: 'Ergonomic Office Chair',
    description: 'Fully adjustable mesh office chair with lumbar support designed for long working hours.',
    price: 349.00,
    image_url: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=800&q=80',
    category: 'Furniture',
    slug: 'ergonomic-office-chair'
  },
  {
    id: '6',
    name: 'Organic Cotton T-Shirt',
    description: 'Ultra-soft, breathable, and sustainably sourced organic cotton everyday tee.',
    price: 28.00,
    image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
    category: 'Apparel',
    slug: 'organic-cotton-t-shirt'
  },
  {
    id: '7',
    name: 'Stainless Steel Water Bottle',
    description: 'Double-wall vacuum insulated water bottle keeps drinks cold for 24 hours or hot for 12 hours.',
    price: 32.00,
    image_url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80',
    category: 'Sports & Outdoors',
    slug: 'stainless-steel-water-bottle'
  },
  {
    id: '8',
    name: 'Mechanical Keyboard',
    description: 'Tenkeyless mechanical keyboard with tactile switches and customizable RGB backlighting.',
    price: 129.99,
    image_url: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80',
    category: 'Electronics',
    slug: 'mechanical-keyboard'
  }
];

// Data fetching layer, abstracted to easily swap to Supabase later.
async function fetchProducts(search?: string | null, category?: string | null): Promise<Product[]> {
  let filtered = [...placeholderProducts];

  if (category) {
    filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(p => p.name.toLowerCase().includes(searchLower));
  }

  return filtered;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');

    const products = await fetchProducts(search, category);

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
