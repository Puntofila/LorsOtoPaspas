export default function ProductLoading() {
  return (
    <div className="container-app py-10 md:py-14">
      <div className="skeleton h-4 w-56" />
      <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div className="space-y-4">
          <div className="skeleton aspect-[5/4] w-full rounded-xl" />
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton aspect-[5/4] w-full rounded-xl" />
            ))}
          </div>
        </div>
        <div>
          <div className="skeleton h-9 w-2/3" />
          <div className="skeleton mt-3 h-4 w-1/3" />
          <div className="skeleton mt-6 h-14 w-48 rounded-xl" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="mt-6">
              <div className="skeleton h-3 w-24" />
              <div className="skeleton mt-2 h-12 w-full rounded-lg" />
            </div>
          ))}
          <div className="skeleton mt-8 h-12 w-56 rounded-full" />
        </div>
      </div>
    </div>
  );
}
