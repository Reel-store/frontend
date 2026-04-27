'use client';

import { useCartStore } from '@/lib/store';
import { useParams, useRouter } from 'next/navigation';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const params = useParams();
  const handle = params.handle as string;
  const router = useRouter();

  const items = useCartStore((s) => s.items);
  const cartHandle = useCartStore((s) => s.handle);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQty = useCartStore((s) => s.updateQty);

  const total = items.reduce((sum, i) => sum + Number(i.product.price) * i.quantity, 0);

  // Cart is for a different storefront
  if (cartHandle && cartHandle !== handle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-5">
        <div className="text-center">
          <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">Your cart is from a different store.</p>
          <Link href={`/s/${handle}`} className="text-sm text-blue-500">← Back to store</Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-5">
        <div className="text-center">
          <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600 font-medium mb-1">Your cart is empty</p>
          <p className="text-gray-400 text-sm mb-4">Add products from the store to get started.</p>
          <Link href={`/s/${handle}`} className="text-sm text-blue-500">← Browse products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-5 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link href={`/s/${handle}`} className="text-gray-400 hover:text-gray-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Your Cart</h1>
          <span className="text-sm text-gray-400">({items.length} {items.length === 1 ? 'item' : 'items'})</span>
        </div>

        {/* Items */}
        <div className="space-y-3 mb-6">
          {items.map((item) => {
            const img = item.product.images?.[0];
            return (
              <div key={item.product.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4">
                {/* Image */}
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                  {img ? (
                    <img src={img.url} alt={item.product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag className="w-6 h-6 text-gray-300" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-900 leading-tight">{item.product.name}</p>
                  <p className="text-sm text-gray-500 mt-0.5">₹{Number(item.product.price).toLocaleString('en-IN')} each</p>

                  {/* Qty controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQty(item.product.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item.product.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Subtotal + Remove */}
                <div className="flex flex-col items-end justify-between flex-shrink-0">
                  <button onClick={() => removeItem(item.product.id)} className="text-gray-300 hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <p className="font-bold text-sm text-gray-900">
                    ₹{(Number(item.product.price) * item.quantity).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Total */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-bold text-gray-900 text-lg">₹{total.toLocaleString('en-IN')}</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">Final price confirmed by the store owner after contact.</p>
        </div>

        {/* Checkout button */}
        <button
          onClick={() => router.push(`/s/${handle}/checkout`)}
          className="w-full bg-gray-900 text-white py-4 rounded-2xl font-semibold text-base hover:bg-gray-700 transition-colors"
        >
          Proceed to Checkout →
        </button>
      </div>
    </div>
  );
}
