'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { Button } from '@/components/Button';
import { formatRelativeTime } from '@/lib/utils';

export default function MyInvitationsPage() {
  const { accessToken } = useAuthStore();
  const [invitations, setInvitations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    const fetch = async () => {
      try {
        const res = await api.get('/communities/invitations/my', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setInvitations(res.data);
      } catch {
        setInvitations([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [accessToken]);

  const handleRespond = async (invitationId: string, accept: boolean) => {
    setProcessingId(invitationId);
    try {
      await api.post(
        `/communities/invitations/${invitationId}/respond`,
        { accept },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setInvitations(prev => prev.filter(inv => inv.id !== invitationId));
      if (accept) {
          alert('İcmaya qoşuldunuz!');
      } else {
          alert('Dəvət rədd edildi.');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Xəta baş verdi');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dəvətlərim</h1>
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-400">Yüklənir...</div>
      ) : invitations.length === 0 ? (
        <div className="rounded-xl border bg-white p-12 text-center">
          <p className="text-gray-400">Hal-hazırda sizə gələn dəvət yoxdur</p>
        </div>
      ) : (
        <div className="space-y-4">
          {invitations.map((inv) => (
            <div key={inv.id} className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border bg-white p-5 shadow-sm gap-4">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-xl font-bold text-primary-700">
                  {inv.community?.name?.charAt(0) || '👥'}
                </div>
                <div>
                  <h3 className="font-semibold text-stone-900">
                    <Link href={`/communities/${inv.community?.slug}`} className="hover:text-primary-600 hover:underline">
                      {inv.community?.name}
                    </Link>{' '}
                    icmasına dəvət
                  </h3>
                  <p className="mt-1 text-sm text-stone-500 line-clamp-2">
                    {inv.message || inv.community?.description}
                  </p>
                  <p className="mt-2 text-xs text-stone-400">
                    Göndərdi: <Link href={`/u/${inv.sender?.displayName}`} className="hover:underline text-stone-500">{inv.sender?.displayName}</Link> • {formatRelativeTime(inv.createdAt)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleRespond(inv.id, false)}
                  disabled={!!processingId}
                  className="!text-red-600 border-red-200 hover:bg-red-50"
                >
                  Rədd et
                </Button>
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => handleRespond(inv.id, true)}
                  isLoading={processingId === inv.id}
                  disabled={!!processingId}
                >
                  Qəbul et
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
