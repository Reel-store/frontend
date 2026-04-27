export type ThemeName = 'studio' | 'noir' | 'blush' | 'terra' | 'ocean' | 'slate';

export interface ThemeConfig {
  accentColor?: string;
  backgroundColor?: string;
  fontStyle?: string;
  layout?: 'grid' | 'list';
  custom_css?: string;
  custom_html?: string;
  figma_embed_url?: string;
}

export interface ResolvedTheme {
  pageBg: string;
  heroBg: string;
  heroBorder: string;
  avatarRing: string;
  avatarGradient: string;
  nameColor: string;
  handleColor: string;
  descColor: string;
  noteBg: string;
  noteText: string;
  noteBorder: string;
  sectionColor: string;
  sectionDivider: string;
  cardBg: string;
  cardBorder: string;
  cardShadow: string;
  cardHover: string;
  productTitleColor: string;
  productPriceColor: string;
  productDescColor: string;
  btnBg: string;
  btnText: string;
  btnHover: string;
  btnBorder: string;
  outOfStockBg: string;
  outOfStockText: string;
  footerBg: string;
  footerBorder: string;
  footerText: string;
  footerBrand: string;
  linkBg: string;
  linkText: string;
  linkBorder: string;
  linkHover: string;
  linkIconColor: string;
  badgeBg: string;
  badgeText: string;
  fontClass: string;
  layout: 'grid' | 'list';
}

export const THEME_CATALOG: Record<
  ThemeName,
  { name: string; desc: string; preview: string; dot: string; text: string; accent: string }
> = {
  studio: {
    name: 'Studio',
    desc: 'Clean editorial white — fashion & lifestyle',
    preview: 'bg-white border-gray-200',
    dot: 'bg-gray-900',
    text: 'text-gray-900',
    accent: '#111111',
  },
  noir: {
    name: 'Noir',
    desc: 'Black & gold luxury — premium brands',
    preview: 'bg-black border-yellow-800',
    dot: 'bg-yellow-500',
    text: 'text-white',
    accent: '#D4AF37',
  },
  blush: {
    name: 'Blush',
    desc: 'Rose gold & cream — beauty & skincare',
    preview: 'bg-rose-50 border-rose-200',
    dot: 'bg-rose-400',
    text: 'text-rose-950',
    accent: '#E8747C',
  },
  terra: {
    name: 'Terra',
    desc: 'Warm sand & olive — organic & sustainable',
    preview: 'bg-stone-100 border-stone-300',
    dot: 'bg-stone-600',
    text: 'text-stone-900',
    accent: '#8B6F47',
  },
  ocean: {
    name: 'Ocean',
    desc: 'Deep navy & teal — coastal & lifestyle',
    preview: 'bg-slate-900 border-teal-700',
    dot: 'bg-teal-400',
    text: 'text-white',
    accent: '#2DD4BF',
  },
  slate: {
    name: 'Slate',
    desc: 'Cool grays & coral — modern & streetwear',
    preview: 'bg-slate-50 border-slate-200',
    dot: 'bg-orange-400',
    text: 'text-slate-900',
    accent: '#F97316',
  },
};

const FONT_CLASSES: Record<string, string> = {
  sans: 'font-sans',
  serif: 'font-serif',
  mono: 'font-mono',
};

