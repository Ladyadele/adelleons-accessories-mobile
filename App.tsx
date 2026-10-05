import 'react-native-url-polyfill/auto';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Linking, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { supabase } from './src/lib/supabase';
import { loadProducts } from './src/lib/catalog';
import { CartLine, Product } from './src/lib/types';
import { addCartItem, loadCart } from './src/lib/cart';
import { HomeScreen } from './src/screens/HomeScreen';
import { ProductScreen } from './src/screens/ProductScreen';
import { CartScreen } from './src/screens/CartScreen';
import { AccountScreen } from './src/screens/AccountScreen';
import { CollectionScreen } from './src/screens/CollectionScreen';
import { MobileHeader } from './src/components/MobileHeader';
import { MobileNavigation } from './src/components/MobileNavigation';
import { productImageUri } from './src/lib/catalog';

WebBrowser.maybeCompleteAuthSession();

type Screen = 'home' | 'collection' | 'cart' | 'account';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>();
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartError, setCartError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const cartLoadGeneration = useRef(0);

  useEffect(() => {
    let mounted = true;
    let authEvents = 0;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      authEvents += 1;
      setUser(session?.user ? { id: session.user.id, email: session.user.email } : null);
      setAuthReady(true);
    });
    const initialEvents = authEvents;
    void supabase.auth.getSession().then(({ data, error }) => {
      if (!mounted || authEvents !== initialEvents) return;
      if (error) console.warn('Session restore failed', error.message);
      setUser(data.session?.user ? { id: data.session.user.id, email: data.session.user.email } : null);
      setAuthReady(true);
    });
    void loadProducts().then((data) => { if (mounted) setProducts(data); })
      .catch((error) => { if (mounted) Alert.alert('Catalog unavailable', error.message || 'Could not load products.'); })
      .finally(() => { if (mounted) setCatalogLoading(false); });
    return () => { mounted = false; subscription.unsubscribe(); };
  }, []);

  const refreshCart = useCallback(async () => {
    const generation = ++cartLoadGeneration.current;
    if (!user) { setCart([]); setCartLoading(false); setCartError(null); return; }
    setCartLoading(true);
    setCartError(null);
    try {
      const nextCart = await loadCart(user.id);
      if (cartLoadGeneration.current === generation) setCart(nextCart);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to load your cart.';
      if (cartLoadGeneration.current === generation) setCartError(message);
    } finally {
      if (cartLoadGeneration.current === generation) setCartLoading(false);
    }
  }, [user]);

  useEffect(() => { void refreshCart(); }, [refreshCart, refreshKey]);

  useEffect(() => {
    if (screen !== 'cart' || !user) return;
    void refreshCart();
    const interval = setInterval(() => { void refreshCart(); }, 5000);
    return () => clearInterval(interval);
  }, [refreshCart, screen, user]);

  const handleAdd = useCallback(async (product: Product, option = '') => {
    if (!user) {
      Alert.alert('Sign in to save your cart', 'Your cart is shared across devices when you sign in.', [
        { text: 'Later', style: 'cancel' }, { text: 'Sign in', onPress: () => setScreen('account') },
      ]);
      return;
    }
    try {
      await addCartItem(user.id, product, option);
      setRefreshKey((value) => value + 1);
      Alert.alert('Added to your cart', product.name);
    } catch (error) {
      Alert.alert('Could not update cart', error instanceof Error ? error.message : 'Please try again.');
    }
  }, [cart, user]);

  const openCollection = useCallback((category?: string) => {
    setCategoryFilter(category);
    setSelectedProduct(null);
    setScreen('collection');
  }, []);
  const openWebsite = useCallback((path: string) => {
    const url = productImageUri(path);
    if (url) void Linking.openURL(url).catch(() => Alert.alert('Page unavailable', 'Could not open this page right now.'));
  }, []);

  const handleGoogleSignIn = useCallback(async () => {
    try {
      const redirectTo = AuthSession.makeRedirectUri({
        scheme: 'adelleons',
        path: 'auth/callback',
        native: 'adelleons://auth/callback',
      });
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google', options: { redirectTo, skipBrowserRedirect: true },
      });
      if (error) throw error;
      if (!data.url) throw new Error('Supabase did not return a Google sign-in URL.');
      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
      if (result.type !== 'success') return;
      const callbackUrl = new URL(result.url);
      const code = callbackUrl.searchParams.get('code');
      if (!code) throw new Error(callbackUrl.searchParams.get('error_description') || 'Google sign-in did not return an authorization code.');
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      if (exchangeError) throw exchangeError;
    } catch (error) {
      Alert.alert('Google sign-in failed', error instanceof Error ? error.message : 'Please try again.');
    }
  }, []);

  const openProduct = (product: Product) => setSelectedProduct(product);
  const count = useMemo(() => cart.reduce((total, line) => total + line.quantity, 0), [cart]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#101110" />
      {!authReady ? (
        <View style={styles.loading}><ActivityIndicator color="#D9B975" /><Text style={styles.loadingText}>Restoring your secure session…</Text></View>
      ) : (
        <>
          <MobileHeader cartCount={count} onMenu={() => setNavigationOpen(true)} onCart={() => { setSelectedProduct(null); setScreen('cart'); }} onHome={() => { setSelectedProduct(null); setScreen('home'); }} />
          <View style={styles.page}>
            {selectedProduct ? <ProductScreen product={selectedProduct} onBack={() => setSelectedProduct(null)} onAdd={handleAdd} /> : null}
            {!selectedProduct && screen === 'home' && <HomeScreen products={products} loading={catalogLoading} onOpenProduct={openProduct} onAdd={handleAdd} onOpenCollection={openCollection} onOpenWebsite={openWebsite} />}
            {!selectedProduct && screen === 'collection' && <CollectionScreen products={products} category={categoryFilter} onOpenProduct={openProduct} onAdd={handleAdd} onSelectCategory={openCollection} />}
            {!selectedProduct && screen === 'cart' && <CartScreen user={user} lines={cart} loading={cartLoading} error={cartError} onRefresh={refreshCart} onSignIn={() => setScreen('account')} />}
            {!selectedProduct && screen === 'account' && <AccountScreen user={user} onGoogleSignIn={handleGoogleSignIn} />}
          </View>
          <MobileNavigation visible={navigationOpen} onClose={() => setNavigationOpen(false)} onHome={() => { setSelectedProduct(null); setScreen('home'); }} onCollection={openCollection} onAccount={() => setScreen('account')} onWebsite={openWebsite} />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#101110' },
  page: { flex: 1, backgroundColor: '#101110' },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { color: '#B3ADA0', fontSize: 13 },
});
