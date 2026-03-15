'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';

const categoryColors: Record<string, string> = {
  proqramlaşdırma: 'bg-blue-100 text-blue-700',
  texnologiya: 'bg-cyan-100 text-cyan-700',
  dizayn: 'bg-pink-100 text-pink-700',
  karyera: 'bg-amber-100 text-amber-700',
  könüllülük: 'bg-green-100 text-green-700',
  startup: 'bg-purple-100 text-purple-700',
};

const groupIcons = ['👥', '💻', '🎨', '📊', '🚀', '🤝', '🌍', '🎓'];

export default function CommunitiesPage() {
  const router = useRouter();
  const { accessToken } = useAuthStore();
  const [search, setSearch] = useState('');
  const [communities, setCommunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [joiningId, setJoiningId] = useState<string | null>(null);

  const fetchCommunities = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/communities', {
        params: { q: search || undefined, limit: 50 },
      });
      setCommunities(res.data?.data || res.data || []);
    } catch {
      setCommunities([]);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const t = setTimeout(fetchCommunities, 300);
    return () => clearTimeout(t);
  }, [fetchCommunities]);

  const handleJoin = async (e: React.MouseEvent, slug: string) => {
    e.preventDefault();
    if (!accessToken) { router.push('/login'); return; }
    setJoiningId(slug);
    try {
      await api.post(`/communities/${slug}/join`, {}, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      fetchCommunities();
    } catch (err: any) {
      if (err.response?.data?.message?.includes('Artıq')) {
        alert('Artıq bu icmanın üzvüsünüz!');
      } else {
        alert('Xəta baş verdi');
      }
    } finally {
      setJoiningId(null);
    }
  };

  return (
    <div className="container-app py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">İcmalar</h1>
          <p className="mt-0.5 text-sm text-stone-500">Maraqlarına uyğun icmalara qoşul</p>
        </div>
        {accessToken && (
          <Link href="/my/communities/new">
            <Button variant="primary" size="md">+ Yeni İcma</Button>
          </Link>
        )}
      </div>

      {/* Search */}
      <div className="mb-6 relative max-w-md">
        <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="İcma axtar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-stone-200 bg-white py-2.5 pl-10 pr-3 text-sm placeholder:text-stone-400 transition focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-16 text-center text-stone-400">Yüklənir...</div>
      ) : communities.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-200 py-16 text-center">
          <p className="text-stone-400">Heç bir icma tapılmadı</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {communities.map((community, i) => {
            let tags: string[] = [];
            try { tags = JSON.parse(community.tags || '[]'); } catch { }

            return (
              <Link key={community.id} href={`/communities/${community.slug}`} className="group block">
                <div className="rounded-2xl border border-stone-200/60 bg-white shadow-card p-6 transition hover:shadow-card-hover hover:-translate-y-0.5">
                  {/* Icon + name */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-xl transition group-hover:bg-primary-100">
                      {groupIcons[i % groupIcons.length]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-stone-800 transition group-hover:text-primary-600 line-clamp-1">
                        {community.name}
                      </h3>
                      <p className="mt-1 text-sm text-stone-500 line-clamp-2">{community.description}</p>
                    </div>
                  </div>

                  {/* Tags */}
                  {tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {tags.slice(0, 3).map((tag: string) => (
                        <span key={tag} className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs text-stone-600">#{tag}</span>
                      ))}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-4">
                    <div className="flex items-center gap-1.5 text-xs text-stone-500">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {community.memberCount || community._count?.members || 0} üzv
                    </div>
                    <button
                      onClick={(e) => handleJoin(e, community.slug)}
                      disabled={joiningId === community.slug}
                      className="rounded-lg bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-700 transition hover:bg-primary-100 disabled:opacity-50"
                    >
                      {joiningId === community.slug ? '...' : 'Qoşul'}
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
