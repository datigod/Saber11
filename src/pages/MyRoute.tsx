import { Link } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, Clock, Flame, BookOpen, Calculator,
  Sparkles, CheckCircle2, Circle, Compass, RefreshCw, Award
} from 'lucide-react';
import { Card, StatCard, Badge, ProgressBar, Button, SectionHeader } from '../components/ui';
import { PageTransition, FadeInView, staggerContainer, staggerItem } from '../lib/animations';

type RouteProfile = {
  title: string;
  goals: { label: string; current: number; total: number; color: 'primary' | 'gradient' }[];
  recommendations: { icon: typeof BookOpen; title: string; desc: string; priority: string }[];
  trend: string;
};

type ActionStep = {
  id: string;
  title: string;
  focus: string;
  description: string;
  actions: string[];
  meta: string;
};

const getRouteProfile = (score: number): RouteProfile => {
  if (score < 260) {
    return {
      title: 'Ruta de fortalecimiento base',
      trend: '+25 pts esperados',
      goals: [
        { label: 'Lectura Crítica', current: 2, total: 5, color: 'primary' },
        { label: 'Matemáticas', current: 1, total: 4, color: 'primary' },
        { label: 'Retos completados', current: 4, total: 10, color: 'gradient' },
      ],
      recommendations: [
        { icon: BookOpen, title: 'Comprensión de Textos Cortos', desc: 'Identifica ideas principales y vocabulario básico.', priority: 'Alta' },
        { icon: Calculator, title: 'Operaciones Básicas', desc: 'Practica regla de tres, porcentajes y operaciones aritméticas esenciales.', priority: 'Alta' },
        { icon: Target, title: 'Micro-reto diario', desc: 'Completa un reto corto para consolidar hábitos.', priority: 'Sugerida' },
      ],
    };
  }

  if (score < 330) {
    return {
      title: 'Ruta de consolidación',
      trend: '+15 pts esperados',
      goals: [
        { label: 'Lectura Crítica', current: 3, total: 5, color: 'primary' },
        { label: 'Matemáticas', current: 2, total: 4, color: 'primary' },
        { label: 'Retos completados', current: 7, total: 10, color: 'gradient' },
      ],
      recommendations: [
        { icon: BookOpen, title: 'Refuerza inferencias', desc: 'Practica lectura argumentativa para subir precisión.', priority: 'Alta' },
        { icon: Calculator, title: 'Repasa álgebra', desc: 'Sube velocidad y exactitud en problemas de modelación.', priority: 'Media' },
        { icon: Target, title: 'Reto semanal', desc: 'Cubre las áreas con mayor potencial de mejora.', priority: 'Sugerida' },
      ],
    };
  }

  return {
    title: 'Ruta de alto rendimiento',
    trend: '+8 pts esperados',
    goals: [
      { label: 'Lectura Crítica', current: 4, total: 5, color: 'primary' },
      { label: 'Matemáticas', current: 3, total: 4, color: 'primary' },
      { label: 'Retos completados', current: 8, total: 10, color: 'gradient' },
    ],
    recommendations: [
      { icon: BookOpen, title: 'Textos complejos', desc: 'Entrena con preguntas de alta dificultad y tiempo limitado.', priority: 'Alta' },
      { icon: Calculator, title: 'Resolución avanzada', desc: 'Trabaja estrategias de eliminación y verificación rápida.', priority: 'Media' },
      { icon: Target, title: 'Simulacro completo', desc: 'Evalúa consistencia y administra mejor el tiempo.', priority: 'Sugerida' },
    ],
  };
};

