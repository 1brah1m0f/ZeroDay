'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { api } from '@/lib/api';

export default function SettingsPage() {
  const { user, accessToken, setAuth } = useAuthStore();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [skills, setSkills] = useState((user?.skills || []).join(', '));
  const [interests, setInterests] = useState((user?.interests || []).join(', '));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await api.put(
        '/users/profile',
        { 
          displayName, 
          bio,
          skills: skills.split(',').map((s: string) => s.trim()).filter(Boolean),
          interests: interests.split(',').map((s: string) => s.trim()).filter(Boolean)
        },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      setAuth({ ...user, ...res.data }, accessToken!, '');
      setMessage('Tənzimləmələr saxlanıldı!');
    } catch {
      setMessage('Xəta baş verdi');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Tənzimləmələr</h1>

      {message && (
        <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600">{message}</div>
      )}

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Ad Soyad
            </label>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Haqqında
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              placeholder="Özünüz haqqında qısa məlumat..."
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Bacarıqlar (vergüllə ayırın)
            </label>
            <input
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="Məsələn: React, Node.js, Dizayn"
              className="w-full rounded-lg border px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Maraqlar (vergüllə ayırın)
            </label>
            <input
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="Məsələn: İdman, Mütaliə, Səyahət"
              className="w-full rounded-lg border px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-primary-600 px-6 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
          >
            {saving ? 'Saxlanılır...' : 'Saxla'}
          </button>
        </div>
      </div>
    </div>
  );
}
