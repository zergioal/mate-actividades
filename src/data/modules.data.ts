import type { ModuleDescriptor } from '@/types/module.types'

/**
 * Central registry of all math modules.
 * Add a new entry here when adding a new topic — the homepage and nav update automatically.
 */
export const MODULES: ModuleDescriptor[] = [
  {
    id: 'number-line',
    title: 'Recta Numérica',
    subtitle: 'Ubica números reales',
    description:
      'Arrastra y posiciona números enteros, decimales y fracciones sobre la recta numérica real. Desarrolla intuición sobre el orden y la magnitud.',
    route: '/modulos/recta-numerica',
    color: 'blue',
    icon: '↔',
    levels: ['basico', 'intermedio', 'avanzado'],
    tags: ['Números reales', 'Orden', 'Representación'],
  },
  {
    id: 'factorization',
    title: 'Factorización',
    subtitle: 'Descompón expresiones algebraicas',
    description:
      'Factoriza trinomios cuadráticos encontrando los dos factores lineales. Puzzle interactivo con validación instantánea.',
    route: '/modulos/factorizacion',
    color: 'violet',
    icon: '×',
    levels: ['basico', 'intermedio', 'avanzado'],
    tags: ['Álgebra', 'Trinomios', 'Factores'],
  },
  {
    id: 'algebraic-fractions',
    title: 'Fracciones Algebraicas',
    subtitle: 'Simplifica paso a paso',
    description:
      'Simplifica fracciones algebraicas factorizando numerador y denominador, cancelando factores comunes con retroalimentación visual.',
    route: '/modulos/fracciones-algebraicas',
    color: 'emerald',
    icon: 'a⁄b',
    levels: ['basico', 'intermedio', 'avanzado'],
    tags: ['Álgebra', 'Fracciones', 'Simplificación'],
  },
  {
    id: 'quadratic-equations',
    title: 'Ecuaciones Cuadráticas',
    subtitle: 'Explora la parábola',
    description:
      'Modifica los coeficientes de ax² + bx + c y observa en tiempo real cómo cambia la parábola, sus raíces y su vértice.',
    route: '/modulos/ecuaciones-cuadraticas',
    color: 'amber',
    icon: '∩',
    levels: ['basico', 'intermedio', 'avanzado'],
    tags: ['Gráficas', 'Raíces', 'Discriminante'],
  },
  {
    id: 'trigonometric-functions',
    title: 'Funciones Trigonométricas',
    subtitle: 'Ondas dinámicas con sliders',
    description:
      'Controla amplitud, período, fase y desplazamiento de funciones seno y coseno. Visualiza cómo cada parámetro transforma la onda.',
    route: '/modulos/funciones-trigonometricas',
    color: 'cyan',
    icon: '∿',
    levels: ['intermedio', 'avanzado'],
    tags: ['Trigonometría', 'Ondas', 'Transformaciones'],
  },
  {
    id: 'mcm-algebraico',
    title: 'MCM Algebraico',
    subtitle: 'Mínimo común múltiplo de expresiones',
    description:
      'Calcula el mínimo común múltiplo de monomios y polinomios, factorizando cada expresión e identificando los factores de mayor potencia.',
    route: '/modulos/mcm-algebraico',
    color: 'blue',
    icon: '⊔',
    levels: ['basico', 'intermedio', 'avanzado'],
    tags: ['Álgebra', 'MCM', 'Factorización'],
  },
  {
    id: 'fracciones-operaciones',
    title: 'Operaciones con Fracciones',
    subtitle: 'Suma, resta, multiplica y divide',
    description:
      'Realiza las cuatro operaciones con fracciones algebraicas: suma y resta con denominador común, multiplicación cancelando factores y división por el inverso.',
    route: '/modulos/fracciones-operaciones',
    color: 'emerald',
    icon: '±',
    levels: ['intermedio', 'avanzado'],
    tags: ['Álgebra', 'Fracciones', 'Operaciones'],
  },
  {
    id: 'conic-sections',
    title: 'Curvas Cónicas',
    subtitle: 'Geometría analítica visual',
    description:
      'Explora circunferencia, parábola, elipse e hipérbola con sliders interactivos. Visualiza focos, ejes y ecuaciones en tiempo real.',
    route: '/modulos/curvas-conicas',
    color: 'rose',
    icon: '○',
    levels: ['intermedio', 'avanzado'],
    tags: ['Geometría', 'Cónicas', 'Analítica'],
  },
]
