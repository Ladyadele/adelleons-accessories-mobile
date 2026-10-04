import React, { useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { productImageUri } from '../lib/catalog';
import { CartLine } from '../lib/types';
import { removeCartItem, updateCartItem } from '../lib/cart';

type Props = {
  user: { id: string; email?: string } | null;
  lines: CartLine[];
  loading: boolean;
  error: string | null;
  onRefresh: () => Promise<void>;
  onSignIn: () => void;
};

export function CartScreen({ user, lines, loading, error, onRefresh, onSignIn }: Props) {
  const [working, setWorking] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const mutate = async (line: CartLine, action: () => Promise<void>) => {
    if (!user) return;
    setWorking(line.id); setLocalError(null);
    try { await action(); await onRefresh(); }
    catch (e) { setLocalError(e instanceof Error ? e.message : 'Could not update your cart.'); }
    finally { setWorking(null); }
  };

  if (!user) return (
    <View style={styles.center}>
      <Text style={styles.kicker}>YOUR SELECTIONS</Text><Text style={styles.title}>Your cart travels with you.</Text>
      <Text style={styles.copy}>Sign in to see and update the cart shared with the Adelleon&apos;s website.</Text>
      <TouchableOpacity style={styles.button} onPress={onSignIn}><Text style={styles.buttonText}>SIGN IN</Text></TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.page}>
      <View style={styles.header}><Text style={styles.kicker}>CLIENT VAULT</Text><Text style={styles.title}>Your cart</Text><Text style={styles.copy}>{user.email}</Text></View>
      {(error || localError) && <Text style={styles.error}>{localError || error}</Text>}
      {loading ? <View style={styles.center}><ActivityIndicator color="#D9B975" /></View> : lines.length === 0 ? (
        <View style={styles.center}><Text style={styles.emptyMark}>A</Text><Text style={styles.emptyTitle}>A considered beginning.</Text><Text style={styles.copy}>Your cart is empty. Explore the collection and add a piece.</Text></View>
      ) : (
        <FlatList data={lines} keyExtractor={(line) => line.id} contentContainerStyle={styles.list} renderItem={({ item }) => (
          <View style={styles.line}>
            <View style={styles.thumb}>{productImageUri(item.product.images[0]) ? <Image source={{ uri: productImageUri(item.product.images[0]) }} style={styles.image} /> : <Text style={styles.thumbMark}>A</Text>}</View>
            <View style={styles.meta}>
              <Text style={styles.category}>{item.product.category.toUpperCase()}</Text>
              <Text style={styles.productName}>{item.product.name}</Text>
              {item.selectedOption ? <Text style={styles.option}>Option: {item.selectedOption}</Text> : null}
              <Text style={styles.price}>₦{item.product.price.toLocaleString('en-NG')}</Text>
              <View style={styles.actions}>
                <View style={styles.quantity}>
                  <TouchableOpacity onPress={() => void mutate(item, () => updateCartItem(user.id, item, item.quantity - 1))} disabled={working === item.id}><Text style={styles.qtyButton}>−</Text></TouchableOpacity>
                  <Text style={styles.qtyText}>{item.quantity}</Text>
                  <TouchableOpacity onPress={() => void mutate(item, () => updateCartItem(user.id, item, item.quantity + 1))} disabled={working === item.id}><Text style={styles.qtyButton}>+</Text></TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => void mutate(item, () => removeCartItem(user.id, item))} disabled={working === item.id}><Text style={styles.remove}>REMOVE</Text></TouchableOpacity>
              </View>
              {working === item.id && <Text style={styles.saving}>Saving…</Text>}
            </View>
          </View>
        )} />
      )}
      {lines.length > 0 && <View style={styles.total}><Text style={styles.totalLabel}>SUBTOTAL</Text><Text style={styles.totalAmount}>₦{lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0).toLocaleString('en-NG')}</Text></View>}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#101110' }, header: { paddingHorizontal: 21, paddingTop: 24, paddingBottom: 17, borderBottomWidth: 1, borderColor: '#292923' }, kicker: { color: '#D9B975', fontSize: 9, letterSpacing: 2 }, title: { color: '#F1EBDD', fontFamily: 'serif', fontSize: 32, marginTop: 7 }, copy: { color: '#9B968A', fontSize: 11, lineHeight: 18, marginTop: 8 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28 }, button: { backgroundColor: '#D9B975', paddingHorizontal: 32, paddingVertical: 15, marginTop: 22 }, buttonText: { color: '#171713', fontSize: 10, letterSpacing: 1.5 }, emptyMark: { color: '#62583E', fontFamily: 'serif', fontSize: 72 }, emptyTitle: { color: '#F1EBDD', fontFamily: 'serif', fontSize: 21, marginTop: 5, textAlign: 'center' },
  error: { color: '#E4A091', backgroundColor: '#301E1B', margin: 14, padding: 11, fontSize: 11 }, list: { paddingHorizontal: 14, paddingBottom: 20 }, line: { flexDirection: 'row', paddingVertical: 15, borderBottomWidth: 1, borderColor: '#292923' }, thumb: { width: 83, height: 101, backgroundColor: '#20211E', alignItems: 'center', justifyContent: 'center' }, image: { width: '100%', height: '100%' }, thumbMark: { color: '#6D6247', fontFamily: 'serif', fontSize: 34 }, meta: { flex: 1, paddingLeft: 13 }, category: { color: '#D9B975', fontSize: 8, letterSpacing: 1.4 }, productName: { color: '#F1EBDD', fontFamily: 'serif', fontSize: 15, lineHeight: 19, marginTop: 5 }, option: { color: '#AAA497', fontSize: 10, marginTop: 4 }, price: { color: '#DEC98F', fontSize: 12, marginTop: 7 },
  actions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 9 }, quantity: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#393831', gap: 15, paddingHorizontal: 9, height: 29 }, qtyButton: { color: '#E9D8AC', fontSize: 18 }, qtyText: { color: '#F1EBDD', fontSize: 11 }, remove: { color: '#AFA89B', fontSize: 8, letterSpacing: 1.2 }, saving: { color: '#BEB8AC', fontSize: 9, marginTop: 5 },
  total: { borderTopWidth: 1, borderColor: '#393831', flexDirection: 'row', justifyContent: 'space-between', padding: 18 }, totalLabel: { color: '#B4AEA1', fontSize: 9, letterSpacing: 1.6 }, totalAmount: { color: '#E2CA8B', fontSize: 14 },
});
