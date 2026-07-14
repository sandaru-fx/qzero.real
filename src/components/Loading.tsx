export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 py-12 sm:px-6 lg:px-9">
      <div className="mb-10 space-y-4">
        <div className="h-4 w-40 rounded-full shimmer" />
        <div className="h-10 w-72 max-w-full rounded-full shimmer" />
        <div className="h-4 w-full max-w-xl rounded-full shimmer" />
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-lg border border-white/5 bg-brand-card sm:rounded-xl"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <div className="aspect-[5/4] shimmer" />
            <div className="space-y-3 p-3 sm:space-y-4 sm:p-6">
              <div className="h-2.5 w-14 rounded-full shimmer sm:h-3 sm:w-20" />
              <div className="h-4 w-3/4 rounded-full shimmer sm:h-6" />
              <div className="h-4 w-1/2 rounded-full shimmer sm:h-7" />
              <div className="hidden gap-2 pt-2 sm:flex">
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
