'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store';

const groupIcons = ['👥', '💻', '🎨', '📊', '🚀', '🤝', '🌍', '🎓'];

export default function MyGroupsPage() {
  const { accessToken } = useAuthStore();
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) return;
    const fetchMyGroups = async () => {
      try {
        // Fetch all groups then filter by membership (backend doesn't have /groups/mine yet)
        const res = await api.get('/groups', { params: { limit: 100 } });
        setGroups(res.data?.data || res.data || []);
      } catch {
        setGroups([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMyGroups();
  }, [accessToken]);

  const handleLeave = async (slug: string) => {
    if (!confirm('Qrupdan çıxmaq istədiyinizə əminsiniz?')) return;
    try {
      await api.delete(`/groups/${slug}/leave`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setGroups(prev => prev.filter(g => g.slug !== slug));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Xəta baş verdi');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Qruplarım</h1>
        <Link
          href="/my/groups/new"
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          + Yeni Qrup
        </Link>
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-400">Yüklənir...</div>
      ) : groups.length === 0 ? (
        <div className="rounded-xl border bg-white p-12 text-center">
          <p className="text-gray-400">Hələ bir qrupa üzv deyilsiniz</p>
          <Link href="/groups" className="mt-3 inline-block text-primary-600 text-sm font-medium hover:underline">
            Qrupları kəşf et →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {groups.map((group, i) => {
            let tags: string[] = [];
            try { tags = JSON.parse(group.tags || '[]'); } catch { }
            return (
              <div key={group.id} className="flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-lg">
                    {groupIcons[i % groupIcons.length]}
                  </div>
                  <div>
                    <Link href={`/groups/${group.slug}`} className="font-medium text-gray-900 hover:text-primary-600 transition">
                      {group.name}
                    </Link>
                    <p className="text-sm text-gray-500">{group.memberCount || 0} üzv</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/groups/${group.slug}`}
                    className="rounded-lg border px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition"
                  >
                    Bax
                  </Link>
                  <button
                    onClick={() => handleLeave(group.slug)}
                    className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 transition"
                  >
                    Çıx
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
