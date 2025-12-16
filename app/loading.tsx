export default function Loading() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8 sm:py-12 relative overflow-hidden">
      {/* Header skeleton */}
      <div className="text-center mb-4">
        <div className="h-7 sm:h-8 w-64 bg-white/10 rounded animate-pulse mx-auto" />
        <div className="h-4 w-48 bg-white/5 rounded animate-pulse mx-auto mt-2" />
      </div>

      {/* Counter skeleton */}
      <div className="my-6 sm:my-8">
        <div className="h-28 sm:h-40 md:h-56 w-24 sm:w-32 md:w-48 bg-rage-900/30 rounded-lg animate-pulse" />
      </div>

      {/* Times label skeleton */}
      <div className="h-8 sm:h-10 w-24 bg-white/10 rounded animate-pulse mb-4" />

      {/* Tagline skeleton */}
      <div className="h-5 w-56 bg-white/5 rounded animate-pulse mb-8 sm:mb-12" />

      {/* Recent misses skeleton */}
      <div className="w-full max-w-lg">
        <div className="h-5 w-32 bg-white/10 rounded animate-pulse mx-auto mb-4" />
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white/5 border border-rage-900/20 rounded-lg p-4"
              style={{ opacity: 1 - i * 0.2 }}
            >
              <div className="h-4 w-3/4 bg-white/10 rounded animate-pulse mb-2" />
              <div className="h-3 w-1/2 bg-white/5 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
