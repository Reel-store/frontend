'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  UserCircle, Package, Palette, Share2, ShoppingBag,
  ChevronDown, ChevronUp, CheckCircle2, ArrowRight, RefreshCw,
} from 'lucide-react';
import Link from 'next/link';

const STEPS = [
  {
    number: '1',
    icon: <UserCircle className="w-5 h-5" />,
    title: 'Complete your store profile',
    desc: 'Add your store description, Instagram username, contact email, shipping note, and UPI payment info. This is what customers see when they visit your store.',
    action: { label: 'Edit Profile', href: '/creator' },
    tip: 'A good description and clear payment/shipping notes build buyer trust.',
  },
  {
    number: '2',
    icon: <Package className="w-5 h-5" />,
    title: 'Add your products',
    desc: 'Upload product photos, set prices (in ₹), write descriptions, and mark availability. Each product gets its own "Order" button on your storefront.',
    action: { label: 'Add Products', href: '/creator/products' },
    tip: 'Good photos sell. Use bright, clear images from multiple angles.',
  },
  {
    number: '3',
    icon: <Palette className="w-5 h-5" />,
    title: 'Customise your storefront',
    desc: 'Pick a theme (Minimal, Bold, Soft, Neon, or Earthy), choose an accent colour, font style, and whether products appear in a grid or list layout.',
    action: { label: 'Customise Theme', href: '/creator/storefront' },
    tip: 'Your theme should match your brand. You can switch themes anytime.',
  },
  {
    number: '4',
    icon: <Share2 className="w-5 h-5" />,
    title: 'Share your store link',
    desc: 'Copy the unique link from your dashboard and paste it in your Instagram bio. Mention it in Reels captions like "Link in bio to order!"',
    action: { label: 'Get My Link', href: '/creator' },
    tip: 'The link looks like: reelstore.in/s/yourhandle — easy to remember.',
  },
  {
    number: '5',
    icon: <ShoppingBag className="w-5 h-5" />,
    title: 'Receive & contact the customer',
    desc: 'When a customer places an order you get an email notification. Open the Orders page, review the order details, then reach out to confirm via DM, phone, or email. Once you have spoken to them, mark the order as Contacted.',
    action: { label: 'View Orders', href: '/creator/orders' },
    tip: 'Reply quickly — buyers expect to hear from you within a few hours of ordering.',
  },
  {
    number: '6',
    icon: <RefreshCw className="w-5 h-5" />,
    title: 'Update order status — customer gets notified by email',
    desc: 'After every interaction, move the order through these stages in the Orders page. The customer receives an automatic email each time the status changes so they always know where their order stands. You can also cancel an order directly from any stage at any time.',
    action: { label: 'Manage Orders', href: '/creator/orders' },
    tip: 'Each status change emails the customer automatically — keep it updated so buyers are never left wondering.',
    statusFlow: [
      { status: 'Pending',          color: 'bg-gray-200 dark:bg-gray-700',    note: 'New order just arrived — review it.' },
      { status: 'Contacted',        color: 'bg-blue-100 dark:bg-blue-900',    note: 'You have reached out to the buyer.' },
      { status: 'Awaiting Payment', color: 'bg-yellow-100 dark:bg-yellow-900', note: 'Waiting for UPI / payment transfer.' },
      { status: 'Paid',             color: 'bg-green-100 dark:bg-green-900',  note: 'Payment received — prepare to ship.' },
      { status: 'Fulfilled',        color: 'bg-purple-100 dark:bg-purple-900', note: 'Order shipped / handed over to buyer.' },
    ],
    cancelNote: 'You can cancel the order at any stage.',
  },
];

