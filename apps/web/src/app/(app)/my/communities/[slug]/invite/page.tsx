'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';

export default function CommunityInvitePage() {
  const params = useParams();
  const router = useRouter();
  const { accessToken } = useAuthStore();
  
  const [community, setCommunity] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [skillsFilter, setSkillsFilter] = useState('');
  const [minPointsFilter, setMinPointsFilter] = useState('');
  
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingId, setSendingId] = useState<string | null>(null);

  // Load community details
  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        const res = await api.get(`/communities/${params.slug}`);
        setCommunity(res.data);
      } catch {
        router.push('/my/communities');
      }
    };
    fetchCommunity();
  }, [params.slug, router]);

  const searchUsers = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const filters: any = {};
      if (search) filters.q = search;
      if (skillsFilter) {
          filters.skills = skillsFilter.split(',').map(s => s.trim()).filter(Boolean);
      }
      if (minPointsFilter) filters.minPoints = parseInt(minPointsFilter);

      const res = await api.post(`/communities/${params.slug}/invite/search`, filters, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setUsers(res.data);
    } catch (err: any) {
        if(err.response?.status === 403) {
            alert('Bu səhifəyə giriş icazəniz yoxdur (Yalnız Admin və Qurucu)');
            router.push(`/communities/${params.slug}`);
        }
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [search, skillsFilter, minPointsFilter, params.slug, accessToken, router]);

  useEffect(() => {
    const t = setTimeout(searchUsers, 500);
    return () => clearTimeout(t);
  }, [searchUsers]);

  const handleInvite = async (userId: string) => {
    setSendingId(userId);
    try {
      await api.post(
        `/communities/${params.slug}/invite`,
        { receiverId: userId, message: `${community?.name} icmasına dəvət edildiniz!` },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      alert('Dəvət göndərildi!');
      // Remove from list
      setUsers(prev => prev.filter(u => u.id !== userId));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Xəta baş verdi');
    } finally {
      setSendingId(null);
    }
  };

  if (!community) return <div className="py-20 text-center">Yüklənir...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/communities/${community.slug}`} className="text-sm font-medium text-stone-500 hover:text-stone-800">
          ← İcmaya qayıt
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-stone-900">Istifadəçiləri Dəvət Et</h1>
        <p className="mt-1 text-sm text-stone-500">
          {community.name} icmasına yeni üzvlər tapın və dəvət göndərin
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Input 
            label="Axtarış (ad, istifadəçi adı)" 
            placeholder="Axtar..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
        />
        <Input 
            label="Bacarıqlar (vergüllə ayır)" 
            placeholder="Məsələn: React, Node.js" 
            value={skillsFilter} 
            onChange={(e) => setSkillsFilter(e.target.value)} 
        />
        <Input 
            label="Minimum Aktivlik Xalı" 
            type="number" 
            placeholder="Məsələn: 10" 
            value={minPointsFilter} 
            onChange={(e) => setMinPointsFilter(e.target.value)} 
        />
      </div>

      {loading ? (
        <div className="py-12 text-center text-stone-400">İstifadəçilər axtarılır...</div>
      ) : users.length === 0 ? (
        <div className="rounded-xl border border-dashed border-stone-200 bg-stone-50 py-12 text-center">
          <p className="text-sm text-stone-400">Uyğun istifadəçi tapılmadı</p>
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((u) => (
            <div key={u.id} className="flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-100 text-lg font-bold text-primary-700">
                  {u.displayName?.charAt(0) || u.username?.charAt(0)}
                </div>
                <div>
                  <Link href={`/u/${u.username}`} className="font-semibold text-stone-900 hover:text-primary-600 transition">
                    {u.displayName}
                  </Link>
                  <span className="ml-2 text-xs text-stone-400">@{u.username}</span>
                  
                  <div className="mt-1 flex flex-wrap gap-1.5 items-center">
                    {u.activityPoints > 0 && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                            ⭐ {u.activityPoints} xal
                        </span>
                    )}
                    {(u.skills && u.skills.length > 0) && u.skills.slice(0, 3).map((skill: string) => (
                      <span key={skill} className="rounded bg-stone-100 px-1.5 py-0.5 text-[10px] font-medium text-stone-600">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleInvite(u.id)}
                isLoading={sendingId === u.id}
              >
                Dəvət et
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
