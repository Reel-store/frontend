'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ExternalLink, Eye, EyeOff, ShoppingBag, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import axiosInstance from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { validateIndianPhone } from '@/lib/utils';
import { THEME_CATALOG, ThemeName, resolveTheme } from '@/app/s/[handle]/themes';

const FONTS = [
  { id: 'sans', name: 'Modern' },
  { id: 'serif', name: 'Classic' },
  { id: 'mono', name: 'Tech' },
];

export default function StorefrontThemePage() {
  const { toast } = useToast();
  const bannerRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [handle, setHandle] = useState('');
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [showPreview, setShowPreview] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [figmaInput, setFigmaInput] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // Parse whatever Figma gives — full <iframe> embed code or a bare URL
  const parseFigmaInput = (raw: string): string => {
    const trimmed = raw.trim();
    // If it's an iframe tag, extract src
    const srcMatch = trimmed.match(/src=["']([^"']+)["']/);
    if (srcMatch) return srcMatch[1];
    // If it's already a URL
    if (trimmed.startsWith('http')) return trimmed;
    return '';
  };

  const handleFigmaInput = (raw: string) => {
    setFigmaInput(raw);
    setForm((f) => ({ ...f, figma_embed_url: parseFigmaInput(raw) }));
  };

  const [form, setForm] = useState({
    name: '',
    theme: 'studio' as ThemeName,
    accentColor: '',
    backgroundColor: '',
    fontStyle: 'sans',
    layout: 'grid' as 'grid' | 'list',
    description: '',
    shipping_note: '',
    payment_note: '',
    instagram_username: '',
    instagram_profile_url: '',
    contact_phone: '',
    contact_email: '',
    custom_css: '',
    custom_html: '',
    figma_embed_url: '',
  });

  useEffect(() => {
    axiosInstance.get('/storefront').then((res) => {
      const s = res.data;
      setHandle(s.handle || '');
      setForm({
        name: s.name || '',
        theme: (s.theme || 'studio') as ThemeName,
        accentColor: s.theme_config?.accentColor || '',
        backgroundColor: s.theme_config?.backgroundColor || '',
        fontStyle: s.theme_config?.fontStyle || 'sans',
        layout: (s.theme_config?.layout || 'grid') as 'grid' | 'list',
        description: s.description || '',
        shipping_note: s.shipping_note || '',
        payment_note: s.payment_note || '',
        instagram_username: s.instagram_username || '',
        instagram_profile_url: s.instagram_profile_url || '',
        contact_phone: s.contact_phone || '',
        contact_email: s.contact_email || '',
        custom_css: s.theme_config?.custom_css || '',
        custom_html: s.theme_config?.custom_html || '',
        figma_embed_url: s.theme_config?.figma_embed_url || '',
      });
      // Restore raw figma input as the saved URL
      setFigmaInput(s.theme_config?.figma_embed_url || '');
      if (s.banner_image_url) setBannerPreview(s.banner_image_url);
    });
  }, []);

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBannerFile(file);
    setBannerPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    const phoneErr = validateIndianPhone(form.contact_phone);
    if (phoneErr) {
      setPhoneError(phoneErr);
      return;
    }
    setPhoneError('');
    setSaving(true);
    try {
      const data = new FormData();
      data.append('theme', form.theme);
      data.append('description', form.description);
      data.append('shipping_note', form.shipping_note);
      data.append('payment_note', form.payment_note);
      data.append('instagram_username', form.instagram_username);
      data.append('instagram_profile_url', form.instagram_profile_url);
      data.append('contact_phone', form.contact_phone);
      data.append('contact_email', form.contact_email);
      if (form.accentColor) data.append('theme_config[accentColor]', form.accentColor);
      if (form.backgroundColor) data.append('theme_config[backgroundColor]', form.backgroundColor);
      data.append('theme_config[fontStyle]', form.fontStyle);
      data.append('theme_config[layout]', form.layout);
      data.append('theme_config[custom_css]', form.custom_css);
      data.append('theme_config[custom_html]', form.custom_html);
      if (form.figma_embed_url) data.append('theme_config[figma_embed_url]', form.figma_embed_url);
      if (bannerFile) data.append('banner_image', bannerFile);

      await axiosInstance.patch('/storefront', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast({ title: 'Storefront saved!' });
    } catch {
      toast({ title: 'Failed to save', variant: 'destructive' });
    }
    setSaving(false);
  };

  const t = resolveTheme(form.theme, {
    accentColor: form.accentColor,
    backgroundColor: form.backgroundColor,
    fontStyle: form.fontStyle,
    layout: form.layout,
  });

  const previewUrl = handle ? `/s/${handle}` : null;

  return (
    <div className="flex gap-8">
      {/* ── Left: Editor ── */}
      <div className="flex-1 max-w-xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Storefront</h1>
            <p className="text-muted-foreground mt-1">Customize how your store looks</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)}>
              {showPreview ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </Button>
            {previewUrl && (
              <Button variant="outline" size="sm" onClick={() => window.open(previewUrl, '_blank')}>
                <ExternalLink className="w-4 h-4 mr-1" />Open Store
              </Button>
            )}
          </div>
        </div>

        {/* Store Info */}
        <Card>
          <CardHeader><CardTitle>Store Info</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Store Name</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input value={form.name} disabled className="bg-muted text-muted-foreground cursor-not-allowed" />
                <span className="text-xs text-muted-foreground whitespace-nowrap">Set by admin</span>
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Tell customers about your store..." rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Instagram Username</Label>
                <Input value={form.instagram_username} onChange={(e) => setForm({ ...form, instagram_username: e.target.value })} placeholder="yourhandle" /></div>
              <div><Label>Instagram URL</Label>
                <Input value={form.instagram_profile_url} onChange={(e) => setForm({ ...form, instagram_profile_url: e.target.value })} placeholder="https://instagram.com/..." /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Contact Phone</Label>
                <Input
                  value={form.contact_phone}
                  onChange={(e) => {
                    const val = e.target.value;
                    setForm({ ...form, contact_phone: val });
                    if (phoneError) setPhoneError(validateIndianPhone(val) || '');
                  }}
                  onBlur={() => setPhoneError(validateIndianPhone(form.contact_phone) || '')}
                  placeholder="9999999999"
                  className={phoneError ? 'border-destructive focus-visible:ring-destructive' : ''}
                />
                {phoneError && (
                  <p className="text-xs text-destructive mt-1">{phoneError}</p>
                )}
              </div>
              <div><Label>Contact Email</Label>
                <Input value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} placeholder="you@example.com" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Shipping Note</Label>
                <Input value={form.shipping_note} onChange={(e) => setForm({ ...form, shipping_note: e.target.value })} placeholder="Ships in 2-3 days" /></div>
              <div><Label>Payment Note</Label>
                <Input value={form.payment_note} onChange={(e) => setForm({ ...form, payment_note: e.target.value })} placeholder="GPay / UPI accepted" /></div>
            </div>
          </CardContent>
        </Card>

        {/* Banner */}
        <Card>
          <CardHeader><CardTitle>Banner Image</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {bannerPreview && <img src={bannerPreview} alt="Banner" className="w-full h-32 object-cover rounded-lg" />}
            <Button variant="outline" onClick={() => bannerRef.current?.click()}>
              {bannerPreview ? 'Change Banner' : 'Upload Banner'}
            </Button>
            <input ref={bannerRef} type="file" accept="image/*" className="hidden" onChange={handleBannerChange} />
            <p className="text-xs text-muted-foreground">Recommended: 1200×400px</p>
          </CardContent>
        </Card>

        {/* Theme picker */}
        <Card>
          <CardHeader>
            <CardTitle>Theme</CardTitle>
            <p className="text-sm text-muted-foreground">Choose a premium theme for your store</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {(Object.entries(THEME_CATALOG) as [ThemeName, typeof THEME_CATALOG[ThemeName]][]).map(([id, theme]) => (
                <button
                  key={id}
                  onClick={() => setForm({ ...form, theme: id })}
                  className={`rounded-xl border-2 p-3 text-left transition-all ${
                    form.theme === id
                      ? 'border-primary ring-2 ring-primary/20'
                      : 'border-border hover:border-muted-foreground/40'
                  }`}
                >
                  <div className={`rounded-lg border p-3 mb-2 ${theme.preview}`}>
                    <div className={`w-5 h-5 rounded-full ${theme.dot} mx-auto`} />
                    <div className={`text-xs font-bold text-center mt-1 ${theme.text}`}>Aa</div>
                  </div>
                  <p className="text-sm font-semibold">{theme.name}</p>
                  <p className="text-xs text-muted-foreground leading-tight mt-0.5">{theme.desc}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Customization */}
        <Card>
          <CardHeader>
            <CardTitle>Customization</CardTitle>
            <p className="text-sm text-muted-foreground">Override colors, font, and layout</p>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Accent Color</Label>
                <p className="text-xs text-muted-foreground mb-1.5">Buttons & highlights</p>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={form.accentColor || THEME_CATALOG[form.theme]?.accent || '#111111'}
                    onChange={(e) => setForm({ ...form, accentColor: e.target.value })}
                    className="w-10 h-10 rounded-lg cursor-pointer border"
                  />
                  <Input
                    value={form.accentColor}
                    onChange={(e) => setForm({ ...form, accentColor: e.target.value })}
                    placeholder={THEME_CATALOG[form.theme]?.accent || '#111111'}
                    className="font-mono text-sm"
                  />
                </div>
                {form.accentColor && (
                  <button
                    onClick={() => setForm({ ...form, accentColor: '' })}
                    className="text-xs text-muted-foreground mt-1 hover:text-foreground underline"
                  >
                    Reset to theme default
                  </button>
                )}
              </div>
              <div>
                <Label>Background Color</Label>
                <p className="text-xs text-muted-foreground mb-1.5">Page background override</p>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={form.backgroundColor || '#f9fafb'}
                    onChange={(e) => setForm({ ...form, backgroundColor: e.target.value })}
                    className="w-10 h-10 rounded-lg cursor-pointer border"
                  />
                  <Input
                    value={form.backgroundColor}
                    onChange={(e) => setForm({ ...form, backgroundColor: e.target.value })}
                    placeholder="#f9fafb"
                    className="font-mono text-sm"
                  />
                </div>
                {form.backgroundColor && (
                  <button
                    onClick={() => setForm({ ...form, backgroundColor: '' })}
                    className="text-xs text-muted-foreground mt-1 hover:text-foreground underline"
                  >
                    Reset to theme default
                  </button>
                )}
              </div>
            </div>
            <div>
              <Label>Font Style</Label>
              <div className="flex gap-2 mt-2">
                {FONTS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setForm({ ...form, fontStyle: f.id })}
                    className={`px-4 py-1.5 rounded-lg text-sm border transition-all ${
                      form.fontStyle === f.id
                        ? 'bg-foreground text-background border-foreground'
                        : 'border-border hover:border-foreground'
                    }`}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label>Product Layout</Label>
              <div className="flex gap-2 mt-2">
                {(['grid', 'list'] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setForm({ ...form, layout: l })}
                    className={`px-4 py-1.5 rounded-lg text-sm border capitalize transition-all ${
                      form.layout === l
                        ? 'bg-foreground text-background border-foreground'
                        : 'border-border hover:border-foreground'
                    }`}
                  >
                    {l === 'grid' ? 'Grid' : 'List'}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Advanced: CSS + HTML — hidden by default */}
        <div>
          <button
            type="button"
            onClick={() => setShowAdvanced((v) => !v)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            {showAdvanced ? 'Hide' : 'Show'} Advanced (Custom CSS & HTML)
          </button>

          {showAdvanced && (
            <Card className="mt-3">
              <CardContent className="space-y-5 pt-5">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label>Custom CSS</Label>
                    {form.custom_css && (
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, custom_css: '' })}
                        className="text-xs text-destructive hover:underline"
                      >
                        Clear CSS
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-1.5">
                    CSS injected as a <code className="bg-muted px-1 rounded text-[11px]">&lt;style&gt;</code> tag on top of your theme.
                  </p>
                  <Textarea
                    value={form.custom_css}
                    onChange={(e) => setForm({ ...form, custom_css: e.target.value })}
                    placeholder={`/* Page background */\n#storefront-root { background: linear-gradient(135deg, #667eea, #764ba2) !important; }\n\n/* Product cards */\n.product-card { border-radius: 20px !important; box-shadow: 0 8px 24px rgba(0,0,0,0.15) !important; }\n.product-card:hover { transform: translateY(-4px); }\n\n/* Link buttons */\n.link-card { border-radius: 50px !important; }\n\n/* Store header */\n.store-header { background: linear-gradient(135deg, #1a1a2e, #16213e) !important; }`}
                    rows={8}
                    className="font-mono text-xs"
                  />

                  {/* CSS class reference */}
                  <details className="mt-3 group">
                    <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground select-none list-none flex items-center gap-1">
                      <ChevronDown className="w-3 h-3 group-open:rotate-180 transition-transform" />
                      Available CSS selectors
                    </summary>
                    <div className="mt-2 rounded-xl border border-border overflow-hidden text-xs">
                      {[
                        { selector: '#storefront-root', desc: 'The entire page wrapper — background, font, etc.' },
                        { selector: '.store-header', desc: 'Top section with banner, store name & links' },
                        { selector: '.product-card', desc: 'Each product card (grid or list item)' },
                        { selector: '.product-card:hover', desc: 'Product card hover state' },
                        { selector: '.product-card img', desc: 'Product thumbnail image' },
                        { selector: '.link-card', desc: 'Each social / custom link button' },
                        { selector: '.link-card:hover', desc: 'Link button hover state' },
                        { selector: '.cart-fab', desc: 'Floating cart button (bottom-right)' },
                      ].map(({ selector, desc }, i) => (
                        <div
                          key={selector}
                          className={`flex gap-3 px-3 py-2 ${i % 2 === 0 ? 'bg-muted/40' : ''}`}
                        >
                          <code className="shrink-0 text-[11px] font-mono text-foreground">{selector}</code>
                          <span className="text-muted-foreground">{desc}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Tip: use <code className="bg-muted px-1 rounded">!important</code> to override theme styles.
                    </p>
                  </details>
                </div>
                <div>
                  <Label>Custom HTML Section</Label>
                  <p className="text-xs text-muted-foreground mb-1.5">
                    HTML block shown between your links and products — great for announcements or video embeds.
                  </p>
                  <Textarea
                    value={form.custom_html}
                    onChange={(e) => setForm({ ...form, custom_html: e.target.value })}
                    placeholder={`<div style="text-align:center;padding:16px;background:#f0f4ff;border-radius:12px;">\n  <h2>✨ New Collection Out Now!</h2>\n</div>`}
                    rows={6}
                    className="font-mono text-xs"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <Button onClick={handleSave} disabled={saving} className="w-full" size="lg">
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* ── Right: Live mini preview ── */}
      {showPreview && (
        <div className="w-96 flex-shrink-0">
          <div className="sticky top-6">
            <p className="text-sm font-medium mb-2 text-muted-foreground">Live Preview</p>
            <div
              className={`rounded-2xl border overflow-hidden shadow-xl ${t.pageBg}`}
              style={{
                height: '680px',
                overflowY: 'auto',
                ...(form.backgroundColor ? { backgroundColor: form.backgroundColor } : {}),
              }}
            >
              <div className={`${t.heroBg} border-b ${t.heroBorder} p-4 text-center`}>
                <div
                  className={`w-12 h-12 rounded-full bg-gradient-to-br ${t.avatarGradient} ${t.avatarRing} flex items-center justify-center text-white text-sm font-bold mx-auto mb-2`}
                >
                  {handle.slice(0, 2).toUpperCase() || 'RS'}
                </div>
                <p className={`font-bold text-sm ${t.nameColor}`}>Your Store</p>
                {form.instagram_username && (
                  <p className={`text-xs ${t.handleColor}`}>@{form.instagram_username}</p>
                )}
                {form.description && (
                  <p className={`text-xs mt-1 line-clamp-2 ${t.descColor}`}>{form.description}</p>
                )}
                {(form.shipping_note || form.payment_note) && (
                  <div className={`mt-2 rounded-xl border ${t.noteBorder} ${t.noteBg} text-left`}>
                    {form.shipping_note && (
                      <p className={`text-xs px-2 py-1.5 ${t.noteText}`}>{form.shipping_note}</p>
                    )}
                    {form.payment_note && (
                      <p className={`text-xs px-2 py-1.5 ${t.noteText} border-t ${t.noteBorder}`}>{form.payment_note}</p>
                    )}
                  </div>
                )}
              </div>

              <div className="p-3 space-y-3">
                {/* Sample links */}
                {['Instagram', 'Website'].map((name) => (
                  <div
                    key={name}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl border text-xs ${t.linkBg} ${t.linkText} ${t.linkBorder}`}
                    style={form.accentColor ? { borderColor: form.accentColor } : undefined}
                  >
                    <span>{name}</span>
                    <ExternalLink className="w-3 h-3 opacity-40" />
                  </div>
                ))}

                <p className={`text-[10px] font-semibold uppercase tracking-widest mt-3 ${t.sectionColor}`}>Products</p>
                <div className={form.layout === 'list' ? 'space-y-2' : 'grid grid-cols-2 gap-2'}>
                  {[1, 2, 3, 4].map((i) =>
                    form.layout === 'list' ? (
                      <div key={i} className={`flex gap-2 rounded-xl border overflow-hidden ${t.cardBg} ${t.cardBorder} ${t.cardShadow}`}>
                        <div className={`w-14 h-14 flex-shrink-0 flex items-center justify-center ${t.badgeBg}`}>
                          <ShoppingBag className={`w-4 h-4 ${t.badgeText} opacity-30`} />
                        </div>
                        <div className="p-2 flex-1 min-w-0">
                          <p className={`text-xs font-medium truncate ${t.productTitleColor}`}>Product {i}</p>
                          <p className={`text-xs font-bold ${t.productPriceColor}`}>₹499</p>
                          <div
                            className={`text-[10px] px-2 py-0.5 rounded-lg mt-1 inline-block font-semibold ${t.btnBg} ${t.btnText}`}
                            style={form.accentColor ? { backgroundColor: form.accentColor } : undefined}
                          >
                            Order
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div key={i} className={`rounded-xl border overflow-hidden ${t.cardBg} ${t.cardBorder} ${t.cardShadow}`}>
                        <div className={`aspect-square flex items-center justify-center ${t.badgeBg}`}>
                          <ShoppingBag className={`w-6 h-6 ${t.badgeText} opacity-20`} />
                        </div>
                        <div className="p-2">
                          <p className={`text-xs font-medium truncate ${t.productTitleColor}`}>Product {i}</p>
                          <p className={`text-xs font-bold ${t.productPriceColor}`}>₹499</p>
                          <div
                            className={`text-[10px] px-2 py-1 rounded-lg mt-1 text-center font-semibold ${t.btnBg} ${t.btnText}`}
                            style={form.accentColor ? { backgroundColor: form.accentColor } : undefined}
                          >
                            Order now
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
            {previewUrl && (
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Save first, then{' '}
                <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  view live store
                </a>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}