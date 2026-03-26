import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { HomePage } from '@/pages/HomePage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { NumberLineModule } from '@/modules/number-line'
import { FactorizationModule } from '@/modules/factorization'
import { AlgebraicFractionsModule } from '@/modules/algebraic-fractions'
import { QuadraticEquationsModule } from '@/modules/quadratic-equations'
import { TrigFunctionsModule } from '@/modules/trigonometric-functions'
import { ConicSectionsModule } from '@/modules/conic-sections'
import { MCMAlgebraico } from '@/modules/mcm-algebraico'
import { FraccionesOperaciones } from '@/modules/fracciones-operaciones'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="modulos/recta-numerica"           element={<NumberLineModule />} />
          <Route path="modulos/factorizacion"            element={<FactorizationModule />} />
          <Route path="modulos/fracciones-algebraicas"   element={<AlgebraicFractionsModule />} />
          <Route path="modulos/ecuaciones-cuadraticas"   element={<QuadraticEquationsModule />} />
          <Route path="modulos/funciones-trigonometricas" element={<TrigFunctionsModule />} />
          <Route path="modulos/curvas-conicas"           element={<ConicSectionsModule />} />
          <Route path="modulos/mcm-algebraico"           element={<MCMAlgebraico />} />
          <Route path="modulos/fracciones-operaciones"   element={<FraccionesOperaciones />} />
          <Route path="*"                                element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
