import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-400 to-green-600 p-6 text-center">
      <div className="text-7xl mb-4">⚽</div>
      <h1 className="text-5xl font-black text-white drop-shadow-lg mb-2">
        FiguTrade
      </h1>
      <p className="text-green-100 text-xl font-semibold mb-2">
        Mundial FIFA 2026
      </p>
      <p className="text-green-100 text-base max-w-xs mb-10">
        Intercambiá figuritas con tus amigos y completá el álbum más rápido
      </p>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Link
          href="/login"
          className="bg-white text-green-700 font-black text-xl py-4 rounded-3xl shadow-lg hover:bg-green-50 transition-colors"
        >
          ¡Entrar!
        </Link>
        <p className="text-green-100 text-xs text-center">
          ¿No tenés cuenta? Pedile un link de invitación a quien te invitó al grupo.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-3 gap-4 text-center max-w-xs">
        <div className="bg-white/20 rounded-2xl p-3">
          <div className="text-3xl">👥</div>
          <p className="text-white text-xs font-semibold mt-1">
            Grupos cerrados
          </p>
        </div>
        <div className="bg-white/20 rounded-2xl p-3">
          <div className="text-3xl">🔄</div>
          <p className="text-white text-xs font-semibold mt-1">
            Matches automáticos
          </p>
        </div>
        <div className="bg-white/20 rounded-2xl p-3">
          <div className="text-3xl">🔒</div>
          <p className="text-white text-xs font-semibold mt-1">
            Solo conocidos
          </p>
        </div>
      </div>

      <div className="mt-10 bg-white/20 rounded-2xl px-5 py-4 max-w-xs text-center">
        <p className="text-white text-sm font-semibold">
          👨‍👧‍👧 Creada por el papá de Ele y Mati
        </p>
        <p className="text-green-100 text-xs mt-1">
          App privada para intercambiar figuritas entre conocidos, de forma segura.
        </p>
      </div>
    </div>
  );
}
