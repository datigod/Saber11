import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Calculator, FlaskConical, Landmark, Languages, Lock, CheckCircle2, Circle, ChevronRight } from 'lucide-react';
import { Card, Badge, ProgressBar, Button } from '../components/ui';
import { PageTransition, FadeInView, staggerContainer, staggerItem, ScaleOnHover } from '../lib/animations';

const modules = [
  {
    id: 1, title: 'Lectura Crítica Esencial', icon: BookOpen,
    status: 'active', progress: 65, units: 8, completedUnits: 5,
    desc: 'Comprensión, análisis e interpretación de textos argumentativos y literarios.',
    color: 'bg-blue-500',
  },
  {
    id: 2, title: 'Matemáticas en Contexto', icon: Calculator,
    status: 'active', progress: 40, units: 10, completedUnits: 4,
    desc: 'Resolución de problemas, modelación y razonamiento cuantitativo.',
    color: 'bg-violet-500',
  },
  {
    id: 3, title: 'Ciencias con Datos', icon: FlaskConical,
    status: 'locked', progress: 0, units: 7, completedUnits: 0,
    desc: 'Completa las unidades anteriores para desbloquear este módulo.',
    color: 'bg-emerald-500',
  },
  {
    id: 4, title: 'Sociales y Ciudadanía', icon: Landmark,
    status: 'locked', progress: 0, units: 6, completedUnits: 0,
    desc: 'Contenido enfocado en análisis histórico y participación ciudadana.',
    color: 'bg-amber-500',
  },
  {
    id: 5, title: 'Inglés para Saber 11', icon: Languages,
    status: 'locked', progress: 0, units: 5, completedUnits: 0,
    desc: 'Práctica integral de comprensión lectora y estructuras gramaticales en inglés.',
    color: 'bg-rose-500',
  },
];

export default function LearningMap() {
  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <FadeInView>
          <div className="text-center mb-10">
            <Badge variant="primary">Mapa de Aprendizaje</Badge>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-surface-900 mt-3">
              Mapa de aprendizaje Saber 11
            </h1>
            <p className="text-surface-700 mt-2 max-w-xl mx-auto">
              Tu ruta personalizada hacia la excelencia académica. Sigue el camino,
              completa los desafíos y prepárate para el futuro.
            </p>
          </div>
        </FadeInView>

        {/* Learning path */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="relative"
        >
          {/* Vertical line connector */}
          <div className="absolute left-8 top-12 bottom-12 w-0.5 bg-surface-300 hidden md:block" />

          {modules.map((mod, i) => (
            <motion.div key={mod.id} variants={staggerItem} className="relative mb-6">
              <div className="flex gap-4 md:gap-6 items-start">
                {/* Node */}
                <div className="relative z-10 flex-shrink-0">
                  <motion.div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
                      mod.status === 'locked' ? 'bg-surface-300' : mod.color
                    }`}
                    whileHover={mod.status !== 'locked' ? { scale: 1.1, rotate: 5 } : {}}
                    animate={mod.status === 'active' ? { boxShadow: ['0 0 0 0 rgba(0,87,168,0.3)', '0 0 16px 4px rgba(0,87,168,0.15)', '0 0 0 0 rgba(0,87,168,0.3)'] } : {}}
                    transition={mod.status === 'active' ? { duration: 2, repeat: Infinity } : { type: 'spring' }}
                  >
                    {mod.status === 'locked' ? (
                      <Lock className="w-6 h-6 text-surface-600" />
                    ) : (
                      <mod.icon className="w-7 h-7 text-white" />
                    )}
                  </motion.div>
                </div>

                {/* Content card */}
                <Card
                  hover={mod.status !== 'locked'}
                  accent={mod.status === 'active' ? 'primary' : 'none'}
                  className={`flex-1 ${mod.status === 'locked' ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-heading font-bold text-lg text-surface-900">{mod.title}</h3>
                        {mod.status === 'active' && mod.progress > 50 && (
                          <Badge variant="success">En progreso</Badge>
                        )}
                        {mod.status === 'locked' && (
                          <Badge variant="neutral">Bloqueado</Badge>
                        )}
                      </div>
                      <p className="text-sm text-surface-700 mb-3">{mod.desc}</p>
                      {mod.status !== 'locked' && (
                        <>
                          <ProgressBar value={mod.progress} size="sm" />
                          <p className="text-xs text-surface-600 mt-2">
                            {mod.completedUnits} de {mod.units} unidades completadas
                          </p>
                        </>
                      )}
                    </div>
                    {mod.status !== 'locked' && (
                      <Link to={`/mapa/detalle`}>
                        <Button variant="ghost" size="sm">
                          <ChevronRight className="w-5 h-5" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </Card>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </PageTransition>
  );
}
