export default function LoadingGrupo() {
  return (
    <div className="min-h-screen bg-green-50 pb-24 animate-pulse">
      {/* Header skeleton */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 px-5 pt-12 pb-8">
        <div className="h-4 w-20 bg-green-400 rounded-full mb-4" />
        <div className="h-7 w-48 bg-green-400 rounded-full mb-2" />
        <div className="h-4 w-24 bg-green-400 rounded-full" />
      </div>

      <div className="px-4 -mt-4 space-y-4">
        {/* Botón copiar link skeleton */}
        <div className="bg-white rounded-3xl p-4 shadow-sm h-14" />

        {/* Sección intercambios */}
        <div className="h-7 w-52 bg-gray-200 rounded-full" />

        {/* Cards de match skeleton */}
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-3xl p-5 shadow-sm space-y-4">
            {/* Avatar + nombre */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
              <div className="h-5 w-32 bg-gray-200 rounded-full" />
            </div>
            {/* Pills skeleton */}
            <div>
              <div className="h-3 w-36 bg-gray-100 rounded-full mb-2" />
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="h-7 w-16 bg-gray-100 rounded-full" />
                ))}
              </div>
            </div>
            <div>
              <div className="h-3 w-36 bg-gray-100 rounded-full mb-2" />
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="h-7 w-16 bg-gray-100 rounded-full" />
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Sección miembros skeleton */}
        <div className="h-7 w-40 bg-gray-200 rounded-full" />
        <div className="bg-white rounded-3xl p-5 shadow-sm space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full" />
              <div className="h-4 w-28 bg-gray-100 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
