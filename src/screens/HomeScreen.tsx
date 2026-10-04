import React from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { productImageUri } from '../lib/catalog';
import { BEST_SELLER_PRODUCT_SLUGS, FEATURED_PRODUCT_SLUGS, HERO_PRODUCT_SLUG, HOME_CATEGORIES, STORY_IMAGES } from '../lib/homeContent';
import { Product } from '../lib/types';
import { ProductCard } from '../components/ProductCard';

const colors = { bg: '#0C0C0E', panel: '#0D0D0F', line: 'rgba(255,255,255,0.08)', gold: '#C9A977', lightGold: '#E2CCA9', ivory: '#F4EFEA', muted: '#B8ABA0' };
type Props = {
  products: Product[];
  loading: boolean;
  onOpenProduct: (product: Product) => void;
  onAdd: (product: Product) => void;
  onOpenCollection: (category?: string) => void;
  onOpenWebsite: (path: string) => void;
};

function orderedProducts(products: Product[], slugs: string[]) {
  const bySlug = new Map(products.map((product) => [product.slug, product]));
  return slugs.map((slug) => bySlug.get(slug)).filter((product): product is Product => Boolean(product));
}

export function HomeScreen({ products, loading, onOpenProduct, onAdd, onOpenCollection, onOpenWebsite }: Props) {
  const heroProduct = products.find((product) => product.slug === HERO_PRODUCT_SLUG) || products[0];
  const featured = orderedProducts(products, FEATURED_PRODUCT_SLUGS);
  const bestSellers = orderedProducts(products, BEST_SELLER_PRODUCT_SLUGS);

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <View style={styles.heroCopy}>
          <View style={styles.heroPill}><Text style={styles.sparkle}>✦</Text><Text style={styles.heroPillText}>ACCESSORIES FOR EVERY DAY AND EVERY OCCASION</Text></View>
          <Text style={styles.heroTitle}>Class in{'\n'}<Text style={styles.heroItalic}>Every Piece.</Text></Text>
          <Text style={styles.heroIntro}>Explore accessories made to bring a little more style to your everyday look, from watches and jewellery to bags and leather goods.</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={() => onOpenCollection()}><Text style={styles.primaryButtonText}>SHOP THE COLLECTION  ›</Text></TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => onOpenCollection('watches')}><Text style={styles.secondaryButtonText}>EXPLORE TIMEPIECES</Text></TouchableOpacity>
          <View style={styles.microBadges}>
            <View style={styles.microBadge}><Text style={styles.microValue}>100%</Text><Text style={styles.microLabel}>SURGICAL 316L</Text></View>
            <View style={styles.microBadge}><Text style={styles.microValue}>18K PVD</Text><Text style={styles.microLabel}>LIFETIME BOND</Text></View>
            <View style={styles.microBadge}><Text style={styles.microValueSmall}>Complimentary</Text><Text style={styles.microLabel}>INSURED COURIER</Text></View>
          </View>
        </View>
        {heroProduct && <TouchableOpacity activeOpacity={0.92} onPress={() => onOpenProduct(heroProduct)} style={styles.heroImageWrap}>
          {!!productImageUri(heroProduct.images[0]) && <Image source={{ uri: productImageUri(heroProduct.images[0]) }} style={styles.heroImage} resizeMode="cover" />}
          <View style={styles.heroShade} />
          <View style={styles.heroProductLabel}>
            <Text style={styles.heroProductEyebrow}>ARCHIVAL CENTERPIECE</Text>
            <Text numberOfLines={1} style={styles.heroProductName}>{heroProduct.name}</Text>
            <Text style={styles.heroProductPrice}>₦{heroProduct.price.toLocaleString('en-NG')}</Text>
            <Text style={styles.heroProductLink}>VIEW PRODUCT  ›</Text>
          </View>
        </TouchableOpacity>}
        {loading && <View style={styles.loading}><ActivityIndicator color={colors.gold} /><Text style={styles.loadingText}>Loading the collection…</Text></View>}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeading}>
          <View><Text style={styles.kicker}>SHOP BY CATEGORY</Text><Text style={styles.sectionTitle}>Find your style</Text></View>
          <TouchableOpacity onPress={() => onOpenCollection()}><Text style={styles.textLink}>VIEW ALL  ›</Text></TouchableOpacity>
        </View>
        <View style={styles.categoryGrid}>
          {HOME_CATEGORIES.map((category) => <TouchableOpacity key={category.slug} activeOpacity={0.88} onPress={() => onOpenCollection(category.slug)} style={styles.categoryCard}>
            <View style={styles.categoryImageWrap}>{!!productImageUri(category.image) && <Image source={{ uri: productImageUri(category.image) }} style={styles.categoryImage} resizeMode="cover" />}<View style={styles.categoryShade} /></View>
            <View style={styles.categoryLabel}><Text numberOfLines={2} style={styles.categoryName}>{category.name}</Text><Text style={styles.categoryCount}>{category.itemCount} PIECES</Text></View>
          </TouchableOpacity>)}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeadingStack}>
          <Text style={styles.kicker}>CURATOR’S SELECTION</Text><Text style={styles.sectionTitle}>Featured products</Text>
          <Text style={styles.sectionCopy}>A few of our favourite pieces, selected for their thoughtful details and easy-to-wear style.</Text>
        </View>
        {loading ? <ActivityIndicator color={colors.gold} /> : featured.map((product) => <ProductCard key={product.id} product={product} onOpen={onOpenProduct} onAdd={onAdd} />)}
      </View>

      <View style={styles.storySection}>
        <View style={styles.storyCollage}>
          {STORY_IMAGES.map((image, index) => <View key={image.uri} style={[styles.storyImageWrap, index === 1 && styles.storyImageOffset]}>
            <Image source={{ uri: productImageUri(image.uri) }} style={styles.storyImage} resizeMode="cover" accessibilityLabel={image.accessibilityLabel} />
          </View>)}
        </View>
        <View style={styles.storyCopy}>
          <Text style={styles.kicker}>THE ADELLEON PHILOSOPHY</Text>
          <Text style={styles.storyTitle}>Accessories that feel like you.</Text>
          <Text style={styles.quote}>“Class in every piece.”</Text>
          <Text style={styles.storyBody}>Find watches, jewellery, and leather accessories to suit your personal style.</Text>
          <View style={styles.storyActions}>
            <TouchableOpacity style={styles.storyPrimary} onPress={() => onOpenWebsite('/about')}><Text style={styles.storyPrimaryText}>ABOUT US</Text></TouchableOpacity>
            <TouchableOpacity style={styles.storySecondary} onPress={() => onOpenWebsite('/contact')}><Text style={styles.storySecondaryText}>CONTACT US</Text></TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeading}>
          <View><Text style={styles.kicker}>POPULAR PICKS</Text><Text style={styles.sectionTitle}>Best sellers</Text></View>
          <TouchableOpacity onPress={() => onOpenCollection()}><Text style={styles.textLink}>SHOP ALL  ›</Text></TouchableOpacity>
        </View>
        {loading ? <ActivityIndicator color={colors.gold} /> : bestSellers.map((product) => <ProductCard key={product.id} product={product} onOpen={onOpenProduct} onAdd={onAdd} />)}
      </View>

      <View style={styles.guarantee}>
        <Text style={styles.kicker}>SHOP WITH CONFIDENCE</Text>
        <Text style={styles.guaranteeTitle}>The Gentleman’s Guarantee</Text>
        <Text style={styles.guaranteeCopy}>Browse the collection and choose a piece that suits your style.</Text>
        <TouchableOpacity style={styles.guaranteePrimary} onPress={() => onOpenCollection()}><Text style={styles.primaryButtonText}>START SHOPPING</Text></TouchableOpacity>
        <TouchableOpacity style={styles.guaranteeSecondary} onPress={() => onOpenWebsite('/shipping')}><Text style={styles.secondaryButtonText}>LEARN ABOUT SHIPPING</Text></TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bg }, content: { paddingBottom: 34 },
  hero: { paddingHorizontal: 17, paddingTop: 35, paddingBottom: 33, borderBottomWidth: 1, borderBottomColor: colors.line }, heroCopy: { alignItems: 'center' },
  heroPill: { backgroundColor: colors.panel, borderWidth: 1, borderColor: '#C9A97755', paddingHorizontal: 10, paddingVertical: 9, flexDirection: 'row', alignItems: 'center', gap: 7 }, sparkle: { color: colors.gold, fontSize: 12 }, heroPillText: { color: colors.lightGold, fontSize: 8, letterSpacing: 1.25, fontWeight: '600' },
  heroTitle: { color: '#FAF8F5', fontFamily: 'serif', fontSize: 45, lineHeight: 51, textAlign: 'center', letterSpacing: -1, marginTop: 23 }, heroItalic: { color: colors.lightGold, fontStyle: 'italic', fontWeight: '300' },
  heroIntro: { color: '#D8CEBFCC', fontSize: 13, lineHeight: 21, fontWeight: '300', textAlign: 'center', marginTop: 16, maxWidth: 350 }, primaryButton: { alignSelf: 'stretch', minHeight: 51, backgroundColor: colors.gold, justifyContent: 'center', alignItems: 'center', marginTop: 23, shadowColor: '#C9A977', shadowOpacity: 0.18, shadowRadius: 12, elevation: 3 }, primaryButtonText: { color: colors.bg, fontSize: 10, letterSpacing: 1.5, fontWeight: '700' },
  secondaryButton: { alignSelf: 'stretch', minHeight: 51, borderWidth: 1, borderColor: '#FFFFFF26', justifyContent: 'center', alignItems: 'center', marginTop: 10 }, secondaryButtonText: { color: '#E9E2D8', fontSize: 10, letterSpacing: 1.5, fontWeight: '500' },
  microBadges: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginTop: 27, paddingTop: 17, borderTopWidth: 1, borderTopColor: colors.line }, microBadge: { flex: 1, alignItems: 'center' }, microValue: { color: '#FAF8F5', fontFamily: 'serif', fontSize: 16 }, microValueSmall: { color: '#FAF8F5', fontFamily: 'serif', fontSize: 11, marginTop: 3 }, microLabel: { color: '#B8ABA0', fontSize: 7, letterSpacing: 1, textAlign: 'center', marginTop: 5 },
  heroImageWrap: { aspectRatio: 4 / 5, width: '100%', maxWidth: 430, alignSelf: 'center', marginTop: 29, backgroundColor: colors.panel, borderWidth: 1, borderColor: '#C9A97755', overflow: 'hidden' }, heroImage: { width: '100%', height: '100%', position: 'absolute' }, heroShade: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '44%', backgroundColor: '#070708C9' }, heroProductLabel: { position: 'absolute', left: 14, right: 14, bottom: 14, padding: 14, backgroundColor: '#070708E8', borderWidth: 1, borderColor: '#FFFFFF1A' }, heroProductEyebrow: { color: colors.gold, fontSize: 8, letterSpacing: 1.7, fontWeight: '600' }, heroProductName: { color: colors.ivory, fontSize: 13, marginTop: 8, flex: 1 }, heroProductPrice: { color: colors.gold, fontSize: 13, marginTop: 5, fontWeight: '600' }, heroProductLink: { color: colors.lightGold, fontSize: 9, letterSpacing: 1.2, marginTop: 10 },
  loading: { padding: 20, alignItems: 'center' }, loadingText: { color: colors.muted, marginTop: 8, fontSize: 11 },
  section: { paddingHorizontal: 17, marginTop: 53 }, sectionHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: 14, marginBottom: 20, borderBottomWidth: 1, borderBottomColor: colors.line }, sectionHeadingStack: { paddingBottom: 14, marginBottom: 20, borderBottomWidth: 1, borderBottomColor: colors.line }, kicker: { color: colors.gold, fontSize: 9, letterSpacing: 2.2, fontWeight: '600' }, sectionTitle: { color: '#FAF8F5', fontFamily: 'serif', fontSize: 27, fontWeight: '400', marginTop: 7 }, textLink: { color: colors.lightGold, fontSize: 9, letterSpacing: 1.2, marginBottom: 4 }, sectionCopy: { color: colors.muted, fontSize: 11, lineHeight: 17, marginTop: 9 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 12 }, categoryCard: { width: '48.5%', backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, overflow: 'hidden' }, categoryImageWrap: { width: '100%', aspectRatio: 4 / 5, backgroundColor: '#070708', overflow: 'hidden' }, categoryImage: { width: '100%', height: '100%' }, categoryShade: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '40%', backgroundColor: '#07070866' }, categoryLabel: { minHeight: 61, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 6, paddingVertical: 9 }, categoryName: { color: colors.ivory, fontSize: 10, textAlign: 'center', letterSpacing: 0.65, textTransform: 'uppercase' }, categoryCount: { color: '#8D867B', fontSize: 8, letterSpacing: 1.4, marginTop: 6 },
  storySection: { marginTop: 49, backgroundColor: colors.panel, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#C9A97733', paddingHorizontal: 17, paddingVertical: 35 }, storyCollage: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' }, storyImageWrap: { flex: 1, aspectRatio: 3 / 4, backgroundColor: colors.bg, borderWidth: 1, borderColor: '#FFFFFF1A', overflow: 'hidden' }, storyImageOffset: { marginTop: 24 }, storyImage: { width: '100%', height: '100%' }, storyCopy: { marginTop: 31 }, storyTitle: { color: '#FAF8F5', fontFamily: 'serif', fontSize: 31, lineHeight: 38, marginTop: 12 }, quote: { color: '#D8CEBF', fontFamily: 'serif', fontStyle: 'italic', fontSize: 15, marginTop: 17, paddingLeft: 12, borderLeftWidth: 2, borderLeftColor: '#C9A97799' }, storyBody: { color: colors.muted, fontSize: 12, lineHeight: 19, marginTop: 15, fontWeight: '300' }, storyActions: { flexDirection: 'row', gap: 10, marginTop: 21 }, storyPrimary: { borderWidth: 1, borderColor: '#C9A97766', backgroundColor: colors.bg, paddingHorizontal: 18, height: 43, justifyContent: 'center' }, storyPrimaryText: { color: colors.lightGold, fontSize: 9, letterSpacing: 1.4, fontWeight: '600' }, storySecondary: { borderWidth: 1, borderColor: '#FFFFFF1A', paddingHorizontal: 18, height: 43, justifyContent: 'center' }, storySecondaryText: { color: '#D8CEBF', fontSize: 9, letterSpacing: 1.4 },
  guarantee: { marginHorizontal: 17, marginTop: 52, padding: 25, backgroundColor: colors.panel, borderWidth: 1, borderColor: '#C9A97766', alignItems: 'center' }, guaranteeTitle: { color: colors.ivory, fontFamily: 'serif', fontSize: 25, lineHeight: 31, textAlign: 'center', marginTop: 12 }, guaranteeCopy: { color: '#D8CEBFCC', fontSize: 11, lineHeight: 18, textAlign: 'center', marginTop: 9 }, guaranteePrimary: { alignSelf: 'stretch', height: 46, backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center', marginTop: 22 }, guaranteeSecondary: { alignSelf: 'stretch', height: 46, borderWidth: 1, borderColor: '#FFFFFF33', alignItems: 'center', justifyContent: 'center', marginTop: 10 },
});
