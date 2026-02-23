'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Badge } from '@/components/Badge';
import { Avatar } from '@/components/Avatar';
import { EmptyState } from '@/components/EmptyState';
import { formatRelativeTime } from '@/lib/utils';
import { categories } from '@/lib/fake-data';

const typeLabel: Record<string, string> = {
  VOLUNTEER: 'Könüllülük',
  EDUCATION: 'Təhsil',
  JOBS: 'İş yeri',
  SERVICES: 'Xidmət',
  EVENTS: 'Tədbir',
  OTHER: 'Digər',
};

const typeColor: Record<string, 'success' | 'neutral' | 'primary'> = {
  VOLUNTEER: 'success',
  EDUCATION: 'primary',
  JOBS: 'success',
  EVENTS: 'primary',
  SERVICES: 'neutral',
  OTHER: 'neutral',
};

function ListingsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'all');
  const [searchQuery, setSearchQuery] = useState('');

  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Debounce search query
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const params: Record<string, string> = {};
        if (selectedCategory !== 'all') params.category = selectedCategory;
        if (debouncedSearch) params.q = debouncedSearch;

        const res = await api.get('/listings', { params });
        setListings(res.data.data || []);
      } catch (err) {
        setListings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, [selectedCategory, debouncedSearch]);

  return (
    <div className="container-app py-8">
      <div className="lg:flex lg:gap-8">
        {/* ─── Sidebar Filters (desktop) ─── */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24 space-y-6">
            {/* Search */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-stone-400">
                Axtar
              </label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Elan axtar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 bg-white py-2.5 pl-10 pr-3 text-sm text-stone-700 placeholder:text-stone-400 transition hover:border-stone-300 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                />
              </div>
            </div>

            {/* Categories */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-stone-400">
                Kateqoriya
              </label>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition ${selectedCategory === 'all'
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-stone-600 hover:bg-stone-50'
                    }`}
                >
                  <span>🔍</span> Bütün Elanlar
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition ${selectedCategory === cat.value
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-stone-600 hover:bg-stone-50'
                      }`}
                  >
                    <span>{cat.icon}</span>
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* ─── Main content ─── */}
        <div className="flex-1">
          {/* Header */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-stone-800">Elanlar</h1>
              {!loading && <p className="mt-0.5 text-sm text-stone-500">{listings.length} nəticə tapıldı</p>}
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/my/listings/new"
                className="rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 hover:shadow-md"
              >
                + Yeni Elan
              </Link>
            </div>
          </div>

          {/* Mobile filters */}
          <div className="mb-6 lg:hidden">
            <div className="relative mb-4">
              <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Elan axtar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-stone-200 bg-white py-2.5 pl-10 pr-3 text-sm placeholder:text-stone-400 transition focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${selectedCategory === 'all'
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
              >
                🔍 Hamısı
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${selectedCategory === cat.value
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                >
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Listings grid */}
          {loading ? (
            <div className="py-20 text-center text-stone-400">Yüklənir...</div>
          ) : listings.length === 0 ? (
            <EmptyState
              icon={
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
              title="Heç bir elan tapılmadı"
              description="Filtri dəyişdirin və ya yeni axtarış edin"
            />
          ) : (
            <div className="stagger grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {listings.map((listing) => {
                const cat = categories.find((c) => c.value === listing.category);
                const tags = typeof listing.tags === 'string' ? JSON.parse(listing.tags || '[]') : (listing.tags || []);
                const images = typeof listing.images === 'string' ? JSON.parse(listing.images || '[]') : (listing.images || []);
                const coverImage = images.length > 0 ? images[0] : null;

                return (
                  <Link key={listing.id} href={`/listings/${listing.id}`} className="group block h-full">
                    <div className="card-interactive overflow-hidden h-full flex flex-col">
                      {/* Image */}
                      <div className="relative h-40 bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center">
                        {coverImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={coverImage} alt={listing.title} className="object-cover w-full h-full" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-3xl opacity-40">
                            {cat?.icon || '📋'}
                          </div>
                        )}
                        <div className="absolute right-3 top-3">
                          <Badge variant={typeColor[listing.category] || 'neutral'} size="sm">
                            {typeLabel[listing.category] || listing.category}
                          </Badge>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 flex flex-col flex-1">
                        <div className="mb-2 flex flex-wrap gap-1.5">
                          {tags.slice(0, 2).map((tag: string) => (
                            <Badge key={tag} variant="primary" size="sm">{tag}</Badge>
                          ))}
                        </div>
                        <h3 className="text-sm font-semibold text-stone-800 transition group-hover:text-primary-600 line-clamp-2 mb-1">
                          {listing.title}
                        </h3>
                        <p className="min-h-8 mt-1 text-xs text-stone-500 line-clamp-2 mb-3">{listing.description}</p>

                        <div className="mt-auto flex items-center justify-between border-t border-stone-100 pt-3">
                          <div className="flex items-center gap-2">
                            {listing.author?.avatarUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={listing.author.avatarUrl} alt="" className="w-5 h-5 rounded-full" />
                            ) : (
                              <Avatar name={listing.author?.displayName || 'A'} size="xs" />
                            )}
                            <span className="text-xs text-stone-600 font-medium truncate max-w-[100px]">{listing.author?.displayName || 'Anonim'}</span>
                          </div>
                          <span className="text-xs text-stone-400 whitespace-nowrap">
                            {formatRelativeTime(listing.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ListingsPage() {
  return (
    <Suspense fallback={<div className="container-app py-8 text-center text-stone-400">Yüklənir...</div>}>
      <ListingsContent />
    </Suspense>
  );
}
