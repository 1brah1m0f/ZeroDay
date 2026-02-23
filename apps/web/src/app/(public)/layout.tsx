'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAuthStore } from '@/lib/store';

const navLinks = [
  { href: '/listings', label: 'Elanlar' },
  { href: '/groups', label: 'Qruplar' },
  { href: '/forum', label: 'Forum' },
];

function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, accessToken } = useAuthStore();

  const isAuthenticated = !!accessToken;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200/60 bg-white/80 backdrop-blur-xl">
      <nav className="container-app flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-600 text-sm font-bold text-white">
            K
          </div>
          <span className="text-lg font-bold text-stone-800">
            Kütlə<span className="text-primary-600">We</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${pathname === link.href || pathname?.startsWith(link.href + '/')
                ? 'bg-primary-50 text-primary-700'
                : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Auth buttons (desktop) */}
        <div className="hidden items-center gap-2.5 md:flex">
          {isAuthenticated ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-xl bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-700 transition hover:bg-stone-200"
            >
              <div className="h-6 w-6 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-xs font-bold uppercase">
                {user?.displayName?.[0] || 'U'}
              </div>
              <span>Panel</span>
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-xl px-4 py-2 text-sm font-semibold text-stone-600 transition hover:bg-stone-50 hover:text-stone-900"
              >
                Daxil ol
              </Link>
              <Link
                href="/register"
                className="rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 hover:shadow-md"
              >
                Qeydiyyat
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-stone-500 transition hover:bg-stone-100 md:hidden"
          aria-label="Menu"
        >
          {mobileOpen ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-stone-100 bg-white px-4 pb-4 pt-2 md:hidden animate-fade-in">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block rounded-xl px-4 py-2.5 text-sm font-medium transition ${pathname === link.href
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-stone-600 hover:bg-stone-50'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-3 flex flex-col gap-2 border-t border-stone-100 pt-3">
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl bg-stone-100 px-4 py-2.5 text-center text-sm font-semibold text-stone-700 transition hover:bg-stone-200"
              >
                Panelə keçid
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl border border-stone-200 px-4 py-2.5 text-center text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
                >
                  Daxil ol
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl bg-primary-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-primary-700"
                >
                  Qeydiyyat
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-stone-200/60 bg-white">
      <div className="container-app py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-600 text-sm font-bold text-white">
                K
              </div>
              <span className="text-lg font-bold text-stone-800">
                Kütlə<span className="text-primary-600">We</span>
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-stone-500">
              Azərbaycanın təhsil və könüllülük platforması. Birlikdə daha güclüyük.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-stone-800">Platforma</h4>
            <ul className="space-y-2">
              {['Elanlar', 'Qruplar', 'Forum'].map((label) => (
                <li key={label}>
                  <Link
                    href={`/${label.toLowerCase()}`}
                    className="text-sm text-stone-500 transition hover:text-primary-600"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-stone-800">Dəstək</h4>
            <ul className="space-y-2">
              {['Haqqımızda', 'Əlaqə', 'Şərtlər', 'Gizlilik'].map((label) => (
                <li key={label}>
                  <span className="text-sm text-stone-500 transition hover:text-primary-600 cursor-pointer">
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-stone-800">Sosial</h4>
            <div className="flex gap-3">
              {[
                { label: 'GitHub', path: 'M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z' },
                { label: 'Twitter', path: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z' },
              ].map((social) => (
                <span
                  key={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-100 text-stone-500 transition hover:bg-primary-50 hover:text-primary-600 cursor-pointer"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d={social.path} />
                  </svg>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-stone-100 pt-6 text-center text-sm text-stone-400">
          &copy; {new Date().getFullYear()} KütləWe. Bütün hüquqlar qorunur.
        </div>
      </div>
    </footer>
  );
}

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-4rem)]">{children}</main>
      <Footer />
    </>
  );
}
