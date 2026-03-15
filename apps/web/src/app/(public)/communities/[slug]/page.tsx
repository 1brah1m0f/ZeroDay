'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store';

export default function CommunityDetailPage() {
  const params = useParams();
  const { user } = useAuthStore();
  const [community, setCommunity] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const userIdParam = user?.id ? `?userId=${user.id}` : '';
      const [communityRes, membersRes] = await Promise.all([
        api.get(`/communities/${params.slug}${userIdParam}`),
        api.get(`/communities/${params.slug}/members`),
      ]);
      setCommunity(communityRes.data);
      const membersData = Array.isArray(membersRes.data) ? membersRes.data : (membersRes.data?.data || []);
      setMembers(membersData);
    } catch {
      // handle
    } finally {
      setLoading(false);
    }
  }, [params.slug, user?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleJoin = async () => {
    setActionLoading(true);
    try {
      await api.post(`/communities/${params.slug}/join`);
      await fetchData(); // Refresh data in-place
    } catch (err: any) {
      alert(err.response?.data?.message || 'Qoşulma zamanı xəta baş verdi');
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeave = async () => {
    if (!confirm('Bu icmadan çıxmaq istədiyinizə əminsiniz?')) return;
    setActionLoading(true);
    try {
      await api.delete(`/communities/${params.slug}/leave`);
      await fetchData(); // Refresh data in-place
    } catch (err: any) {
      alert(err.response?.data?.message || 'Çıxış zamanı xəta baş verdi');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="py-20 text-center text-gray-400">Yüklənir...</div>;
  if (!community) return <div className="py-20 text-center text-gray-400">İcma tapılmadı</div>;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/communities" className="text-sm text-primary-600 hover:underline">
        ← İcmalara qayıt
      </Link>

      <div className="rounded-xl border bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">{community.name}</h1>
        <p className="mt-2 text-gray-600">{community.description}</p>

        <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
          <span>{community.memberCount} üzv</span>
          <span>{community.privacy === 'PUBLIC' ? 'İctimai' : 'Məxfi'}</span>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {['OWNER', 'ADMIN'].includes(community.memberRole) && (
            <Link
              href={`/my/communities/${community.slug}/invite`}
              className="rounded-lg border border-primary-600 px-6 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 transition"
            >
              Üzvləri Dəvət Et
            </Link>
          )}
          {community.isMember && (
            <Link
              href={`/communities/${community.slug}/chat`}
              className="rounded-lg bg-green-600 px-6 py-2 text-sm font-medium text-white hover:bg-green-700 transition"
            >
              💬 Söhbətə Qoşul
            </Link>
          )}
          {!community.isMember && (
            <button
              onClick={handleJoin}
              disabled={actionLoading}
              className="rounded-lg bg-primary-600 px-6 py-2 text-sm font-medium text-white hover:bg-primary-700 transition disabled:opacity-50"
            >
              {actionLoading ? 'Gözləyin...' : 'Qoşul'}
            </button>
          )}
          {community.isMember && community.memberRole !== 'OWNER' && (
            <button
              onClick={handleLeave}
              disabled={actionLoading}
              className="rounded-lg border border-red-200 text-red-600 px-6 py-2 text-sm font-medium hover:bg-red-50 transition disabled:opacity-50"
            >
              {actionLoading ? 'Gözləyin...' : 'İcmadan Çıx'}
            </button>
          )}
        </div>
      </div>

      {/* Members */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Üzvlər</h2>
        <div className="space-y-3">
          {members.map((m) => (
            <Link
              key={m.userId}
              href={`/u/${m.user.username}`}
              className="flex items-center gap-3 rounded-lg p-2 hover:bg-gray-50"
            >
              <div className="h-8 w-8 rounded-full bg-primary-100 text-center text-sm font-bold leading-8 text-primary-600">
                {m.user.displayName?.charAt(0)}
              </div>
              <div>
                <span className="text-sm font-medium text-gray-900">
                  {m.user.displayName}
                </span>
                <span className="ml-2 text-xs text-gray-400">@{m.user.username}</span>
              </div>
              {m.role !== 'MEMBER' && (
                <span className="ml-auto rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700">
                  {m.role}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
