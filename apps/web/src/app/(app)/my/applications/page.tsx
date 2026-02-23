'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { Avatar } from '@/components/Avatar';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { formatRelativeTime } from '@/lib/utils';
import clsx from 'clsx';

export default function ApplicationsPage() {
    const router = useRouter();
    const { accessToken } = useAuthStore();
    const [activeTab, setActiveTab] = useState<'sent' | 'received'>('sent');

    const [sentApps, setSentApps] = useState<any[]>([]);
    const [receivedApps, setReceivedApps] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const [sentRes, receivedRes] = await Promise.all([
                api.get('/listings/applications/me', { headers: { Authorization: `Bearer ${accessToken}` } }),
                api.get('/listings/applications/received', { headers: { Authorization: `Bearer ${accessToken}` } })
            ]);
            setSentApps(sentRes.data);
            setReceivedApps(receivedRes.data);
        } catch {
            // Handle error quietly
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (accessToken) fetchApplications();
    }, [accessToken]);

    const handleStatusUpdate = async (appId: string, newStatus: string) => {
        try {
            await api.put(`/listings/applications/${appId}`, { status: newStatus }, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            // Refresh list
            fetchApplications();
        } catch {
            alert('Xəta baş verdi');
        }
    };

    const handleDelete = async (appId: string) => {
        if (!confirm('Müraciəti ləğv etmək istəyirsiniz?')) return;
        try {
            await api.delete(`/listings/applications/${appId}`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            setSentApps(prev => prev.filter(app => app.id !== appId));
        } catch {
            alert('Ləğv edərkən xəta baş verdi');
        }
    };

    const handleMessage = async (recipientId: string) => {
        try {
            const res = await api.post('/chat/messages', {
                recipientId,
                body: 'Salam, müraciətinizlə bağlı yazırdım.',
            }, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            router.push(`/chat?id=${res.data.conversationId}`);
        } catch {
            alert('Mesaj bölməsinə keçid edərkən xəta baş verdi');
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'ACCEPTED': return <Badge variant="success">Qəbul edildi</Badge>;
            case 'REJECTED': return <Badge variant="warning">İmtina edildi</Badge>;
            default: return <Badge variant="neutral">Gözləyir</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Müraciətlər</h1>
            </div>

            <div className="flex items-center gap-1 rounded-xl bg-stone-100 p-1 w-full max-w-md">
                <button
                    onClick={() => setActiveTab('sent')}
                    className={clsx(
                        "flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition",
                        activeTab === 'sent' ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-700"
                    )}
                >
                    Gündərdiklərim ({sentApps.length})
                </button>
                <button
                    onClick={() => setActiveTab('received')}
                    className={clsx(
                        "flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition",
                        activeTab === 'received' ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-700"
                    )}
                >
                    Gələn Müraciətlər ({receivedApps.length})
                </button>
            </div>

            {loading ? (
                <div className="py-12 text-center text-stone-400">Yüklənir...</div>
            ) : activeTab === 'sent' ? (
                // SENT APPLICATIONS
                sentApps.length === 0 ? (
                    <div className="rounded-2xl border border-stone-100 bg-white p-12 text-center">
                        <p className="text-stone-500">Heç bir elana müraciət etməmisiniz.</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {sentApps.map(app => (
                            <div key={app.id} className="flex items-center justify-between rounded-xl border border-stone-200/60 bg-white p-5 shadow-sm">
                                <div>
                                    <Link href={`/listings/${app.listingId}`} className="text-base font-semibold text-stone-800 hover:text-primary-600 transition">
                                        {app.listing?.title || 'Silinmiş Elan'}
                                    </Link>
                                    <p className="mt-1 text-sm text-stone-500">
                                        Müraciət tarixi: {new Date(app.createdAt).toLocaleDateString('az-AZ')}
                                    </p>
                                </div>
                                <div>
                                    <div className="flex items-center gap-4">
                                        {getStatusBadge(app.status)}
                                        <button
                                            onClick={() => handleDelete(app.id)}
                                            className="text-sm font-medium text-red-500 hover:text-red-700"
                                        >
                                            Ləğv et
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            ) : (
                // RECEIVED APPLICATIONS
                receivedApps.length === 0 ? (
                    <div className="rounded-2xl border border-stone-100 bg-white p-12 text-center">
                        <p className="text-stone-500">Elanlarınıza hələ heç kim müraciət etməyib.</p>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {receivedApps.map(app => (
                            <div key={app.id} className="flex flex-col rounded-xl border border-stone-200/60 bg-white p-5 shadow-sm relative overflow-hidden">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        {app.applicant?.avatarUrl ? (
                                            <img src={app.applicant.avatarUrl} alt="" className="h-10 w-10 rounded-full object-cover" />
                                        ) : (
                                            <Avatar name={app.applicant?.displayName || '?'} size="sm" />
                                        )}
                                        <div>
                                            <Link href={`/u/${app.applicant?.username}`} className="text-sm font-semibold text-stone-800 hover:text-primary-600">
                                                {app.applicant?.displayName}
                                            </Link>
                                            <p className="text-xs text-stone-500">@{app.applicant?.username}</p>
                                        </div>
                                    </div>
                                    {getStatusBadge(app.status)}
                                </div>

                                <div className="mb-4 text-sm text-stone-600 border-l-2 border-stone-200 pl-3">
                                    Müraciət etdiyi elan:<br />
                                    <Link href={`/listings/${app.listingId}`} className="font-semibold text-stone-800 hover:text-primary-600 transition">
                                        {app.listing?.title}
                                    </Link>
                                </div>

                                <div className="mt-auto border-t border-stone-100 pt-4 flex flex-col gap-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-stone-400">{formatRelativeTime(app.createdAt)}</span>
                                        <Button variant="outline" size="sm" onClick={() => handleMessage(app.applicantId)}>
                                            Mesaj yaz
                                        </Button>
                                    </div>
                                    {app.status === 'PENDING' && (
                                        <div className="flex gap-2 w-full mt-2">
                                            <Button variant="outline" size="sm" onClick={() => handleStatusUpdate(app.id, 'REJECTED')} className="!text-red-600 !border-red-200 hover:!bg-red-50">
                                                İmtina et
                                            </Button>
                                            <Button variant="primary" size="sm" onClick={() => handleStatusUpdate(app.id, 'ACCEPTED')}>
                                                Qəbul et
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )
            )}
        </div>
    );
}
