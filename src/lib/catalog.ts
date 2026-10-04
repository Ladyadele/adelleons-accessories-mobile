import { supabase } from './supabase';
import { Product } from './types';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

type ProductRow = Record<string, any>;

export function mapProduct(row: ProductRow): Product {
  return {
    id: String(row.id),
    slug: String(row.slug),
    name: String(row.name),
    tagline: row.tagline || '',
    category: row.category_slug || '',
    price: Number(row.price),
    compareAtPrice: row.compare_at_price == null ? undefined : Number(row.compare_at_price),
    description: row.description || '',
    images: Array.isArray(row.images) ? row.images : [],
    material: row.material || '',
    dimensions: row.dimensions || undefined,
    features: Array.isArray(row.features) ? row.features : [],
    careInstructions: Array.isArray(row.care_instructions) ? row.care_instructions : [],
    stockQuantity: Number(row.stock_quantity) || 0,
    sku: row.sku || '',
    rating: Number(row.rating) || 0,
    reviewCount: Number(row.review_count) || 0,
    isFeatured: Boolean(row.featured),
    isBestSeller: Boolean(row.is_best_seller),
    isNew: Boolean(row.is_new),
  };
}

export async function loadProducts(): Promise<Product[]> {
  const { data, error } = await supabase.from('products').select('*').eq('active', true).order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map((row) => mapProduct(row as ProductRow));
}

export function productImageUri(path?: string): string | undefined {
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path)) return new URL(path).toString();

  let origin = process.env.EXPO_PUBLIC_SITE_URL || 'https://adelleons.com';
  if (__DEV__ && Platform.OS === 'web' && typeof window !== 'undefined') {
    origin = `http://${window.location.hostname}:3000`;
  } else if (__DEV__ && Platform.OS !== 'web') {
    const developmentHost = Constants.expoConfig?.hostUri?.split(':')[0];
    if (developmentHost) origin = `http://${developmentHost}:3000`;
  }

  return new URL(path.startsWith('/') ? path : `/${path}`, `${origin.replace(/\/$/, '')}/`).toString();
}
