import { supabase } from './supabase';
import { CartLine, normalizeOption, Product } from './types';
import { mapProduct } from './catalog';

const MAX_QUANTITY = 99;
type CartRow = { id: string; user_id: string; product_id: string; quantity: number; selected_size: string | null };

export async function loadCart(userId: string): Promise<CartLine[]> {
  const { data: rows, error } = await supabase.from('cart_items')
    .select('id, user_id, product_id, quantity, selected_size').eq('user_id', userId).order('created_at');
  if (error) throw error;
  const cartRows = (rows || []) as CartRow[];
  if (!cartRows.length) return [];
  const productIds = Array.from(new Set(cartRows.map((row) => row.product_id)));
  const { data: products, error: productsError } = await supabase.from('products').select('*')
    .in('id', productIds).eq('active', true);
  if (productsError) throw productsError;
  const productById = new Map((products || []).map((row) => {
    const product = mapProduct(row as Record<string, any>);
    return [product.id, product] as const;
  }));

  const lineMap = new Map<string, CartLine>();
  for (const row of cartRows) {
    const product = productById.get(row.product_id);
    if (!product || product.stockQuantity < 1) continue;
    const option = normalizeOption(row.selected_size);
    const key = `${product.id}::${option}`;
    const current = lineMap.get(key);
    if (current) {
      current.quantity = Math.min(product.stockQuantity, MAX_QUANTITY, current.quantity + row.quantity);
      current.rowIds.push(row.id);
    } else {
      lineMap.set(key, {
        id: row.id,
        rowIds: [row.id],
        product,
        quantity: Math.min(product.stockQuantity, MAX_QUANTITY, row.quantity),
        selectedOption: option,
      });
    }
  }
  return Array.from(lineMap.values());
}

export async function addCartItem(userId: string, product: Product, selectedOption: string) {
  const { data: productRow, error: productError } = await supabase.from('products').select('id, stock_quantity, active')
    .eq('slug', product.slug).eq('active', true).maybeSingle();
  if (productError) throw productError;
  if (!productRow) throw new Error('This product is not available in the shared catalog.');
  const productId = productRow.id;
  const option = normalizeOption(selectedOption);
  const { data: rows, error: rowsError } = await supabase.from('cart_items').select('id, quantity, selected_size')
    .eq('user_id', userId).eq('product_id', productId);
  if (rowsError) throw rowsError;
  const matchingRows = (rows || []).filter((row) => normalizeOption(row.selected_size) === option);
  const currentQuantity = matchingRows.reduce((sum, row) => sum + row.quantity, 0);
  const quantity = Math.min(Number(productRow.stock_quantity), MAX_QUANTITY, currentQuantity + 1);
  if (quantity < 1) throw new Error('This product is currently out of stock.');

  if (matchingRows.length) {
    const [keeper, ...duplicates] = matchingRows;
    if (duplicates.length) {
      const { error: deleteError } = await supabase.from('cart_items').delete()
        .in('id', duplicates.map((row) => row.id)).eq('user_id', userId);
      if (deleteError) throw deleteError;
    }
    const { error: updateError } = await supabase.from('cart_items').update({ quantity, selected_size: option })
      .eq('id', keeper.id).eq('user_id', userId);
    if (updateError) throw updateError;
  } else {
    const { error: insertError } = await supabase.from('cart_items').insert({
      user_id: userId, product_id: productId, quantity: 1, selected_size: option,
    });
    if (insertError) throw insertError;
  }
}

export async function updateCartItem(userId: string, line: CartLine, quantity: number) {
  const nextQuantity = Math.min(line.product.stockQuantity, MAX_QUANTITY, Math.floor(quantity));
  if (nextQuantity < 1) return removeCartItem(userId, line);
  const [keeper, ...duplicates] = line.rowIds;
  const { error } = await supabase.from('cart_items').update({ quantity: nextQuantity })
    .eq('id', keeper).eq('user_id', userId);
  if (error) throw error;
  if (duplicates.length) {
    const { error: deleteError } = await supabase.from('cart_items').delete().in('id', duplicates).eq('user_id', userId);
    if (deleteError) throw deleteError;
  }
}

export async function removeCartItem(userId: string, line: CartLine) {
  const { error } = await supabase.from('cart_items').delete().in('id', line.rowIds).eq('user_id', userId);
  if (error) throw error;
}
