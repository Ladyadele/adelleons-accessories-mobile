export type Product = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  description: string;
  images: string[];
  material: string;
  dimensions?: string;
  features: string[];
  careInstructions: string[];
  stockQuantity: number;
  sku: string;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNew: boolean;
};

export type CartLine = {
  id: string;
  rowIds: string[];
  product: Product;
  quantity: number;
  selectedOption: string;
};

export const normalizeOption = (option?: string | null) => option?.trim() || '';
