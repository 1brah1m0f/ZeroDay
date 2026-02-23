'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store';

export default function ChatConversationPage() {
  const params = useParams();
  const { user, accessToken } = useAuthStore();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/chat/conversations/${params.id}/messages`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setMessages(res.data);
      } catch {
        // handle
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [params.id, accessToken]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || loading) return;

    try {
      const textToSend = newMessage;
      setNewMessage('');

      const res = await api.post(`/chat/conversations/${params.id}/messages`, {
        body: textToSend
      }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      // Optimitic update
      setMessages(prev => [...prev, res.data.message]);
    } catch {
      alert('Mesaj göndərilərkən xəta baş verdi.');
    }
  };

  return (
    <div className="flex h-[calc(100vh-10rem)] flex-col rounded-xl border bg-white shadow-sm">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="py-12 text-center text-gray-400">Yüklənir...</div>
        ) : messages.length === 0 ? (
          <div className="py-12 text-center text-gray-400">Söhbətə başlayın!</div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender?.id === user?.id;
            return (
              <div
                key={msg.id}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs rounded-2xl px-4 py-2 ${isMe
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                    }`}
                >
                  <p className="text-sm">{msg.body}</p>
                  <p
                    className={`mt-1 text-xs ${isMe ? 'text-primary-200' : 'text-gray-400'
                      }`}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString('az-AZ', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 rounded-lg border px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            placeholder="Mesaj yazın..."
          />
          <button
            onClick={handleSend}
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            Göndər
          </button>
        </div>
      </div>
    </div>
  );
}
