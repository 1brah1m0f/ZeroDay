'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { Avatar } from '@/components/Avatar';
import { formatRelativeTime } from '@/lib/utils';
import clsx from 'clsx';

function ChatInterface() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeId = searchParams.get('id');

  const { user, accessToken } = useAuthStore();
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');

  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch conversations
  const fetchConversations = async () => {
    try {
      const res = await api.get('/chat/conversations', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setConversations(res.data);
    } catch {
      // handle err
    } finally {
      setLoadingConvs(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchConversations();
    }
  }, [accessToken]);

  // Fetch messages when activeId changes
  useEffect(() => {
    if (!activeId || !accessToken) {
      setMessages([]);
      return;
    }

    let isMounted = true;
    const fetchMessages = async () => {
      setLoadingMessages(true);
      try {
        const res = await api.get(`/chat/conversations/${activeId}/messages`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (isMounted) {
          setMessages(res.data);
          // Small delay to ensure scroll happens after render
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
          }, 100);
        }
      } catch {
        // handle err
      } finally {
        if (isMounted) setLoadingMessages(false);
      }
    };

    fetchMessages();

    // Setup polling for new messages on this active chat
    const interval = setInterval(() => {
      api.get(`/chat/conversations/${activeId}/messages`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      }).then(res => {
        // if lengths differ or last message id differs, update
        if (isMounted) {
          setMessages(prev => {
            if (prev.length === 0) return res.data;
            const newLast = res.data[res.data.length - 1];
            const oldLast = prev[prev.length - 1];
            if (newLast?.id !== oldLast?.id || res.data.length !== prev.length) {
              setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
              return res.data;
            }
            return prev;
          });
        }
      }).catch(() => { });
    }, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [activeId, accessToken]);

  const handleSend = async () => {
    if (!newMessage.trim() || sending || !activeId) return;

    try {
      setSending(true);
      const textToSend = newMessage;
      setNewMessage('');

      const res = await api.post(`/chat/conversations/${activeId}/messages`, {
        body: textToSend
      }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      // Optimistic update
      setMessages(prev => [...prev, res.data.message]);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);

      // Refresh conversations list to update last message snippet
      fetchConversations();
    } catch {
      alert('Mesaj göndərilərkən xəta baş verdi.');
    } finally {
      setSending(false);
    }
  };

  // Find active conversation details
  const activeConversation = conversations.find(c => c.id === activeId);
  const activeOtherUser = activeConversation?.participants?.find(
    (p: any) => p.username !== user?.username
  );

  return (
    <div className="flex h-[calc(100vh-140px)] flex-col md:flex-row overflow-hidden rounded-2xl border bg-white shadow-sm mt-4">

      {/* LEFT PANE: Conversations List */}
      <div className={clsx(
        "flex flex-col border-r border-stone-100 bg-stone-50 md:w-80 lg:w-96 shrink-0",
        activeId ? "hidden md:flex" : "flex w-full"
      )}>
        <div className="p-4 border-b border-stone-100 bg-white">
          <h2 className="text-xl font-bold text-stone-800">Mesajlaşma</h2>
          <div className="mt-3 relative">
            <svg className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Mesajlarda arayın"
              className="w-full bg-stone-100 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loadingConvs ? (
            <div className="p-6 text-center text-sm text-stone-400">Söhbətlər yüklənir...</div>
          ) : conversations.length === 0 ? (
            <div className="p-6 text-center text-sm text-stone-400">Heç bir söhbət yoxdur.</div>
          ) : (
            <div className="divide-y divide-stone-100">
              {conversations.map((conv) => {
                const otherUser = conv.participants?.find(
                  (p: any) => p.username !== user?.username,
                );
                const isActive = conv.id === activeId;

                return (
                  <button
                    key={conv.id}
                    onClick={() => router.push(`/chat?id=${conv.id}`)}
                    className={clsx(
                      "w-full flex items-start gap-3 p-4 text-left transition relative",
                      isActive ? "bg-white border-l-4 border-l-primary-600" : "hover:bg-stone-100 border-l-4 border-l-transparent",
                    )}
                  >
                    <Link
                      href={`/u/${otherUser?.username}`}
                      onClick={(e) => e.stopPropagation()}
                      className="shrink-0 transition hover:opacity-80"
                    >
                      {otherUser?.avatarUrl ? (
                        <img src={otherUser.avatarUrl} alt="" className="h-12 w-12 rounded-full object-cover" />
                      ) : (
                        <Avatar name={otherUser?.displayName || '?'} size="md" />
                      )}
                    </Link>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="font-semibold text-stone-900 truncate pr-2">
                          {otherUser?.displayName || 'Naməlum'}
                        </span>
                        <span className="text-xs text-stone-500 shrink-0">
                          {conv.lastMessage ? formatRelativeTime(conv.lastMessage.createdAt) : ''}
                        </span>
                      </div>
                      <p className="text-sm text-stone-500 truncate">
                        {conv.lastMessage?.senderId === user?.id ? 'Siz: ' : ''}
                        {conv.lastMessage?.body || 'Mesaj yoxdur'}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANE: Active Chat */}
      <div className={clsx(
        "flex-1 flex flex-col bg-white",
        !activeId ? "hidden md:flex" : "flex"
      )}>
        {!activeId ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-24 h-24 mb-4 rounded-full bg-stone-100 flex items-center justify-center text-4xl text-stone-300">
              💬
            </div>
            <h3 className="text-xl font-semibold text-stone-700">Mesajlaşmağa başlayın</h3>
            <p className="text-stone-500 mt-2 max-w-sm">
              Soldakı siyahıdan bir söhbət seçin və ya istifadəçilərin profilindən "Mesaj yaz" klikləyərək yeni söhbətə başlayın.
            </p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-3 p-4 border-b border-stone-100 bg-white">
              <button
                onClick={() => router.push('/chat')}
                className="md:hidden p-2 -ml-2 text-stone-500 hover:bg-stone-100 rounded-xl"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <Link href={`/u/${activeOtherUser?.username}`} className="shrink-0 transition hover:opacity-80">
                {activeOtherUser?.avatarUrl ? (
                  <img src={activeOtherUser.avatarUrl} alt="" className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <Avatar name={activeOtherUser?.displayName || '?'} size="sm" />
                )}
              </Link>
              <div>
                <Link href={`/u/${activeOtherUser?.username}`}>
                  <h3 className="font-semibold text-stone-900 hover:text-primary-600 transition">{activeOtherUser?.displayName || 'Naməlum'}</h3>
                </Link>
                <p className="text-xs text-stone-500">@{activeOtherUser?.username}</p>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50/50">
              {loadingMessages ? (
                <div className="py-12 text-center text-stone-400">Yüklənir...</div>
              ) : messages.length === 0 ? (
                <div className="py-12 text-center text-stone-400 flex flex-col items-center">
                  <span className="text-3xl mb-3">👋</span>
                  İlk mesajı siz yazın!
                </div>
              ) : (
                messages.map((msg, index) => {
                  const isMe = msg.sender?.id === user?.id;
                  // simple heuristic for grouping
                  const prevMsg = messages[index - 1];
                  const showAvatar = !isMe && prevMsg?.sender?.id !== msg.sender?.id;

                  return (
                    <div
                      key={msg.id}
                      className={clsx("flex gap-2 max-w-[85%]", isMe ? "ml-auto flex-row-reverse" : "mr-auto")}
                    >
                      {/* Avatar placeholder for grouping */}
                      {!isMe && (
                        <div className="w-8 shrink-0 flex items-end pb-1">
                          {showAvatar ? (
                            <Link href={`/u/${msg.sender?.username}`} className="transition hover:opacity-80">
                              {msg.sender?.avatarUrl ?
                                <img src={msg.sender.avatarUrl} className="w-8 h-8 rounded-full object-cover" alt="" /> :
                                <Avatar name={msg.sender?.displayName || '?'} size="xs" />}
                            </Link>
                          ) : null}
                        </div>
                      )}

                      <div className="flex flex-col gap-1 min-w-[100px]">
                        <div className={clsx(
                          "px-4 py-2.5 text-[15px] shadow-sm",
                          isMe ? "bg-primary-600 text-white rounded-2xl rounded-tr-sm" : "bg-white border border-stone-200 text-stone-800 rounded-2xl rounded-tl-sm"
                        )}>
                          <p className="break-words whitespace-pre-wrap leading-relaxed">{msg.body}</p>
                        </div>
                        <span className={clsx(
                          "text-[10px] font-medium text-stone-400",
                          isMe ? "text-right mr-1" : "text-left ml-1"
                        )}>
                          {new Date(msg.createdAt).toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} className="h-4" />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-stone-100">
              <div className="flex items-end gap-2 bg-stone-100 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-primary-500/20 transition-all">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  className="flex-1 bg-transparent max-h-32 min-h-[44px] px-3 py-2.5 resize-none text-[15px] focus:outline-none placeholder:text-stone-400"
                  placeholder="Bir mesaj yazın..."
                  rows={1}
                />
                <button
                  onClick={handleSend}
                  disabled={!newMessage.trim() || sending}
                  className="h-10 w-10 shrink-0 flex items-center justify-center rounded-xl bg-primary-600 text-white transition hover:bg-primary-700 disabled:opacity-50 disabled:hover:bg-primary-600 mb-0.5"
                >
                  <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                </button>
              </div>
              <p className="text-[10px] text-stone-400 text-center mt-2 font-medium">
                Göndərmək üçün Enter, yeni sətir üçün Shift + Enter basın
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Wrap in Suspense because of useSearchParams
export default function ChatPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-stone-500">Yüklənir...</div>}>
      <ChatInterface />
    </Suspense>
  )
}
