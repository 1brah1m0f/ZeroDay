'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { Avatar } from '@/components/Avatar';
import { Badge } from '@/components/Badge';
import { formatRelativeTime } from '@/lib/utils';
import clsx from 'clsx';

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

export default function SavedListingsPage() {
    const { accessToken } = useAuthStore();
    const [savedListings, setSavedListings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchSaved = async () => {
        try {
            const res = await api.get('/listings/saved/me', {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            setSavedListings(res.data);
        } catch {
            // handle error
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (accessToken) fetchSaved();
    }, [accessToken]);

    const handleUnsave = async (listingId: string) => {
        try {
            await api.post(`/listings/${listingId}/save`, {}, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            // optimistically remove
            setSavedListings(prev => prev.filter(sl => sl.listingId !== listingId));
        } catch {
            alert('Saxlanmadan silinmədi.');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Yadda Saxlanılanlar</h1>
            </div>

            {loading ? (
                <div className="py-12 text-center text-stone-400">Yüklənir...</div>
            ) : savedListings.length === 0 ? (
                <div className="rounded-xl border bg-white p-12 text-center">
                    <p className="text-gray-400">Heç bir elanı yadda saxlamısınız.</p>
                    <Link href="/listings" className="mt-4 inline-block text-primary-600 font-medium hover:underline">
                        Elanları kəşf et
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {savedListings.map((savedItem) => {
                        const listing = savedItem.listing;
                        let coverImage = null;
                        try {
                            const imgs = JSON.parse(listing.images || '[]');
                            if (imgs.length > 0) coverImage = imgs[0];
                        } catch { }

                        let tags = [];
                        try {
                            tags = JSON.parse(listing.tags || '[]');
                        } catch { }

                        return (
                            <div key={savedItem.id} className="group relative flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-card-hover hover:-translate-y-0.5">

                                <Link href={`/listings/${listing.id}`} className="block">
                                    <div className="relative h-40 bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center">
                                        {coverImage ? (
                                            <img src={coverImage} alt={listing.title} className="object-cover w-full h-full" />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-4xl opacity-40">
                                                📋
                                            </div>
                                        )}
                                        <div className="absolute right-3 top-3">
                                            <Badge variant={typeColor[listing.category] || 'neutral'} size="sm">
                                                {typeLabel[listing.category] || listing.category}
                                            </Badge>
                                        </div>
                                    </div>
                                </Link>

                                {/* Content */}
                                <div className="flex flex-col flex-1 p-5">
                                    <div className="mb-2 flex flex-wrap gap-1.5">
                                        {tags.slice(0, 2).map((tag: string) => (
                                            <Badge key={tag} variant="primary" size="sm">{tag}</Badge>
                                        ))}
                                    </div>

                                    <Link href={`/listings/${listing.id}`}>
                                        <h3 className="text-base font-semibold text-stone-800 transition group-hover:text-primary-600 line-clamp-2 mb-1">
                                            {listing.title}
                                        </h3>
                                    </Link>

                                    <p className="min-h-8 mt-1.5 text-sm text-stone-500 line-clamp-2">{listing.description}</p>

                                    <div className="mt-4 mb-3 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            {listing.author?.avatarUrl ? (
                                                <img src={listing.author.avatarUrl} alt="" className="w-5 h-5 rounded-full" />
                                            ) : (
                                                <Avatar name={listing.author?.displayName || 'A'} size="xs" />
                                            )}
                                            <span className="text-xs font-medium text-stone-600 truncate max-w-[100px]">{listing.author?.displayName || 'Anonim'}</span>
                                        </div>
                                        <span className="text-xs text-stone-400 whitespace-nowrap">{formatRelativeTime(listing.createdAt)}</span>
                                    </div>

                                    {/* Unsave button */}
                                    <div className="mt-auto pt-3 border-t border-stone-100 flex justify-end">
                                        <button
                                            onClick={(e) => { e.preventDefault(); handleUnsave(listing.id); }}
                                            className="text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition"
                                        >
                                            Siyahıdan çıxar
                                        </button>
                                    </div>

                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    );
}
