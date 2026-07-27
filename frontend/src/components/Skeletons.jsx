// Simple loading skeleton blocks
export const SkeletonCard = () => (
  <div className="card p-5">
    <div className="skeleton h-44 w-full" />
    <div className="mt-4 space-y-2">
      <div className="skeleton h-4 w-1/3" />
      <div className="skeleton h-5 w-3/4" />
      <div className="skeleton h-4 w-full" />
      <div className="skeleton h-4 w-5/6" />
    </div>
  </div>
);

export const SkeletonGrid = ({ count = 6 }) => (
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export const SkeletonImage = () => <div className="skeleton aspect-[4/3] w-full" />;
