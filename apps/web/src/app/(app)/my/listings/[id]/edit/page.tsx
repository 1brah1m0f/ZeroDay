'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/lib/api';
import ListingForm from '@/features/listings/ListingForm';

export default function EditListingPage() {
    const router = useRouter();
    const params = useParams();
    const [listing, setListing] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchListing = async () => {
            try {
                const res = await api.get(`/listings/${params.id}`);
                setListing(res.data);
            } catch (err) {
                alert('Elan tapılmadı');
                router.push('/my/listings');
            } finally {
                setLoading(false);
            }
        };
        fetchListing();
    }, [params.id, router]);

    if (loading) {
        return <div className="py-20 text-center text-gray-400">Yüklənir...</div>;
    }

    if (!listing) return null;

    return (
        <div className="mx-auto max-w-2xl space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Elanı Redaktə Et</h1>
            </div>
            <div className="rounded-xl border bg-white p-6 shadow-sm">
                <ListingForm initialData={listing} onSuccess={() => router.push('/my/listings')} />
            </div>
        </div>
    );
}
