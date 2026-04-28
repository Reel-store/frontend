'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Instagram, ArrowRight, CheckCircle, Store, Zap, TrendingUp, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { earlyAccess } from '@/lib/api';

export default function EarlyAccessPage() {
  const [form, setForm] = useState({ name: '', email: '', instagram_handle: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');
    try {
      await earlyAccess.signup({
        name: form.name.trim(),
        email: form.email.trim(),
        instagram_handle: form.instagram_handle.trim().replace(/^@/, '') || undefined,
        message: form.message.trim() || undefined,
      });
      setStatus('success');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string | string[] } } })?.response?.data?.error;
      setErrorMsg(Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Something went wrong. Please try again.'));
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">

      {/* Nav */}
      <nav className="bg-background/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent cursor-pointer">
              Reel Store
            </h1>
          </Link>
          <div className="flex items-center gap-3">
            <a href="https://instagram.com/oriona.tech" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="sm" className="gap-2">
                <Instagram className="w-4 h-4" /> Follow
              </Button>
            </a>
            <Link href="/login">
              <Button size="sm">Sign In</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-[500px] h-[500px] rounded-full bg-purple-300/30 dark:bg-purple-600/10 -top-24 -left-32 blur-3xl" />
          <div className="absolute w-[400px] h-[400px] rounded-full bg-pink-300/30 dark:bg-pink-600/10 top-10 -right-20 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto px-4 pt-20 pb-12 text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-1.5 rounded-full text-sm font-medium">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            Limited early access — join the waitlist
          </div>

          <h2 className="text-4xl md:text-6xl font-bold text-foreground leading-tight tracking-tight">
            Be the first to get
            <br />
            <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              your Reel Store
            </span>
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto">
            We're inviting Instagram creators to set up their storefront for free.
            Drop your details and we'll reach out personally to get you live.
          </p>
        </div>
      </section>

      {/* Form + perks */}
      <section className="max-w-5xl mx-auto px-4 pb-24 grid md:grid-cols-2 gap-12 items-start">

        {/* Form */}
        <div className="bg-background border border-border rounded-2xl p-8 shadow-sm">
          {status === 'success' ? (
            <div className="text-center space-y-4 py-8">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">You're on the list! 🎉</h3>
              <p className="text-muted-foreground leading-relaxed">
                We've sent a confirmation to <strong>{form.email}</strong>.
                We'll reach out soon to get your store set up.
              </p>
              <a href="https://instagram.com/oriona.tech" target="_blank" rel="noopener noreferrer">
                <Button className="gap-2 mt-2">
                  <Instagram className="w-4 h-4" /> Follow us for updates
                </Button>
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Your name *</label>
                <Input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Priya Sharma"
                  required
                  disabled={status === 'loading'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Email address *</label>
                <Input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  disabled={status === 'loading'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Instagram handle
                  <span className="text-muted-foreground font-normal ml-1">(optional)</span>
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-secondary text-muted-foreground text-sm">
                    @
                  </span>
                  <Input
                    name="instagram_handle"
                    value={form.instagram_handle}
                    onChange={handleChange}
                    placeholder="yourhandle"
                    className="rounded-l-none"
                    disabled={status === 'loading'}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  What do you sell?
                  <span className="text-muted-foreground font-normal ml-1">(optional)</span>
                </label>
                <Textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Handmade jewellery, candles, clothing…"
                  rows={3}
                  disabled={status === 'loading'}
                />
              </div>

              {status === 'error' && (
                <p className="text-sm text-destructive">{errorMsg}</p>
              )}

              <Button type="submit" className="w-full gap-2" disabled={status === 'loading'}>
                {status === 'loading' ? 'Joining…' : <>Join the waitlist <ArrowRight className="w-4 h-4" /></>}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Free to set up · No commission · No hidden fees
              </p>
            </form>
          )}
        </div>

        {/* Perks */}
        <div className="space-y-6 pt-4">
          <h3 className="text-xl font-bold text-foreground">What you get with early access</h3>

          {[
            {
              icon: <Store className="w-5 h-5" />,
              title: 'Free store setup',
              desc: "We personally set up your storefront. You don't write a single line of code.",
            },
            {
              icon: <Zap className="w-5 h-5" />,
              title: 'Live within 24 hours',
              desc: 'DM us today, your store is live tonight. Share one link and start selling.',
            },
            {
              icon: <TrendingUp className="w-5 h-5" />,
              title: '0% commission forever',
              desc: "We never take a cut from your sales. Keep every rupee you earn.",
            },
            {
              icon: <Instagram className="w-5 h-5" />,
              title: 'Built for Instagram creators',
              desc: 'Your store link goes in your bio. Every Reel, every post, drives customers there.',
            },
            {
              icon: <CheckCircle className="w-5 h-5" />,
              title: 'Priority support',
              desc: 'Early access members get direct Slack/WhatsApp support from our team.',
            },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-foreground flex-shrink-0">
                {icon}
              </div>
              <div>
                <h4 className="font-semibold text-foreground text-sm">{title}</h4>
                <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}

          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="text-foreground font-medium hover:underline">
                Sign in →
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Social proof strip */}
      <div className="border-t border-border bg-secondary/40 py-10">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Perfect for</p>
          <div className="flex flex-wrap justify-center gap-3">
            {['💍 Jewellery', '🕯️ Candles', '👗 Fashion', '🎨 Art', '🧶 Handmade', '🌿 Skincare', '🍫 Food & bakes', '📸 Photography'].map((label) => (
              <span key={label} className="px-4 py-2 rounded-full border border-border bg-background text-sm font-medium text-foreground">
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-background border-t border-border">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p className="font-semibold text-foreground">Reel Store</p>
          <p>© 2026 Reel Store by Oriona Tech. All rights reserved.</p>
          <a href="https://instagram.com/oriona.tech" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-foreground transition-colors">
            <Instagram className="w-4 h-4" /> @orionatech
          </a>
        </div>
      </footer>

    </div>
  );
}
