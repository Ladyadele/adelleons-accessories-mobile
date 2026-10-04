import 'react-native-url-polyfill/auto';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { createClient } from '@supabase/supabase-js';

// SecureStore has a per-value size limit on some platforms. Split the encoded
// Supabase session into small values while keeping every part in secure storage.
const SECURE_VALUE_LIMIT = 1800;
const secureStorage = {
  async getItem(key: string) {
    if (Platform.OS === 'web') return typeof localStorage === 'undefined' ? null : localStorage.getItem(key);
    const countValue = await SecureStore.getItemAsync(`${key}.chunk-count`);
    if (!countValue) return SecureStore.getItemAsync(key); // legacy one-value session
    const count = Number(countValue);
    if (!Number.isInteger(count) || count < 1) return null;
    const chunks = await Promise.all(Array.from({ length: count }, (_, index) => SecureStore.getItemAsync(`${key}.chunk-${index}`)));
    if (chunks.some((chunk) => chunk === null)) return null;
    return decodeURIComponent(chunks.join(''));
  },
  async setItem(key: string, value: string) {
    if (Platform.OS === 'web') {
      if (typeof localStorage !== 'undefined') localStorage.setItem(key, value);
      return;
    }
    const encoded = encodeURIComponent(value);
    const chunks = encoded.match(new RegExp(`.{1,${SECURE_VALUE_LIMIT}}`, 'g')) || [''];
    await Promise.all(chunks.map((chunk, index) => SecureStore.setItemAsync(`${key}.chunk-${index}`, chunk)));
    await SecureStore.setItemAsync(`${key}.chunk-count`, String(chunks.length));
    const previousCount = Number(await SecureStore.getItemAsync(`${key}.previous-count`) || 0);
    await SecureStore.deleteItemAsync(key).catch(() => undefined);
    for (let index = chunks.length; index < previousCount; index++) {
      await SecureStore.deleteItemAsync(`${key}.chunk-${index}`).catch(() => undefined);
    }
    await SecureStore.setItemAsync(`${key}.previous-count`, String(chunks.length));
  },
  async removeItem(key: string) {
    if (Platform.OS === 'web') {
      if (typeof localStorage !== 'undefined') localStorage.removeItem(key);
      return;
    }
    const count = Number(await SecureStore.getItemAsync(`${key}.chunk-count`) || 0);
    await SecureStore.deleteItemAsync(key).catch(() => undefined);
    await SecureStore.deleteItemAsync(`${key}.chunk-count`).catch(() => undefined);
    await SecureStore.deleteItemAsync(`${key}.previous-count`).catch(() => undefined);
    for (let index = 0; index < count; index++) {
      await SecureStore.deleteItemAsync(`${key}.chunk-${index}`).catch(() => undefined);
    }
  },
};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in .env before running the app.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: secureStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    flowType: 'pkce',
  },
});
