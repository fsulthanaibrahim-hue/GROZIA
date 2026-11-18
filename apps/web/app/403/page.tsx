import { ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function ForbiddenPage() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center bg-[#EAEFE7] px-4 text-[#17261F]"
      style={{ fontFamily: "'Figtree', system-ui, sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800&family=Figtree:wght@400;500;600&display=swap');
        .font-display { font-family: 'Bricolage Grotesque', 'Figtree', system-ui, sans-serif; }
      `}</style>

      <div className="text-center">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-100">
          <ShieldAlert className="h-12 w-12 text-red-600" strokeWidth={1.5} />
        </div>
        
        <h1 className="font-display text-6xl font-extrabold tracking-tight sm:text-8xl">
          403
        </h1>
        
        <h2 className="font-display mt-2 text-2xl font-bold sm:text-3xl">
          Access Denied
        </h2>
        
        <p className="mt-4 max-w-md text-[#17261F]/60">
          You do not have the required permissions to view this page. Please contact your shop Owner if you believe this is a mistake.
        </p>

        <Link
          href="/home"
          className="mt-8 inline-block rounded-md bg-[#17261F] px-6 py-3 font-semibold text-[#EAEFE7] transition-colors hover:bg-[#25392F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#17261F]"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}