export type HomeCategory = { slug: string; name: string; image: string; itemCount: number; description: string };

// Kept in the same order and with the same labels as the web app's category portals/menu.
export const HOME_CATEGORIES: HomeCategory[] = [
  { slug: 'watches', name: 'Horology & Timepieces', image: '/products/watches/Black stainless-steel watch.jpg', itemCount: 5, description: 'Masterfully calibrated chronographs and automatic timepieces crafted with sapphire crystal and surgical-grade stainless steel.' },
  { slug: 'bracelets', name: 'Cuffs & Bracelets', image: '/products/bracelets/Black + gold bracelet.jpg', itemCount: 5, description: 'Engineered cuffs, braided Italian calfskins, and natural volcanic stone beads designed to harmonize with bespoke tailoring.' },
  { slug: 'chains', name: 'Precious Chains', image: '/products/chains/Gold Cuban chain.jpg', itemCount: 5, description: 'Heavier solid links and micro-diamond cut chains in 18k champagne gold and 925 rhodium-finished sterling silver.' },
  { slug: 'rings', name: 'Signets & Bands', image: '/products/rings/Gold-tone signet ring.jpg', itemCount: 4, description: 'Distinctive signet silhouettes, brushed tungsten carbide, and engraved crests that signify lasting achievement.' },
  { slug: 'sunglasses', name: 'Luxury Eyewear', image: '/products/sunglasses/Gold-frame sunglasses.jpg', itemCount: 4, description: 'Architectural frames with custom polarized Zeiss lenses offering superior UV protection and an unmistakable silhouette.' },
  { slug: 'wallets', name: 'Leather Small Goods', image: '/products/wallets/Black leather wallet.jpg', itemCount: 4, description: 'Ultra-slim leathercraft and aerospace aluminum vaults that eliminate pocket bulk while protecting financial privacy.' },
  { slug: 'belts', name: 'Artisanal Belts', image: '/products/belts/Black leather belt.jpg', itemCount: 2, description: 'Edge-painted French box calf and vegetable-tanned hides finished with brushed champagne gold and gunmetal hardware.' },
  { slug: 'cufflinks', name: 'Atelier Cufflinks', image: '/products/cufflinks/Gold-tone cufflinks.jpg', itemCount: 3, description: 'Sartorial finishing touches for French-cuff dress shirts, hand-polished to catch light with understated refinement.' },
  { slug: 'necklaces', name: 'Necklaces & Pendants', image: '/products/necklaces/Gold Cuban necklace.jpg', itemCount: 5, description: 'Refined neckwear designed to rest effortlessly on silk collars or open linen shirts for an air of composed confidence.' },
  { slug: 'bags', name: 'Luggage & Crossbody', image: '/products/bags/Black leather crossbody.jpg', itemCount: 3, description: 'Minimalist city crossbodies, reporter envelopes, and leather travel bags engineered for the modern gentleman on the move.' },
];

export const COLLECTION_DESCRIPTION = 'Each design represents our commitment to geometric balance, weight, and enduring materials. Made to be handed down.';

export const HERO_PRODUCT_SLUG = 'aethelgard-automatic-stealth-chronograph';
export const FEATURED_PRODUCT_SLUGS = [
  'aethelgard-automatic-stealth-chronograph',
  'imperial-royale-18k-gilded-automatic',
  'elysium-matte-onyx-champagne-gold-bangle',
  'monarch-solid-18k-beveled-cuban-chain',
];
export const BEST_SELLER_PRODUCT_SLUGS = [
  'aethelgard-automatic-stealth-chronograph',
  'imperial-royale-18k-gilded-automatic',
  'sovereign-chronograph-obsidian-noir',
  'elysium-matte-onyx-champagne-gold-bangle',
  'vanguard-matte-volcanic-lava-beads',
  'monarch-solid-18k-beveled-cuban-chain',
  'titan-sterling-9mm-heavy-cuban-chain',
  'the-chevalier-18k-gold-heirloom-signet',
];

export const STORY_IMAGES = [
  { uri: '/products/chains/Gold Cuban chain.jpg', accessibilityLabel: 'Gold Cuban craftsmanship' },
  { uri: '/products/bags/Black leather crossbody.jpg', accessibilityLabel: 'Calfskin leather detail' },
];
