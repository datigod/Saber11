import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Play, CheckCircle2, Clock, Star, ArrowLeft } from 'lucide-react';
import { Card, Badge, ProgressBar, Button } from '../components/ui';
import { PageTransition, FadeInView, staggerContainer, staggerItem } from '../lib/animations';

const units = [
  { id: 1, title: 'Comprensión literal', status: 'completed', duration: '25 min', score: 90 },
  { id: 2, title: 'Inferencias y deducciones', status: 'completed', duration: '30 min', score: 85 },
  { id: 3, title: 'Análisis de argumentos', status: 'completed', duration: '35 min', score: 78 },
  { id: 4, title: 'Lectura de gráficos y tablas', status: 'completed', duration: '20 min', score: 92 },
  { id: 5, title: 'Evaluación de fuentes', status: 'completed', duration: '30 min', score: 88 },
  { id: 6, title: 'Textos argumentativos', status: 'active', duration: '40 min', score: 0 },
  { id: 7, title: 'Textos literarios y poéticos', status: 'locked', duration: '35 min', score: 0 },
  { id: 8, title: 'Evaluación final del módulo', status: 'locked', duration: '45 min', score: 0 },
];

export default function LearningMapDetail() {
  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link to="/mapa" className="inline-flex items-center gap-1.5 text-sm text-surface-700 hover:text-primary-500 transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Volver al mapa
        </Link>

        <FadeInView>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-blue-500 flex items-center justify-center shadow-lg">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-heading font-bold text-surface-900">Lectura Crítica Esencial</h1>
              <p className="text-surface-700 text-sm mt-0.5">8 unidades · 65% completado</p>
            </div>
          </div>
          <ProgressBar value={65} label="Progreso del módulo" color="primary" />
        </FadeInView>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="mt-8 space-y-3"
        >
          {units.map((unit) => (
            <motion.div key={unit.id} variants={staggerItem}>
              <Card
                hover={unit.status !== 'locked'}
                className={`flex items-center gap-4 ${unit.status === 'locked' ? 'opacity-50' : ''}`}
                padding="sm"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  unit.status === 'completed' ? 'bg-tertiary-50 text-tertiary-400' :
                  unit.status === 'active' ? 'bg-primary-50 text-primary-500' :
                  'bg-surface-200 text-surface-600'
                }`}>
                  {unit.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> :
                   unit.status === 'active' ? <Play className="w-5 h-5" /> :
                   <span className="text-sm font-bold">{unit.id}</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-surface-900">{unit.title}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-surface-600 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {unit.duration}
                    </span>
                    {unit.score > 0 && (
                      <span className="text-xs text-amber-500 flex items-center gap-1">
                        <Star className="w-3 h-3" /> {unit.score}%
                      </span>
                    )}
                  </div>
                </div>
                {unit.status === 'completed' && <Badge variant="success">Completado</Badge>}
                {unit.status === 'active' && (
                  <Link to="/practica">
                    <Button size="sm">Continuar</Button>
                  </Link>
                )}
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </PageTransition>
  );
}