/* ── Dashboard variant (compact card) ─────────────────────────────────────── */
export function CreatorGuideCard() {
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <Card className="border-purple-200 dark:border-purple-900 bg-gradient-to-br from-purple-50/60 to-blue-50/40 dark:from-purple-950/40 dark:to-blue-950/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-base">Quick Start Guide</CardTitle>
              <Badge variant="secondary" className="text-xs">6 steps</Badge>
            </div>
            <CardDescription className="text-sm">
              New here? Follow these steps to get your store live and start receiving orders.
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOpen((p) => !p)}
            className="flex-shrink-0 gap-1 text-xs text-muted-foreground"
          >
            {open ? (
              <><ChevronUp className="w-4 h-4" /> Hide</>
            ) : (
              <><ChevronDown className="w-4 h-4" /> Show steps</>
            )}
          </Button>
        </div>
      </CardHeader>

      {open && (
        <CardContent className="pt-0 space-y-3">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="flex gap-3 p-3 rounded-xl border border-border bg-background/70"
            >
              <div className="w-8 h-8 rounded-lg bg-foreground text-background flex items-center justify-center font-bold text-xs flex-shrink-0">
                {step.number}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-0.5">
                  <p className="text-sm font-semibold text-foreground">{step.title}</p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-2">{step.desc}</p>
                {'statusFlow' in step && step.statusFlow && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {step.statusFlow.map((sf, i) => (
                      <span key={sf.status} className="flex items-center gap-1">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${sf.color} text-foreground`}>
                          {sf.status}
                        </span>
                        {i < step.statusFlow!.length - 1 && (
                          <span className="text-muted-foreground text-[10px]">→</span>
                        )}
                      </span>
                    ))}
                    {'cancelNote' in step && step.cancelNote && (
                      <span className="flex items-center gap-1">
                        <span className="text-muted-foreground text-[10px]">or</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900 text-foreground">
                          Cancelled
                        </span>
                        <span className="text-[10px] text-muted-foreground italic">anytime</span>
                      </span>
                    )}
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Link href={step.action.href}>
                    <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                      {step.action.label} <ArrowRight className="w-3 h-3" />
                    </Button>
                  </Link>
                  <p className="text-xs text-purple-600 dark:text-purple-400 italic hidden sm:block">
                    💡 {step.tip}
                  </p>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-end pt-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDismissed(true)}
              className="text-xs text-muted-foreground"
            >
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Got it, dismiss guide
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

/* ── Homepage variant (full section) ──────────────────────────────────────── */
export function CreatorGuideSection() {
  return (
    <section className="max-w-5xl mx-auto px-4 py-24 space-y-12">
      {/* Heading */}
      <div className="rs text-center space-y-3">
        <div className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-1.5 rounded-full text-sm font-medium mb-2">
          <UserCircle className="w-3.5 h-3.5" />
          For Creators
        </div>
        <h3 className="text-3xl md:text-4xl font-bold text-foreground">How to get started</h3>
        <p className="text-muted-foreground max-w-xl mx-auto">
          From sign-up to your first order — six simple steps. No tech skills needed.
        </p>
      </div>

      {/* Steps */}
      <div className="space-y-4">
        {STEPS.map((step, idx) => (
          <div
            key={step.number}
            className={`rs rs-d${(idx % 4) + 1} flex flex-col sm:flex-row gap-5 p-6 rounded-2xl border border-border bg-background hover:shadow-md transition-shadow`}
          >
            {/* Step number + icon */}
            <div className="flex sm:flex-col items-center gap-3 sm:gap-2 sm:w-14 flex-shrink-0">
              <div className="w-10 h-10 rounded-xl bg-foreground text-background flex items-center justify-center font-bold text-sm">
                {step.number}
              </div>
              <div className="text-muted-foreground">{step.icon}</div>
            </div>

            {/* Content */}
            <div className="flex-1 space-y-2">
              <h4 className="font-bold text-foreground">{step.title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              {'statusFlow' in step && step.statusFlow && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {step.statusFlow.map((sf, i) => (
                    <span key={sf.status} className="flex items-center gap-2">
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${sf.color} text-foreground`}
                        title={sf.note}
                      >
                        {sf.status}
                      </span>
                      {i < step.statusFlow!.length - 1 && (
                        <span className="text-muted-foreground text-sm">→</span>
                      )}
                    </span>
                  ))}
                  {'cancelNote' in step && step.cancelNote && (
                    <span className="flex items-center gap-2">
                      <span className="text-muted-foreground text-sm">or</span>
                      <span
                        className="text-xs font-semibold px-3 py-1 rounded-full bg-red-100 dark:bg-red-900 text-foreground"
                        title="Cancel the order at any stage"
                      >
                        Cancelled
                      </span>
                      <span className="text-xs text-muted-foreground italic">— at any stage</span>
                    </span>
                  )}
                </div>
              )}
              <div className="flex items-center gap-2 pt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0" />
                <p className="text-xs text-purple-600 dark:text-purple-400 italic">{step.tip}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="rs text-center space-y-4">
        <p className="text-muted-foreground text-sm">Ready to set up your store?</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/early-access">
            <Button size="lg" className="gap-2 w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-500 text-white border-0 hover:opacity-90">
              Get Early Access <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
              Already have an account? Sign In
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
