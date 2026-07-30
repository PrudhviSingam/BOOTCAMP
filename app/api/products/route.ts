import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  slug: string;
}

// Data fetching layer using Supabase
async function fetchProducts(search?: string | null, category?: string | null): Promise<Product[]> {
  let query = supabase.from('products').select('*');

  if (category) {
    // using ilike for case-insensitive category matching
    query = query.ilike('category', category);
  }

  if (search) {
    // using ilike with wildcards for partial name search
    query = query.ilike('name', `%${search}%`);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data as Product[];
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
