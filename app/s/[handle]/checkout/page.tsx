'use client';

import { useCartStore } from '@/lib/store';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingBag, Loader2, CheckCircle2, Mail } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export default function CheckoutPage() {
  const params = useParams();
  const handle = params.handle as string;
  const router = useRouter();

  const items = useCartStore((s) => s.items);
  const cartHandle = useCartStore((s) => s.handle);
  const clearCart = useCartStore((s) => s.clearCart);

  const [form, setForm] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    customer_notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // OTP state
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);

  const total = items.reduce((sum, i) => sum + Number(i.product.price) * i.quantity, 0);

  // Reset OTP state when email changes
  useEffect(() => {
    setOtpSent(false);
    setOtpValue('');
    setOtpError('');
  }, [form.customer_email]);

  // Countdown timer
  useEffect(() => {
    if (otpTimer <= 0) return;
    const t = setTimeout(() => setOtpTimer((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [otpTimer]);

  const emailTrimmed = form.customer_email.trim();
  const emailProvided = emailTrimmed.length > 0;
  // OTP considered ready when 6 digits entered
  const otpReady = otpValue.length === 6;
  // Can submit: either no email, or email + 6-digit OTP entered
  const canSubmit = !loading && (!emailProvided || (otpSent && otpReady));

  const handleSendOtp = async () => {
    setOtpLoading(true);
    setOtpError('');
    try {
      await axios.post(`${API_BASE}/customer_otp/request`, { email: emailTrimmed });
      setOtpSent(true);
      setOtpValue('');
      setOtpTimer(60);
    } catch (err: any) {
      setOtpError(err?.response?.data?.error || 'Failed to send code. Try again.');
    }
    setOtpLoading(false);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.customer_name.trim()) errs.customer_name = 'Name is required';
    if (!emailProvided && !form.customer_phone.trim())
      errs.customer_contact = 'Email or phone number is required';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    setSubmitError('');
    try {
      const payload: Record<string, any> = {
        customer_name:  form.customer_name.trim(),
        customer_phone: form.customer_phone.trim() || undefined,
        customer_notes: form.customer_notes.trim() || undefined,
        items: items.map((i) => ({ product_id: i.product.id, quantity: i.quantity })),
      };
      if (emailProvided) {
        payload.customer_email = emailTrimmed;
        payload.email_otp      = otpValue;
      }
      const res = await axios.post(`${API_BASE}/s/${handle}/orders`, payload);
      clearCart();
      router.push(`/s/${handle}/order/${res.data.id}`);
    } catch (err: any) {
      const msg = err?.response?.data?.error;
      setSubmitError(Array.isArray(msg) ? msg.join(', ') : (msg || 'Something went wrong. Please try again.'));
    }
    setLoading(false);
  };

  if (cartHandle !== handle || items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-5">
        <div className="text-center">
          <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">Your cart is empty.</p>
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
          <Link href={`/s/${handle}/cart`} className="text-gray-400 hover:text-gray-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Checkout</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Contact Info */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
            <h2 className="font-semibold text-gray-900">Your Details</h2>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.customer_name}
                onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                placeholder="Your name"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-400 transition-colors"
              />
              {errors.customer_name && <p className="text-xs text-red-500 mt-1">{errors.customer_name}</p>}
            </div>

            {/* Email with OTP verification */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={form.customer_email}
                  onChange={(e) => setForm({ ...form, customer_email: e.target.value })}
                  placeholder="you@example.com"
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-400 transition-colors"
                />
                {emailProvided && !otpSent && (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={otpLoading}
                    className="flex-shrink-0 bg-gray-900 text-white text-sm px-4 rounded-xl font-medium hover:bg-gray-700 transition-colors disabled:opacity-60 flex items-center gap-1.5"
                  >
                    {otpLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Mail className="w-3.5 h-3.5" />}
                    Verify
                  </button>
                )}
                {emailProvided && otpSent && (
                  <div className="flex-shrink-0 flex items-center">
                    {otpReady
                      ? <CheckCircle2 className="w-5 h-5 text-green-500" />
                      : <span className="text-xs text-orange-500 font-medium whitespace-nowrap">Enter code</span>
                    }
                  </div>
                )}
              </div>

              {/* OTP input row */}
              {emailProvided && otpSent && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={otpValue}
                      onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ''))}
                      placeholder="6-digit code"
                      className="w-36 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-center tracking-widest outline-none focus:border-gray-400 transition-colors font-mono"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={otpTimer > 0 || otpLoading}
                      className="text-xs text-blue-500 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      {otpTimer > 0 ? `Resend in ${otpTimer}s` : 'Resend code'}
                    </button>
                  </div>
                  {otpError && <p className="text-xs text-red-500">{otpError}</p>}
                  <p className="text-xs text-gray-400">Check your inbox for the 6-digit verification code.</p>
                </div>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={form.customer_phone}
                onChange={(e) => setForm({ ...form, customer_phone: e.target.value })}
                placeholder="+91 99999 99999"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-400 transition-colors"
              />
            </div>

            {errors.customer_contact && (
              <p className="text-xs text-red-500 -mt-2">{errors.customer_contact}</p>
            )}

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
              <textarea
                value={form.customer_notes}
                onChange={(e) => setForm({ ...form, customer_notes: e.target.value })}
                placeholder="Any special requests, delivery address, etc."
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-400 transition-colors resize-none"
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="font-semibold text-gray-900 mb-3">Order Summary</h2>
            <div className="space-y-2 mb-3">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.product.name} × {item.quantity}</span>
                  <span className="font-medium text-gray-900">
                    ₹{(Number(item.product.price) * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t pt-3 flex justify-between">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="font-bold text-gray-900">₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* How it works */}
          <div className="bg-blue-50 rounded-2xl p-4 text-xs text-blue-700 space-y-1">
            <p className="font-semibold mb-1">How ordering works:</p>
            <p>1. Place your order here</p>
            <p>2. The store owner will contact you on phone/email</p>
            <p>3. Confirm details and make payment with the owner</p>
            <p>4. Order gets fulfilled after payment</p>
          </div>

          {/* Hint when email not verified */}
          {emailProvided && !otpSent && (
            <p className="text-xs text-amber-600 bg-amber-50 rounded-xl px-4 py-3">
              Click <strong>Verify</strong> next to your email to receive a confirmation code before placing the order.
            </p>
          )}

          {submitError && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">{submitError}</div>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full bg-gray-900 text-white py-4 rounded-2xl font-semibold text-base hover:bg-gray-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? 'Placing Order…' : 'Place Order'}
          </button>
        </form>
      </div>
    </div>
  );
}
