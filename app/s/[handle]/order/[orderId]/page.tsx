import { CheckCircle2, Clock, Phone, Mail, ShoppingBag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { Order } from '@/lib/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

const STATUS_LABELS: Record<string, { label: string; color: string; desc: string }> = {
  pending:          { label: 'Order Placed',        color: 'bg-yellow-100 text-yellow-800', desc: 'Your order was received. The store owner will contact you soon.' },
  contacted:        { label: 'Contacted',            color: 'bg-blue-100 text-blue-800',    desc: 'The store owner has been in touch with you.' },
  awaiting_payment: { label: 'Awaiting Payment',    color: 'bg-orange-100 text-orange-800', desc: 'Please complete payment with the store owner.' },
  paid:             { label: 'Payment Received',    color: 'bg-green-100 text-green-800',   desc: 'Payment confirmed. Your order is being prepared.' },
  fulfilled:        { label: 'Fulfilled',            color: 'bg-green-100 text-green-800',   desc: 'Your order has been fulfilled. Thank you!' },
  cancelled:        { label: 'Cancelled',            color: 'bg-red-100 text-red-800',       desc: 'This order has been cancelled.' },
};

async function getOrder(orderId: string): Promise<Order | null> {
  try {
    const res = await fetch(`${API_BASE}/orders/${orderId}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ handle: string; orderId: string }>;
}) {
  const { handle, orderId } = await params;
  const order = await getOrder(orderId);

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-5">
        <div className="text-center">
          <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">Order not found.</p>
          <Link href={`/s/${handle}`} className="text-sm text-blue-500">← Back to store</Link>
        </div>
      </div>
    );
  }

  const status = STATUS_LABELS[order.status] || STATUS_LABELS.pending;
  const isFulfilled = order.status === 'fulfilled';
  const isCancelled = order.status === 'cancelled';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-5 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link href={`/s/${handle}`} className="text-gray-400 hover:text-gray-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Order Status</h1>
        </div>

        {/* Status card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4 text-center">
          {isFulfilled ? (
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
          ) : isCancelled ? (
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
              <span className="text-red-500 text-xl font-bold">✕</span>
            </div>
          ) : (
            <Clock className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
          )}
          <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3 ${status.color}`}>
            {status.label}
          </span>
          <p className="text-gray-500 text-sm">{status.desc}</p>
          {order.creator_note && (
            <div className="mt-4 bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-600 text-left">
              <span className="font-semibold text-gray-700">Note from store: </span>
              {order.creator_note}
            </div>
          )}
        </div>

        {/* Store contact */}
        {order.storefront && (order.storefront.contact_phone || order.storefront.contact_email) && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
            <h2 className="font-semibold text-gray-900 mb-3">Store Contact</h2>
            <p className="text-sm text-gray-500 mb-3">{order.storefront.name}</p>
            <div className="space-y-2">
              {order.storefront.contact_phone && (
                <a
                  href={`tel:${order.storefront.contact_phone}`}
                  className="flex items-center gap-3 text-sm text-gray-700 hover:text-blue-600"
                >
                  <Phone className="w-4 h-4 text-gray-400" />
                  {order.storefront.contact_phone}
                </a>
              )}
              {order.storefront.contact_email && (
                <a
                  href={`mailto:${order.storefront.contact_email}`}
                  className="flex items-center gap-3 text-sm text-gray-700 hover:text-blue-600"
                >
                  <Mail className="w-4 h-4 text-gray-400" />
                  {order.storefront.contact_email}
                </a>
              )}
            </div>
          </div>
        )}

        {/* Order details */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
          <h2 className="font-semibold text-gray-900 mb-3">Order Details</h2>
          <div className="text-xs text-gray-400 font-mono mb-4">ID: {order.id}</div>
          <div className="space-y-2 mb-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-600">{item.product_name} × {item.quantity}</span>
                <span className="font-medium text-gray-900">
                  ₹{(Number(item.subtotal)).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t pt-3 flex justify-between">
            <span className="font-semibold text-gray-900">Total</span>
            <span className="font-bold text-gray-900">₹{Number(order.total_amount).toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Your details */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
          <h2 className="font-semibold text-gray-900 mb-3">Your Details</h2>
          <div className="space-y-1 text-sm text-gray-600">
            <p><span className="font-medium text-gray-700">Name:</span> {order.customer_name}</p>
            {order.customer_email && <p><span className="font-medium text-gray-700">Email:</span> {order.customer_email}</p>}
            {order.customer_phone && <p><span className="font-medium text-gray-700">Phone:</span> {order.customer_phone}</p>}
            {order.customer_notes && <p><span className="font-medium text-gray-700">Notes:</span> {order.customer_notes}</p>}
          </div>
        </div>

        <p className="text-xs text-gray-400 text-center">
          Bookmark this page to check your order status anytime.
        </p>

        <Link
          href={`/s/${handle}`}
          className="mt-4 block w-full text-center text-sm text-gray-500 hover:text-gray-700"
        >
          ← Continue Shopping
        </Link>
      </div>
    </div>
  );
}
