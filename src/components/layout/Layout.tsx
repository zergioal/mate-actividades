import { Outlet } from 'react-router-dom'
import { Header } from './Header'

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="mt-auto py-4 text-center text-xs text-slate-400 border-t border-slate-200/60">
        MathClass Interactive · Herramienta docente para matemáticas de secundaria
      </footer>
    </div>
  )
}
