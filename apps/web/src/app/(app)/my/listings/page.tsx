'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { Button } from '@/components/Button';

export default function MyListingsPage() {
  const { accessToken } = useAuthStore();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/listings/user/me', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setListings(res.data);
      } catch {
        // handle
      } finally {
        setLoading(false);
      }
    };
    if (accessToken) fetch();
  }, [accessToken]);

  const handleDelete = async (id: string) => {
    if (!confirm('Bu elanı silmək istədiyinizə əminsiniz?')) return;
    try {
      await api.delete(`/listings/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setListings((prev) => prev.filter((l) => l.id !== id));
    } catch {
      alert('Silinmə zamanı xəta baş verdi.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Elanlarım</h1>
        <Link href="/my/listings/new" className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">
          + Yeni Elan
        </Link>
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-400">Yüklənir...</div>
      ) : listings.length === 0 ? (
        <div className="rounded-xl border bg-white p-12 text-center">
          <p className="text-gray-400">Hələ elanınız yoxdur</p>
        </div>
      ) : (
        <div className="space-y-3">
          {listings.map((listing) => (
            <div key={listing.id} className="flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm">
              <div>
                <Link href={`/listings/${listing.id}`} className="font-medium text-gray-900 hover:text-primary-600 transition">
                  {listing.title}
                </Link>
                <p className="text-sm text-gray-500">
                  {listing.status === 'ACTIVE' ? 'Aktiv' : listing.status} · {new Date(listing.createdAt).toLocaleDateString('az-AZ')}
                </p>
              </div>
              <div className="flex gap-2">
                <Link href={`/my/listings/${listing.id}/edit`} className="rounded-lg border px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition">
                  Redaktə
                </Link>
                <button
                  onClick={() => handleDelete(listing.id)}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 transition"
                >
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
