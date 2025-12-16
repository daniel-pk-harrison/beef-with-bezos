import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-rage-500 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-white mb-2">Page Not Found</h2>
        <p className="text-white/60 mb-8 max-w-md">
          Unlike Amazon, we actually know when something is missing.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-rage-600 hover:bg-rage-500 text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          <span>Back to Home</span>
        </Link>
      </div>
    </main>
  );
}
