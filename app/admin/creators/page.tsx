'use client';

import { useState, useEffect } from 'react';
import { Plus, MoreVertical, Check, X, Trash2, LogIn  } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import axiosInstance from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import type { Creator } from '@/lib/types';

export default function CreatorsPage() {
  const { toast } = useToast();
  const [creators, setCreators] = useState<Creator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [form, setForm] = useState({
    email: '', password: '', storefront_handle: '',
    storefront_name: '', instagram_username: '', contact_email: '', contact_phone: '',
  });
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean; action: 'activate' | 'deactivate' | 'delete' | null; creator: Creator | null;
  }>({ open: false, action: null, creator: null });

  const load = async () => {
    try {
      const res = await axiosInstance.get('/admin/creators');
      setCreators(res.data || []);
    } catch {}
    setIsLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleImpersonate = async (creator: Creator) => {
    try {
      const res = await axiosInstance.post(`/admin/creators/${creator.id}/impersonate`);
      const { token, user } = res.data;
      // Save current admin session so we can come back
      const adminToken = localStorage.getItem('auth_token');
      const adminUser = localStorage.getItem('auth_user');
      if (adminToken) localStorage.setItem('admin_backup_token', adminToken);
      if (adminUser) localStorage.setItem('admin_backup_user', adminUser);
      // Switch to creator session — must use setAuth so Zustand's persisted
      // auth-store key is updated before the full-page reload
      useAuthStore.getState().setAuth(user, token);
      document.cookie = `auth_token=${token}; path=/; max-age=3600`;
      document.cookie = `auth_user=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=3600`;
      window.location.href = '/creator';
    } catch {
      toast({ title: 'Failed to impersonate', variant: 'destructive' });
    }
  };

  const handleCreate = async () => {
    setCreating(true);
    setCreateError('');
    try {
      await axiosInstance.post('/admin/creators', form);
      setShowCreate(false);
      setForm({ email: '', password: '', storefront_handle: '', storefront_name: '', instagram_username: '', contact_email: '', contact_phone: '' });
      load();
    } catch (err: any) {
      setCreateError(err?.response?.data?.error?.join(', ') || 'Failed to create creator');
    }
    setCreating(false);
  };

  const confirmAction = async () => {
    if (!confirmDialog.creator || !confirmDialog.action) return;
    try {
      if (confirmDialog.action === 'delete') {
        await axiosInstance.delete(`/admin/creators/${confirmDialog.creator.id}`);
      } else {
        await axiosInstance.patch(`/admin/creators/${confirmDialog.creator.id}/status`, {
          active: confirmDialog.action === 'activate',
        });
      }
      load();
    } catch {}
    setConfirmDialog({ open: false, action: null, creator: null });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Creators</h1>
          <p className="text-muted-foreground mt-1">Manage platform creators</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add Creator
        </Button>
      </div>

      <Card>
        <CardHeader><CardTitle>All Creators ({creators.length})</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : creators.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No creators yet. Create one to get started.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Storefront</TableHead>
                  <TableHead>Instagram</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {creators.map((creator) => (
                  <TableRow key={creator.id}>
                    <TableCell className="font-medium">{creator.email}</TableCell>
                    <TableCell>
                      {creator.storefront ? (
                        <span className="text-sm">@{creator.storefront.handle}</span>
                      ) : '—'}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {creator.storefront?.instagram_username ? `@${creator.storefront.instagram_username}` : '—'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={creator.active ? 'default' : 'destructive'}>
                        {creator.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {creator.created_at ? new Date(creator.created_at).toLocaleDateString('en-IN') : '—'}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm"><MoreVertical className="w-4 h-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() =>
                            setConfirmDialog({ open: true, action: creator.active ? 'deactivate' : 'activate', creator })
                          }>
                            {creator.active ? <><X className="w-4 h-4 mr-2" />Deactivate</> : <><Check className="w-4 h-4 mr-2" />Activate</>}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setConfirmDialog({ open: true, action: 'delete', creator })}
                            className="text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />Delete
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleImpersonate(creator)}>
                          <LogIn className="w-4 h-4 mr-2" />Login as Creator
                        </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Creator Modal */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Create Creator Account</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            {createError && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{createError}</div>
            )}
            {[
              { label: 'Email *', key: 'email', type: 'email', placeholder: 'creator@example.com' },
              { label: 'Password *', key: 'password', type: 'password', placeholder: '••••••••' },
              { label: 'Storefront Handle *', key: 'storefront_handle', type: 'text', placeholder: 'mystore' },
              { label: 'Storefront Name *', key: 'storefront_name', type: 'text', placeholder: 'My Store' },
              { label: 'Instagram Username', key: 'instagram_username', type: 'text', placeholder: 'username' },
              { label: 'Contact Email', key: 'contact_email', type: 'email', placeholder: 'contact@example.com' },
              { label: 'Contact Phone', key: 'contact_phone', type: 'text', placeholder: '+91-9999999999' },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key} className="space-y-1">
                <Label>{label}</Label>
                <Input
                  type={type}
                  placeholder={placeholder}
                  value={(form as any)[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={creating}>
              {creating ? 'Creating...' : 'Create Creator'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.action === 'delete' ? 'Delete Creator' : confirmDialog.action === 'activate' ? 'Activate Creator' : 'Deactivate Creator'}
        description={
          confirmDialog.action === 'delete'
            ? `Permanently delete ${confirmDialog.creator?.email}? This cannot be undone.`
            : confirmDialog.action === 'activate'
            ? `Activate ${confirmDialog.creator?.email}?`
            : `Deactivate ${confirmDialog.creator?.email}? They will lose access.`
        }
        actionLabel={confirmDialog.action === 'delete' ? 'Delete' : confirmDialog.action === 'activate' ? 'Activate' : 'Deactivate'}
        isDestructive={confirmDialog.action !== 'activate'}
        onConfirm={confirmAction}
        onCancel={() => setConfirmDialog({ open: false, action: null, creator: null })}
      />
    </div>
  );
}
