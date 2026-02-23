'use client';

import Link from 'next/link';
import { useAuthStore } from '@/lib/store';

export default function DashboardPage() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Salam, {user?.displayName}!</h1>
        <p className="mt-1 text-gray-500">Panel səhifəsinə xoş gəldiniz</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/my/listings"
          className="rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md"
        >
          <h3 className="text-sm font-medium text-gray-500">Elanlarım</h3>
          <p className="mt-2 text-2xl font-bold text-gray-900">—</p>
        </Link>
        <Link
          href="/my/groups"
          className="rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md"
        >
          <h3 className="text-sm font-medium text-gray-500">Qruplarım</h3>
          <p className="mt-2 text-2xl font-bold text-gray-900">—</p>
        </Link>
        <Link
          href="/my/experiences"
          className="rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md"
        >
          <h3 className="text-sm font-medium text-gray-500">Təcrübələr</h3>
          <p className="mt-2 text-2xl font-bold text-gray-900">—</p>
        </Link>
        <Link
          href="/chat"
          className="rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md"
        >
          <h3 className="text-sm font-medium text-gray-500">Mesajlar</h3>
          <p className="mt-2 text-2xl font-bold text-gray-900">—</p>
        </Link>
        <Link
          href="/my/applications"
          className="rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md"
        >
          <h3 className="text-sm font-medium text-gray-500">Müraciətlər</h3>
          <p className="mt-2 text-2xl font-bold text-gray-900">—</p>
        </Link>
        <Link
          href="/my/saved"
          className="rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md"
        >
          <h3 className="text-sm font-medium text-gray-500">Saxlanılanlar</h3>
          <p className="mt-2 text-2xl font-bold text-gray-900">—</p>
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Tez hərəkətlər</h2>
          <div className="space-y-2">
            <Link
              href="/my/listings"
              className="block rounded-lg bg-primary-50 px-4 py-3 text-sm font-medium text-primary-700 hover:bg-primary-100"
            >
              + Yeni elan yarat
            </Link>
            <Link
              href="/my/groups"
              className="block rounded-lg bg-primary-50 px-4 py-3 text-sm font-medium text-primary-700 hover:bg-primary-100"
            >
              + Yeni qrup yarat
            </Link>
            <Link
              href="/my/experiences"
              className="block rounded-lg bg-primary-50 px-4 py-3 text-sm font-medium text-primary-700 hover:bg-primary-100"
            >
              + Təcrübə əlavə et
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
