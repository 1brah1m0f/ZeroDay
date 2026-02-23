'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { Badge } from '@/components/Badge';
import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { formatRelativeTime } from '@/lib/utils';

export default function ForumPage() {
  const router = useRouter();
  const { accessToken, user } = useAuthStore();
  const [sortBy, setSortBy] = useState<'newest' | 'popular'>('newest');
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQ, setSearchQ] = useState('');

  // New topic form
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [newTags, setNewTags] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchTopics = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/forum/topics', {
        params: { q: searchQ || undefined },
      });
      let data = res.data?.data || res.data || [];
      if (sortBy === 'popular') {
        data = [...data].sort((a: any, b: any) => (b.upvotes ?? 0) - (a.upvotes ?? 0));
      }
      setTopics(data);
    } catch {
      setTopics([]);
    } finally {
      setLoading(false);
    }
  }, [sortBy, searchQ]);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  const handleVote = async (e: React.MouseEvent, topicId: string, value: 1 | -1) => {
    e.preventDefault();
    if (!accessToken) return router.push('/login');
    try {
      await api.post(`/forum/topics/${topicId}/vote`, { value }, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      fetchTopics();
    } catch { }
  };

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) return router.push('/login');
    try {
      setSubmitting(true);
      const tags = newTags.split(',').map(t => t.trim()).filter(Boolean);
      await api.post('/forum/topics', { title: newTitle, body: newBody, tags }, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setShowForm(false);
      setNewTitle(''); setNewBody(''); setNewTags('');
      fetchTopics();
    } catch {
      alert('Xəta baş verdi');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-app py-8">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-stone-800">Forum</h1>
            <p className="mt-0.5 text-sm text-stone-500">Suallar ver, təcrübəni paylaş, müzakirə et</p>
          </div>
          <Button variant="primary" size="md" onClick={() => {
            if (!accessToken) { router.push('/login'); return; }
            setShowForm(v => !v);
          }}>
            {showForm ? 'Ləğv et' : '+ Yeni Mövzu'}
          </Button>
        </div>

        {/* Create Topic Form */}
        {showForm && (
          <form onSubmit={handleCreateTopic} className="mb-6 rounded-2xl border bg-white p-5 shadow-card space-y-4">
            <h2 className="font-semibold text-stone-800">Yeni mövzu yarat</h2>
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">Başlıq</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="Mövzu başlığı..."
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">Məzmun</label>
              <textarea
                required
                rows={4}
                value={newBody}
                onChange={e => setNewBody(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 resize-none"
                placeholder="Fikirlərini paylaş..."
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">Teqlər (vergüllə ayırın)</label>
              <input
                type="text"
                value={newTags}
                onChange={e => setNewTags(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
                placeholder="məs: könüllülük, texnologiya, karyera"
              />
            </div>
            <Button type="submit" variant="primary" isLoading={submitting}>Mövzu Yarat</Button>
          </form>
        )}

        {/* Search bar */}
        <div className="mb-4 relative">
          <svg className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Mövzularda axtar..."
            value={searchQ}
            onChange={e => setSearchQ(e.target.value)}
            className="w-full rounded-xl border pl-9 pr-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>

        {/* Tabs */}
        <div className="mb-6 flex items-center gap-1 rounded-xl bg-stone-100 p-1">
          {[
            { key: 'newest' as const, label: 'Ən yeni' },
            { key: 'popular' as const, label: 'Ən populyar' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSortBy(tab.key)}
              className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition ${sortBy === tab.key
                ? 'bg-white text-stone-800 shadow-sm'
                : 'text-stone-500 hover:text-stone-700'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Topics list */}
        {loading ? (
          <div className="py-12 text-center text-stone-400">Yüklənir...</div>
        ) : topics.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-stone-200 bg-stone-50 py-12 text-center">
            <p className="text-stone-400">Hələ heç bir mövzu yoxdur. İlk mövzunu sən yarat!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {topics.map((topic) => {
              let tags: string[] = [];
              try { tags = JSON.parse(topic.tags || '[]'); } catch { }

              return (
                <Link key={topic.id} href={`/forum/${topic.slug}`} className="block group">
                  <div className="rounded-2xl border border-stone-200/60 bg-white p-5 shadow-card transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5">
                    <div className="flex gap-4">
                      {/* Upvotes */}
                      <div className="hidden shrink-0 flex-col items-center gap-1 sm:flex">
                        <button
                          onClick={(e) => handleVote(e, topic.id, 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 transition hover:bg-primary-50 hover:text-primary-600"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                          </svg>
                        </button>
                        <span className="text-sm font-bold text-stone-800">{topic.upvotes ?? 0}</span>
                        <button
                          onClick={(e) => handleVote(e, topic.id, -1)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 transition hover:bg-red-50 hover:text-red-500"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          {topic.isPinned && (
                            <Badge variant="warning" size="sm">📌 Sabit</Badge>
                          )}
                          {tags.map((tag: string) => (
                            <Badge key={tag} variant="neutral" size="sm">{tag}</Badge>
                          ))}
                        </div>

                        <h3 className="mt-2 text-base font-semibold text-stone-800 transition group-hover:text-primary-600 line-clamp-2">
                          {topic.title}
                        </h3>
                        <p className="mt-1 text-sm text-stone-500 line-clamp-2">{topic.body}</p>

                        <div className="mt-3 flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            {topic.author?.avatarUrl ? (
                              <img src={topic.author.avatarUrl} alt="" className="h-5 w-5 rounded-full" />
                            ) : (
                              <Avatar name={topic.author?.displayName || '?'} size="xs" />
                            )}
                            <span className="text-xs font-medium text-stone-600">{topic.author?.displayName}</span>
                          </div>
                          <span className="text-xs text-stone-400">{formatRelativeTime(topic.createdAt)}</span>
                          <div className="flex items-center gap-1 text-xs text-stone-400">
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            {topic.commentCount ?? topic._count?.comments ?? 0} cavab
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
