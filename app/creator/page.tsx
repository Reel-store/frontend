'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, AlertTriangle } from 'lucide-react';
import axiosInstance from '@/lib/api';
import type { Storefront } from '@/lib/types';

export default function CreatorPage() {
  const [storefront, setStorefront] = useState<Storefront | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    description: '', instagram_username: '', instagram_profile_url: '',
    contact_email: '', contact_phone: '', shipping_note: '', payment_note: '',
  });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axiosInstance.get('/storefront');
        const sf = res.data;
        setStorefront(sf);
        setForm({
          description: sf.description || '',
          instagram_username: sf.instagram_username || '',
          instagram_profile_url: sf.instagram_profile_url || '',
          contact_email: sf.contact_email || '',
          contact_phone: sf.contact_phone || '',
          shipping_note: sf.shipping_note || '',
          payment_note: sf.payment_note || '',
        });
      } catch {}
      setIsLoading(false);
    };
    load();
  }, []);

  const onSave = async () => {
    setIsSaving(true);
    try {
      const res = await axiosInstance.patch('/storefront', form);
      setStorefront(res.data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {}
    setIsSaving(false);
  };

  const publicUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/s/${storefront?.handle}`;

  const copyUrl = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) return <div className="text-center py-16 text-muted-foreground">Loading your store...</div>;

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Store</h1>
        <p className="text-muted-foreground mt-1">Manage your storefront information</p>
      </div>

      {storefront?.status === 'suspended' && (
        <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive rounded-lg text-destructive">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">
            Your storefront is currently suspended. For any queries, please write to us at{' '}
            <a href="mailto:contact@orionatech.in" className="underline font-semibold">contact@orionatech.in</a>.
          </span>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{storefront?.name}</CardTitle>
              <CardDescription>@{storefront?.handle}</CardDescription>
            </div>
            <Badge variant={storefront?.status === 'active' ? 'default' : 'destructive'}>
              {storefront?.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: 'Description', key: 'description', placeholder: 'Tell customers about your store...' },
            { label: 'Instagram Username', key: 'instagram_username', placeholder: 'yourhandle' },
            { label: 'Instagram Profile URL', key: 'instagram_profile_url', placeholder: 'https://instagram.com/yourhandle' },
            { label: 'Contact Email', key: 'contact_email', placeholder: 'you@example.com' },
            { label: 'Contact Phone', key: 'contact_phone', placeholder: '+91-9999999999' },
            { label: 'Shipping Note', key: 'shipping_note', placeholder: 'Ships in 3-5 days via India Post...' },
            { label: 'Payment Note', key: 'payment_note', placeholder: 'Pay via UPI: yourname@upi' },
          ].map(({ label, key, placeholder }) => (
            <div key={key} className="space-y-1">
              <Label>{label}</Label>
              <Input
                placeholder={placeholder}
                value={(form as any)[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              />
            </div>
          ))}
          <Button onClick={onSave} disabled={isSaving} className="w-full">
            {isSaving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Instagram Bio Link</CardTitle>
          <CardDescription>Paste this in your Instagram bio</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 p-3 bg-secondary rounded-md border border-border">
            <Input value={publicUrl} readOnly className="bg-transparent border-0 text-sm" />
            <Button size="sm" variant="outline" onClick={copyUrl}>
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            This is your public storefront URL. Add it to your Instagram bio!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
