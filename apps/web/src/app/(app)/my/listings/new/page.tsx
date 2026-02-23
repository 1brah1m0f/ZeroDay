'use client';

import { useRouter } from 'next/navigation';
import ListingForm from '@/features/listings/ListingForm';

export default function NewListingPage() {
    const router = useRouter();

    return (
        <div className="mx-auto max-w-2xl space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Yeni Elan</h1>
            </div>
            <div className="rounded-xl border bg-white p-6 shadow-sm">
                <ListingForm onSuccess={() => router.push('/my/listings')} />
            </div>
        </div>
    );
}