const getActionStepsForScore = (score: number): ActionStep[] => {
  if (score < 260) {
    return [
      {
        id: 'step_1',
        title: 'Paso 1: Construcción del Hábito Diario',
        focus: 'Construir consistencia',
        description: 'La clave para subir un puntaje bajo es la práctica diaria constante, no estudiar 5 horas seguidas un día antes del examen.',
        actions: [
          'Completa el "Reto Diario" de 3 preguntas todas las mañanas al despertar.',
          'Revisa las explicaciones de cada respuesta del reto, especialmente en las que te equivoques.',
          'Consigue una racha de 7 días activos seguidos en tu perfil para consolidar el hábito.'
        ],
        meta: 'Meta: 7 días de racha activa en la plataforma.'
      },
      {
        id: 'step_2',
        title: 'Paso 2: Competencia de Lectura Crítica (Nivel Literal)',
        focus: 'Comprensión de lectura base',
        description: 'En el examen, más del 50% de las preguntas de todas las áreas dependen directamente de entender qué dice el texto.',
        actions: [
          'Lee al menos un texto corto al día de periódicos o guías académicas.',
          'Escribe en una sola frase cuál es la tesis principal (la idea que defiende el autor).',
          'Utiliza el diccionario o pide ayuda con cualquier vocabulario o palabra que no entiendas.'
        ],
        meta: 'Meta: Entender la postura de un autor en menos de 3 minutos por texto.'
      },
      {
        id: 'step_3',
        title: 'Paso 3: Dominio de Números y Proporciones Básicas',
        focus: 'Matemáticas esenciales',
        description: 'Enfoca tus esfuerzos en los temas más rentables de matemáticas que siempre se evalúan y son sencillos.',
        actions: [
          'Domina la regla de tres simple (directa e inversa) para resolver problemas de proporciones.',
          'Practica el cálculo mental rápido de porcentajes comunes (10%, 25%, 50%).',
          'Entrena la lectura e interpretación de gráficos de barras simples y tablas de datos.'
        ],
        meta: 'Meta: Responder correctamente todas las preguntas de lectura de gráficos en el módulo de Práctica.'
      },
      {
        id: 'step_4',
        title: 'Paso 4: Simulación de Preguntas sin Medición de Tiempo',
        focus: 'Entrenamiento de precisión',
        description: 'Antes de preocuparte por la velocidad, asegúrate de responder de manera correcta analizando despacio cada enunciado.',
        actions: [
          'Realiza bloques semanales de 10 preguntas continuas en el módulo de Práctica.',
          'No uses cronómetro; tómate todo el tiempo necesario para leer cada opción de respuesta.',
          'Justifica en tu mente por qué las otras 3 opciones son falsas antes de marcar la correcta.'
        ],
        meta: 'Meta: Lograr un 70% de precisión en tus sesiones de práctica individuales.'
      }
    ];
  }

  if (score < 330) {
    return [
      {
        id: 'step_1',
        title: 'Paso 1: Lectura Activa e Inferencial',
        focus: 'Lectura crítica intermedia',
        description: 'Sube tu nivel pasando de la comprensión literal a inferir la postura oculta del autor y evaluar argumentos.',
        actions: [
          'Lee las preguntas antes de comenzar a leer el texto completo para saber qué buscar.',
          'Entrena con textos discontinuos (caricaturas académicas, infografías y cómics) en Lectura Crítica.',
          'Aprende a identificar la ironía, contradicciones o supuestos implícitos en las lecturas.'
        ],
        meta: 'Meta: Reconocer la intención e ironía en textos de opinión complejos.'
      },
      {
        id: 'step_2',
        title: 'Paso 2: Modelación Matemática y Álgebra Práctica',
        focus: 'Álgebra y geometría aplicada',
        description: 'Consolida la capacidad de traducir problemas verbales a fórmulas matemáticas del mundo real.',
        actions: [
          'Practica plantear ecuaciones lineales a partir de textos descriptivos.',
          'Repasa las propiedades básicas de figuras geométricas comunes (triángulos rectángulos, áreas y perímetros).',
          'Domina el uso del Teorema de Pitágoras en problemas de modelación espacial.'
        ],
        meta: 'Meta: Plantear y resolver la ecuación de un problema en menos de 2 minutos.'
      },
      {
        id: 'step_3',
        title: 'Paso 3: Bitácora de Errores Activa',
        focus: 'Aprender de las fallas',
        description: 'La forma más rápida de romper el techo de los 300 puntos es analizar detalladamente cada pregunta fallada.',
        actions: [
          'Anota cada pregunta incorrecta de tus prácticas en una libreta o bloc de notas.',
          'Escribe a mano la explicación de por qué la opción correcta es la adecuada y por qué fallaste.',
          'Vuelve a resolver las mismas preguntas falladas 3 días después para asegurar que aprendiste el concepto.'
        ],
        meta: 'Meta: Reducir a la mitad la repetición de errores del mismo concepto.'
      },
      {
        id: 'step_4',
        title: 'Paso 4: Simulacros por Sección con Gestión de Tiempo',
        focus: 'Control del reloj',
        description: 'Entrena a tu cerebro para resolver la prueba bajo las mismas restricciones de tiempo del examen real.',
        actions: [
          'Realiza prácticas cortas de 15 preguntas de una sola materia.',
          'Ponte un límite estricto de 2 minutos por pregunta (30 minutos en total por sesión).',
          'Aprende a saltar o marcar una respuesta tentativa en preguntas muy difíciles para no perder tiempo.'
        ],
        meta: 'Meta: Terminar las 15 preguntas dentro del tiempo establecido con más del 75% de acierto.'
      }
    ];
  }

  return [
    {
      id: 'step_1',
      title: 'Paso 1: Análisis Filosófico y Textos Complejos',
      focus: 'Lectura crítica de alto nivel',
      description: 'Logra el puntaje perfecto en Lectura Crítica entrenando tu mente con textos de alta complejidad filosófica.',
      actions: [
        'Lee y analiza extractos de ensayos de filosofía clásica o artículos de divulgación científica densos.',
        'Busca e identifica falacias lógicas comunes en discursos argumentativos.',
        'Practica contrastar las opiniones de dos autores diferentes sobre el mismo tema.'
      ],
      meta: 'Meta: Resolver textos densos sin perder concentración y con precisión perfecta.'
    },
    {
      id: 'step_2',
      title: 'Paso 2: Velocidad de Resolución y Técnicas de Descarte Rápido',
      focus: 'Matemáticas y Ciencias avanzadas',
      description: 'Gana valioso tiempo en el examen real descartando opciones con agilidad mediante deducción lógica extrema.',
      actions: [
        'Resuelve problemas de razonamiento cuantitativo eliminando opciones extremas o inconsistentes.',
        'Prueba valores hipotéticos rápidos en las variables de las opciones de respuesta para validar ecuaciones.',
        'Repasa conceptos avanzados de química, física y biología (reacciones químicas, genética, conservación de la energía).'
      ],
      meta: 'Meta: Promediar 1 minuto y 20 segundos por pregunta de matemáticas.'
    },
    {
      id: 'step_3',
      title: 'Paso 3: Entrenamiento de Resistencia Física y Mental',
      focus: 'Combate la fatiga del examen',
      description: 'El Saber 11 dura más de 9 horas en total. La fatiga al final de cada sesión reduce la precisión en un 15% si no te entrenas.',
      actions: [
        'Realiza bloques ininterrumpidos de 40 a 50 preguntas seguidas de múltiples áreas los fines de semana.',
        'Simula el ambiente real: apaga tu música, tu celular y mantente sentado concentrado toda la sesión.',
        'Aprende técnicas de respiración profunda para oxigenar tu cerebro y mantener el enfoque en las últimas preguntas.'
      ],
      meta: 'Meta: Mantener el mismo porcentaje de aciertos en la primera y última pregunta de un bloque largo.'
    },
    {
      id: 'step_4',
      title: 'Paso 4: Aprendizaje por Enseñar (Técnica Feynman)',
      focus: 'Consolidación total del conocimiento',
      description: 'Explicar de forma simple un concepto complejo a otros es la mejor forma de asegurar que tú lo dominas a la perfección.',
      actions: [
        'Lidera o crea un círculo de estudio con tus compañeros de clase que necesiten mejorar.',
        'Explícales los temas que dominas (como matemáticas o inglés) de la manera más sencilla posible.',
        'Pídeles que te hagan preguntas difíciles y trata de responder usando ejemplos sencillos de la vida diaria.'
      ],
      meta: 'Meta: Explicar un problema difícil a alguien que no lo entienda hasta que le quede claro.'
    }
  ];
};

