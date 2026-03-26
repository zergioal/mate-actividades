import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6 animate-fade-in">
      <p className="text-7xl font-black text-slate-200 select-none">404</p>
      <h1 className="mt-2 text-2xl font-bold text-slate-800">Página no encontrada</h1>
      <p className="mt-2 text-slate-500 text-sm max-w-sm">
        La ruta que buscas no existe. Vuelve al inicio para ver los módulos disponibles.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-brand-700 hover:bg-brand-800 text-white rounded-lg font-medium transition-colors text-sm"
      >
        ← Volver al inicio
      </Link>
    </div>
  )
}
