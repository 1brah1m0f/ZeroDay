import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Left side — decorative */}
      <div className="hidden w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 p-12 lg:flex lg:flex-col lg:justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 text-sm font-bold text-white">
            K
          </div>
          <span className="text-lg font-bold text-white">
            Kütlə<span className="text-accent-300">We</span>
          </span>
        </Link>
        <div>
          <h2 className="text-3xl font-bold text-white">Birlikdə öyrən,<br />birlikdə böyü.</h2>
          <p className="mt-3 max-w-md text-primary-100/70">
            Azərbaycanın ən böyük təhsil və könüllülük icmasına qoşul. Elanlar paylaş, qruplara qatıl, forumda müzakirə et.
          </p>
        </div>
        <p className="text-sm text-primary-200/50">&copy; {new Date().getFullYear()} KütləWe</p>
      </div>

      {/* Right side — form */}
      <div className="flex flex-1 items-center justify-center bg-surface-50 px-4 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-8 text-center lg:hidden">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-sm font-bold text-white">
                K
              </div>
              <span className="text-lg font-bold text-stone-800">
                Kütlə<span className="text-primary-600">We</span>
              </span>
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
