import { ReactNode } from 'react';

/**
 * Storefront shell layout.
 *
 * Mobile  → full-screen, no changes (customers see the normal storefront).
 * Desktop → the storefront is centered in a 430 px column with a subtle
 *            shadow, sitting on a soft gradient background.  This gives
 *            the "phone form-factor" feel on large screens without using
 *            a fixed-height scroll container (which would break sticky /
 *            fixed child elements such as the cart FAB).
 */
export default function StorefrontLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen lg:bg-gradient-to-br lg:from-slate-200 lg:via-slate-100 lg:to-slate-200 lg:py-10 lg:px-4">
      {/* Centered phone-width column on lg+ */}
      <div
        className={[
          // Mobile: nothing extra
          'min-h-screen bg-background',
          // Desktop: narrow column, rounded, elevated
          'lg:max-w-[430px] lg:mx-auto lg:min-h-0',
          'lg:rounded-[2.5rem] lg:overflow-hidden',
          'lg:shadow-[0_8px_60px_rgba(0,0,0,0.18)]',
          'lg:ring-1 lg:ring-black/10',
        ].join(' ')}
      >
        {/* Top notch bar — visible only on desktop */}
        <div className="hidden lg:flex items-center justify-center h-8 bg-zinc-900 rounded-t-[2.5rem]">
          <div className="w-24 h-[6px] rounded-full bg-zinc-700" />
        </div>

        {children}

        {/* Bottom home-indicator — visible only on desktop */}
        <div className="hidden lg:flex items-center justify-center py-3 bg-inherit">
          <div className="w-28 h-1 rounded-full bg-black/20" />
        </div>
      </div>
    </div>
  );
}
