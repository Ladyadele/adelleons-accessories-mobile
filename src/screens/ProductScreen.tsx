import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { productImageUri } from '../lib/catalog';
import { Product } from '../lib/types';

type Props = { product: Product; onBack: () => void; onAdd: (product: Product, option?: string) => void };
export function ProductScreen({ product, onBack, onAdd }: Props) {
  const [option, setOption] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const imageUri = productImageUri(product.images[selectedImage] || product.images[0]);
  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <View style={styles.breadcrumb}><TouchableOpacity onPress={onBack}><Text style={styles.back}>‹  THE COLLECTION</Text></TouchableOpacity><Text numberOfLines={1} style={styles.crumbName}>{product.name}</Text></View>
      <View style={styles.imageWrap}>
        {imageUri ? <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" /> : <Text style={styles.placeholder}>A</Text>}
        <View style={styles.badges}>
          {product.isBestSeller && <Text style={styles.bestSeller}>SIGNATURE PIECE</Text>}
          {product.isNew && <Text style={styles.newRelease}>NEW ARCHIVAL RELEASE</Text>}
        </View>
      </View>
      {product.images.length > 1 && <View style={styles.thumbnails}>{product.images.map((image, index) => <TouchableOpacity key={`${image}-${index}`} onPress={() => setSelectedImage(index)} style={[styles.thumbnail, selectedImage === index && styles.thumbnailSelected]}>
        <Image source={{ uri: productImageUri(image) }} style={styles.thumbnailImage} resizeMode="cover" />
      </TouchableOpacity>)}</View>}
      <View style={styles.details}>
        <Text style={styles.category}>{product.category.toUpperCase()}  /  {product.sku}</Text>
        <Text style={styles.name}>{product.name}</Text>
        {!!product.tagline && <Text style={styles.tagline}>{product.tagline}</Text>}
        <Text style={styles.price}>₦{product.price.toLocaleString('en-NG')}</Text>
        <Text style={styles.description}>{product.description}</Text>
        {!!product.material && <Text style={styles.info}><Text style={styles.label}>MATERIAL  </Text>{product.material}</Text>}
        {!!product.dimensions && <Text style={styles.info}><Text style={styles.label}>DETAILS  </Text>{product.dimensions}</Text>}
        <Text style={styles.label}>SIZE / OPTION (OPTIONAL)</Text>
        <TextInput value={option} onChangeText={setOption} placeholder="Leave blank if not applicable" placeholderTextColor="#69665E" style={styles.input} maxLength={80} />
        <Text style={styles.stock}>{product.stockQuantity > 0 ? `${product.stockQuantity} pieces available` : 'Currently unavailable'}</Text>
        <TouchableOpacity style={[styles.button, product.stockQuantity < 1 && styles.buttonDisabled]} disabled={product.stockQuantity < 1} onPress={() => onAdd(product, option.trim())}>
          <Text style={styles.buttonText}>ADD TO YOUR CART</Text>
        </TouchableOpacity>
        {product.features.length > 0 && <View style={styles.featureBlock}><Text style={styles.label}>CRAFT DETAILS</Text>{product.features.slice(0, 5).map((feature) => <Text key={feature} style={styles.feature}>—  {feature}</Text>)}</View>}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#0C0C0E' }, content: { paddingBottom: 35 },
  breadcrumb: { minHeight: 49, paddingHorizontal: 19, borderBottomWidth: 1, borderColor: '#FFFFFF14', flexDirection: 'row', alignItems: 'center', gap: 12 },
  back: { color: '#C9A977', fontSize: 9, letterSpacing: 1.2 }, crumbName: { flex: 1, color: '#B8ABA0', fontSize: 9 },
  imageWrap: { width: '100%', aspectRatio: 4 / 5, backgroundColor: '#0D0D0F', alignItems: 'center', justifyContent: 'center', borderBottomWidth: 1, borderColor: '#C9A97733', overflow: 'hidden' }, image: { width: '100%', height: '100%' }, placeholder: { color: '#6D6247', fontFamily: 'serif', fontSize: 80 },
  badges: { position: 'absolute', top: 15, left: 15, gap: 8 }, bestSeller: { color: '#E2CCA9', backgroundColor: '#070708E8', borderWidth: 1, borderColor: '#C9A97766', paddingVertical: 7, paddingHorizontal: 10, fontSize: 8, letterSpacing: 1.4 }, newRelease: { color: '#F4EFEA', backgroundColor: '#070708E8', borderWidth: 1, borderColor: '#FFFFFF33', paddingVertical: 7, paddingHorizontal: 10, fontSize: 8, letterSpacing: 1.4 },
  thumbnails: { flexDirection: 'row', gap: 9, paddingHorizontal: 18, paddingTop: 12 }, thumbnail: { width: 64, height: 78, backgroundColor: '#0D0D0F', borderWidth: 1, borderColor: '#FFFFFF1A' }, thumbnailSelected: { borderColor: '#C9A977', borderWidth: 2 }, thumbnailImage: { width: '100%', height: '100%' },
  details: { paddingHorizontal: 22, paddingTop: 22 }, category: { color: '#D9B975', fontSize: 9, letterSpacing: 1.5 },
  name: { color: '#F1EBDD', fontFamily: 'serif', fontSize: 28, lineHeight: 33, marginTop: 9 }, tagline: { color: '#AAA497', fontSize: 12, lineHeight: 19, marginTop: 7 },
  price: { color: '#E2CA8B', fontSize: 19, marginTop: 15 }, description: { color: '#C0BAAE', fontSize: 12, lineHeight: 20, marginTop: 18 },
  info: { color: '#B5B0A5', fontSize: 10, lineHeight: 17, marginTop: 12 }, label: { color: '#D9B975', fontSize: 9, letterSpacing: 1.5 },
  input: { height: 45, borderWidth: 1, borderColor: '#454137', paddingHorizontal: 12, color: '#F1EBDD', fontSize: 12, marginTop: 8 },
  stock: { color: '#989286', fontSize: 10, marginTop: 12 }, button: { marginTop: 13, height: 50, backgroundColor: '#D9B975', alignItems: 'center', justifyContent: 'center' }, buttonDisabled: { opacity: 0.4 }, buttonText: { color: '#171713', letterSpacing: 1.4, fontSize: 10, fontWeight: '600' },
  featureBlock: { marginTop: 25, borderTopWidth: 1, borderColor: '#292923', paddingTop: 18 }, feature: { color: '#B9B3A7', fontSize: 11, lineHeight: 19, marginTop: 9 },
});
