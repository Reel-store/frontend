'use client';

import { ShoppingCart, Plus, Check, Minus } from 'lucide-react';
import { useState } from 'react';
import { useCartStore } from '@/lib/store';
import type { Product } from '@/lib/types';
import Link from 'next/link';

// ── Add to Cart button for product cards ──────────────────────────────────────
export function AddToCartButton({
  product,
  handle,
  accentStyle,
  btnBg,
  btnText,
  fullWidth = false,
}: {
  product: Product;
  handle: string;
  accentStyle?: React.CSSProperties;
  btnBg: string;
  btnText: string;
  fullWidth?: boolean;
}) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, handle);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  if (product.status === 'out_of_stock') return null;

  return (
    <button
      onClick={handleClick}
      className={`flex items-center justify-center gap-1.5 font-semibold transition-all rounded-xl ${btnBg} ${btnText} ${
        fullWidth
          ? 'w-full py-3 px-4 text-sm'
          : 'text-xs px-3 py-1.5 rounded-lg gap-1'
      }`}
      style={accentStyle}
      title="Add to cart"
    >
      {added ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
      {added ? 'Added to cart' : 'Add to cart'}
    </button>
  );
}

// ── Product detail CTA: Add to cart OR +/- qty controls ─────────────────────
export function ProductDetailCTA({
  product,
  handle,
  accentStyle,
  btnBg,
  btnText,
}: {
  product: Product;
  handle: string;
  accentStyle?: React.CSSProperties;
  btnBg: string;
  btnText: string;
}) {
  const addItem  = useCartStore((s) => s.addItem);
  const updateQty = useCartStore((s) => s.updateQty);
  const items    = useCartStore((s) => s.items);

  const cartItem = items.find((i) => i.product.id === product.id);
  const qty = cartItem?.quantity ?? 0;

  if (product.status === 'out_of_stock') return null;

  if (qty > 0) {
    return (
      <div className="flex items-center gap-3 w-full">
        <button
          onClick={() => updateQty(product.id, qty - 1)}
          className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg transition-all ${btnBg} ${btnText}`}
          style={accentStyle}
          aria-label="Remove one"
        >
          <Minus className="w-5 h-5" />
        </button>
        <span className="flex-1 text-center font-semibold text-base">
          {qty} in cart
        </span>
        <button
          onClick={() => addItem(product, handle)}
          className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg transition-all ${btnBg} ${btnText}`}
          style={accentStyle}
          aria-label="Add one more"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => addItem(product, handle)}
      className={`w-full py-3 px-4 text-sm flex items-center justify-center gap-1.5 font-semibold transition-all rounded-xl ${btnBg} ${btnText}`}
      style={accentStyle}
    >
      <Plus className="w-4 h-4" />
      Add to cart
    </button>
  );
}

// ── Floating cart FAB ─────────────────────────────────────────────────────────
export function CartFab({ handle }: { handle: string }) {
  const items = useCartStore((s) => s.items);
  const cartHandle = useCartStore((s) => s.handle);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  // Only show if cart has items for THIS storefront
  if (!count || cartHandle !== handle) return null;

  return (
    <Link
      href={`/s/${handle}/cart`}
      className="cart-fab fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-gray-900 text-white px-4 py-3 rounded-full shadow-2xl hover:bg-gray-700 transition-all"
    >
      <ShoppingCart className="w-5 h-5" />
      <span className="font-semibold text-sm">Cart</span>
      <span className="bg-white text-gray-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
        {count}
      </span>
    </Link>
  );
}
