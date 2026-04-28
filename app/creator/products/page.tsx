'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, ImagePlus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ConfirmDialog } from '@/components/confirm-dialog';
import axiosInstance from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { validateIndianPhone } from '@/lib/utils';
import type { Product } from '@/lib/types';

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  draft: 'bg-gray-100 text-gray-800',
  out_of_stock: 'bg-red-100 text-red-800',
  archived: 'bg-yellow-100 text-yellow-800',
};

const ALL_STATUSES = ['all', 'active', 'draft', 'out_of_stock', 'archived'] as const;
type StatusFilter = typeof ALL_STATUSES[number];

const EMPTY_FORM = {
  name: '', description: '', price: '', currency: 'INR',
  stock: '0', category: '', status: 'draft',
  whatsapp_number: '', external_link: '', order_instructions: '',
};

export default function ProductsPage() {
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [confirmDelete, setConfirmDelete] = useState<Product | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [phoneError, setPhoneError] = useState('');

  const filteredProducts = statusFilter === 'all'
    ? products
    : products.filter((p) => p.status === statusFilter);

  const load = async () => {
    try {
      const res = await axiosInstance.get('/products');
      setProducts(res.data || []);
    } catch {}
    setIsLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditingProduct(null);
    setForm(EMPTY_FORM);
    setNewImages([]);
    setImagePreviews([]);
    setPhoneError('');
    setShowForm(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      currency: product.currency,
      stock: String(product.stock),
      category: product.category || '',
      status: product.status,
      whatsapp_number: product.whatsapp_number || '',
      external_link: product.external_link || '',
      order_instructions: product.order_instructions || '',
    });
    setNewImages([]);
    setImagePreviews([]);
    setPhoneError('');
    setShowForm(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewImages((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [
      ...prev,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);
    // reset input so same file can be re-selected
    e.target.value = '';
  };

  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const deleteExistingImage = async (productId: string, imageId: string) => {
    try {
      await axiosInstance.delete(`/products/${productId}/images/${imageId}`);
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId
            ? { ...p, images: p.images.filter((img) => img.id !== imageId) }
            : p
        )
      );
      if (editingProduct?.id === productId) {
        setEditingProduct((prev) =>
          prev ? { ...prev, images: prev.images.filter((img) => img.id !== imageId) } : prev
        );
      }
    } catch {
      toast({ title: 'Failed to delete image', variant: 'destructive' });
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.price) {
      toast({ title: 'Name and price are required', variant: 'destructive' });
      return;
    }
    const waErr = validateIndianPhone(form.whatsapp_number);
    if (waErr) {
      setPhoneError(waErr);
      return;
    }
    setPhoneError('');
    setSaving(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v !== '') data.append(k, v); });
      newImages.forEach((img) => data.append('images[]', img));

      if (editingProduct) {
        await axiosInstance.patch(`/products/${editingProduct.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast({ title: 'Product updated!' });
      } else {
        await axiosInstance.post('/products', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast({ title: 'Product created!' });
      }

      setShowForm(false);
      load();
    } catch (err: any) {
      toast({
        title: err?.response?.data?.error?.join?.(', ') || 'Failed to save product',
        variant: 'destructive',
      });
    }
    setSaving(false);
  };

  const handleDelete = async (product: Product) => {
    try {
      await axiosInstance.delete(`/products/${product.id}`);
      toast({ title: 'Product deleted' });
      load();
    } catch {
      toast({ title: 'Failed to delete', variant: 'destructive' });
    }
    setConfirmDelete(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground mt-1">{filteredProducts.length} of {products.length} products</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" /> Add Product
        </Button>
      </div>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2">
        {ALL_STATUSES.map((s) => {
          const count = s === 'all' ? products.length : products.filter((p) => p.status === s).length;
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                statusFilter === s
                  ? 'bg-foreground text-background border-foreground'
                  : 'bg-background text-muted-foreground border-border hover:border-foreground'
              }`}
            >
              {s === 'all' ? 'All' : s.replace('_', ' ')}
              <span className="ml-1.5 opacity-70">{count}</span>
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <p className="text-4xl mb-3">🛍️</p>
            <p>{statusFilter === 'all' ? 'No products yet. Add your first one!' : `No ${statusFilter.replace('_', ' ')} products.`}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => openEdit(product)}
            >
              <div className="aspect-video bg-gray-100 relative">
                {product.images?.[0] ? (
                  <img
                    src={product.images[0].url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">🛍️</div>
                )}
                {product.images?.length > 1 && (
                  <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
                    +{product.images.length - 1} more
                  </span>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-sm leading-tight">{product.name}</h3>
                  <button
                    onClick={(e) => { e.stopPropagation(); setConfirmDelete(product); }}
                    className="text-muted-foreground hover:text-destructive flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="font-bold mt-1">₹{Number(product.price).toLocaleString('en-IN')}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[product.status]}`}>
                    {product.status.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-muted-foreground">Stock: {product.stock}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Product Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add Product'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Images */}
            <div>
              <Label>Images</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {/* Existing images */}
                {editingProduct?.images?.map((img) => (
                  <div key={img.id} className="relative w-20 h-20">
                    <img src={img.url} alt="" className="w-full h-full object-cover rounded-lg" />
                    <button
                      onClick={() => deleteExistingImage(editingProduct.id, img.id)}
                      className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {/* New image previews */}
                {imagePreviews.map((src, i) => (
                  <div key={i} className="relative w-20 h-20">
                    <img src={src} alt="" className="w-full h-full object-cover rounded-lg" />
                    <button
                      onClick={() => removeNewImage(i)}
                      className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {/* Upload button */}
                <button
                  onClick={() => fileRef.current?.click()}
                  className="w-20 h-20 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground hover:border-foreground transition-colors"
                >
                  <ImagePlus className="w-5 h-5" />
                  <span className="text-xs mt-1">Add</span>
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            <div>
              <Label>Product Name *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Handmade Earrings"
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2}
                placeholder="Describe your product..."
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Price (₹) *</Label>
                <Input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="499"
                />
              </div>
              <div>
                <Label>Stock</Label>
                <Input
                  type="number"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  placeholder="10"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Category</Label>
                <Input
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="Jewellery, Clothing..."
                />
              </div>
              <div>
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>WhatsApp Number</Label>
              <Input
                value={form.whatsapp_number}
                onChange={(e) => {
                  const val = e.target.value;
                  setForm({ ...form, whatsapp_number: val });
                  if (phoneError) setPhoneError(validateIndianPhone(val) || '');
                }}
                onBlur={() => setPhoneError(validateIndianPhone(form.whatsapp_number) || '')}
                placeholder="9999999999"
                className={phoneError ? 'border-destructive focus-visible:ring-destructive' : ''}
              />
              {phoneError && (
                <p className="text-xs text-destructive mt-1">{phoneError}</p>
              )}
            </div>

            <div>
              <Label>External Link (optional)</Label>
              <Input
                value={form.external_link}
                onChange={(e) => setForm({ ...form, external_link: e.target.value })}
                placeholder="https://wa.me/..."
              />
            </div>

            <div>
              <Label>Order Instructions</Label>
              <Textarea
                value={form.order_instructions}
                onChange={(e) => setForm({ ...form, order_instructions: e.target.value })}
                rows={2}
                placeholder="DM on Instagram to order..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : editingProduct ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!confirmDelete}
        title="Delete Product"
        description={`Are you sure you want to delete "${confirmDelete?.name}"?`}
        onConfirm={() => confirmDelete && handleDelete(confirmDelete)}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}