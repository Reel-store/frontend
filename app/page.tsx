'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  ArrowRight, Store, ShoppingBag, MessageCircle,
  Instagram, Palette, Package, Zap, Star,
  CheckCircle, Smartphone, TrendingUp, ShoppingCart, Mail,
} from 'lucide-react';
import { CreatorGuideSection } from '@/components/creator-guide';
import Link from 'next/link';

export default function Home() {
  // Scroll-reveal: observe every .rs element and add .rs-visible when in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('rs-visible');
            observer.unobserve(entry.target); // fire once
          }
        });
      },
      { threshold: 0.12 },
    );
    document.querySelectorAll('.rs').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">

      {/* Navigation */}
      <nav className="bg-background/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              Reel Store
            </h1>         
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

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden max-w-full">
        {/* Moving gradient blobs */}
        <div
          className="landing-blob w-[480px] h-[480px] bg-pink-300/50 dark:bg-pink-600/20 top-[-80px] left-[-120px]"
          style={{ animationDelay: '0s' }}
        />
        <div
          className="landing-blob w-[360px] h-[360px] bg-purple-300/50 dark:bg-purple-600/20 top-[60px] right-[-80px]"
          style={{ animationDelay: '3s' }}
        />
        <div
          className="landing-blob w-[280px] h-[280px] bg-blue-200/50 dark:bg-blue-600/20 bottom-0 left-[35%]"
          style={{ animationDelay: '6s' }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-4 py-20 md:py-32 text-center space-y-8">
          {/* Badge */}
          <div className="landing-hero-zoom inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-1.5 rounded-full text-sm font-medium">
            <Instagram className="w-3.5 h-3.5" />
            Built for Instagram Creators in India
          </div>

          {/* Headline — zoom in + gradient text */}
          <div className="landing-hero-zoom space-y-4" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-5xl md:text-7xl font-bold text-foreground leading-tight tracking-tight">
              Turn your Reels
              <br />
              <span className="landing-gradient-text">into a Store</span>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Sell from your Instagram Reels. Your own storefront, your own theme, orders with email confirmation.
            </p>
          </div>

          {/* CTAs */}
          <div className="landing-hero-zoom flex flex-col sm:flex-row gap-4 justify-center pt-4" style={{ animationDelay: '0.2s' }}>
            <Link href="/early-access">
              <Button size="lg" className="gap-2 w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-500 text-white border-0 hover:opacity-90">
                <Star className="w-4 h-4" /> Get Early Access
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                Sign In <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <p className="landing-hero-zoom text-sm text-muted-foreground" style={{ animationDelay: '0.3s' }}>
            Free to set up · No commission · No hidden fees
          </p>
        </div>
      </section>

      {/* ── Storefront preview mockup ─────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 pb-24">
        <div className="rs rounded-3xl border border-border bg-secondary/40 p-6 md:p-10">
          <p className="text-xs uppercase tracking-widest text-muted-foreground text-center mb-6 font-medium">
            What your store looks like
          </p>
          <div className="max-w-sm mx-auto rounded-2xl border border-border bg-background overflow-hidden shadow-xl">
            <div className="bg-gradient-to-br from-rose-400 to-pink-600 h-28 flex items-end px-5 pb-4">
              <div className="flex items-end gap-3">
                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-xl font-bold text-pink-600 shadow-md">
                  PJ
                </div>
                <div className="text-white mb-1">
                  <p className="font-bold text-sm leading-tight">Priya Jewels</p>
                  <p className="text-xs opacity-80">@priyajewels</p>
                </div>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <p className="text-xs text-muted-foreground">Handcrafted silver jewellery 🤍 Ships across India</p>
              <div className="flex gap-2">
                <span className="text-xs bg-secondary px-2 py-1 rounded-full">🚚 Ships in 3 days</span>
                <span className="text-xs bg-secondary px-2 py-1 rounded-full">💳 UPI accepted</span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                {[
                  { name: 'Silver Hoops', price: '₹499' },
                  { name: 'Lotus Ring', price: '₹699' },
                  { name: 'Oxidised Set', price: '₹899' },
                  { name: 'Pearl Drops', price: '₹399' },
                ].map((item) => (
                  <div key={item.name} className="rounded-xl border border-border overflow-hidden">
                    <div className="aspect-square bg-gradient-to-br from-rose-50 to-pink-100 flex items-center justify-center text-2xl">
                      💍
                    </div>
                    <div className="p-2">
                      <p className="text-xs font-medium text-foreground truncate">{item.name}</p>
                      <p className="text-xs font-bold text-foreground">{item.price}</p>
                      <div className="mt-1.5 bg-foreground text-background text-center text-[10px] font-semibold py-1 rounded-lg">
                        Order
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Creator Quick Start Guide ─────────────────────────────────────── */}
      <div className="border-t border-border bg-secondary/40">
        <CreatorGuideSection />
      </div>

      {/* ── Core Features ────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 py-24 space-y-16">
        <div className="rs text-center space-y-3">
          <h3 className="text-3xl md:text-4xl font-bold text-foreground">Everything you need to sell</h3>
          <p className="text-muted-foreground max-w-xl mx-auto">
            From your store page to customer orders — we handle the setup, you handle the sales.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: <Store className="w-5 h-5" />,
              title: 'Your Own Storefront',
              desc: 'A dedicated page for your products. Share one link in your Instagram bio — customers see everything you sell.',
              delay: 'rs-d1',
            },
            {
              icon: <ShoppingBag className="w-5 h-5" />,
              title: 'List Any Product',
              desc: 'Jewellery, handmade, clothing, art, candles — add photos, prices, and descriptions. No technical skills needed.',
              delay: 'rs-d2',
            },
            {
              icon: <ShoppingCart className="w-5 h-5" />,
              title: 'Cart & Secure Checkout',
              desc: 'Customers add multiple items to cart, verify their email with a one-time code, and place the order in seconds.',
              delay: 'rs-d3',
            },
            {
              icon: <Palette className="w-5 h-5" />,
              title: 'Custom Themes',
              desc: 'Pick from 5 unique themes — Minimal, Bold, Soft, Neon, Earthy. Change accent colours, fonts, and product layout.',
              delay: 'rs-d1',
            },
            {
              icon: <Package className="w-5 h-5" />,
              title: 'Product Customization',
              desc: 'Add size options, colour variants, stock count, category tags. Your store looks as professional as any big brand.',
              delay: 'rs-d2',
            },
            {
              icon: <Zap className="w-5 h-5" />,
              title: 'Instant Setup',
              desc: 'DM us today, your store is live tonight. No waiting, no forms, no tech knowledge required.',
              delay: 'rs-d3',
            },
          ].map(({ icon, title, desc, delay }) => (
            <div
              key={title}
              className={`rs ${delay} p-6 rounded-2xl border border-border bg-background space-y-3 hover:shadow-md transition-shadow`}
            >
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-foreground">
                {icon}
              </div>
              <h4 className="font-bold text-foreground">{title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Theme showcase ────────────────────────────────────────────────── */}
      <section className="bg-secondary/40 border-y border-border py-24">
        <div className="max-w-6xl mx-auto px-4 space-y-12">
          <div className="rs text-center space-y-3">
            <h3 className="text-3xl md:text-4xl font-bold text-foreground">5 unique themes</h3>
            <p className="text-muted-foreground">Your store, your personality. Switch themes anytime with one click.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { name: 'Minimal', bg: 'bg-gray-50', dot: 'bg-gray-900', text: 'text-gray-900', border: 'border-gray-200', desc: 'Clean & elegant', delay: 'rs-d1' },
              { name: 'Bold', bg: 'bg-zinc-900', dot: 'bg-yellow-400', text: 'text-white', border: 'border-zinc-700', desc: 'Dark & powerful', delay: 'rs-d2' },
              { name: 'Soft', bg: 'bg-rose-50', dot: 'bg-rose-500', text: 'text-rose-900', border: 'border-rose-200', desc: 'Warm & feminine', delay: 'rs-d3' },
              { name: 'Neon', bg: 'bg-purple-950', dot: 'bg-green-400', text: 'text-white', border: 'border-purple-700', desc: 'Bold & electric', delay: 'rs-d4' },
              { name: 'Earthy', bg: 'bg-amber-50', dot: 'bg-amber-700', text: 'text-amber-900', border: 'border-amber-200', desc: 'Natural & warm', delay: 'rs-d5' },
            ].map(({ name, bg, dot, text, border, desc, delay }) => (
              <div key={name} className={`rs ${delay} rounded-2xl border-2 ${border} ${bg} p-4 text-center space-y-3`}>
                <div className={`w-8 h-8 rounded-full ${dot} mx-auto`} />
                <div>
                  <p className={`font-bold text-sm ${text}`}>{name}</p>
                  <p className={`text-xs opacity-60 ${text}`}>{desc}</p>
                </div>
                <div className="space-y-1">
                  <div className={`h-1.5 rounded-full ${dot} opacity-40`} />
                  <div className={`h-1.5 rounded-full ${dot} opacity-20 w-3/4 mx-auto`} />
                </div>
              </div>
            ))}
          </div>

          <div className="rs text-center">
            <p className="text-sm text-muted-foreground">
              Plus custom accent colours, font styles (Modern / Classic / Tech), grid or list product layout, and full custom CSS
            </p>
          </div>
        </div>
      </section>

      {/* ── Order flow ─────────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 py-24 space-y-12">
        <div className="rs text-center space-y-3">
          <h3 className="text-3xl md:text-4xl font-bold text-foreground">How ordering works</h3>
          <p className="text-muted-foreground">Simple for your customer. Transparent for you.</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {[
            {
              step: '1',
              icon: <Instagram className="w-5 h-5" />,
              title: 'Discovers your Reel',
              desc: 'Customer visits your profile and taps the Reel Store link in your bio.',
              delay: 'rs-d1',
            },
            {
              step: '2',
              icon: <ShoppingCart className="w-5 h-5" />,
              title: 'Shops & adds to Cart',
              desc: 'Browses your products, views photos and prices, then adds items to the cart.',
              delay: 'rs-d2',
            },
            {
              step: '3',
              icon: <Mail className="w-5 h-5" />,
              title: 'Verifies email & checks out',
              desc: 'Enters their email, receives a one-time code, verifies it, and places the order — all in one page.',
              delay: 'rs-d3',
            },
            {
              step: '4',
              icon: <CheckCircle className="w-5 h-5" />,
              title: 'Everyone gets notified',
              desc: 'Customer gets an order confirmation email. You get a new-order notification. Confirm & ship.',
              delay: 'rs-d4',
            },
          ].map(({ step, icon, title, desc, delay }) => (
            <div key={step} className={`rs ${delay} relative space-y-3`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-foreground text-background flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {step}
                </div>
                <div className="h-px flex-1 bg-border hidden md:block" />
              </div>
              <div className="text-muted-foreground">{icon}</div>
              <h4 className="font-bold text-foreground text-sm">{title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Who is it for ─────────────────────────────────────────────────── */}
      <section className="bg-secondary/40 border-y border-border py-24">
        <div className="max-w-5xl mx-auto px-4 space-y-12">
          <div className="rs text-center space-y-3">
            <h3 className="text-3xl md:text-4xl font-bold text-foreground">Built for creators like you</h3>
            <p className="text-muted-foreground">If you sell anything on Instagram, this is for you.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { emoji: '💍', label: 'Jewellery makers', delay: 'rs-d1' },
              { emoji: '🕯️', label: 'Candle & home decor', delay: 'rs-d2' },
              { emoji: '👗', label: 'Fashion & clothing', delay: 'rs-d3' },
              { emoji: '🎨', label: 'Artists & illustrators', delay: 'rs-d4' },
              { emoji: '🧶', label: 'Crochet & handmade', delay: 'rs-d1' },
              { emoji: '🌿', label: 'Skincare & beauty', delay: 'rs-d2' },
              { emoji: '📸', label: 'Photographers', delay: 'rs-d3' },
              { emoji: '🍫', label: 'Food & bakers', delay: 'rs-d4' },
            ].map(({ emoji, label, delay }) => (
              <div key={label} className={`rs ${delay} flex items-center gap-3 p-4 rounded-2xl border border-border bg-background`}>
                <span className="text-2xl">{emoji}</span>
                <span className="text-sm font-medium text-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why us ────────────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 py-24 space-y-12">
        <div className="rs text-center space-y-3">
          <h3 className="text-3xl md:text-4xl font-bold text-foreground">Why Reel Store</h3>
          <p className="text-muted-foreground">vs managing everything over Instagram DMs</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {[
            { icon: <TrendingUp className="w-4 h-4" />, title: 'No commission ever', desc: 'Keep 100% of every sale. We never take a cut.', delay: 'rs-d1' },
            { icon: <Smartphone className="w-4 h-4" />, title: 'Mobile-first design', desc: 'Your store looks perfect on every phone — exactly where your customers are.', delay: 'rs-d2' },
            { icon: <Palette className="w-4 h-4" />, title: 'Your brand, your look', desc: 'Custom themes, colours and fonts. Looks like your store, not ours.', delay: 'rs-d3' },
            { icon: <Star className="w-4 h-4" />, title: 'India-native checkout', desc: 'UPI, GPay, cash on delivery — you decide how you collect payment.', delay: 'rs-d4' },
            { icon: <Zap className="w-4 h-4" />, title: 'No "DM to order" chaos', desc: 'Stop repeating prices 50 times a day. Your store answers every question.', delay: 'rs-d1' },
            { icon: <CheckCircle className="w-4 h-4" />, title: 'Email order trail', desc: 'Every order sends an email confirmation — no more lost messages in DMs.', delay: 'rs-d2' },
          ].map(({ icon, title, desc, delay }) => (
            <div key={title} className={`rs ${delay} flex gap-4 p-5 rounded-2xl border border-border bg-background`}>
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-foreground flex-shrink-0">
                {icon}
              </div>
              <div>
                <h4 className="font-bold text-foreground text-sm">{title}</h4>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <div className="border-t border-border bg-foreground text-background">
        <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
          <h3 className="text-3xl md:text-4xl font-bold">Ready for your store?</h3>
          <p className="text-background/70 text-lg">
            DM us on Instagram. We set it up for you — free. Your store is live tonight.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/early-access">
              <Button size="lg" variant="secondary" className="gap-2 w-full sm:w-auto">
                <Star className="w-4 h-4" /> Get Early Access
              </Button>
            </Link>
            <a href="https://instagram.com/oriona.tech" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto border-background/30 text-background hover:bg-background/10">
                <Instagram className="w-4 h-4" /> DM us on Instagram
              </Button>
            </a>
          </div>
          <p className="text-sm text-background/50">Free to set up · No commission · No hidden fees</p>
        </div>
      </div>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
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

