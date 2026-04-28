import Link from 'next/link';
import { MessageCircle, ExternalLink, Instagram, Youtube, Globe, Twitter, MapPin, Truck, CreditCard, ShoppingBag } from 'lucide-react';
import { resolveTheme, ThemeName } from './themes';
import { AddToCartButton, CartFab } from './cart-actions';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

async function getStorefront(handle: string) {
  try {
    const res = await fetch(`${API_BASE}/s/${handle}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

const platformIcon: Record<string, any> = {
  instagram: Instagram,
  youtube: Youtube,
  website: Globe,
  twitter: Twitter,
};

export default async function StorefrontPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const storefront = await getStorefront(handle);

  if (!storefront) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-6">
        <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">Store not found</h1>
        <p className="text-gray-400 mt-2 text-sm">This storefront doesn't exist or has been removed.</p>
      </div>
    </div>
  );

  if (storefront.status === 'suspended') return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-6">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-6 h-6 text-gray-400" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">Store unavailable</h1>
        <p className="text-gray-400 mt-2 text-sm">This store is temporarily unavailable.</p>
      </div>
    </div>
  );

  const t = resolveTheme((storefront.theme || 'studio') as ThemeName, storefront.theme_config || {});
  const customBg = storefront.theme_config?.backgroundColor;
  const customAccent = storefront.theme_config?.accentColor;
  const customCss = storefront.theme_config?.custom_css || '';
  const customHtml = storefront.theme_config?.custom_html || '';
  const figmaEmbedUrl = storefront.theme_config?.figma_embed_url || '';
  const initials = storefront.name
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  const activeProducts = (storefront.products || []).filter(
    (p: any) => p.status === 'active' || p.status === 'out_of_stock'
  );
  const sortedLinks = [...(storefront.storefront_links || [])].sort(
    (a: any, b: any) => a.position - b.position
  );

  return (
    <div
      id="storefront-root"
      className={`min-h-screen ${t.pageBg} ${t.fontClass}`}
      style={customBg ? { backgroundColor: customBg } : undefined}
    >
      {/* Inject custom CSS */}
      {customCss && (
        <style dangerouslySetInnerHTML={{ __html: customCss }} />
      )}
      {/* Hero / Profile — banner is background behind the profile */}
      <div className={`store-header ${t.heroBg} border-b ${t.heroBorder} relative`}>
        {/* Banner image as background */}
        {storefront.banner_image_url && (
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={storefront.banner_image_url}
              alt=""
              className="w-full h-full object-cover"
            />
            {/* dark scrim so text is readable */}
            <div className="absolute inset-0 bg-black/40" />
          </div>
        )}

        <div className="relative max-w-lg mx-auto px-5 py-10 text-center">
          {/* Avatar */}
          <div
            className={`w-20 h-20 rounded-full bg-gradient-to-br ${t.avatarGradient} ${t.avatarRing} flex items-center justify-center text-white text-xl font-bold mx-auto mb-5 shadow-lg`}
          >
            {initials}
          </div>

          {/* Name */}
          <h1 className={`text-2xl font-bold tracking-tight ${storefront.banner_image_url ? 'text-white' : t.nameColor}`}>{storefront.name}</h1>

          {/* Instagram handle */}
          {storefront.instagram_username && (
            <a
              href={storefront.instagram_profile_url || `https://instagram.com/${storefront.instagram_username}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 text-sm mt-1.5 transition-opacity hover:opacity-80 ${storefront.banner_image_url ? 'text-white/80' : t.handleColor}`}
            >
              <Instagram className="w-3.5 h-3.5" />
              @{storefront.instagram_username}
            </a>
          )}

          {/* Description */}
          {storefront.description && (
            <p className={`text-sm mt-4 leading-relaxed max-w-sm mx-auto ${storefront.banner_image_url ? 'text-white/80' : t.descColor}`}>
              {storefront.description}
            </p>
          )}

          {/* Info notes */}
          {(storefront.shipping_note || storefront.payment_note) && (
            <div className={`mt-5 text-left rounded-xl border ${t.noteBorder} ${t.noteBg} divide-y divide-inherit`}>
              {storefront.shipping_note && (
                <div className={`flex items-start gap-3 px-4 py-3 text-xs ${t.noteText}`}>
                  <Truck className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 opacity-60" />
                  <span>{storefront.shipping_note}</span>
                </div>
              )}
              {storefront.payment_note && (
                <div className={`flex items-start gap-3 px-4 py-3 text-xs ${t.noteText}`}>
                  <CreditCard className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 opacity-60" />
                  <span>{storefront.payment_note}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto px-5 py-8 space-y-10">

        {/* Social / Links */}
        {sortedLinks.length > 0 && (
          <div className="space-y-2.5">
            {sortedLinks.map((link: any) => {
              const Icon = platformIcon[link.platform];
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`link-card flex items-center justify-between w-full px-5 py-3.5 rounded-2xl border text-sm font-medium transition-all ${t.linkBg} ${t.linkText} ${t.linkBorder} ${t.linkHover}`}
                  style={customAccent ? { borderColor: customAccent } : undefined}
                >
                  <div className="flex items-center gap-3">
                    {Icon && <Icon className={`w-4 h-4 ${t.linkIconColor}`} />}
                    <span>{link.label || link.platform}</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 opacity-40" />
                </a>
              );
            })}
          </div>
        )}

        {/* Custom HTML Block */}
        {customHtml && (
          <div dangerouslySetInnerHTML={{ __html: customHtml }} />
        )}

        {/* Figma Embed */}
        {figmaEmbedUrl && (
          <div className="w-full rounded-2xl border overflow-hidden" style={{ height: 480 }}>
            <iframe
              src={figmaEmbedUrl}
              style={{ width: '100%', height: '100%', border: 'none' }}
              allowFullScreen
              allow="fullscreen"
              title="Figma Design"
            />
          </div>
        )}

        {/* Products */}
        {activeProducts.length > 0 && (
          <div>
            <div className={`flex items-center gap-3 mb-5 pb-3 border-b ${t.sectionDivider}`}>
              <h2 className={`text-base font-semibold tracking-wide uppercase text-[0.7rem] letter-spacing-widest ${t.sectionColor}`}>
                Products
              </h2>
            </div>

            <div className={t.layout === 'list' ? 'space-y-3' : 'grid grid-cols-2 gap-3'}>
              {activeProducts.map((product: any) => {
                const images = product.images || product.product_images || [];
                const primaryImg = images[0];
                const isOutOfStock = product.status === 'out_of_stock';
                const waNum = product.whatsapp_number?.replace(/\D/g, '');
                const waMsg = `Hi! I want to order: ${product.name} — ₹${Number(product.price).toLocaleString('en-IN')}`;
                const accentStyle = customAccent ? { backgroundColor: customAccent } : undefined;

                if (t.layout === 'list') {
                  return (
                    <Link
                      key={product.id}
                      href={`/s/${handle}/${product.id}`}
                      className={`product-card flex gap-4 rounded-2xl border overflow-hidden ${t.cardBg} ${t.cardBorder} ${t.cardShadow} ${t.cardHover}`}
                    >
                      {/* Image */}
                      <div className="w-24 h-24 flex-shrink-0 relative overflow-hidden">
                        {primaryImg ? (
                          <img
                            src={primaryImg.url || primaryImg.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className={`w-full h-full flex items-center justify-center ${t.badgeBg}`}>
                            <ShoppingBag className={`w-6 h-6 ${t.badgeText} opacity-40`} />
                          </div>
                        )}
                        {isOutOfStock && (
                          <div className={`absolute inset-0 flex items-center justify-center ${t.outOfStockBg}`}>
                            <span className={`text-[10px] font-semibold ${t.outOfStockText}`}>Sold out</span>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 py-3 pr-4 flex flex-col justify-between min-w-0">
                        <div>
                          <h3 className={`font-semibold text-sm leading-tight ${t.productTitleColor}`}>
                            {product.name}
                          </h3>
                          {product.description && (
                            <p className={`text-xs mt-1 line-clamp-2 ${t.productDescColor}`}>
                              {product.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className={`font-bold text-sm ${t.productPriceColor}`}>
                            ₹{Number(product.price).toLocaleString('en-IN')}
                          </span>
                          {isOutOfStock ? (
                            <span className={`text-xs px-2 py-1 rounded-lg ${t.badgeBg} ${t.badgeText}`}>Sold out</span>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <AddToCartButton product={product} handle={handle} btnBg={t.btnBg} btnText={t.btnText} accentStyle={accentStyle} />
                              <span className={`text-xs px-3 py-1.5 rounded-lg font-semibold ${t.btnBg} ${t.btnText}`} style={accentStyle}>
                                View →
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                }

                // Grid card
                return (
                  <Link
                    key={product.id}
                    href={`/s/${handle}/${product.id}`}
                    className={`product-card rounded-2xl border overflow-hidden flex flex-col ${t.cardBg} ${t.cardBorder} ${t.cardShadow} ${t.cardHover}`}
                  >
                    {/* Image */}
                    <div className="aspect-square relative overflow-hidden">
                      {primaryImg ? (
                        <img
                          src={primaryImg.url || primaryImg.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className={`w-full h-full flex items-center justify-center ${t.badgeBg}`}>
                          <ShoppingBag className={`w-8 h-8 ${t.badgeText} opacity-30`} />
                        </div>
                      )}
                      {isOutOfStock && (
                        <div className={`absolute inset-0 flex items-center justify-center ${t.outOfStockBg}`}>
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${t.outOfStockText}`}>
                            Sold out
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-3.5 flex flex-col flex-1">
                      <h3 className={`font-semibold text-sm leading-tight line-clamp-2 ${t.productTitleColor}`}>
                        {product.name}
                      </h3>
                      {product.description && (
                        <p className={`text-xs mt-1 line-clamp-2 ${t.productDescColor}`}>
                          {product.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-auto pt-2 gap-1">
                        <p className={`text-sm font-bold flex-shrink-0 ${t.productPriceColor}`}>
                          ₹{Number(product.price).toLocaleString('en-IN')}
                        </p>
                        {isOutOfStock ? (
                          <span className={`text-xs px-2 py-1 rounded-lg flex-shrink-0 ${t.badgeBg} ${t.badgeText}`}>Sold out</span>
                        ) : (
                          <AddToCartButton product={product} handle={handle} btnBg={t.btnBg} btnText={t.btnText} accentStyle={accentStyle} />
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty state */}
        {activeProducts.length === 0 && sortedLinks.length === 0 && (
          <div className="text-center py-16">
            <ShoppingBag className={`w-10 h-10 mx-auto mb-3 opacity-20 ${t.sectionColor}`} />
            <p className={`text-sm ${t.descColor}`}>No products yet. Check back soon.</p>
          </div>
        )}
      </div>

      {/* Floating cart button */}
      <CartFab handle={handle} />

      {/* Footer */}
      <div className={`border-t mt-10 ${t.footerBg} ${t.footerBorder}`}>
        <div className="max-w-lg mx-auto px-5 py-5 text-center">
          <p className={`text-xs tracking-wide ${t.footerText}`}>
            Powered by{' '}
            <span className={`font-semibold ${t.footerBrand}`}>Reelstore</span>
          </p>
        </div>
      </div>
    </div>
  );
}