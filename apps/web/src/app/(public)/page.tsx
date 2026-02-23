'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { categories, stats, features } from '@/lib/fake-data';
import { Badge } from '@/components/Badge';
import { Avatar } from '@/components/Avatar';
import { useAuthStore } from '@/lib/store';
import { formatRelativeTime } from '@/lib/utils';

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

function ListingCard({ listing }: { listing: any }) {
  const cat = categories.find((c) => c.value === listing.category);
  const tags = typeof listing.tags === 'string' ? JSON.parse(listing.tags || '[]') : (listing.tags || []);
  const images = typeof listing.images === 'string' ? JSON.parse(listing.images || '[]') : (listing.images || []);
  const coverImage = images.length > 0 ? images[0] : null;
  return (
    <Link href={`/listings/${listing.id}`} className="group block">
      <div className="card-interactive overflow-hidden">
        {/* Image placeholder */}
        <div className="relative h-40 bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center">
          {coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={coverImage} alt={listing.title} className="object-cover w-full h-full" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-4xl opacity-40">
              {cat?.icon || '📋'}
            </div>
          )}
          {listing.featured && (
            <div className="absolute left-3 top-3">
              <Badge variant="accent" size="sm">⭐ Seçilmiş</Badge>
            </div>
          )}
          <div className="absolute right-3 top-3">
            <Badge variant={typeColor[listing.category] || 'neutral'} size="sm">
              {typeLabel[listing.category] || listing.category}
            </Badge>
          </div>
        </div>
        {/* Content */}
        <div className="p-5">
          <div className="mb-2 flex flex-wrap gap-1.5">
            {tags.slice(0, 2).map((tag: string) => (
              <Badge key={tag} variant="primary" size="sm">{tag}</Badge>
            ))}
          </div>
          <h3 className="text-base font-semibold text-stone-800 transition group-hover:text-primary-600 line-clamp-2 mb-1">
            {listing.title}
          </h3>
          <p className="min-h-8 mt-1.5 text-sm text-stone-500 line-clamp-2">{listing.description}</p>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {listing.author?.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={listing.author.avatarUrl} alt="" className="w-5 h-5 rounded-full" />
              ) : (
                <Avatar name={listing.author?.displayName || 'A'} size="xs" />
              )}
              <span className="text-xs font-medium text-stone-600 truncate max-w-[100px]">{listing.author?.displayName || 'Anonim'}</span>
            </div>
            <span className="text-xs text-stone-400 whitespace-nowrap">{formatRelativeTime(listing.createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const { accessToken } = useAuthStore();
  const isAuthenticated = !!accessToken;

  const [recentListings, setRecentListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await api.get('/listings?limit=6');
        setRecentListings(res.data.data || []);
      } catch (err) {
        console.error('Failed to fetch recent listings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, []);

  const featured = recentListings.slice(0, 3); // For now just take top 3 as featured

  return (
    <div>
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800">
        {/* Decorative circles */}
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-primary-500/20 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-accent-400/10 blur-3xl" />

        <div className="container-app relative py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-primary-100 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-400 animate-pulse-soft" />
              Azərbaycanın #1 könüllülük platforması
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Birlikdə daha{' '}
              <span className="bg-gradient-to-r from-accent-300 to-accent-400 bg-clip-text text-transparent">
                güclüyük
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-primary-100/80">
              Elan paylaş, qruplara qoşul, forumda müzakirə et — icma ilə birlikdə öyrən, öyrət, inkişaf et.
            </p>

            {/* Search bar */}
            <div className="mx-auto mt-8 max-w-xl">
              <div className="flex overflow-hidden rounded-2xl bg-white shadow-elevated">
                <div className="flex flex-1 items-center gap-3 px-5 py-4">
                  <svg className="h-5 w-5 text-stone-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Elan, mentor və ya tədbir axtar..."
                    className="w-full bg-transparent text-sm text-stone-800 placeholder:text-stone-400 outline-none"
                  />
                </div>
                <button className="bg-primary-600 px-6 font-semibold text-sm text-white transition hover:bg-primary-700 active:bg-primary-800">
                  Axtar
                </button>
              </div>
            </div>

            {/* Quick category pills */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {categories.slice(1, 6).map((cat) => (
                <Link
                  key={cat.value}
                  href={`/listings?category=${cat.value}`}
                  className="rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm transition hover:bg-white/20"
                >
                  {cat.icon} {cat.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Stats ─── */}
      <section className="relative -mt-8 z-10">
        <div className="container-app">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl bg-white p-5 text-center shadow-card animate-fade-up"
              >
                <div className="text-2xl">{stat.icon}</div>
                <div className="mt-2 text-2xl font-bold text-stone-800">{stat.value}</div>
                <div className="mt-0.5 text-xs font-medium text-stone-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured listings ─── */}
      <section className="section">
        <div className="container-app">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-stone-800">Seçilmiş elanlar</h2>
              <p className="mt-1 text-sm text-stone-500">Bu həftənin ən populyar elanları</p>
            </div>
            <Link
              href="/listings"
              className="hidden items-center gap-1 rounded-xl bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-700 transition hover:bg-primary-100 sm:inline-flex"
            >
              Hamısını gör
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="stagger grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Recent listings ─── */}
      <section className="bg-stone-50/50 section">
        <div className="container-app">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-stone-800">Son elanlar</h2>
              <p className="mt-1 text-sm text-stone-500">Ən yeni paylaşılan elan və imkanlar</p>
            </div>
            <Link
              href="/listings"
              className="hidden items-center gap-1 rounded-xl bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-700 transition hover:bg-primary-100 sm:inline-flex"
            >
              Hamısını gör
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="stagger grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <div className="col-span-full py-10 text-center text-stone-500">Yüklənir...</div>
            ) : recentListings.length === 0 ? (
              <div className="col-span-full py-10 text-center text-stone-500">Hazırda elan tapılmadı.</div>
            ) : (
              recentListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))
            )}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/listings"
              className="inline-flex items-center gap-1 rounded-xl bg-primary-50 px-5 py-2.5 text-sm font-semibold text-primary-700 transition hover:bg-primary-100"
            >
              Bütün elanları gör →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Features / Niyə biz? ─── */}
      <section className="section">
        <div className="container-app">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-stone-800 sm:text-3xl">Niyə KütləWe?</h2>
            <p className="mt-2 text-stone-500">
              Cəmiyyətə dəyər qatmağın ən asan yolu
            </p>
          </div>
          <div className="stagger grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-stone-200/60 bg-white p-6 text-center transition-all hover:shadow-card-hover hover:-translate-y-0.5"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-2xl transition group-hover:bg-primary-100">
                  {feature.icon}
                </div>
                <h3 className="text-base font-semibold text-stone-800">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800">
        <div className="container-app py-16 text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            {isAuthenticated ? 'İcma səni gözləyir' : 'Hazırsan?'}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-primary-100/80">
            {isAuthenticated ? 'Yeni elanlar yarat və qruplardakı fəallığını artır.' : 'İndi qoşul, elanını paylaş, icma ilə birlikdə böyü.'}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={isAuthenticated ? '/dashboard' : '/register'}
              className="rounded-2xl bg-white px-8 py-3 text-sm font-bold text-primary-700 shadow-sm transition hover:shadow-md"
            >
              {isAuthenticated ? 'Panelə keçid' : 'Pulsuz başla'}
            </Link>
            <Link
              href="/listings"
              className="rounded-2xl border-2 border-white/30 px-8 py-3 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Elanları kəşf et
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
