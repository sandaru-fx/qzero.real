export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 py-12 sm:px-6 lg:px-9">
      <div className="mb-10 space-y-4">
        <div className="h-4 w-40 rounded-full shimmer" />
        <div className="h-10 w-72 max-w-full rounded-full shimmer" />
        <div className="h-4 w-full max-w-xl rounded-full shimmer" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-xl border border-white/5 bg-brand-card"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <div className="aspect-[4/3] shimmer sm:aspect-[5/4]" />
            <div className="space-y-4 p-5 sm:p-6">
              <div className="h-3 w-20 rounded-full shimmer" />
              <div className="h-6 w-3/4 rounded-full shimmer" />
              <div className="h-7 w-1/2 rounded-full shimmer" />
              <div className="flex gap-2 pt-2">
                <div className="h-8 w-24 rounded-full shimmer" />
                <div className="h-8 w-24 rounded-full shimmer" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
