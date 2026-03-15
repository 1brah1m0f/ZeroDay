'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { Avatar } from '@/components/Avatar';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { formatRelativeTime } from '@/lib/utils';

const typeLabel: Record<string, string> = {
  VOLUNTEER: 'Könüllülük',
  EDUCATION: 'Təhsil',
  JOBS: 'İş elanı',
  SERVICES: 'Xidmət',
  EVENTS: 'Tədbir',
  OTHER: 'Digər',
};

const typeIcon: Record<string, string> = {
  VOLUNTEER: '🤝',
  EDUCATION: '🎓',
  JOBS: '💼',
  SERVICES: '⚙️',
  EVENTS: '🎪',
  OTHER: '📋',
};

const tabs = [
  { key: 'listings', label: 'Elanlarım' },
  { key: 'experience', label: 'Təcrübə' },
  { key: 'education', label: 'Təhsil' },
  { key: 'volunteer', label: 'Könüllülük' },
  { key: 'events', label: 'Tədbirlər' },
  { key: 'badges', label: 'Nişanlar' },
];

export default function PublicProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { accessToken, user: currentUser } = useAuthStore();

  const [activeTab, setActiveTab] = useState('listings');
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [startingChat, setStartingChat] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/users/${params.username}`);
        setProfile(res.data);
      } catch {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [params.username]);

  const handleMessage = async () => {
    if (!accessToken) {
      router.push('/login');
      return;
    }
    if (currentUser?.id === profile?.id) return;
    try {
      setStartingChat(true);
      const res = await api.post('/chat/messages', {
        recipientId: profile.id,
        body: 'Salam!',
      }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      router.push(`/chat?id=${res.data.conversationId}`);
    } catch {
      alert('Xəta baş verdi');
      setStartingChat(false);
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-gray-500">Yüklənir...</div>;
  }

  if (!profile) {
    return <div className="py-20 text-center text-gray-500">İstifadəçi tapılmadı.</div>;
  }

  // Use ONLY real data from the API
  const displayListings: any[] = profile.listings || [];
  const allExperiences: any[] = profile.experiences || [];

  const workExp = allExperiences.filter((e: any) => e.type === 'WORK' || !e.type || e.type === 'work');
  const eduExp = allExperiences.filter((e: any) => e.type === 'EDUCATION' || e.type === 'education');
  const volExp = allExperiences.filter((e: any) => e.type === 'VOLUNTEER' || e.type === 'volunteer');

  const eventParticipations = profile.eventParticipations || [];

  const ExpCard = ({ exp }: { exp: any }) => (
    <div className="rounded-2xl border border-stone-200/60 bg-white p-5 shadow-card">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-sm font-bold text-primary-700">
          {exp.organization?.charAt(0) || '?'}
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-stone-800">{exp.title}</h3>
          <p className="text-sm text-stone-600">{exp.organization}</p>
          <p className="mt-1 text-xs text-stone-400">
            {new Date(exp.startDate).toLocaleDateString('az-AZ', { year: 'numeric', month: 'short' })} —{' '}
            {exp.isCurrent ? (
              <Badge variant="success" size="sm">Davam edir</Badge>
            ) : (
              exp.endDate && new Date(exp.endDate).toLocaleDateString('az-AZ', { year: 'numeric', month: 'short' })
            )}
          </p>
          {exp.description && (
            <p className="mt-2 text-sm text-stone-500 leading-relaxed">{exp.description}</p>
          )}
        </div>
      </div>
    </div>
  );

  const EmptyState = ({ text }: { text: string }) => (
    <div className="rounded-2xl border border-dashed border-stone-200 bg-stone-50 py-12 text-center">
      <p className="text-sm text-stone-400">{text}</p>
    </div>
  );

  return (
    <div className="container-app py-8">
      <div className="mx-auto max-w-3xl">
        {/* Profile header card */}
        <div className="relative rounded-2xl border border-stone-200/60 bg-white shadow-card overflow-hidden">
          {/* Banner */}
          <div className="h-32 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700" />

          <div className="px-6 pb-6">
            {/* Avatar */}
            <div className="-mt-12 mb-4 flex items-end justify-between">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.displayName} className="h-24 w-24 rounded-full object-cover ring-4 ring-white" />
              ) : (
                <Avatar
                  name={profile.displayName}
                  size="xl"
                  className="ring-4 ring-white !h-24 !w-24 !text-2xl"
                />
              )}
              {currentUser?.id !== profile.id && (
                <Button variant="outline" size="sm" className="mt-4" onClick={handleMessage} isLoading={startingChat}>
                  Mesaj yaz
                </Button>
              )}
            </div>

            {/* Info */}
            <h1 className="text-xl font-bold text-stone-800">{profile.displayName}</h1>
            <p className="text-sm text-stone-500">@{profile.username}</p>
            {profile.bio && (
              <p className="mt-2 text-sm text-stone-600 leading-relaxed">{profile.bio}</p>
            )}

            {/* Skills & Interests */}
            {(profile.skills && profile.skills.length > 0) && (
              <div className="mt-4">
                <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Bacarıqlar</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill: string) => (
                    <Badge key={skill} variant="primary" size="sm">{skill}</Badge>
                  ))}
                </div>
              </div>
            )}
            {(profile.interests && profile.interests.length > 0) && (
              <div className="mt-3">
                <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Maraqlar</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest: string) => (
                    <Badge key={interest} variant="neutral" size="sm">{interest}</Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-stone-500">
              {profile.location && (
                <span className="flex items-center gap-1.5">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {profile.location}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatRelativeTime(profile.createdAt)} qoşulub
              </span>
              {(profile.activityPoints > 0) && (
                <span className="flex items-center gap-1.5 text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded-full">
                  ⭐ {profile.activityPoints} xal
                </span>
              )}
            </div>

            {/* Stats */}
            <div className="mt-5 flex gap-6">
              <div>
                <span className="text-lg font-bold text-stone-800">{displayListings.length}</span>
                <span className="ml-1 text-sm text-stone-500">elan</span>
              </div>
              <div>
                <span className="text-lg font-bold text-stone-800">{profile.communities?.length || 0}</span>
                <span className="ml-1 text-sm text-stone-500">İcma</span>
              </div>
              <div>
                <span className="text-lg font-bold text-stone-800">{allExperiences.length}</span>
                <span className="ml-1 text-sm text-stone-500">təcrübə</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 flex items-center gap-1 rounded-xl bg-stone-100 p-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition ${activeTab === tab.key
                ? 'bg-white text-stone-800 shadow-sm'
                : 'text-stone-500 hover:text-stone-700'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="mt-6 animate-fade-in">
          {/* LISTINGS */}
          {activeTab === 'listings' && (
            <div className="space-y-3">
              {displayListings.length === 0 ? (
                <EmptyState text="Bu istifadəçinin hələ elanı yoxdur." />
              ) : (
                displayListings.map((listing: any) => {
                  let images: string[] = [];
                  try { images = JSON.parse(listing.images || '[]'); } catch { }
                  const coverImage = images[0] || null;

                  return (
                    <Link
                      key={listing.id}
                      href={`/listings/${listing.id}`}
                      className="block rounded-2xl border border-stone-200/60 bg-white p-5 shadow-card transition hover:shadow-card-hover hover:-translate-y-0.5"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-lg overflow-hidden">
                          {coverImage ? (
                            <img src={coverImage} alt="" className="h-full w-full object-cover" />
                          ) : (
                            typeIcon[listing.category] || '📋'
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="neutral" size="sm">{typeLabel[listing.category] || listing.category}</Badge>
                          </div>
                          <h3 className="text-sm font-semibold text-stone-800 line-clamp-1">{listing.title}</h3>
                          <p className="mt-0.5 text-xs text-stone-500 line-clamp-1">{listing.description}</p>
                          <div className="mt-2 flex items-center gap-3 text-xs text-stone-400">
                            <span>{listing._count?.applications ?? 0} müraciət</span>
                            <span>·</span>
                            <span>{formatRelativeTime(listing.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          )}

          {/* WORK EXPERIENCE */}
          {activeTab === 'experience' && (
            <div className="space-y-4">
              {workExp.length === 0 ? (
                <EmptyState text="Bu istifadəçinin iş təcrübəsi əlavə edilməyib." />
              ) : workExp.map((exp: any) => <ExpCard key={exp.id} exp={exp} />)}
            </div>
          )}

          {/* EDUCATION */}
          {activeTab === 'education' && (
            <div className="space-y-4">
              {eduExp.length === 0 ? (
                <EmptyState text="Bu istifadəçinin təhsil məlumatı əlavə edilməyib." />
              ) : eduExp.map((exp: any) => <ExpCard key={exp.id} exp={exp} />)}
            </div>
          )}

          {/* VOLUNTEER */}
          {activeTab === 'volunteer' && (
            <div className="space-y-4">
              {volExp.length === 0 ? (
                <EmptyState text="Bu istifadəçinin könüllülük fəaliyyəti əlavə edilməyib." />
              ) : volExp.map((exp: any) => <ExpCard key={exp.id} exp={exp} />)}
            </div>
          )}

          {/* EVENTS */}
          {activeTab === 'events' && (
            <div className="space-y-4">
              {eventParticipations.length === 0 ? (
                <EmptyState text="Bu istifadəçi hələ heç bir tədbirdə iştirak etməyib." />
              ) : eventParticipations.map((ep: any) => {
                const event = ep.event;
                return (
                  <div key={ep.id} className="rounded-2xl border border-stone-200/60 bg-white p-5 shadow-card">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-xl">
                        🎟️
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                           <Badge variant="warning" size="sm">{event.status === 'UPCOMING' ? 'Gözlənilir' : event.status === 'ONGOING' ? 'Davam edir' : 'Bitib'}</Badge>
                           <span className="text-xs text-stone-500">{new Date(event.startDate).toLocaleDateString('az-AZ', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <h3 className="text-sm font-semibold text-stone-800">{event.title}</h3>
                        <p className="mt-1 text-sm text-stone-500 line-clamp-2">{event.description}</p>
                        {event.community && (
                          <Link href={`/communities/${event.community.slug}`} className="mt-2 text-xs font-medium text-primary-600 hover:underline inline-block">
                            {event.community.name} icması
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* BADGES */}
          {activeTab === 'badges' && (
            <div>
              {(profile.userBadges || profile.badges || []).length === 0 ? (
                <EmptyState text="Bu istifadəçinin hələ nişanı yoxdur." />
              ) : (
                <div className="grid gap-4 sm:grid-cols-3">
                  {(profile.userBadges || profile.badges || []).map((ub: any) => {
                    const badge = ub.badge || ub;
                    return (
                      <div
                        key={badge.id || badge.name}
                        className="flex flex-col items-center rounded-2xl border border-stone-200/60 bg-white p-6 shadow-card text-center"
                      >
                        <div className={`mb-3 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl ${badge.tier === 'GOLD' ? 'bg-amber-50' : badge.tier === 'SILVER' ? 'bg-stone-100' : 'bg-orange-50'}`}>
                          {badge.tier === 'GOLD' ? '🥇' : badge.tier === 'SILVER' ? '🥈' : '🥉'}
                        </div>
                        <h3 className="text-sm font-semibold text-stone-800">{badge.name}</h3>
                        <Badge
                          variant={badge.tier === 'GOLD' ? 'accent' : badge.tier === 'SILVER' ? 'neutral' : 'warning'}
                          size="sm"
                          className="mt-2"
                        >
                          {badge.tier === 'GOLD' ? 'Qızıl' : badge.tier === 'SILVER' ? 'Gümüş' : 'Bürünc'}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
