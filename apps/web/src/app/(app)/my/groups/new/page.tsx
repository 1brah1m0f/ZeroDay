'use client';

import { useRouter } from 'next/navigation';
import GroupForm from '@/features/groups/GroupForm';

export default function NewGroupPage() {
    const router = useRouter();

    return (
        <div className="mx-auto max-w-2xl space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Yeni Qrup</h1>
            </div>
            <div className="rounded-xl border bg-white p-6 shadow-sm">
                <GroupForm onSuccess={() => router.push('/my/groups')} />
            </div>
        </div>
    );
}
