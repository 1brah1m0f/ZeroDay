'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { Avatar } from '@/components/Avatar';
import { Badge } from '@/components/Badge';
import { formatRelativeTime } from '@/lib/utils';

export default function TopicDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { accessToken, user } = useAuthStore();

  const [topic, setTopic] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [commentBody, setCommentBody] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  const fetchTopic = async () => {
    try {
      const res = await api.get(`/forum/topics/${params.topic}`);
      setTopic(res.data);
    } catch {
      setTopic(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTopic(); }, [params.topic]);

  const handleVote = async (value: 1 | -1) => {
    if (!accessToken) { router.push('/login'); return; }
    try {
      await api.post(`/forum/topics/${topic.id}/vote`, { value }, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      fetchTopic();
    } catch { }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) { router.push('/login'); return; }
    if (!commentBody.trim()) return;
    try {
      setSubmittingComment(true);
      await api.post(`/forum/topics/${topic.id}/comments`, { body: commentBody }, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setCommentBody('');
      fetchTopic();
    } catch {
      alert('Şərh göndərilərkən xəta baş verdi');
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) return <div className="py-20 text-center text-gray-400">Yüklənir...</div>;
  if (!topic) return <div className="py-20 text-center text-gray-400">Mövzu tapılmadı</div>;

  let tags: string[] = [];
  try { tags = JSON.parse(topic.tags || '[]'); } catch { }

  return (
    <div className="container-app py-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <Link href="/forum" className="flex items-center gap-1 text-sm text-primary-600 hover:underline">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Foruma qayıt
        </Link>

        {/* Main topic card */}
        <div className="rounded-2xl border bg-white p-8 shadow-card">
          {/* Tags */}
          {tags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {tags.map((tag: string) => (
                <Badge key={tag} variant="neutral" size="sm">#{tag}</Badge>
              ))}
            </div>
          )}

          <h1 className="text-2xl font-bold text-stone-900">{topic.title}</h1>

          {/* Author + date */}
          <div className="mt-4 flex items-center gap-3">
            {topic.author?.avatarUrl ? (
              <img src={topic.author.avatarUrl} alt="" className="h-9 w-9 rounded-full object-cover" />
            ) : (
              <Avatar name={topic.author?.displayName || '?'} size="sm" />
            )}
            <div>
              <Link href={`/u/${topic.author?.username}`} className="text-sm font-semibold text-stone-800 hover:text-primary-600">
                {topic.author?.displayName}
              </Link>
              <p className="text-xs text-stone-400">{formatRelativeTime(topic.createdAt)}</p>
            </div>
          </div>

          <div className="mt-6 whitespace-pre-wrap text-stone-700 leading-relaxed">{topic.body}</div>

          {/* Vote buttons */}
          <div className="mt-6 flex items-center gap-3 border-t border-stone-100 pt-5">
            <button
              onClick={() => handleVote(1)}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-stone-500 transition hover:bg-primary-50 hover:text-primary-600"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
              </svg>
              Bəyən
            </button>
            <span className="text-sm font-bold text-stone-800">{topic.upvotes ?? 0}</span>
            <button
              onClick={() => handleVote(-1)}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-stone-500 transition hover:bg-red-50 hover:text-red-500"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
              Bəyənmə
            </button>
          </div>
        </div>

        {/* Comment input */}
        <div className="rounded-2xl border bg-white p-5 shadow-card">
          <h2 className="mb-4 font-semibold text-stone-800">Şərh yaz</h2>
          {!accessToken ? (
            <div className="text-sm text-stone-500">
              Şərh yazmaq üçün{' '}
              <Link href="/login" className="font-medium text-primary-600 hover:underline">daxil olun</Link>.
            </div>
          ) : (
            <form onSubmit={handleComment} className="space-y-3">
              <textarea
                rows={3}
                value={commentBody}
                onChange={e => setCommentBody(e.target.value)}
                className="w-full rounded-xl border px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 resize-none"
                placeholder="Fikirinizi paylaşın..."
              />
              <button
                type="submit"
                disabled={!commentBody.trim() || submittingComment}
                className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-700 disabled:opacity-50"
              >
                {submittingComment ? 'Göndərilir...' : 'Şərh Göndər'}
              </button>
            </form>
          )}
        </div>

        {/* Comments list */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-stone-900">
            Şərhlər ({topic.comments?.length || 0})
          </h2>

          {(topic.comments || []).length === 0 ? (
            <div className="rounded-2xl border border-dashed border-stone-200 bg-stone-50 py-8 text-center">
              <p className="text-sm text-stone-400">Hələ şərh yoxdur. İlk şərhi siz yazın!</p>
            </div>
          ) : (
            topic.comments.map((comment: any) => (
              <div key={comment.id} className="rounded-2xl border bg-white p-5 shadow-card">
                <div className="flex items-center gap-3 mb-3">
                  {comment.author?.avatarUrl ? (
                    <img src={comment.author.avatarUrl} alt="" className="h-8 w-8 rounded-full object-cover" />
                  ) : (
                    <Avatar name={comment.author?.displayName || '?'} size="xs" />
                  )}
                  <Link href={`/u/${comment.author?.username}`} className="text-sm font-semibold text-stone-800 hover:text-primary-600">
                    {comment.author?.displayName}
                  </Link>
                  <span className="text-xs text-stone-400">{formatRelativeTime(comment.createdAt)}</span>
                </div>
                <p className="text-sm text-stone-700 leading-relaxed">{comment.body}</p>

                {/* Nested replies */}
                {comment.replies?.length > 0 && (
                  <div className="mt-4 space-y-3 border-l-2 border-stone-100 pl-4">
                    {comment.replies.map((reply: any) => (
                      <div key={reply.id}>
                        <div className="flex items-center gap-2 mb-1">
                          <Avatar name={reply.author?.displayName || '?'} size="xs" />
                          <Link href={`/u/${reply.author?.username}`} className="text-sm font-medium text-stone-800 hover:text-primary-600">
                            {reply.author?.displayName}
                          </Link>
                          <span className="text-xs text-stone-400">{formatRelativeTime(reply.createdAt)}</span>
                        </div>
                        <p className="text-sm text-stone-700">{reply.body}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
