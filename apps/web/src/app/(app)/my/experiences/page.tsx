'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store';

export default function MyExperiencesPage() {
  const { accessToken } = useAuthStore();
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/profiles/experiences', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setExperiences(res.data);
      } catch {
        // handle
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [accessToken]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Təcrübələrim</h1>
        <button className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">
          + Əlavə et
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-400">Yüklənir...</div>
      ) : experiences.length === 0 ? (
        <div className="rounded-xl border bg-white p-12 text-center">
          <p className="text-gray-400">Hələ təcrübə əlavə etməmisiniz</p>
          <p className="mt-1 text-sm text-gray-400">
            LinkedIn kimi könüllülük, iş, təhsil təcrübələrinizi paylaşın
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="rounded-xl border bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{exp.title}</h3>
                  <p className="text-sm text-gray-600">{exp.organization}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(exp.startDate).toLocaleDateString('az-AZ')} —{' '}
                    {exp.isCurrent
                      ? 'Davam edir'
                      : exp.endDate
                        ? new Date(exp.endDate).toLocaleDateString('az-AZ')
                        : ''}
                  </p>
                  {exp.description && (
                    <p className="mt-2 text-sm text-gray-500">{exp.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button className="rounded-lg border px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50">
                    Redaktə
                  </button>
                  <button className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50">
                    Sil
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
