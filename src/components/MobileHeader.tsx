import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = { cartCount: number; onMenu: () => void; onCart: () => void; onHome: () => void };

export function MobileHeader({ cartCount, onMenu, onCart, onHome }: Props) {
  return (
    <View style={styles.shell}>
      <View style={styles.ticker}><Text style={styles.tickerStar}>✦</Text><Text style={styles.tickerText}>COMPLIMENTARY ARMORED COURIER ON ORDERS ABOVE ₦300,000</Text></View>
      <View style={styles.header}>
        <TouchableOpacity onPress={onMenu} style={styles.menuButton} accessibilityLabel="Open navigation menu"><Text style={styles.menuGlyph}>☰</Text></TouchableOpacity>
        <TouchableOpacity style={styles.brand} onPress={onHome} accessibilityLabel="Go to homepage">
          <Text style={styles.brandName}>ADELLEON&apos;S</Text>
          <Text style={styles.brandTagline}>CLASS IN EVERY PIECE</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onCart} style={styles.bagButton} accessibilityLabel="Shopping bag">
          <Text style={styles.bagText}>BAG</Text>{cartCount > 0 && <View style={styles.countBadge}><Text style={styles.countText}>{cartCount}</Text></View>}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: { backgroundColor: '#0D0D0F', zIndex: 1 },
  ticker: { minHeight: 29, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: '#FFFFFF0D', backgroundColor: '#070708', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 7 },
  tickerStar: { color: '#C9A977', fontSize: 10 }, tickerText: { color: '#E2CCA9', fontSize: 7, letterSpacing: 1.1, textAlign: 'center' },
  header: { minHeight: 66, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: '#FFFFFF0D', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  menuButton: { width: 42, height: 44, justifyContent: 'center' }, menuGlyph: { color: '#E9E2D8', fontSize: 18 },
  brand: { alignItems: 'center', flex: 1 }, brandName: { color: '#FAF8F5', fontFamily: 'serif', fontSize: 18, letterSpacing: 3, fontWeight: '600' }, brandTagline: { color: '#C9A977', fontSize: 7, letterSpacing: 2.2, marginTop: 3 },
  bagButton: { minWidth: 42, height: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }, bagText: { color: '#E9E2D8', fontSize: 9, letterSpacing: 1.2 }, countBadge: { minWidth: 16, height: 16, borderRadius: 9, backgroundColor: '#E2CCA9', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 }, countText: { color: '#070708', fontSize: 9, fontWeight: '700' },
});
