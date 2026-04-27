'use client';

import { useState, useEffect } from 'react';
import { Package, Phone, Mail, ChevronDown, Loader2, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import axiosInstance from '@/lib/api';
import type { Order, OrderStatus } from '@/lib/types';

const ALL_STATUSES: OrderStatus[] = ['pending', 'contacted', 'awaiting_payment', 'paid', 'fulfilled', 'cancelled'];

const STATUS_META: Record<OrderStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending:          { label: 'Pending',           variant: 'secondary' },
  contacted:        { label: 'Contacted',          variant: 'default' },
  awaiting_payment: { label: 'Awaiting Payment',  variant: 'default' },
  paid:             { label: 'Paid',               variant: 'default' },
  fulfilled:        { label: 'Fulfilled',          variant: 'default' },
  cancelled:        { label: 'Cancelled',          variant: 'destructive' },
};

const NEXT_STATUSES: Record<OrderStatus, OrderStatus[]> = {
  pending:          ['contacted', 'cancelled'],
  contacted:        ['awaiting_payment', 'cancelled'],
  awaiting_payment: ['paid', 'cancelled'],
  paid:             ['fulfilled', 'cancelled'],
  fulfilled:        [],
  cancelled:        [],
};

export default function CreatorOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [updateDialog, setUpdateDialog] = useState<{
    open: boolean; order: Order | null; newStatus: OrderStatus | ''; creatorNote: string;
  }>({ open: false, order: null, newStatus: '', creatorNote: '' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get('/orders', { params: { status: statusFilter } });
      setOrders(res.data || []);
    } catch {}
    setIsLoading(false);
  };

  useEffect(() => { load(); }, [statusFilter]);

  const openUpdate = (order: Order) => {
    setUpdateDialog({ open: true, order, newStatus: order.status, creatorNote: order.creator_note || '' });
  };

  const handleUpdate = async () => {
    if (!updateDialog.order) return;
    setSaving(true);
    try {
      await axiosInstance.patch(`/orders/${updateDialog.order.id}`, {
        status: updateDialog.newStatus || undefined,
        creator_note: updateDialog.creatorNote || undefined,
      });
      setUpdateDialog({ open: false, order: null, newStatus: '', creatorNote: '' });
      load();
    } catch {}
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Orders</h1>
          <p className="text-muted-foreground mt-1">Manage customer orders for your store</p>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="All orders" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All orders</SelectItem>
            {ALL_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>{STATUS_META[s].label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : orders.length === 0 ? (
        <Card>
          <CardContent className="py-20 text-center">
            <Package className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">
              {statusFilter === 'all' ? 'No orders yet.' : `No ${STATUS_META[statusFilter as OrderStatus]?.label} orders.`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const meta = STATUS_META[order.status];
            const nextStatuses = NEXT_STATUSES[order.status];
            return (
              <Card key={order.id} className="overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    {/* Left: customer info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-foreground">{order.customer_name}</p>
                        <Badge variant={meta.variant} className="text-xs">{meta.label}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                        {order.customer_phone && (
                          <a href={`tel:${order.customer_phone}`} className="flex items-center gap-1 hover:text-foreground">
                            <Phone className="w-3 h-3" />{order.customer_phone}
                          </a>
                        )}
                        {order.customer_email && (
                          <a href={`mailto:${order.customer_email}`} className="flex items-center gap-1 hover:text-foreground">
                            <Mail className="w-3 h-3" />{order.customer_email}
                          </a>
                        )}
                      </div>

                      {/* Items */}
                      <div className="mt-3 space-y-0.5">
                        {order.items.map((item) => (
                          <p key={item.id} className="text-sm text-muted-foreground">
                            {item.product_name} × {item.quantity}
                            <span className="ml-1 font-medium text-foreground">
                              — ₹{Number(item.subtotal).toLocaleString('en-IN')}
                            </span>
                          </p>
                        ))}
                      </div>

                      {order.customer_notes && (
                        <p className="text-xs text-muted-foreground mt-2 italic">"{order.customer_notes}"</p>
                      )}
                      {order.creator_note && (
                        <p className="text-xs text-blue-600 mt-1">Note: {order.creator_note}</p>
                      )}
                    </div>

                    {/* Right: total + actions */}
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <p className="font-bold text-foreground text-lg">
                        ₹{Number(order.total_amount).toLocaleString('en-IN')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                      <Button size="sm" variant="outline" onClick={() => openUpdate(order)}>
                        Update Status
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Update Status Dialog */}
      <Dialog
        open={updateDialog.open}
        onOpenChange={(open) => !open && setUpdateDialog({ open: false, order: null, newStatus: '', creatorNote: '' })}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Update Order</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-1">
            <div>
              <Label className="mb-1.5 block">Customer</Label>
              <p className="text-sm font-medium">{updateDialog.order?.customer_name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                ₹{Number(updateDialog.order?.total_amount || 0).toLocaleString('en-IN')} · {updateDialog.order?.items.length} item(s)
              </p>
            </div>

            <div>
              <Label className="mb-1.5 block">Status</Label>
              <Select
                value={updateDialog.newStatus}
                onValueChange={(v) => setUpdateDialog((d) => ({ ...d, newStatus: v as OrderStatus }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {/* Current status always available */}
                  {updateDialog.order && (
                    <SelectItem value={updateDialog.order.status}>
                      {STATUS_META[updateDialog.order.status]?.label} (current)
                    </SelectItem>
                  )}
                  {updateDialog.order &&
                    NEXT_STATUSES[updateDialog.order.status].map((s) => (
                      <SelectItem key={s} value={s}>{STATUS_META[s].label}</SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-1.5 block">Note to customer (optional)</Label>
              <Textarea
                value={updateDialog.creatorNote}
                onChange={(e) => setUpdateDialog((d) => ({ ...d, creatorNote: e.target.value }))}
                placeholder="e.g. Will call you tomorrow to confirm payment"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setUpdateDialog({ open: false, order: null, newStatus: '', creatorNote: '' })}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
