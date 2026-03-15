'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { useEffect, useState } from 'react';
import { APP_NAME } from '@kutlewe/shared';

const sidebarLinks = [
  { href: '/dashboard', label: 'Panel' },
  { href: '/my/listings', label: 'Elanlarım' },
  { href: '/my/communities', label: 'İcmalarım' },
  { href: '/my/invitations', label: 'Dəvətlərim' },
  { href: '/my/applications', label: 'Müraciətlər' },
  { href: '/my/saved', label: 'Saxlanılanlar' },
  { href: '/chat', label: 'Mesajlar' },
  { href: '/my/profile', label: 'Profilim' },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, accessToken, logout } = useAuthStore();
  const [hydrated, setHydrated] = useState(false);

  // Wait for Zustand to hydrate from localStorage before checking auth
  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && !accessToken) {
      router.push('/login');
    }
  }, [hydrated, accessToken, router]);

  if (!hydrated || !accessToken) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b bg-white">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-600 text-sm font-bold text-white">
              K
            </div>
            <span className="text-lg font-bold text-stone-800">
              Kütlə<span className="text-primary-600">We</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.displayName}</span>
            <button
              onClick={() => {
                logout();
                router.push('/');
              }}
              className="text-sm text-red-500 hover:underline"
            >
              Çıxış
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto flex gap-6 px-4 py-6">
        {/* Sidebar */}
        <aside className="hidden w-56 flex-shrink-0 md:block">
          <nav className="space-y-1">
            {sidebarLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block rounded-lg px-3 py-2 text-sm font-medium ${pathname === link.href
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
