import { Link } from 'react-router-dom'
import { MODULES } from '@/data/modules.data'
import { DifficultyBadge } from '@/components/ui/Badge'
import type { ModuleDescriptor, ModuleColor } from '@/types/module.types'
import { cn } from '@/lib/cn'

// ── Color maps for card accents ───────────────────────────────────────────────
const cardAccent: Record<ModuleColor, { border: string; iconBg: string; iconText: string; btn: string; tag: string }> = {
  blue:    { border: 'border-t-blue-500',    iconBg: 'bg-blue-100',    iconText: 'text-blue-700',    btn: 'bg-blue-700 hover:bg-blue-800',    tag: 'text-blue-600' },
  violet:  { border: 'border-t-violet-500',  iconBg: 'bg-violet-100',  iconText: 'text-violet-700',  btn: 'bg-violet-700 hover:bg-violet-800',  tag: 'text-violet-600' },
  emerald: { border: 'border-t-emerald-500', iconBg: 'bg-emerald-100', iconText: 'text-emerald-700', btn: 'bg-emerald-700 hover:bg-emerald-800', tag: 'text-emerald-600' },
  amber:   { border: 'border-t-amber-500',   iconBg: 'bg-amber-100',   iconText: 'text-amber-700',   btn: 'bg-amber-600 hover:bg-amber-700',   tag: 'text-amber-600' },
  cyan:    { border: 'border-t-cyan-500',    iconBg: 'bg-cyan-100',    iconText: 'text-cyan-700',    btn: 'bg-cyan-700 hover:bg-cyan-800',    tag: 'text-cyan-600' },
  rose:    { border: 'border-t-rose-500',    iconBg: 'bg-rose-100',    iconText: 'text-rose-700',    btn: 'bg-rose-700 hover:bg-rose-800',    tag: 'text-rose-600' },
}

function ModuleCard({ mod }: { mod: ModuleDescriptor }) {
  const c = cardAccent[mod.color]
  return (
    <Link
      to={mod.route}
      className={cn(
        'group flex flex-col bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-200',
        'border border-slate-100 border-t-4 overflow-hidden hover:-translate-y-0.5',
        c.border,
      )}
    >
      <div className="p-6 flex flex-col gap-4 flex-1">
        {/* Icon + title */}
        <div className="flex items-start gap-4">
          <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold shrink-0', c.iconBg, c.iconText)}>
            {mod.icon}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-lg leading-tight">{mod.title}</h3>
            <p className="text-sm text-slate-500 mt-0.5">{mod.subtitle}</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-600 leading-relaxed flex-1">{mod.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {mod.tags.map((tag) => (
            <span key={tag} className={cn('text-xs font-medium bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200', c.tag)}>
              {tag}
            </span>
          ))}
        </div>

        {/* Difficulty levels */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400 font-medium">Niveles:</span>
          {mod.levels.map((l) => (
            <DifficultyBadge key={l} level={l} />
          ))}
        </div>
      </div>

      {/* CTA footer */}
      <div className={cn('px-6 py-3 flex items-center justify-between', c.btn.includes('amber') ? 'bg-amber-50' : 'bg-slate-50', 'border-t border-slate-100')}>
        <span className={cn('text-sm font-semibold', c.iconText)}>Abrir actividad</span>
        <svg className={cn('w-4 h-4 transition-transform group-hover:translate-x-1', c.iconText)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  )
}

export function HomePage() {
  return (
    <div className="animate-fade-in">
      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16 sm:py-20">
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 bg-brand-700/50 text-brand-200 text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Plataforma educativa · Matemáticas de secundaria
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              MathClass{' '}
              <span className="text-cyan-400">Interactive</span>
            </h1>
            <p className="mt-4 text-lg text-brand-200 leading-relaxed">
              Explora, visualiza y practica matemáticas con actividades interactivas
              diseñadas para el aula. Proyecta, manipula y aprende con retroalimentación inmediata.
            </p>

            {/* Stats row */}
            <div className="mt-8 flex flex-wrap gap-6 text-sm">
              {[
                { value: '6', label: 'Módulos temáticos' },
                { value: '3', label: 'Niveles de dificultad' },
                { value: '∞', label: 'Problemas generados' },
              ].map(({ value, label }) => (
                <div key={label} className="flex flex-col">
                  <span className="text-2xl font-bold text-white">{value}</span>
                  <span className="text-brand-300">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full text-slate-50 -mb-px">
          <path d="M0 60V30C240 0 480 60 720 30C960 0 1200 60 1440 30V60H0Z" fill="currentColor" />
        </svg>
      </section>

      {/* ── Module grid ─────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Módulos disponibles</h2>
            <p className="mt-1 text-slate-500 text-sm">Selecciona un tema para comenzar la actividad interactiva</p>
          </div>
          <span className="text-sm text-slate-400 hidden sm:block">{MODULES.length} módulos · Actualizado 2024</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MODULES.map((mod) => (
            <ModuleCard key={mod.id} mod={mod} />
          ))}
        </div>
      </section>

      {/* ── How to use ──────────────────────────────────────────────── */}
      <section className="bg-white border-t border-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Cómo usar en clase</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Elige el tema', desc: 'Selecciona el módulo que corresponde a tu clase del día.' },
              { step: '02', title: 'Proyecta la actividad', desc: 'Abre en pantalla completa. El diseño está optimizado para proyector.' },
              { step: '03', title: 'Interactúa en vivo', desc: 'Manipula parámetros en tiempo real mientras explicas el concepto.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex gap-4">
                <span className="text-3xl font-black text-brand-100 leading-none shrink-0">{step}</span>
                <div>
                  <h3 className="font-semibold text-slate-800">{title}</h3>
                  <p className="text-sm text-slate-500 mt-1 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
