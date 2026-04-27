'use client';

import { useState, useEffect } from 'react';
import { MoreVertical, Check, X, ExternalLink, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axiosInstance from '@/lib/api';
import type { Storefront } from '@/lib/types';

const statusColor: Record<string, 'default' | 'destructive' | 'secondary'> = {
  active: 'default', suspended: 'destructive', pending: 'secondary',
};

export default function StorefrontsPage() {
  const [storefronts, setStorefronts] = useState<Storefront[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean; action: 'activate' | 'suspend' | null; storefront: Storefront | null;
  }>({ open: false, action: null, storefront: null });
  const [renameDialog, setRenameDialog] = useState<{ open: boolean; storefront: Storefront | null; newName: string }>(
    { open: false, storefront: null, newName: '' }
  );
  const [renaming, setRenaming] = useState(false);

  const load = async () => {
    try {
      const res = await axiosInstance.get('/admin/storefronts');
      setStorefronts(res.data || []);
    } catch {}
    setIsLoading(false);
  };

  useEffect(() => { load(); }, []);

  const confirmAction = async () => {
    if (!confirmDialog.storefront || !confirmDialog.action) return;
    try {
      await axiosInstance.patch(`/admin/storefronts/${confirmDialog.storefront.id}/${confirmDialog.action}`);
      load();
    } catch {}
    setConfirmDialog({ open: false, action: null, storefront: null });
  };

  const handleRename = async () => {
    if (!renameDialog.storefront || !renameDialog.newName.trim()) return;
    setRenaming(true);
    try {
      await axiosInstance.patch(`/admin/storefronts/${renameDialog.storefront.id}`, { name: renameDialog.newName.trim() });
      load();
      setRenameDialog({ open: false, storefront: null, newName: '' });
    } catch {}
    setRenaming(false);
  };

  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Storefronts</h1>
        <p className="text-muted-foreground mt-1">Monitor and manage all storefronts</p>
      </div>
      <Card>
        <CardHeader><CardTitle>All Storefronts ({storefronts.length})</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : storefronts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No storefronts yet.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Handle</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Creator</TableHead>
                  <TableHead>Instagram</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {storefronts.map((sf) => (
                  <TableRow key={sf.id}>
                    <TableCell className="font-mono text-sm">@{sf.handle}</TableCell>
                    <TableCell className="font-medium">{sf.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{sf.user?.email || '—'}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {sf.instagram_username ? `@${sf.instagram_username}` : '—'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusColor[sf.status] || 'secondary'}>{sf.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm"><MoreVertical className="w-4 h-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => window.open(`${apiBase}/s/${sf.handle}`, '_blank')}>
                            <ExternalLink className="w-4 h-4 mr-2" />View Public Page
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setRenameDialog({ open: true, storefront: sf, newName: sf.name })}>
                            <Pencil className="w-4 h-4 mr-2" />Rename
                          </DropdownMenuItem>
                          {sf.status !== 'active' ? (
                            <DropdownMenuItem onClick={() => setConfirmDialog({ open: true, action: 'activate', storefront: sf })}>
                              <Check className="w-4 h-4 mr-2" />Activate
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => setConfirmDialog({ open: true, action: 'suspend', storefront: sf })}
                              className="text-destructive"
                            >
                              <X className="w-4 h-4 mr-2" />Suspend
                            </DropdownMenuItem>
                          )}
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
      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.action === 'activate' ? 'Activate Storefront' : 'Suspend Storefront'}
        description={
          confirmDialog.action === 'activate'
            ? `Activate @${confirmDialog.storefront?.handle}? It will be visible publicly.`
            : `Suspend @${confirmDialog.storefront?.handle}? It will be hidden from public.`
        }
        actionLabel={confirmDialog.action === 'activate' ? 'Activate' : 'Suspend'}
        isDestructive={confirmDialog.action === 'suspend'}
        onConfirm={confirmAction}
        onCancel={() => setConfirmDialog({ open: false, action: null, storefront: null })}
      />

      {/* Rename dialog */}
      <Dialog open={renameDialog.open} onOpenChange={(open) => !open && setRenameDialog({ open: false, storefront: null, newName: '' })}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Rename Storefront</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <Label className="text-sm mb-1.5 block">Store Name</Label>
            <Input
              value={renameDialog.newName}
              onChange={(e) => setRenameDialog((d) => ({ ...d, newName: e.target.value }))}
              onKeyDown={(e) => e.key === 'Enter' && handleRename()}
              placeholder="Enter new store name"
              autoFocus
            />
            <p className="text-xs text-muted-foreground mt-1.5">Storefront: @{renameDialog.storefront?.handle}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameDialog({ open: false, storefront: null, newName: '' })}>Cancel</Button>
            <Button onClick={handleRename} disabled={renaming || !renameDialog.newName.trim()}>
              {renaming ? 'Saving…' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
