'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function GroupDetailPage() {
  const params = useParams();
  const [group, setGroup] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [groupRes, membersRes] = await Promise.all([
          api.get(`/groups/${params.slug}`),
          api.get(`/groups/${params.slug}/members`),
        ]);
        setGroup(groupRes.data);
        setMembers(membersRes.data);
      } catch {
        // handle
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [params.slug]);

  if (loading) return <div className="py-20 text-center text-gray-400">Yüklənir...</div>;
  if (!group) return <div className="py-20 text-center text-gray-400">Qrup tapılmadı</div>;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/groups" className="text-sm text-primary-600 hover:underline">
        ← Qruplara qayıt
      </Link>

      <div className="rounded-xl border bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">{group.name}</h1>
        <p className="mt-2 text-gray-600">{group.description}</p>

        <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
          <span>{group.memberCount} üzv</span>
          <span>{group.privacy === 'PUBLIC' ? 'İctimai' : 'Məxfi'}</span>
        </div>

        <button className="mt-6 rounded-lg bg-primary-600 px-6 py-2 text-sm font-medium text-white hover:bg-primary-700">
          Qoşul
        </button>
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
