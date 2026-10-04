import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLLECTION_DESCRIPTION, HOME_CATEGORIES } from '../lib/homeContent';
import { Product } from '../lib/types';
import { ProductCard } from '../components/ProductCard';

type Props = { products: Product[]; category?: string; onOpenProduct: (product: Product) => void; onAdd: (product: Product) => void; onSelectCategory: (category?: string) => void };

export function CollectionScreen({ products, category, onOpenProduct, onAdd, onSelectCategory }: Props) {
  const selectedCategory = HOME_CATEGORIES.find((item) => item.slug === category);
  const visibleProducts = (category ? products.filter((product) => product.category === category) : products)
    .slice().sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.heading}>
        <Text style={styles.kicker}>THE COMPLETE ARCHIVE</Text>
        <Text style={styles.title}>{selectedCategory?.name || 'The Entire Collection'}</Text>
        <Text style={styles.copy}>{selectedCategory?.description || COLLECTION_DESCRIPTION}</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
        <TouchableOpacity onPress={() => onSelectCategory()} style={[styles.filter, !category && styles.filterActive]}><Text style={[styles.filterText, !category && styles.filterTextActive]}>ALL PIECES ({products.length})</Text></TouchableOpacity>
        {HOME_CATEGORIES.map((item) => <TouchableOpacity key={item.slug} onPress={() => onSelectCategory(item.slug)} style={[styles.filter, category === item.slug && styles.filterActive]}><Text style={[styles.filterText, category === item.slug && styles.filterTextActive]}>{item.name.toUpperCase()}</Text></TouchableOpacity>)}
      </ScrollView>
      <View style={styles.list}>
        {visibleProducts.map((product) => <ProductCard key={product.id} product={product} onOpen={onOpenProduct} onAdd={onAdd} />)}
        {visibleProducts.length === 0 && <Text style={styles.empty}>No pieces are currently listed in this collection.</Text>}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#0C0C0E' }, content: { paddingBottom: 35 },
  heading: { paddingHorizontal: 19, paddingTop: 29, paddingBottom: 19, borderBottomWidth: 1, borderColor: '#FFFFFF14' }, kicker: { color: '#C9A977', fontSize: 9, letterSpacing: 2 }, title: { color: '#FAF8F5', fontFamily: 'serif', fontSize: 30, marginTop: 8 }, copy: { color: '#B8ABA0', fontSize: 11, lineHeight: 18, marginTop: 8 },
  filters: { paddingHorizontal: 17, paddingVertical: 15, gap: 8 }, filter: { borderWidth: 1, borderColor: '#FFFFFF24', paddingHorizontal: 12, height: 33, justifyContent: 'center' }, filterActive: { borderColor: '#C9A97799', backgroundColor: '#C9A9771A' }, filterText: { color: '#B8ABA0', fontSize: 8, letterSpacing: 1 }, filterTextActive: { color: '#E2CCA9' },
  list: { paddingHorizontal: 17, paddingTop: 3 }, empty: { color: '#B8ABA0', paddingVertical: 30, fontSize: 12 },
});
