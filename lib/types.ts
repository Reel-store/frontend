export type UserRole = 'super_admin' | 'creator';


export interface ProductImage {
  id: string;
  url: string;
  filename: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: string;
  currency: string;
  stock: number;
  status: 'draft' | 'active' | 'out_of_stock';
  category?: string;
  external_link?: string | null;
  whatsapp_number?: string | null;
  order_instructions?: string | null;
  images: ProductImage[];
}

export interface StorefrontLink {
  id: string;
  platform: string;
  url: string;
  label?: string;
  position: number;
}

export interface ThemeConfig {
  accentColor?: string;
  backgroundColor?: string;
  fontStyle?: string;
  layout?: 'grid' | 'list';
  custom_css?: string;
  custom_html?: string;
  figma_embed_url?: string;
}

export interface Storefront {
  id: string;
  handle: string;
  name: string;
  user?: { id: string; email: string };
  description?: string | null;
  instagram_username?: string | null;
  instagram_profile_url?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  shipping_note?: string | null;
  payment_note?: string | null;
  status: string;
  theme: 'minimal' | 'bold' | 'soft';
  theme_config: ThemeConfig;
  banner_image_url?: string | null;
  storefront_links: StorefrontLink[];
  products: Product[];
}

export interface User {
  id: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Creator {
  id: string;
  email: string;
  active: boolean;
  created_at?: string;
  storefront?: Storefront;
}

// ── Cart ─────────────────────────────────────────────────────────────────────

export interface CartItem {
  product: Product;
  quantity: number;
}

// ── Orders ───────────────────────────────────────────────────────────────────

export type OrderStatus = 'pending' | 'contacted' | 'awaiting_payment' | 'paid' | 'fulfilled' | 'cancelled';

export interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  unit_price: string;
  quantity: number;
  subtotal: string;
}

export interface Order {
  id: string;
  status: OrderStatus;
  customer_name: string;
  customer_email?: string | null;
  customer_phone?: string | null;
  customer_notes?: string | null;
  creator_note?: string | null;
  total_amount: string;
  created_at: string;
  storefront?: {
    id: string;
    handle: string;
    name: string;
    contact_phone?: string | null;
    contact_email?: string | null;
  };
  items: OrderItem[];
}

// ── Early Signups ─────────────────────────────────────────────────────────────

export interface EarlySignup {
  id: string;
  name: string;
  email: string;
  instagram_handle?: string | null;
  message?: string | null;
  status: 'pending' | 'created';
  created_at: string;
}

// ── Audit Logs ────────────────────────────────────────────────────────────────

export interface AuditLog {
  id: string;
  action: 'create' | 'update' | 'destroy';
  auditable_type: string;
  auditable_id: string;
  changes: Record<string, [unknown, unknown]> | null;
  performed_by: { id: string; email: string } | null;
  created_at: string;
}