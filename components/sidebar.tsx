'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { LogOut, Users, Store, Link as LinkIcon, BarChart3, Palette, ShoppingCart } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, clearAuth, setAuth } = useAuthStore();
  const [isImpersonating, setIsImpersonating] = useState(false);

  useEffect(() => {
    setIsImpersonating(!!localStorage.getItem('admin_backup_token'));
  }, []);

  const navItems: NavItem[] =
    user?.role === 'super_admin'
      ? [
          { label: 'Overview', href: '/admin', icon: <BarChart3 className="w-4 h-4" /> },
          { label: 'Creators', href: '/admin/creators', icon: <Users className="w-4 h-4" /> },
          { label: 'Storefronts', href: '/admin/storefronts', icon: <Store className="w-4 h-4" /> },
        ]
      : [
          { label: 'My Store', href: '/creator', icon: <Store className="w-4 h-4" /> },
          { label: 'Storefront', href: '/creator/storefront', icon: <Palette className="w-4 h-4" /> },
          { label: 'Products', href: '/creator/products', icon: <BarChart3 className="w-4 h-4" /> },
          { label: 'Orders', href: '/creator/orders', icon: <ShoppingCart className="w-4 h-4" /> },
          { label: 'Links', href: '/creator/links', icon: <LinkIcon className="w-4 h-4" /> },
        ];

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
  };

  const isActive = (href: string) => {
    if (href === '/admin' || href === '/creator') return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside className="bg-secondary border-r border-border w-64 flex flex-col">
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-bold text-foreground">Reelstore</h1>
        <p className="text-sm text-muted-foreground capitalize mt-1">{user?.role}</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button
              variant={isActive(item.href) ? 'default' : 'ghost'}
              className="w-full justify-start"
            >
              {item.icon}
              <span className="ml-3">{item.label}</span>
            </Button>
          </Link>
        ))}
      </nav>
      {/* Show "Back to Admin" if impersonating */}
      {isImpersonating && (
        <div className="p-4 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-orange-600 border-orange-300 hover:bg-orange-50"
            onClick={() => {
              const adminToken = localStorage.getItem('admin_backup_token');
              const adminUser = localStorage.getItem('admin_backup_user');
              if (adminToken && adminUser) {
                const parsedAdminUser = JSON.parse(adminUser);
                localStorage.removeItem('admin_backup_token');
                localStorage.removeItem('admin_backup_user');
                // Use setAuth so Zustand's persisted auth-store key is updated
                // before the full-page reload
                setAuth(parsedAdminUser, adminToken);
                document.cookie = `auth_token=${adminToken}; path=/; max-age=86400`;
                document.cookie = `auth_user=${encodeURIComponent(adminUser)}; path=/; max-age=86400`;
                window.location.href = '/admin';
              }
            }}>
            ← Back to Admin
          </Button>
        </div>
      )}

      <div className="p-4 border-t border-border space-y-2">
        <div className="text-sm">
          <p className="text-muted-foreground">Signed in as</p>
          <p className="font-medium truncate">{user?.email}</p>
        </div>
        <Button onClick={handleLogout} variant="outline" className="w-full justify-start">
          <LogOut className="w-4 h-4" />
          <span className="ml-3">Logout</span>
        </Button>
      </div>
    </aside>
  );
}