export function resolveTheme(themeName: ThemeName, config: ThemeConfig = {}): ResolvedTheme {
  const layout = config.layout || 'grid';
  const fontClass = FONT_CLASSES[config.fontStyle || ''] || 'font-sans';

  const bases: Record<ThemeName, Omit<ResolvedTheme, 'fontClass' | 'layout'>> = {
    // ── Studio ── editorial, high-fashion white
    studio: {
      pageBg: 'bg-gray-50',
      heroBg: 'bg-white',
      heroBorder: 'border-gray-100',
      avatarRing: 'ring-2 ring-gray-200',
      avatarGradient: 'from-gray-700 to-gray-900',
      nameColor: 'text-gray-950',
      handleColor: 'text-gray-500',
      descColor: 'text-gray-500',
      noteBg: 'bg-gray-50',
      noteText: 'text-gray-600',
      noteBorder: 'border-gray-200',
      sectionColor: 'text-gray-950',
      sectionDivider: 'border-gray-100',
      cardBg: 'bg-white',
      cardBorder: 'border-gray-100',
      cardShadow: 'shadow-sm',
      cardHover: 'hover:shadow-md transition-shadow duration-300',
      productTitleColor: 'text-gray-900',
      productPriceColor: 'text-gray-900',
      productDescColor: 'text-gray-400',
      btnBg: 'bg-gray-950',
      btnText: 'text-white',
      btnHover: 'hover:bg-gray-800',
      btnBorder: 'border-transparent',
      outOfStockBg: 'bg-gray-950/60',
      outOfStockText: 'text-white',
      footerBg: 'bg-white',
      footerBorder: 'border-gray-100',
      footerText: 'text-gray-300',
      footerBrand: 'text-gray-500',
      linkBg: 'bg-white',
      linkText: 'text-gray-800',
      linkBorder: 'border-gray-200',
      linkHover: 'hover:bg-gray-50 hover:border-gray-400',
      linkIconColor: 'text-gray-400',
      badgeBg: 'bg-gray-100',
      badgeText: 'text-gray-600',
    },

    // ── Noir ── black & gold, ultra luxury
    noir: {
      pageBg: 'bg-zinc-950',
      heroBg: 'bg-black',
      heroBorder: 'border-zinc-800',
      avatarRing: 'ring-2 ring-yellow-600/40',
      avatarGradient: 'from-yellow-500 to-amber-600',
      nameColor: 'text-white',
      handleColor: 'text-yellow-500/80',
      descColor: 'text-zinc-400',
      noteBg: 'bg-zinc-900',
      noteText: 'text-zinc-300',
      noteBorder: 'border-zinc-800',
      sectionColor: 'text-white',
      sectionDivider: 'border-zinc-800',
      cardBg: 'bg-zinc-900',
      cardBorder: 'border-zinc-800',
      cardShadow: 'shadow-lg',
      cardHover: 'hover:border-yellow-600/40 transition-colors duration-300',
      productTitleColor: 'text-white',
      productPriceColor: 'text-yellow-500',
      productDescColor: 'text-zinc-500',
      btnBg: 'bg-yellow-500',
      btnText: 'text-black',
      btnHover: 'hover:bg-yellow-400',
      btnBorder: 'border-transparent',
      outOfStockBg: 'bg-black/70',
      outOfStockText: 'text-yellow-500',
      footerBg: 'bg-black',
      footerBorder: 'border-zinc-800',
      footerText: 'text-zinc-600',
      footerBrand: 'text-zinc-400',
      linkBg: 'bg-zinc-900',
      linkText: 'text-white',
      linkBorder: 'border-zinc-800',
      linkHover: 'hover:border-yellow-600/50 hover:bg-zinc-800',
      linkIconColor: 'text-yellow-500',
      badgeBg: 'bg-zinc-800',
      badgeText: 'text-zinc-300',
    },

    // ── Blush ── rose gold & cream, beauty / skincare
    blush: {
      pageBg: 'bg-rose-50',
      heroBg: 'bg-white',
      heroBorder: 'border-rose-100',
      avatarRing: 'ring-2 ring-rose-200',
      avatarGradient: 'from-rose-300 to-pink-500',
      nameColor: 'text-rose-950',
      handleColor: 'text-rose-400',
      descColor: 'text-rose-700/70',
      noteBg: 'bg-rose-50',
      noteText: 'text-rose-600',
      noteBorder: 'border-rose-200',
      sectionColor: 'text-rose-950',
      sectionDivider: 'border-rose-100',
      cardBg: 'bg-white',
      cardBorder: 'border-rose-100',
      cardShadow: 'shadow-sm',
      cardHover: 'hover:shadow-md transition-shadow duration-300',
      productTitleColor: 'text-rose-950',
      productPriceColor: 'text-rose-600',
      productDescColor: 'text-rose-400',
      btnBg: 'bg-rose-500',
      btnText: 'text-white',
      btnHover: 'hover:bg-rose-400',
      btnBorder: 'border-transparent',
      outOfStockBg: 'bg-rose-950/50',
      outOfStockText: 'text-rose-100',
      footerBg: 'bg-white',
      footerBorder: 'border-rose-100',
      footerText: 'text-rose-200',
      footerBrand: 'text-rose-400',
      linkBg: 'bg-white',
      linkText: 'text-rose-800',
      linkBorder: 'border-rose-200',
      linkHover: 'hover:bg-rose-50 hover:border-rose-300',
      linkIconColor: 'text-rose-400',
      badgeBg: 'bg-rose-100',
      badgeText: 'text-rose-600',
    },

    // ── Terra ── warm sand & olive, organic / sustainable
    terra: {
      pageBg: 'bg-stone-100',
      heroBg: 'bg-amber-50',
      heroBorder: 'border-stone-200',
      avatarRing: 'ring-2 ring-stone-300',
      avatarGradient: 'from-amber-700 to-stone-600',
      nameColor: 'text-stone-900',
      handleColor: 'text-stone-500',
      descColor: 'text-stone-500',
      noteBg: 'bg-amber-50',
      noteText: 'text-stone-600',
      noteBorder: 'border-stone-200',
      sectionColor: 'text-stone-900',
      sectionDivider: 'border-stone-200',
      cardBg: 'bg-white',
      cardBorder: 'border-stone-200',
      cardShadow: 'shadow-sm',
      cardHover: 'hover:shadow-md transition-shadow duration-300',
      productTitleColor: 'text-stone-900',
      productPriceColor: 'text-stone-700',
      productDescColor: 'text-stone-400',
      btnBg: 'bg-stone-800',
      btnText: 'text-amber-50',
      btnHover: 'hover:bg-stone-700',
      btnBorder: 'border-transparent',
      outOfStockBg: 'bg-stone-900/60',
      outOfStockText: 'text-stone-100',
      footerBg: 'bg-amber-50',
      footerBorder: 'border-stone-200',
      footerText: 'text-stone-300',
      footerBrand: 'text-stone-500',
      linkBg: 'bg-white',
      linkText: 'text-stone-800',
      linkBorder: 'border-stone-200',
      linkHover: 'hover:bg-stone-50 hover:border-stone-400',
      linkIconColor: 'text-stone-400',
      badgeBg: 'bg-stone-100',
      badgeText: 'text-stone-600',
    },

    // ── Ocean ── deep navy & teal, coastal / lifestyle
    ocean: {
      pageBg: 'bg-slate-900',
      heroBg: 'bg-slate-950',
      heroBorder: 'border-slate-800',
      avatarRing: 'ring-2 ring-teal-500/30',
      avatarGradient: 'from-teal-400 to-cyan-500',
      nameColor: 'text-white',
      handleColor: 'text-teal-400',
      descColor: 'text-slate-400',
      noteBg: 'bg-slate-800',
      noteText: 'text-slate-300',
      noteBorder: 'border-slate-700',
      sectionColor: 'text-white',
      sectionDivider: 'border-slate-800',
      cardBg: 'bg-slate-800',
      cardBorder: 'border-slate-700',
      cardShadow: 'shadow-lg',
      cardHover: 'hover:border-teal-500/40 transition-colors duration-300',
      productTitleColor: 'text-white',
      productPriceColor: 'text-teal-400',
      productDescColor: 'text-slate-500',
      btnBg: 'bg-teal-500',
      btnText: 'text-slate-950',
      btnHover: 'hover:bg-teal-400',
      btnBorder: 'border-transparent',
      outOfStockBg: 'bg-slate-950/70',
      outOfStockText: 'text-teal-400',
      footerBg: 'bg-slate-950',
      footerBorder: 'border-slate-800',
      footerText: 'text-slate-600',
      footerBrand: 'text-slate-400',
      linkBg: 'bg-slate-800',
      linkText: 'text-white',
      linkBorder: 'border-slate-700',
      linkHover: 'hover:border-teal-500/50 hover:bg-slate-700',
      linkIconColor: 'text-teal-400',
      badgeBg: 'bg-slate-700',
      badgeText: 'text-slate-300',
    },

    // ── Slate ── cool gray & coral, modern / streetwear
    slate: {
      pageBg: 'bg-slate-50',
      heroBg: 'bg-white',
      heroBorder: 'border-slate-100',
      avatarRing: 'ring-2 ring-orange-200',
      avatarGradient: 'from-orange-400 to-rose-500',
      nameColor: 'text-slate-900',
      handleColor: 'text-orange-500',
      descColor: 'text-slate-500',
      noteBg: 'bg-slate-50',
      noteText: 'text-slate-600',
      noteBorder: 'border-slate-200',
      sectionColor: 'text-slate-900',
      sectionDivider: 'border-slate-100',
      cardBg: 'bg-white',
      cardBorder: 'border-slate-100',
      cardShadow: 'shadow-sm',
      cardHover: 'hover:shadow-md transition-shadow duration-300',
      productTitleColor: 'text-slate-900',
      productPriceColor: 'text-orange-500',
      productDescColor: 'text-slate-400',
      btnBg: 'bg-orange-500',
      btnText: 'text-white',
      btnHover: 'hover:bg-orange-400',
      btnBorder: 'border-transparent',
      outOfStockBg: 'bg-slate-900/60',
      outOfStockText: 'text-white',
      footerBg: 'bg-white',
      footerBorder: 'border-slate-100',
      footerText: 'text-slate-300',
      footerBrand: 'text-slate-500',
      linkBg: 'bg-white',
      linkText: 'text-slate-800',
      linkBorder: 'border-slate-200',
      linkHover: 'hover:bg-slate-50 hover:border-orange-300',
      linkIconColor: 'text-orange-400',
      badgeBg: 'bg-slate-100',
      badgeText: 'text-slate-600',
    },
  };

  return { ...bases[themeName] ?? bases.studio, fontClass, layout };
}