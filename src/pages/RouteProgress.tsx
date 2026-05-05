import { motion } from 'framer-motion';
import { TrendingUp, Award, Calendar, Zap, BookOpen, Calculator, FlaskConical } from 'lucide-react';
import { Card, Badge, ProgressBar, SectionHeader } from '../components/ui';
import { PageTransition, FadeInView, staggerContainer, staggerItem } from '../lib/animations';

const subjectProgress = [
  { name: 'Lectura Crítica', score: 72, previous: 65, icon: BookOpen, color: 'bg-blue-500' },
  { name: 'Matemáticas', score: 58, previous: 52, icon: Calculator, color: 'bg-violet-500' },
  { name: 'Ciencias Naturales', score: 45, previous: 45, icon: FlaskConical, color: 'bg-emerald-500' },
];

const milestones = [
  { date: 'Hoy', label: 'Completaste el módulo de Inferencias', done: true },
  { date: 'Ayer', label: 'Alcanzaste 7 días de racha', done: true },
  { date: 'Hace 3 días', label: 'Primer reto semanal completado', done: true },
  { date: 'Próximo', label: 'Desbloquear módulo de Ciencias', done: false },
];

export default function RouteProgress() {
  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <FadeInView>
          <Badge variant="primary">Progreso</Badge>
          <h1 className="text-3xl font-heading font-bold text-surface-900 mt-2">Tu Ruta de Aprendizaje</h1>
          <p className="text-surface-700 mt-1">Seguimiento detallado de tu avance general.</p>
        </FadeInView>

        {/* Overall progress */}
        <FadeInView delay={0.1}>
          <Card className="mt-8 gradient-primary text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-white/15 flex items-center justify-center">
                <TrendingUp className="w-10 h-10" />
              </div>
              <div className="flex-1">
                <p className="text-white/70 text-sm font-medium">Progreso general</p>
                <p className="text-4xl font-heading font-bold mt-1">48%</p>
                <div className="mt-3 w-full h-2 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '48%' }}
                    transition={{ duration: 1.5, ease: [0.34, 1.56, 0.64, 1] }}
                    className="h-full bg-white rounded-full"
                  />
                </div>
              </div>
            </div>
          </Card>
        </FadeInView>

        {/* Subject progress */}
        <div className="mt-8">
          <SectionHeader title="Progreso por Materia" />
          <motion.div variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }} className="grid gap-4">
            {subjectProgress.map((s, i) => (
              <motion.div key={i} variants={staggerItem}>
                <Card hover>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl ${s.color} flex items-center justify-center shadow-md`}>
                      <s.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-heading font-semibold text-surface-900">{s.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-heading font-bold text-surface-900">{s.score}%</span>
                          {s.score > s.previous && (
                            <Badge variant="success">+{s.score - s.previous}%</Badge>
                          )}
                        </div>
                      </div>
                      <ProgressBar value={s.score} showValue={false} size="sm" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Timeline */}
        <div className="mt-8">
          <SectionHeader title="Hitos recientes" />
          <div className="space-y-4">
            {milestones.map((m, i) => (
              <FadeInView key={i} delay={i * 0.05}>
                <div className="flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    m.done ? 'bg-tertiary-50 text-tertiary-400' : 'bg-surface-200 text-surface-600'
                  }`}>
                    {m.done ? <Zap className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-surface-600">{m.date}</p>
                    <p className="text-sm font-medium text-surface-900">{m.label}</p>
                  </div>
                </div>
              </FadeInView>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
