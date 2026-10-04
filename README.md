# Adelleon's Accessories Mobile

Expo + React Native client for the Adelleon's Accessories Supabase project.

## Configuration

Copy `.env.example` to `.env` and set the existing project's public Supabase URL and anon/publishable key. Never put a Supabase service-role key in this app. The app stores the Supabase auth session in Expo SecureStore.

Products are read from `public.products` where `active = true`. Cart lines are read and written directly to `public.cart_items` with the signed-in Supabase user ID, so Supabase RLS remains in force. Empty product options are written as `selected_size = ''`; non-empty options are stored as entered.

## Run on Android

Install Expo Go on the phone, put the phone and development computer on the same network, then run:

```sh
npm install
npx expo start
```

Scan the QR code in Expo Go. `app.json` includes the Android package, app display name, deep-link scheme, and icon asset paths for a later native installable build.

## Google OAuth

Google sign-in uses the native `adelleons://auth/callback` redirect. Configure the Google provider and allow this redirect URL in Supabase Auth before using Google sign-in. Email/password sign-in and sign-up use the existing Supabase project.

The current product schema has no dedicated option list. The product screen accepts an optional text option/size; leave it blank for products without an option.
