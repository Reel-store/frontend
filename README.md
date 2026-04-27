# Reelstore MVP - Creator Commerce Platform

A modern SaaS platform enabling creators to build and manage their own digital storefronts, sell products directly to their audience, and manage orders through WhatsApp.

## Features

### For Creators
- **My Store**: Manage storefront profile, bio, and handle
- **Products**: Add, edit, and manage products with images and pricing
- **Links**: Manage social media links displayed on storefront (Instagram, YouTube, TikTok, Twitter, Website)
- **Public Storefront**: Beautiful mobile-first storefront at `/s/[handle]`

### For Admins
- **Overview Dashboard**: Monitor platform stats (creators, storefronts, products, growth)
- **Creators Management**: View all creators, activate/deactivate accounts
- **Storefronts Management**: Monitor active storefronts, suspend/activate, view product counts

### Public
- **Landing Page**: Marketing homepage with feature highlights
- **Storefront Page**: Mobile-optimized store view with products and links
- **WhatsApp Integration**: One-click ordering via WhatsApp messages

## Tech Stack

- **Frontend**: Next.js 16 with App Router
- **Styling**: Tailwind CSS 4 + shadcn/ui components
- **State Management**: Zustand with persistence
- **Forms**: React Hook Form + Zod validation
- **API**: Axios with interceptors
- **Icons**: Lucide Icons
- **Authentication**: JWT-based with localStorage + cookies

## Project Structure

```
app/
├── page.tsx                    # Landing page
├── layout.tsx                  # Root layout
├── login/
│   └── page.tsx               # Login page
├── admin/
│   ├── layout.tsx             # Admin layout with sidebar
│   ├── page.tsx               # Overview dashboard
│   ├── creators/
│   │   └── page.tsx           # Manage creators
│   └── storefronts/
│       └── page.tsx           # Manage storefronts
├── creator/
│   ├── layout.tsx             # Creator layout with sidebar
│   ├── page.tsx               # My Store profile
│   ├── products/
│   │   └── page.tsx           # Manage products
│   └── links/
│       └── page.tsx           # Manage social links
└── s/[handle]/
    └── page.tsx               # Public storefront

components/
├── sidebar.tsx                # Navigation sidebar
├── status-badge.tsx           # Active/inactive status indicator
├── confirm-dialog.tsx         # Confirmation dialogs
├── skeleton.tsx               # Loading skeletons
├── empty-state.tsx            # Empty state component
└── ui/                        # shadcn/ui components

lib/
├── types.ts                   # TypeScript type definitions
├── api.ts                     # Axios instance with interceptors
├── store.ts                   # Zustand authentication store
└── format.ts                  # Utility formatters (price, date)

middleware.ts                  # Route protection middleware
```

## Getting Started

### Installation

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev
```

The app will be available at `http://localhost:3000`

### Demo Credentials

The login page accepts any email/password combination for demo purposes:
- **Admin**: `admin@reelstore.com` / `password123` (role: admin)
- **Creator**: `creator@reelstore.com` / `password123` (role: creator)

## Key Features

### Authentication Flow
1. Users login with email, password, and selected role
2. Token stored in localStorage and cookie
3. Middleware protects routes based on authentication
4. Auto-redirect to dashboard based on role (admin → /admin, creator → /creator)

### Role-Based Access
- **Admin Routes**: `/admin/*` - Protected, requires admin role
- **Creator Routes**: `/creator/*` - Protected, requires creator role
- **Public Routes**: `/` and `/s/[handle]` - Accessible to all
- **Auth Routes**: `/login` - Redirects authenticated users to dashboard

### Product Management
- Creators can add/edit/delete products
- Products display images, names, descriptions, and prices
- Status toggle (active/inactive) for visibility
- Price formatted in Indian Rupees (₹)

### Storefront Display
- Mobile-first responsive design
- Creator avatar, store name, and bio
- Social links with icons
- Product grid with WhatsApp ordering
- Fallback to external ordering links if needed

## API Integration

The app uses Axios with:
- **Request Interceptor**: Automatically adds auth token from localStorage
- **Response Interceptor**: Handles 401 errors by clearing auth and redirecting to login

Base URL: `process.env.NEXT_PUBLIC_API_URL` (defaults to `http://localhost:3001/api`)

## Customization

### Adding a New Feature

1. **Create Type Definition** in `lib/types.ts`
2. **Add API Service** in `lib/api.ts`
3. **Create Component** in appropriate route directory
4. **Add State** to Zustand store if needed
5. **Protect Routes** with middleware if applicable

### Modifying Styles

- Colors and tokens defined in `globals.css` and `tailwind.config.ts`
- Component styles use shadcn/ui variants
- Responsive classes: `md:` and `lg:` prefixes

## Notes

- **No Real Database**: Data is mocked in component state for demo
- **No Image Upload**: Products use image URLs only
- **No Payments**: Orders go directly to creator via WhatsApp/email
- **No Email Sending**: All communications are manual
- **Mock Auth**: Login accepts any credentials for demonstration

## Future Enhancements

- Real backend API integration
- Payment processing (Stripe, Razorpay)
- Email notifications
- Analytics dashboard
- Inventory management
- Order tracking
- Customer reviews
- Content scheduling
- Advanced analytics

## License

MIT
