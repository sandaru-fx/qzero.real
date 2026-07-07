export default function Loading() {
  return (
    <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-lg border border-brand-line bg-brand-card">
          <div className="aspect-[16/10] shimmer" />
          <div className="space-y-4 p-5">
            <div className="h-4 w-24 rounded-full shimmer" />
            <div className="h-6 w-3/4 rounded-full shimmer" />
            <div className="h-4 w-1/2 rounded-full shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
}
