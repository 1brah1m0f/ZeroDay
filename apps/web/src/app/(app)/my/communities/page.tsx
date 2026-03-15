'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store';

const groupIcons = ['👥', '💻', '🎨', '📊', '🚀', '🤝', '🌍', '🎓'];

export default function MyCommunitiesPage() {
  const { accessToken } = useAuthStore();
  const [communities, setCommunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) return;
    const fetchMyCommunities = async () => {
      try {
        const res = await api.get('/communities', { params: { limit: 100 } });
        setCommunities(res.data?.data || res.data || []);
      } catch {
        setCommunities([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMyCommunities();
  }, [accessToken]);

  const handleLeave = async (slug: string) => {
    if (!confirm('İcmadan çıxmaq istədiyinizə əminsiniz?')) return;
    try {
      await api.delete(`/communities/${slug}/leave`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setCommunities(prev => prev.filter(g => g.slug !== slug));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Xəta baş verdi');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">İcmalarım</h1>
        <Link
          href="/my/communities/new"
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          + Yeni İcma
        </Link>
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-400">Yüklənir...</div>
      ) : communities.length === 0 ? (
        <div className="rounded-xl border bg-white p-12 text-center">
          <p className="text-gray-400">Hələ bir icmaya üzv deyilsiniz</p>
          <Link href="/communities" className="mt-3 inline-block text-primary-600 text-sm font-medium hover:underline">
            İcmaları kəşf et →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {communities.map((community, i) => {
            let tags: string[] = [];
            try { tags = JSON.parse(community.tags || '[]'); } catch { }
            return (
              <div key={community.id} className="flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-lg">
                    {groupIcons[i % groupIcons.length]}
                  </div>
                  <div>
                    <Link href={`/communities/${community.slug}`} className="font-medium text-gray-900 hover:text-primary-600 transition">
                      {community.name}
                    </Link>
                    <p className="text-sm text-gray-500">{community.memberCount || 0} üzv</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/communities/${community.slug}`}
                    className="rounded-lg border px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition"
                  >
                    Bax
                  </Link>
                  <button
                    onClick={() => handleLeave(community.slug)}
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
