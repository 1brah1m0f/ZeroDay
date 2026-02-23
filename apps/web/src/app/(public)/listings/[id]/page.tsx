'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { Badge } from '@/components/Badge';
import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { formatDate, formatRelativeTime } from '@/lib/utils';
import { categories } from '@/lib/fake-data'; // Only using categories for icon lookup

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

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { accessToken, user } = useAuthStore();

  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Interaction states
  const [applying, setApplying] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [applications, setApplications] = useState<any[]>([]);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await api.get(`/listings/${params.id}`);
        setListing(res.data);
      } catch (err) {
        setListing(null);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.id]);

  useEffect(() => {
    // If logged in, fetch saved listings and my applications to see status
    if (accessToken) {
      api.get('/listings/saved/me', { headers: { Authorization: `Bearer ${accessToken}` } })
        .then(res => {
          setIsSaved(res.data.some((s: any) => s.listingId === params.id));
        }).catch(console.error);

      api.get('/listings/applications/me', { headers: { Authorization: `Bearer ${accessToken}` } })
        .then(res => {
          setApplications(res.data);
        }).catch(console.error);
    }
  }, [accessToken, params.id]);

  const handleApply = async () => {
    if (!accessToken) return router.push('/login');
    if (listing?.authorId === user?.id) return alert('Öz elanınıza müraciət edə bilməzsiniz');

    try {
      setApplying(true);
      await api.post(`/listings/${params.id}/apply`, {}, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      alert('Müraciətiniz qeydə alındı!');
      // Update local state to reflect application
      setApplications(prev => [...prev, { listingId: params.id }]);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Müraciət xətası');
    } finally {
      setApplying(false);
    }
  };

  const handleSave = async () => {
    if (!accessToken) return router.push('/login');
    try {
      setSaving(true);
      const res = await api.post(`/listings/${params.id}/save`, {}, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setIsSaved(res.data.saved);
    } catch {
      alert('Xəta baş verdi');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-gray-500">Yüklənir...</div>;
  }

  if (!listing) {
    return (
      <div className="container-app py-20 text-center">
        <div className="mx-auto max-w-md">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="text-xl font-bold text-stone-800">Elan tapılmadı</h2>
          <p className="mt-2 text-sm text-stone-500">Bu elan silinmiş və ya mövcud deyil.</p>
          <Link href="/listings" className="mt-6 inline-block">
            <Button variant="primary">Elanlara qayıt</Button>
          </Link>
        </div>
      </div>
    );
  }

  const cat = categories.find((c) => c.value === listing.category);
  const images = typeof listing.images === 'string' ? JSON.parse(listing.images || '[]') : (listing.images || []);
  const coverImage = images.length > 0 ? images[0] : null;
  const tags = typeof listing.tags === 'string' ? JSON.parse(listing.tags || '[]') : (listing.tags || []);
  const hasApplied = applications.some(a => a.listingId === params.id);
  const isOwner = listing.authorId === user?.id;

  return (
    <div className="container-app py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-stone-500">
        <Link href="/" className="hover:text-primary-600 transition">Ana səhifə</Link>
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <Link href="/listings" className="hover:text-primary-600 transition">Elanlar</Link>
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-stone-800 font-medium truncate max-w-[200px]">{listing.title}</span>
      </nav>

      <div className="lg:flex lg:gap-8">
        {/* Main content */}
        <div className="flex-1">
          {/* Cover image */}
          <div className="relative h-52 sm:h-72 overflow-hidden rounded-2xl bg-gradient-to-br from-primary-100 via-primary-50 to-accent-50 mb-6 flex items-center justify-center">
            {coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={coverImage} alt={listing.title} className="object-cover w-full h-full" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-30">
                {cat?.icon || '📋'}
              </div>
            )}
            {listing.status !== 'ACTIVE' && (
              <div className="absolute left-4 top-4">
                <Badge variant="warning" size="md">Aktiv deyil</Badge>
              </div>
            )}
          </div>

          {/* Tags + type */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Badge variant={typeColor[listing.category] || 'neutral'} size="md" dot>
              {typeLabel[listing.category] || listing.category}
            </Badge>
            {tags.map((tag: string) => (
              <Badge key={tag} variant="neutral" size="sm">{tag}</Badge>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-stone-800 sm:text-3xl">{listing.title}</h1>

          {/* Meta */}
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-stone-500">
            <div className="flex items-center gap-1.5">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formatRelativeTime(listing.createdAt)}
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {listing.viewCount || 0} baxış
            </div>
          </div>

          {/* Description */}
          <div className="mt-8">
            <h2 className="mb-3 text-lg font-semibold text-stone-800">Təsvir</h2>
            <div className="prose prose-stone max-w-none">
              <p className="text-stone-600 leading-relaxed whitespace-pre-wrap">
                {listing.description}
              </p>
              <p className="mt-4 text-stone-600 leading-relaxed">
                Bu elan KütləWe platformasında paylaşılıb. Maraqlananlar aşağıdakı düymə vasitəsilə müraciət edə bilər.
                Ətraflı məlumat almaq üçün elan sahibi ilə əlaqə saxlaya bilərsiniz.
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="mt-8 lg:mt-0 lg:w-80">
          <div className="sticky top-24 space-y-5">
            {/* Apply CTA */}
            <div className="rounded-2xl border border-stone-200/60 bg-white p-6 shadow-card">
              <h3 className="text-lg font-semibold text-stone-800">Maraqlısan?</h3>
              <p className="mt-1 text-sm text-stone-500">
                İndi müraciət et və icma ilə birləş.
              </p>

              {!isOwner ? (
                <>
                  <Button
                    variant={hasApplied ? 'outline' : 'primary'}
                    size="lg"
                    className="mt-4 w-full"
                    onClick={handleApply}
                    disabled={hasApplied}
                    isLoading={applying}
                  >
                    {hasApplied ? 'Müraciət edilib' : 'Müraciət et'}
                  </Button>
                  <Button
                    variant={isSaved ? 'primary' : 'outline'}
                    size="md"
                    className="mt-2 w-full"
                    onClick={handleSave}
                    isLoading={saving}
                  >
                    {isSaved ? 'Yadda saxlanılıb' : 'Saxla'}
                  </Button>
                </>
              ) : (
                <div className="mt-4 p-3 bg-primary-50 text-primary-700 text-sm font-medium rounded-lg text-center">
                  Siz bu elanın sahibisiniz
                </div>
              )}
            </div>

            {/* Author card */}
            <div className="rounded-2xl border border-stone-200/60 bg-white p-6 shadow-card">
              <div className="flex items-center gap-3">
                {listing.author?.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={listing.author.avatarUrl} alt="" className="w-12 h-12 rounded-full" />
                ) : (
                  <Avatar name={listing.author?.displayName || 'A'} size="lg" />
                )}
                <div>
                  <Link
                    href={`/u/${listing.author?.username}`}
                    className="text-sm font-semibold text-stone-800 hover:text-primary-600 transition"
                  >
                    {listing.author?.displayName || 'Anonim'}
                  </Link>
                  <p className="text-xs text-stone-500">@{listing.author?.username}</p>
                </div>
              </div>
              <Link
                href={`/u/${listing.author?.username}`}
                className="mt-4 block rounded-xl bg-stone-50 px-4 py-2 text-center text-sm font-medium text-stone-700 transition hover:bg-stone-100"
              >
                Profilə bax
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
