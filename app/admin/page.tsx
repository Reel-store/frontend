'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Store, Package, ShieldOff } from 'lucide-react';
import axiosInstance from '@/lib/api';

export default function AdminPage() {
  const [stats, setStats] = useState({ total: 0, active: 0, suspended: 0, products: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [creatorsRes, storefrontsRes] = await Promise.all([
          axiosInstance.get('/admin/creators'),
          axiosInstance.get('/admin/storefronts'),
        ]);
        const creators = creatorsRes.data || [];
        const storefronts = storefrontsRes.data || [];
        setStats({
          total: creators.length,
          active: storefronts.filter((s: any) => s.status === 'active').length,
          suspended: storefronts.filter((s: any) => s.status === 'suspended').length,
          products: 0,
        });
      } catch {}
      setIsLoading(false);
    };
    load();
  }, []);

  const cards = [
    { title: 'Total Creators', value: stats.total, icon: <Users className="w-6 h-6 text-blue-500" /> },
    { title: 'Active Storefronts', value: stats.active, icon: <Store className="w-6 h-6 text-green-500" /> },
    { title: 'Suspended', value: stats.suspended, icon: <ShieldOff className="w-6 h-6 text-red-500" /> },
    { title: 'Products', value: stats.products, icon: <Package className="w-6 h-6 text-purple-500" /> },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Platform overview</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              {card.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? '...' : card.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
