'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { io, Socket } from 'socket.io-client';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { formatRelativeTime } from '@/lib/utils';
import { Avatar } from '@/components/Avatar';

export default function CommunityChatPage() {
  const params = useParams();
  const { accessToken, user: currentUser } = useAuthStore();
  const [community, setCommunity] = useState<any>(null);
  const [channels, setChannels] = useState<any[]>([]);
  const [groupedChannels, setGroupedChannels] = useState<Record<string, any[]>>({});
  const [activeChannel, setActiveChannel] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [typingUsers, setTypingUsers] = useState<Record<string, Record<string, string>>>({}); // channelId -> userId -> username
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [commRes, chanRes] = await Promise.all([
          api.get(`/communities/${params.slug}`),
          api.get(`/communities/${params.slug}/channels`)
        ]);
        setCommunity(commRes.data);
        setChannels(chanRes.data.channels);
        setGroupedChannels(chanRes.data.grouped);
        
        // Auto-select first channel
        if (chanRes.data.channels.length > 0) {
          const first = chanRes.data.channels.find((c: any) => c.isDefault) || chanRes.data.channels[0];
          setActiveChannel(first);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.slug]);

  // Load Messages for Active Channel
  useEffect(() => {
    if (!activeChannel || !accessToken) return;
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/communities/channels/${activeChannel.id}/messages`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        setMessages(res.data);
        scrollToBottom();
      } catch (err) {
        console.error(err);
      }
    };
    fetchMessages();
  }, [activeChannel, accessToken]);

  // Socket setup
  useEffect(() => {
    if (!accessToken) return;
    // Socket.IO needs the raw server URL without /api/v1 prefix
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
    const backendUrl = apiUrl.replace(/\/api\/v1\/?$/, '');
    const s = io(backendUrl, { auth: { token: accessToken } });
    
    s.on('connect', () => console.log('Connected to socket'));
    
    s.on('channel:message:new', (message: any) => {
      if (activeChannel && message.channelId === activeChannel.id) {
        setMessages(prev => [...prev, message]);
        scrollToBottom();
      }
    });

    s.on('channel:typing', (data: { channelId: string, userId: string, username: string, isTyping: boolean }) => {
      setTypingUsers(prev => {
        const updated = { ...prev };
        if (!updated[data.channelId]) updated[data.channelId] = {};
        
        if (data.isTyping) {
          updated[data.channelId][data.userId] = data.username;
        } else {
          delete updated[data.channelId][data.userId];
        }
        return updated;
      });
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, [accessToken, activeChannel]);

  // Join/Leave channel room when activeChannel changes
  useEffect(() => {
    if (!socket || !activeChannel) return;
    socket.emit('channel:join', { channelId: activeChannel.id });
    
    return () => {
      socket.emit('channel:leave', { channelId: activeChannel.id });
    };
  }, [socket, activeChannel]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChannel || !accessToken || !socket) return;

    try {
      // Opt 1: REST
      // const res = await api.post(`/communities/channels/${activeChannel.id}/messages`, { body: newMessage }, { headers: { Authorization: `Bearer ${accessToken}` }});
      
      // Opt 2: Socket
      socket.emit('channel:message:send', {
        channelId: activeChannel.id,
        body: newMessage
      });
      
      setNewMessage('');
      socket.emit('channel:typing:indicator', { channelId: activeChannel.id, isTyping: false });
    } catch (err) {
      console.error(err);
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    if (socket && activeChannel) {
      socket.emit('channel:typing:indicator', {
        channelId: activeChannel.id,
        isTyping: e.target.value.length > 0
      });
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center text-stone-500">Yüklənir...</div>;
  if (!community) return <div className="h-screen flex items-center justify-center text-stone-500">İcma tapılmadı və ya giriş icazəniz yoxdur</div>;

  const currentTypingUsers = Object.values(typingUsers[activeChannel?.id] || {});

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-white">
      {/* Sidebar - Channels */}
      <div className="w-64 shrink-0 border-r border-stone-200 bg-stone-50 flex flex-col">
        <div className="p-4 border-b border-stone-200">
          <h2 className="font-bold text-stone-900 truncate">{community.name}</h2>
          <Link href={`/communities/${community.slug}`} className="text-xs text-primary-600 hover:underline">
            İcma səhifəsinə qayıt
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {Object.entries(groupedChannels).map(([category, chans]) => (
            <div key={category}>
              <h3 className="mb-1 px-2 text-xs font-semibold uppercase tracking-wider text-stone-500">
                {category}
              </h3>
              <ul className="space-y-0.5">
                {chans.map((ch: any) => (
                  <li key={ch.id}>
                    <button
                      onClick={() => setActiveChannel(ch)}
                      className={`w-full text-left px-2 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                        activeChannel?.id === ch.id
                          ? 'bg-primary-100 text-primary-900'
                          : 'text-stone-600 hover:bg-stone-200/50 hover:text-stone-900'
                      }`}
                    >
                      <span className="text-stone-400 text-lg leading-none">
                        {ch.type === 'ANNOUNCEMENT' ? '📢' : ch.type === 'EVENT' ? '📅' : '#'}
                      </span>
                      <span className="truncate">{ch.name.replace(/^[#📢📅]\s*/, '')}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {activeChannel ? (
          <>
            {/* Channel Header */}
            <div className="flex h-14 shrink-0 items-center justify-between border-b border-stone-200 bg-white px-6">
              <div className="flex flex-col">
                <div className="flex items-center gap-2 font-bold text-stone-900">
                  <span className="text-stone-400">
                    {activeChannel.type === 'ANNOUNCEMENT' ? '📢' : activeChannel.type === 'EVENT' ? '📅' : '#'}
                  </span>
                  {activeChannel.name.replace(/^[#📢📅]\s*/, '')}
                </div>
                {activeChannel.description && (
                  <span className="text-xs text-stone-500 truncate">{activeChannel.description}</span>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center text-stone-400">
                  <div className="mb-4 text-4xl">💬</div>
                  <h3 className="mb-1 text-lg font-medium text-stone-900">Kanal boşdur</h3>
                  <p className="text-sm">İlk mesajı siz göndərin!</p>
                </div>
              ) : (
                messages.map((msg, i) => {
                  const isConsecutive = i > 0 && messages[i - 1].senderId === msg.senderId && 
                    new Date(msg.createdAt).getTime() - new Date(messages[i - 1].createdAt).getTime() < 5 * 60 * 1000;
                  
                  return (
                    <div key={msg.id} className={`flex gap-3 ${isConsecutive ? 'mt-1' : ''}`}>
                      {!isConsecutive ? (
                        <div className="shrink-0 mt-0.5">
                          {msg.sender.avatarUrl ? (
                            <img src={msg.sender.avatarUrl} alt="" className="h-10 w-10 rounded-full object-cover" />
                          ) : (
                            <Avatar name={msg.sender.displayName} size="md" />
                          )}
                        </div>
                      ) : (
                        <div className="w-10 shrink-0" /> // Spacer
                      )}
                      
                      <div className="min-w-0 flex-1">
                        {!isConsecutive && (
                          <div className="flex items-baseline gap-2 mb-0.5">
                            <span className="font-semibold text-stone-900">{msg.sender.displayName}</span>
                            <span className="text-xs text-stone-400">{formatRelativeTime(msg.createdAt)}</span>
                          </div>
                        )}
                        <div className="text-stone-800 text-[15px] whitespace-pre-wrap leading-relaxed">
                          {msg.body}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            {activeChannel.type === 'ANNOUNCEMENT' && community.memberRole !== 'OWNER' && community.memberRole !== 'ADMIN' && community.memberRole !== 'MODERATOR' ? (
              <div className="p-4 bg-stone-50 border-t border-stone-200 text-center text-sm text-stone-500 font-medium">
                Siz yalnız oxumaq hüququna maliksiniz
              </div>
            ) : (
              <div className="shrink-0 p-4 bg-white border-t border-stone-200">
                {currentTypingUsers.length > 0 && (
                  <div className="mb-2 text-xs text-stone-500 font-medium animate-pulse">
                    {currentTypingUsers.join(', ')} {currentTypingUsers.length > 1 ? 'yazırlar' : 'yazır'}...
                  </div>
                )}
                <form onSubmit={handleSendMessage} className="relative flex items-center">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={handleTyping}
                    placeholder={`#${activeChannel.name.replace(/^[#📢📅]\s*/, '')} kanalına mesaj göndər...`}
                    className="w-full rounded-xl border border-stone-300 bg-stone-50 py-3 pl-4 pr-12 text-[15px] shadow-sm focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="absolute right-2 flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white transition hover:bg-primary-700 disabled:opacity-50 disabled:hover:bg-primary-600"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </form>
              </div>
            )}
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-stone-400">
            Kanal seçin
          </div>
        )}
      </div>
    </div>
  );
}
