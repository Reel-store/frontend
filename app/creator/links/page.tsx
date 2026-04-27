'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import axiosInstance from '@/lib/api';
import type { StorefrontLink } from '@/lib/types';

const platformEmoji: Record<string, string> = {
  instagram: '📷', youtube: '📺', whatsapp: '💬', website: '🌐', twitter: '𝕏', other: '🔗',
};

const platforms = ['instagram', 'youtube', 'whatsapp', 'website', 'twitter', 'other'];

const emptyForm = { platform: 'instagram', url: '', label: '', position: '0' };

export default function LinksPage() {
  const [links, setLinks] = useState<StorefrontLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [form, setForm] = useState({ ...emptyForm });
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean; link: StorefrontLink | null;
  }>({ open: false, link: null });

  const load = async () => {
    try {
      const res = await axiosInstance.get('/storefront/links');
      setLinks(res.data || []);
    } catch {}
    setIsLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaveError('');
    try {
      await axiosInstance.post('/storefront/links', {
        ...form,
        position: parseInt(form.position) || 0,
      });
      setShowModal(false);
      setForm({ ...emptyForm });
      load();
    } catch (err: any) {
      setSaveError(err?.response?.data?.error || 'Failed to add link');
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!confirmDialog.link) return;
    try {
      await axiosInstance.delete(`/storefront/links/${confirmDialog.link.id}`);
      load();
    } catch {}
    setConfirmDialog({ open: false, link: null });
  };

  const sortedLinks = [...links].sort((a, b) => a.position - b.position);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Links</h1>
          <p className="text-muted-foreground mt-1">Links displayed on your public storefront</p>
        </div>
        <Button onClick={() => { setForm({ ...emptyForm }); setSaveError(''); setShowModal(true); }}>
          <Plus className="w-4 h-4 mr-2" />Add Link
        </Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Your Links ({links.length})</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading links...</div>
          ) : sortedLinks.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg font-medium">No links yet</p>
              <p className="text-sm mt-1">Add links to Instagram, WhatsApp, YouTube etc.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8"></TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Label</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedLinks.map((link) => (
                  <TableRow key={link.id}>
                    <TableCell>
                      <GripVertical className="w-4 h-4 text-muted-foreground" />
                    </TableCell>
                    <TableCell className="font-medium">
                      <span className="mr-2">{platformEmoji[link.platform] || '🔗'}</span>
                      {link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}
                    </TableCell>
                    <TableCell>{link.label || '—'}</TableCell>
                    <TableCell>
                      <a href={link.url} target="_blank" rel="noopener noreferrer"
                        className="text-primary hover:underline text-sm truncate max-w-48 block">
                        {link.url}
                      </a>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{link.position}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm"
                        onClick={() => setConfirmDialog({ open: true, link })}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add Link Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Add Link</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            {saveError && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{saveError}</div>
            )}
            <div className="space-y-1">
              <Label>Platform</Label>
              <Select value={form.platform} onValueChange={v => setForm({ ...form, platform: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {platforms.map(p => (
                    <SelectItem key={p} value={p}>
                      {platformEmoji[p]} {p.charAt(0).toUpperCase() + p.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>URL *</Label>
              <Input placeholder="https://instagram.com/yourhandle" value={form.url}
                onChange={e => setForm({ ...form, url: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>Label</Label>
              <Input placeholder="Follow on Instagram" value={form.label}
                onChange={e => setForm({ ...form, label: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>Position (lower = first)</Label>
              <Input type="number" placeholder="0" value={form.position}
                onChange={e => setForm({ ...form, position: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving || !form.url.trim()}>
              {saving ? 'Adding...' : 'Add Link'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmDialog.open}
        title="Delete Link"
        description={`Delete this ${confirmDialog.link?.platform} link? This cannot be undone.`}
        actionLabel="Delete"
        isDestructive
        onConfirm={handleDelete}
        onCancel={() => setConfirmDialog({ open: false, link: null })}
      />
    </div>
  );
}
