import Link from 'next/link';

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#EAEFE7]">
      <h1 className="text-6xl font-extrabold text-red-600">403</h1>
      <h2 className="text-2xl font-bold mt-4">Access Denied</h2>
      <Link href="/home" className="mt-6 px-6 py-2 bg-[#17261F] text-white rounded">
        Go Home
      </Link>
    </div>
  );
}