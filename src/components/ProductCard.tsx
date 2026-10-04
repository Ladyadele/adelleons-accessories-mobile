import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { productImageUri } from '../lib/catalog';
import { Product } from '../lib/types';

const colors = { card: '#0D0D0F', image: '#070708', line: 'rgba(255,255,255,0.07)', gold: '#C9A977', ivory: '#F4EFEA', muted: '#B8ABA0' };

type Props = { product: Product; onOpen: (product: Product) => void; onAdd: (product: Product) => void };

export function ProductCard({ product, onOpen, onAdd }: Props) {
  const imageUri = productImageUri(product.images[0]);
  return (
    <View style={styles.card}>
      <TouchableOpacity activeOpacity={0.9} onPress={() => onOpen(product)} accessibilityLabel={`View ${product.name} details`}>
        <View style={styles.imageWrap}>
          {imageUri ? <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" /> : <View style={styles.imageFallback}><Text style={styles.fallbackMark}>A</Text></View>}
          <View style={styles.badges}>
            {product.isBestSeller && <Text style={styles.bestSeller}>BEST SELLER</Text>}
            {product.isNew && !product.isBestSeller && <Text style={styles.newRelease}>✦  NEW RELEASE</Text>}
          </View>
        </View>
      </TouchableOpacity>
      <View style={styles.details}>
        <View style={styles.metaRow}>
          <Text style={styles.category}>{product.category.toUpperCase()}</Text>
          <Text style={styles.rating}>★  {product.rating.toFixed(1)}</Text>
        </View>
        <TouchableOpacity onPress={() => onOpen(product)}>
          <Text numberOfLines={1} style={styles.name}>{product.name}</Text>
          <Text numberOfLines={1} style={styles.tagline}>{product.tagline}</Text>
        </TouchableOpacity>
        <View style={styles.footer}>
          <View style={styles.priceRow}>
            <Text style={styles.price}>₦{product.price.toLocaleString('en-NG')}</Text>
            {!!product.compareAtPrice && <Text style={styles.comparePrice}>₦{product.compareAtPrice.toLocaleString('en-NG')}</Text>}
          </View>
          <TouchableOpacity onPress={() => onAdd(product)} disabled={product.stockQuantity < 1} style={[styles.addButton, product.stockQuantity < 1 && styles.disabled]}>
            <Text style={styles.addText}>{product.stockQuantity > 0 ? 'ADD TO CART  +' : 'SOLD OUT'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, marginBottom: 17 },
  imageWrap: { width: '100%', aspectRatio: 4 / 5, overflow: 'hidden', backgroundColor: colors.image },
  image: { width: '100%', height: '100%' },
  imageFallback: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  fallbackMark: { color: '#6D6247', fontFamily: 'serif', fontSize: 68 },
  badges: { position: 'absolute', left: 12, top: 12, gap: 7 },
  bestSeller: { color: '#E2CCA9', backgroundColor: '#070708E8', borderWidth: 1, borderColor: '#C9A97766', paddingVertical: 6, paddingHorizontal: 9, fontSize: 8, letterSpacing: 1.6, fontWeight: '600' },
  newRelease: { color: colors.ivory, backgroundColor: '#070708E8', borderWidth: 1, borderColor: '#FFFFFF33', paddingVertical: 6, paddingHorizontal: 9, fontSize: 8, letterSpacing: 1.4 },
  details: { padding: 15 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  category: { color: colors.gold, fontSize: 9, letterSpacing: 1.8 },
  rating: { color: '#B8ABA0', fontSize: 10 },
  name: { color: colors.ivory, fontSize: 15, fontWeight: '500' },
  tagline: { color: '#B8ABA0CC', fontSize: 11, marginTop: 5, fontWeight: '300' },
  footer: { paddingTop: 13, marginTop: 12, borderTopWidth: 1, borderTopColor: colors.line, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  price: { color: colors.gold, fontSize: 15, fontWeight: '600' },
  comparePrice: { color: '#8B8278', fontSize: 11, textDecorationLine: 'line-through' },
  addButton: { borderWidth: 1, borderColor: '#C9A97755', backgroundColor: '#1B1B20', paddingHorizontal: 12, minHeight: 39, alignItems: 'center', justifyContent: 'center' },
  addText: { color: '#E2CCA9', fontSize: 8, letterSpacing: 1.1, fontWeight: '600' },
  disabled: { opacity: 0.45 },
});
