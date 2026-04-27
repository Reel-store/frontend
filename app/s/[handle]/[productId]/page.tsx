import { ArrowLeft, ShoppingBag, Package } from 'lucide-react';
import Link from 'next/link';
import { resolveTheme, ThemeName } from '../themes';
import { ProductDetailCTA, CartFab } from '../cart-actions';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

async function getStorefront(handle: string) {
  try {
    const res = await fetch(`${API_BASE}/s/${handle}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ handle: string; productId: string }>;
}) {
  const { handle, productId } = await params;
  const storefront = await getStorefront(handle);

  if (!storefront) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center px-6">
          <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Store not found</p>
          <Link href={`/s/${handle}`} className="text-sm text-blue-500 mt-2 inline-block">← Back to store</Link>
        </div>
      </div>
    );
  }

  const product = (storefront.products || []).find((p: any) => String(p.id) === String(productId));

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center px-6">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Product not found</p>
          <Link href={`/s/${handle}`} className="text-sm text-blue-500 mt-2 inline-block">← Back to store</Link>
        </div>
      </div>
    );
  }

  const t = resolveTheme((storefront.theme || 'studio') as ThemeName, storefront.theme_config || {});
  const customBg = storefront.theme_config?.backgroundColor;
  const customAccent = storefront.theme_config?.accentColor;
  const accentStyle = customAccent ? { backgroundColor: customAccent } : undefined;

  const images: { id: string; url: string; filename: string }[] = product.images || [];
  const isOutOfStock = product.status === 'out_of_stock';

  return (
    <div
      className={`min-h-screen ${t.pageBg} ${t.fontClass}`}
      style={customBg ? { backgroundColor: customBg } : undefined}
    >
      {/* Top bar */}
      <div className={`sticky top-0 z-10 ${t.heroBg} border-b ${t.heroBorder} px-4 py-3 flex items-center gap-3`}>
        <Link
          href={`/s/${handle}`}
          className={`flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-70 ${t.nameColor}`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{storefront.name}</span>
        </Link>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">

        {/* Image gallery */}
        {images.length > 0 ? (
          <div className="space-y-2">
            {/* Main image */}
            <div className={`aspect-square w-full rounded-2xl overflow-hidden ${t.badgeBg} relative`}>
              <img
                src={images[0].url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {isOutOfStock && (
                <div className={`absolute inset-0 flex items-center justify-center ${t.outOfStockBg}`}>
                  <span className={`text-sm font-semibold px-4 py-2 rounded-full ${t.outOfStockText}`}>
                    Sold out
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail grid */}
            {images.length > 1 && (
              <div className={`grid gap-2 ${images.length === 2 ? 'grid-cols-2' : images.length === 3 ? 'grid-cols-3' : 'grid-cols-4'}`}>
                {images.slice(1).map((img) => (
                  <div
                    key={img.id}
                    className={`aspect-square rounded-xl overflow-hidden ${t.badgeBg}`}
                  >
                    <img
                      src={img.url}
                      alt={img.filename}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className={`aspect-square w-full rounded-2xl flex items-center justify-center ${t.badgeBg}`}>
            <ShoppingBag className={`w-16 h-16 ${t.badgeText} opacity-20`} />
          </div>
        )}

        {/* Product info */}
        <div className={`rounded-2xl border ${t.cardBg} ${t.cardBorder} ${t.cardShadow} p-5 space-y-4`}>
          {/* Name + Price */}
          <div className="flex items-start justify-between gap-3">
            <h1 className={`text-xl font-bold leading-tight ${t.productTitleColor}`}>{product.name}</h1>
            <span className={`text-xl font-bold flex-shrink-0 ${t.productPriceColor}`}>
              ₹{Number(product.price).toLocaleString('en-IN')}
            </span>
          </div>

          {/* Category badge */}
          {product.category && (
            <span className={`inline-block text-xs px-3 py-1 rounded-full font-medium ${t.badgeBg} ${t.badgeText}`}>
              {product.category}
            </span>
          )}

          {/* Description */}
          {product.description && (
            <p className={`text-sm leading-relaxed ${t.productDescColor}`}>{product.description}</p>
          )}

          {/* Order instructions */}
          {/* {product.order_instructions && (
            <div className={`text-xs px-4 py-3 rounded-xl border ${t.noteBorder} ${t.noteBg} ${t.noteText} leading-relaxed`}>
              {product.order_instructions}
            </div>
          )} */}

          {/* CTA */}
          {isOutOfStock ? (
            <div className={`w-full py-3 px-4 rounded-xl text-center text-sm font-semibold ${t.badgeBg} ${t.badgeText}`}>
              Currently out of stock
            </div>
          ) : (
            <ProductDetailCTA
              product={product}
              handle={handle}
              accentStyle={accentStyle}
              btnBg={t.btnBg}
              btnText={t.btnText}
            />
          )}
        </div>

        {/* Stock indicator */}
        {!isOutOfStock && product.stock > 0 && product.stock <= 5 && (
          <p className={`text-xs text-center ${t.productDescColor}`}>
            Only {product.stock} left in stock
          </p>
        )}
      </div>

      {/* Floating cart button */}
      <CartFab handle={handle} />

      {/* Footer */}
      <div className={`border-t mt-6 ${t.footerBg} ${t.footerBorder}`}>
        <div className="max-w-lg mx-auto px-5 py-4 text-center">
          <p className={`text-xs tracking-wide ${t.footerText}`}>
            Powered by <span className={`font-semibold ${t.footerBrand}`}>Reelstore</span>
          </p>
        </div>
      </div>
    </div>
  );
}
