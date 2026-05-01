'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Store, ShieldOff, ClipboardList, Activity } from 'lucide-react';
import axiosInstance, { adminApi } from '@/lib/api';
import type { EarlySignup, AuditLog } from '@/lib/types';

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function AdminPage() {
  const [stats, setStats] = useState({ total: 0, active: 0, suspended: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [earlySignups, setEarlySignups] = useState<EarlySignup[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [auditFilter, setAuditFilter] = useState<'all' | 'Product' | 'User'>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [creatorsRes, storefrontsRes, signupsRes, auditRes] = await Promise.all([
          axiosInstance.get('/admin/creators'),
          axiosInstance.get('/admin/storefronts'),
          adminApi.getEarlySignups(),
          adminApi.getAuditLogs(),
        ]);
        const storefronts = storefrontsRes.data || [];
        setStats({
          total: (creatorsRes.data || []).length,
          active: storefronts.filter((s: any) => s.status === 'active').length,
          suspended: storefronts.filter((s: any) => s.status === 'suspended').length,
        });
        setEarlySignups(signupsRes.data || []);
        setAuditLogs(auditRes.data || []);
      } catch {}
      setIsLoading(false);
    };
    load();
  }, []);

  const markCreated = async (id: string) => {
    setUpdatingId(id);
    try {
      const res = await adminApi.updateEarlySignupStatus(id, 'created');
      setEarlySignups((prev) => prev.map((s) => (s.id === id ? res.data : s)));
    } catch {}
    setUpdatingId(null);
  };

  const markPending = async (id: string) => {
    setUpdatingId(id);
    try {
      const res = await adminApi.updateEarlySignupStatus(id, 'pending');
      setEarlySignups((prev) => prev.map((s) => (s.id === id ? res.data : s)));
    } catch {}
    setUpdatingId(null);
  };

  const filteredLogs = auditFilter === 'all'
    ? auditLogs
    : auditLogs.filter((l) => l.auditable_type === auditFilter);

  const cards = [
    { title: 'Total Creators', value: stats.total, icon: <Users className="w-6 h-6 text-blue-500" /> },
    { title: 'Active Storefronts', value: stats.active, icon: <Store className="w-6 h-6 text-green-500" /> },
    { title: 'Suspended', value: stats.suspended, icon: <ShieldOff className="w-6 h-6 text-red-500" /> },
    { title: 'Early Signups', value: earlySignups.length, icon: <ClipboardList className="w-6 h-6 text-purple-500" /> },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Platform overview</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              {card.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? '...' : card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Early Signups */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-purple-500" />
            <CardTitle>Early Signups</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground text-sm">Loading...</p>
          ) : earlySignups.length === 0 ? (
            <p className="text-muted-foreground text-sm">No early signups yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="text-left py-2 pr-4 font-medium">Name</th>
                    <th className="text-left py-2 pr-4 font-medium">Email</th>
                    <th className="text-left py-2 pr-4 font-medium">Instagram</th>
                    <th className="text-left py-2 pr-4 font-medium">Status</th>
                    <th className="text-left py-2 pr-4 font-medium">Signed up</th>
                    <th className="text-left py-2 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {earlySignups.map((s) => (
                    <tr key={s.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="py-2 pr-4 font-medium">{s.name}</td>
                      <td className="py-2 pr-4 text-muted-foreground">{s.email}</td>
                      <td className="py-2 pr-4 text-muted-foreground">
                        {s.instagram_handle ? `@${s.instagram_handle}` : '—'}
                      </td>
                      <td className="py-2 pr-4">
                        <Badge variant={s.status === 'created' ? 'default' : 'secondary'}>
                          {s.status}
                        </Badge>
                      </td>
                      <td className="py-2 pr-4 text-muted-foreground">{timeAgo(s.created_at)}</td>
                      <td className="py-2">
                        {s.status === 'pending' ? (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={updatingId === s.id}
                            onClick={() => markCreated(s.id)}
                          >
                            Mark Created
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={updatingId === s.id}
                            onClick={() => markPending(s.id)}
                          >
                            Revert
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Audit Logs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-orange-500" />
              <CardTitle>Activity Log</CardTitle>
            </div>
            <div className="flex gap-2">
              {(['all', 'Product', 'User'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setAuditFilter(f)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                    auditFilter === f
                      ? 'bg-foreground text-background border-foreground'
                      : 'bg-background text-muted-foreground border-border hover:border-foreground'
                  }`}
                >
                  {f === 'all' ? 'All' : f + 's'}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground text-sm">Loading...</p>
          ) : filteredLogs.length === 0 ? (
            <p className="text-muted-foreground text-sm">No activity yet.</p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/40 text-sm">
                  <span className={`mt-0.5 px-1.5 py-0.5 rounded text-xs font-semibold uppercase ${
                    log.action === 'create' ? 'bg-green-100 text-green-700' :
                    log.action === 'destroy' ? 'bg-red-100 text-red-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {log.action}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">
                      {log.auditable_type}{' '}
                      <span className="text-muted-foreground font-mono text-xs">{log.auditable_id.slice(0, 8)}…</span>
                    </p>
                    {log.changes && Object.keys(log.changes).length > 0 && (
                      <p className="text-muted-foreground text-xs mt-0.5 truncate">
                        Changed: {Object.keys(log.changes).join(', ')}
                      </p>
                    )}
                    <p className="text-muted-foreground text-xs mt-0.5">
                      by {log.performed_by?.email ?? 'system'} · {timeAgo(log.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