export default function MyRoute() {
  const predictedScore = useMemo(() => {
    const raw = localStorage.getItem('saber11_prediction');
    if (!raw) return 285;
    try {
      const parsed = JSON.parse(raw) as { score?: number };
      return typeof parsed.score === 'number' ? parsed.score : 285;
    } catch {
      return 285;
    }
  }, []);

  const profile = useMemo(() => getRouteProfile(predictedScore), [predictedScore]);
  const actionSteps = useMemo(() => getActionStepsForScore(predictedScore), [predictedScore]);

  // Persistent checklist state
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(`completed_steps_${predictedScore}`);
    if (saved) {
      try {
        setCompletedSteps(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, [predictedScore]);

  const toggleStep = (stepId: string) => {
    const updated = completedSteps.includes(stepId)
      ? completedSteps.filter(id => id !== stepId)
      : [...completedSteps, stepId];
    
    setCompletedSteps(updated);
    localStorage.setItem(`completed_steps_${predictedScore}`, JSON.stringify(updated));
  };

  const planProgress = useMemo(() => {
    if (actionSteps.length === 0) return 0;
    return (completedSteps.length / actionSteps.length) * 100;
  }, [completedSteps, actionSteps]);

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Header Section */}
        <FadeInView>
          <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <Badge variant="primary" className="mb-2">Mi Ruta Dinámica</Badge>
              <h1 className="text-3xl font-heading font-bold text-surface-900 mt-2">{profile.title}</h1>
              <p className="text-surface-700 mt-1">Plan de estudio personalizado actualizado en tiempo real según tu predicción actual.</p>
            </div>
            
            <Link to="/onboarding">
              <Button variant="secondary" size="sm" iconRight={RefreshCw}>Recalcular Proyección</Button>
            </Link>
          </div>
        </FadeInView>

        {/* Stats Grid */}
        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Días activos', value: '12', icon: Flame, trend: { value: '+3 esta semana', positive: true }, color: 'warning' },
            { label: 'Puntaje estimado', value: `${predictedScore}`, icon: Target, trend: { value: profile.trend, positive: true }, color: 'primary' },
            { label: 'Unidades completas', value: '18', icon: BookOpen, color: 'success' },
            { label: 'Tiempo de estudio', value: '8.5h', icon: Clock, color: 'secondary' },
          ].map((s, i) => (
            <motion.div key={i} variants={staggerItem}>
              <StatCard {...s} />
            </motion.div>
          ))}
        </motion.div>

        {/* Goals & Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          {/* Metas */}
          <FadeInView className="md:col-span-5 h-full">
            <Card className="h-full">
              <SectionHeader title="Metas Semanales" subtitle="Ajustadas a tu proyección de puntaje" />
              <div className="space-y-6 mt-4">
                {profile.goals.map((g, i) => (
                  <div key={i}>
                    <ProgressBar value={g.current} max={g.total} label={g.label} color={g.color} />
                  </div>
                ))}
              </div>
            </Card>
          </FadeInView>

          {/* Recomendaciones */}
          <FadeInView delay={0.1} className="md:col-span-7 h-full">
            <Card className="h-full">
              <SectionHeader
                title="Acciones Recomendadas"
                subtitle="Sugerencias del modelo inteligente"
              />
              <div className="space-y-4 mt-4">
                {profile.recommendations.map((r, i) => (
                  <div key={i} className="flex items-start gap-4 p-3 rounded-xl border border-surface-200 bg-surface-50">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                      <r.icon className="w-5 h-5 text-primary-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-heading font-semibold text-surface-900 text-sm truncate">{r.title}</h4>
                        <Badge variant={i === 0 ? 'error' : i === 1 ? 'warning' : 'neutral'} size="sm">{r.priority}</Badge>
                      </div>
                      <p className="text-xs text-surface-700 mt-1">{r.desc}</p>
                    </div>
                    <Link to="/practica">
                      <Button variant="ghost" size="sm" className="px-2.5 py-1 text-xs">Entrenar</Button>
                    </Link>
                  </div>
                ))}
              </div>
            </Card>
          </FadeInView>
        </div>

        {/* Personalized Actions Steps */}
        <FadeInView delay={0.2}>
          <div className="relative rounded-3xl border border-primary-200/60 shadow-xl overflow-hidden bg-white mb-8">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-primary-500 via-indigo-500 to-primary-600"></div>
            
            {/* Header */}
            <div className="p-6 border-b border-surface-200 bg-gradient-to-b from-primary-50/50 to-white">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-primary-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
                    <Compass className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-surface-900 text-lg flex items-center gap-2">
                      Plan de Acción de Ruta Personalizada
                      <Badge variant="primary" size="sm">ACTIVO</Badge>
                    </h3>
                    <p className="text-xs text-surface-500">Pasos prácticos requeridos según tu puntaje estimado de {predictedScore} puntos</p>
                  </div>
                </div>
                
                {/* Progress Circle/Pill */}
                <div className="flex items-center gap-2.5 bg-primary-50 px-3.5 py-2 rounded-2xl border border-primary-100 self-start sm:self-center shrink-0">
                  <Award className="w-4 h-4 text-primary-600" />
                  <span className="text-xs font-bold text-primary-800">
                    {completedSteps.length} / {actionSteps.length} Pasos Completados
                  </span>
                </div>
              </div>
              
              {/* Progress bar of the roadmap */}
              <div className="mt-5">
                <div className="flex justify-between text-xs font-bold text-surface-500 mb-1.5 px-0.5">
                  <span>Progreso de la Ruta</span>
                  <span>{Math.round(planProgress)}%</span>
                </div>
                <ProgressBar value={planProgress} max={100} color="gradient" />
              </div>
            </div>

            {/* Steps Checklist Grid */}
            <div className="p-6 sm:p-8 bg-surface-50/30 space-y-6">
              {actionSteps.map((step, idx) => {
                const isCompleted = completedSteps.includes(step.id);
                
                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`p-6 rounded-2xl border transition-all duration-300 ${
                      isCompleted 
                        ? 'bg-emerald-50/30 border-emerald-200/60 shadow-sm' 
                        : 'bg-white border-surface-200 hover:border-primary-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Checkbox button */}
                      <button
                        type="button"
                        onClick={() => toggleStep(step.id)}
                        className={`mt-1 shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                          isCompleted 
                            ? 'bg-emerald-500 text-white scale-110 shadow-md shadow-emerald-500/20' 
                            : 'border-2 border-surface-300 text-transparent hover:border-primary-500'
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-4 h-4" />}
                      </button>
                      
                      <div className="flex-1 min-w-0">
                        {/* Title and Badge */}
                        <div className="flex items-center gap-2 flex-wrap mb-1.5">
                          <h4 className={`font-heading font-bold text-base transition-colors ${
                            isCompleted ? 'text-emerald-900 line-through opacity-75' : 'text-surface-900'
                          }`}>
                            {step.title}
                          </h4>
                          <Badge variant={isCompleted ? 'success' : 'primary'} size="sm" className="font-semibold">
                            {step.focus}
                          </Badge>
                        </div>
                        
                        {/* Description */}
                        <p className={`text-sm mb-4 leading-relaxed ${isCompleted ? 'text-emerald-700/70' : 'text-surface-700'}`}>
                          {step.description}
                        </p>
                        
                        {/* Sub-actions bullet checklist */}
                        <div className={`p-4 rounded-xl border space-y-2.5 mb-4 ${
                          isCompleted 
                            ? 'bg-emerald-50/50 border-emerald-100/50' 
                            : 'bg-surface-50 border-surface-200'
                        }`}>
                          <p className="text-xs font-extrabold uppercase tracking-wider text-surface-400">Acciones Concretas a Realizar:</p>
                          <ul className="space-y-2">
                            {step.actions.map((act, aIdx) => (
                              <li key={aIdx} className="flex items-start gap-2 text-xs leading-relaxed text-surface-700">
                                <span className={`mt-1 shrink-0 w-1.5 h-1.5 rounded-full ${
                                  isCompleted ? 'bg-emerald-400' : 'bg-primary-500'
                                }`}></span>
                                <span className={isCompleted ? 'line-through opacity-70' : ''}>{act}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        {/* Meta badge */}
                        <div className="flex items-center gap-1.5 text-xs font-bold text-primary-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-ping"></span>
                          <span>{step.meta}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </FadeInView>

      </div>
    </PageTransition>
  );
}
