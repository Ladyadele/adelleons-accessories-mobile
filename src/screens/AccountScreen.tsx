import React, { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../lib/supabase';

type User = { id: string; email?: string } | null;
type Props = { user: User; onGoogleSignIn: () => Promise<void> };

export function AccountScreen({ user, onGoogleSignIn }: Props) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!email.trim() || password.length < 6) {
      Alert.alert('Check your details', 'Enter your email and a password with at least 6 characters.');
      return;
    }
    setBusy(true);
    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(), password,
          options: { data: { full_name: name.trim() } },
        });
        if (error) throw error;
        if (!data.session) Alert.alert('Check your email', 'Confirm your email address, then sign in to your account.');
        else Alert.alert('Account created', 'Welcome to Adelleon’s Accessories.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
      }
    } catch (error) {
      Alert.alert(mode === 'signup' ? 'Sign-up failed' : 'Sign-in failed', error instanceof Error ? error.message : 'Please try again.');
    } finally { setBusy(false); }
  };

  const signOut = async () => {
    setBusy(true);
    const { error } = await supabase.auth.signOut();
    setBusy(false);
    if (error) Alert.alert('Could not sign out', error.message);
  };

  return (
    <KeyboardAvoidingView style={styles.page} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.kicker}>ADELLEON&apos;S ACCESSORIES</Text>
        {user ? (
          <View style={styles.signedIn}>
            <View style={styles.seal}><Text style={styles.sealText}>{(user.email || 'A').slice(0, 1).toUpperCase()}</Text></View>
            <Text style={styles.title}>Welcome back.</Text>
            <Text style={styles.copy}>Signed in as</Text>
            <Text style={styles.email}>{user.email}</Text>
            <Text style={styles.note}>Your cart is shared with the Adelleon&apos;s website through your account.</Text>
            <TouchableOpacity style={styles.outlineButton} onPress={() => void signOut()} disabled={busy}>
              {busy ? <ActivityIndicator color="#E4D2A8" /> : <Text style={styles.outlineText}>SIGN OUT</Text>}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.form}>
            <Text style={styles.title}>{mode === 'signin' ? 'Your account.' : 'Join the clientele.'}</Text>
            <Text style={styles.copy}>Sign in to keep your cart in step across devices.</Text>
            <TouchableOpacity style={styles.googleButton} onPress={() => void onGoogleSignIn()} disabled={busy}>
              <Text style={styles.googleMark}>G</Text><Text style={styles.googleText}>CONTINUE WITH GOOGLE</Text>
            </TouchableOpacity>
            <View style={styles.divider}><View style={styles.dividerLine} /><Text style={styles.or}>OR WITH EMAIL</Text><View style={styles.dividerLine} /></View>
            {mode === 'signup' && <TextInput value={name} onChangeText={setName} placeholder="Full name" placeholderTextColor="#777268" autoCapitalize="words" style={styles.input} />}
            <TextInput value={email} onChangeText={setEmail} placeholder="Email address" placeholderTextColor="#777268" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} style={styles.input} />
            <TextInput value={password} onChangeText={setPassword} placeholder="Password (6+ characters)" placeholderTextColor="#777268" secureTextEntry style={styles.input} />
            <TouchableOpacity style={styles.primaryButton} onPress={() => void submit()} disabled={busy}>
              {busy ? <ActivityIndicator color="#171713" /> : <Text style={styles.primaryText}>{mode === 'signin' ? 'SIGN IN' : 'CREATE ACCOUNT'}</Text>}
            </TouchableOpacity>
            <View style={styles.switchRow}><Text style={styles.switchCopy}>{mode === 'signin' ? 'New to the clientele?' : 'Already have an account?'}</Text><TouchableOpacity onPress={() => setMode(mode === 'signin' ? 'signup' : 'signin')}><Text style={styles.switchAction}>{mode === 'signin' ? ' JOIN' : ' SIGN IN'}</Text></TouchableOpacity></View>
          </View>
        )}
        <Text style={styles.footnote}>SECURE ACCOUNT ACCESS BY SUPABASE</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#101110' }, content: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingTop: 30, paddingBottom: 28 }, kicker: { textAlign: 'center', color: '#D9B975', fontSize: 9, letterSpacing: 2.5 },
  title: { color: '#F1EBDD', fontFamily: 'serif', fontSize: 32, textAlign: 'center', marginTop: 17 }, copy: { color: '#A6A093', fontSize: 12, lineHeight: 18, textAlign: 'center', marginTop: 8 },
  form: { marginTop: 13 }, googleButton: { height: 49, borderWidth: 1, borderColor: '#68604D', marginTop: 25, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 11 }, googleMark: { color: '#E4D2A8', fontSize: 16, fontWeight: '700' }, googleText: { color: '#EEE7D8', fontSize: 9, letterSpacing: 1.1 },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 20 }, dividerLine: { flex: 1, height: 1, backgroundColor: '#34332E' }, or: { color: '#888276', fontSize: 8, letterSpacing: 1.2 },
  input: { height: 49, borderWidth: 1, borderColor: '#393831', paddingHorizontal: 13, color: '#F1EBDD', fontSize: 12, marginBottom: 11 }, primaryButton: { height: 50, backgroundColor: '#D9B975', alignItems: 'center', justifyContent: 'center', marginTop: 3 }, primaryText: { color: '#171713', fontSize: 10, letterSpacing: 1.5, fontWeight: '600' },
  switchRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 }, switchCopy: { color: '#A6A093', fontSize: 11 }, switchAction: { color: '#E5CD91', fontSize: 11, fontWeight: '600' },
  signedIn: { alignItems: 'center', marginTop: 30 }, seal: { width: 72, height: 72, borderWidth: 1, borderColor: '#7D6D48', alignItems: 'center', justifyContent: 'center', borderRadius: 36 }, sealText: { color: '#E1C783', fontFamily: 'serif', fontSize: 26 }, email: { color: '#E8DDC1', fontSize: 13, marginTop: 7 }, note: { color: '#9B968A', fontSize: 11, lineHeight: 18, textAlign: 'center', marginTop: 20, maxWidth: 280 }, outlineButton: { height: 47, borderWidth: 1, borderColor: '#65583D', paddingHorizontal: 34, alignItems: 'center', justifyContent: 'center', marginTop: 24 }, outlineText: { color: '#E4D2A8', fontSize: 10, letterSpacing: 1.5 },
  footnote: { color: '#68665D', fontSize: 8, letterSpacing: 1.6, textAlign: 'center', marginTop: 42 },
});
