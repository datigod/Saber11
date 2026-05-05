import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, AlertTriangle, Lightbulb, Target, ArrowRight, BookOpen, Calculator, Brain } from 'lucide-react';
import { Card, Badge, ProgressBar, Button, SectionHeader } from '../components/ui';
import { PageTransition, FadeInView, staggerContainer, staggerItem } from '../lib/animations';

const weakAreas = [
  { area: 'Inferencias en lectura', score: 45, target: 70, subject: 'Lectura Crítica', icon: BookOpen },
  { area: 'Ecuaciones lineales', score: 38, target: 65, subject: 'Matemáticas', icon: Calculator },
  { area: 'Interpretación de gráficos', score: 52, target: 75, subject: 'Ciencias', icon: Brain },
];

const improvementPlan = [
  { week: 'Semana 1', focus: 'Inferencias y deducciones', activities: 5, type: 'Lectura Crítica' },
  { week: 'Semana 2', focus: 'Álgebra y ecuaciones', activities: 6, type: 'Matemáticas' },
  { week: 'Semana 3', focus: 'Lectura de gráficos', activities: 4, type: 'Ciencias' },
  { week: 'Semana 4', focus: 'Evaluación integrada', activities: 3, type: 'General' },
];

export default function ImprovementRoute() {
  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <FadeInView>
          <Badge variant="warning">Plan de Mejora</Badge>
          <h1 className="text-3xl font-heading font-bold text-surface-900 mt-2">Mi Ruta de Mejora</h1>
          <p className="text-surface-700 mt-1">Enfócate en las áreas con mayor margen de crecimiento.</p>
        </FadeInView>

        {/* Weak areas */}
        <div className="mt-8">
          <SectionHeader title="Áreas por mejorar" subtitle="Detectadas automáticamente según tu rendimiento" />
          <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid gap-4">
            {weakAreas.map((w, i) => (
              <motion.div key={i} variants={staggerItem}>
                <Card hover accent="warning">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
                      <w.icon className="w-6 h-6 text-amber-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-heading font-semibold text-surface-900">{w.area}</h3>
                        <Badge variant="neutral" size="sm">{w.subject}</Badge>
                      </div>
                      <ProgressBar value={w.score} label={`Actual: ${w.score}% → Meta: ${w.target}%`} color="primary" size="sm" />
                    </div>
                    <Link to="/practica">
                      <Button size="sm" icon={ArrowRight}>Practicar</Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Improvement plan */}
        <div className="mt-10">
          <SectionHeader title="Plan de 4 semanas" subtitle="Tu ruta sugerida para mejorar" />
          <motion.div variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }} className="space-y-4">
            {improvementPlan.map((p, i) => (
              <motion.div key={i} variants={staggerItem}>
                <Card hover>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-heading font-bold text-sm ${
                      i === 0 ? 'gradient-primary text-white' : 'bg-surface-200 text-surface-700'
                    }`}>
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-surface-600 uppercase tracking-wider">{p.week}</p>
                      <h3 className="font-heading font-semibold text-surface-900">{p.focus}</h3>
                      <p className="text-xs text-surface-600 mt-0.5">{p.activities} actividades · {p.type}</p>
                    </div>
                    {i === 0 && <Badge variant="primary">Actual</Badge>}
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Tip */}
        <FadeInView delay={0.2}>
          <Card className="mt-8 bg-primary-50/50 border-primary-200/50">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-heading font-semibold text-sm text-primary-700">Consejo de estudio</p>
                <p className="text-sm text-primary-600 mt-1">
                  Dedica al menos 30 minutos diarios a tu área más débil. La constancia es más importante que la intensidad.
                </p>
              </div>
            </div>
          </Card>
        </FadeInView>
      </div>
    </PageTransition>
  );
}
