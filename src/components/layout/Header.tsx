import { Link, useLocation } from 'react-router-dom'

export function Header() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 bg-brand-700 rounded-lg flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold leading-none">M</span>
          </div>
          <span className="font-semibold text-slate-900 group-hover:text-brand-700 transition-colors">
            MathClass <span className="text-brand-600">Interactive</span>
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {!isHome && (
            <Link
              to="/"
              className="text-sm text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Inicio
            </Link>
          )}
          <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full font-medium hidden sm:block">
            Modo Aula
          </span>
        </div>
      </div>
    </header>
  )
}
