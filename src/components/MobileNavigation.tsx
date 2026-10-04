import React from 'react';
import { Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { HOME_CATEGORIES } from '../lib/homeContent';

type Props = {
  visible: boolean;
  onClose: () => void;
  onHome: () => void;
  onCollection: (category?: string) => void;
  onAccount: () => void;
  onWebsite: (path: string) => void;
};

export function MobileNavigation({ visible, onClose, onHome, onCollection, onAccount, onWebsite }: Props) {
  const action = (callback: () => void) => { onClose(); callback(); };
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close navigation menu" />
        <SafeAreaView style={styles.drawer}>
          <ScrollView contentContainerStyle={styles.drawerContent} showsVerticalScrollIndicator={false}>
            <View style={styles.drawerHeader}>
              <TouchableOpacity onPress={() => action(onHome)}>
                <Text style={styles.brand}>ADELLEON&apos;S</Text><Text style={styles.tagline}>CLASS IN EVERY PIECE</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}><Text style={styles.close}>×</Text></TouchableOpacity>
            </View>
            <Text style={styles.sectionLabel}>SHOP BY CATEGORY</Text>
            <TouchableOpacity style={styles.allProducts} onPress={() => action(() => onCollection())}><Text style={styles.allProductsText}>SHOP ALL PRODUCTS</Text><Text style={styles.chevron}>›</Text></TouchableOpacity>
            {HOME_CATEGORIES.map((category) => <TouchableOpacity key={category.slug} style={styles.categoryLink} onPress={() => action(() => onCollection(category.slug))}>
              <Text style={styles.categoryName}>{category.name.toUpperCase()}</Text><Text style={styles.count}>({category.itemCount})</Text>
            </TouchableOpacity>)}
            <View style={styles.divider} />
            <Text style={styles.sectionLabel}>THE HOUSE</Text>
            {[
              ['About us', '/about'], ['Contact us', '/contact'], ['FAQs', '/faq'], ['Delivery & returns', '/shipping'],
            ].map(([label, path]) => <TouchableOpacity key={path} style={styles.houseLink} onPress={() => action(() => onWebsite(path))}>
              <Text style={styles.houseText}>{label.toUpperCase()}</Text>
            </TouchableOpacity>)}
            <TouchableOpacity style={styles.accountButton} onPress={() => action(onAccount)}><Text style={styles.accountText}>CLIENT ACCOUNT</Text></TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, flexDirection: 'row', backgroundColor: '#00000080' }, backdrop: { ...StyleSheet.absoluteFill },
  drawer: { width: '86%', maxWidth: 360, backgroundColor: '#070708', borderRightWidth: 1, borderColor: '#C9A97755', elevation: 18 }, drawerContent: { flexGrow: 1, paddingHorizontal: 23, paddingBottom: 24 },
  drawerHeader: { minHeight: 79, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#FFFFFF1A', marginBottom: 24 }, brand: { color: '#FAF8F5', fontFamily: 'serif', fontSize: 17, letterSpacing: 2.5, fontWeight: '600' }, tagline: { color: '#C9A977', fontSize: 7, letterSpacing: 2.1, marginTop: 4 }, closeButton: { width: 42, height: 44, alignItems: 'flex-end', justifyContent: 'center' }, close: { color: '#B8ABA0', fontSize: 28, fontWeight: '300' },
  sectionLabel: { color: '#C9A977CC', fontSize: 9, letterSpacing: 2.1, fontWeight: '600', marginBottom: 9 }, allProducts: { minHeight: 47, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#FFFFFF10' }, allProductsText: { color: '#F4EFEA', fontSize: 11, letterSpacing: 1.1 }, chevron: { color: '#8D867B', fontSize: 20 },
  categoryLink: { minHeight: 43, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, categoryName: { color: '#D8CEBF', fontSize: 9, letterSpacing: 1.1, flex: 1 }, count: { color: '#8D867B', fontSize: 9 }, divider: { height: 1, backgroundColor: '#FFFFFF12', marginVertical: 18 },
  houseLink: { minHeight: 42, justifyContent: 'center' }, houseText: { color: '#B8ABA0', fontSize: 9, letterSpacing: 1.2 }, accountButton: { minHeight: 48, borderWidth: 1, borderColor: '#C9A97755', alignItems: 'center', justifyContent: 'center', marginTop: 18 }, accountText: { color: '#E2CCA9', fontSize: 9, letterSpacing: 1.5, fontWeight: '600' },
});
