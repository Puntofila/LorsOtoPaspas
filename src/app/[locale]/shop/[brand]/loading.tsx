export default function BrandLoading() {
  return (
    <div className="container-app py-10 md:py-14">
      <div className="skeleton h-4 w-40" />
      <div className="mt-6 flex items-center gap-5">
        <div className="skeleton h-20 w-20 rounded-lg" />
        <div>
          <div className="skeleton h-8 w-40" />
          <div className="skeleton mt-2 h-3 w-56" />
        </div>
      </div>
      <div className="skeleton mt-8 h-12 w-full max-w-md" />
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="card p-5">
            <div className="skeleton aspect-[4/3] w-full rounded-lg" />
            <div className="skeleton mt-4 h-4 w-3/4" />
            <div className="skeleton mt-2 h-3 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
