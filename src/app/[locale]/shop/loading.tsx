export default function ShopLoading() {
  return (
    <div className="container-app py-10 md:py-14">
      <div className="skeleton h-9 w-48" />
      <div className="skeleton mt-6 h-12 w-full max-w-md" />
      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {Array.from({ length: 18 }).map((_, i) => (
          <div key={i} className="card flex flex-col items-center p-5">
            <div className="skeleton h-20 w-20 rounded-lg" />
            <div className="skeleton mt-3 h-3 w-16" />
            <div className="skeleton mt-2 h-3 w-12" />
          </div>
        ))}
      </div>
    </div>
  );
}
