import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Target, TrendingUp, Clock, Flame, BookOpen, Calculator, ChevronRight, Sparkles } from 'lucide-react';
import { Card, StatCard, Badge, ProgressBar, Button, SectionHeader } from '../components/ui';
import { PageTransition, FadeInView, staggerContainer, staggerItem } from '../lib/animations';

const weeklyGoals = [
  { label: 'Lectura Crítica', current: 3, total: 5, color: 'primary' as const },
  { label: 'Matemáticas', current: 2, total: 4, color: 'primary' as const },
  { label: 'Retos completados', current: 7, total: 10, color: 'gradient' as const },
];

const recommendations = [
  { icon: BookOpen, title: 'Refuerza Inferencias', desc: 'Tu rendimiento en inferencias bajó 5%. Practica con textos argumentativos.', priority: 'Alta' },
  { icon: Calculator, title: 'Repasa Álgebra', desc: 'Los problemas con ecuaciones lineales tienen margen de mejora.', priority: 'Media' },
  { icon: Target, title: 'Intenta el Reto Semanal', desc: 'El reto de esta semana cubre tus áreas más débiles.', priority: 'Sugerida' },
];

export default function MyRoute() {
  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <FadeInView>
          <div className="mb-8">
            <Badge variant="primary">Tu Ruta</Badge>
            <h1 className="text-3xl font-heading font-bold text-surface-900 mt-2">Tu ruta de aprendizaje</h1>
            <p className="text-surface-700 mt-1">Plan personalizado basado en tu perfil y progreso.</p>
          </div>
        </FadeInView>

        {/* Stats */}
        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Días activos', value: '12', icon: Flame, trend: { value: '+3 esta semana', positive: true }, color: 'warning' },
            { label: 'Puntaje estimado', value: '285', icon: Target, trend: { value: '+15 pts', positive: true }, color: 'primary' },
            { label: 'Unidades completas', value: '18', icon: BookOpen, color: 'success' },
            { label: 'Tiempo de estudio', value: '8.5h', icon: Clock, color: 'secondary' },
          ].map((s, i) => (
            <motion.div key={i} variants={staggerItem}>
              <StatCard {...s} />
            </motion.div>
          ))}
        </motion.div>

        {/* Weekly goals */}
        <FadeInView>
          <Card className="mb-8">
            <SectionHeader title="Metas de la Semana" subtitle="Mantén tu racha y avanza más rápido" />
            <div className="space-y-5">
              {weeklyGoals.map((g, i) => (
                <div key={i}>
                  <ProgressBar
                    value={g.current}
                    max={g.total}
                    label={g.label}
                    color={g.color}
                  />
                </div>
              ))}
            </div>
          </Card>
        </FadeInView>

        {/* Recommendations */}
        <FadeInView delay={0.1}>
          <SectionHeader
            title="Recomendaciones personalizadas"
            subtitle="Basadas en tu rendimiento reciente"
            action={<Link to="/ruta/mejora"><Button variant="ghost" size="sm" iconRight={ChevronRight}>Ver plan de mejora</Button></Link>}
          />
          <motion.div variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }} className="space-y-4">
            {recommendations.map((r, i) => (
              <motion.div key={i} variants={staggerItem}>
                <Card hover accent={i === 0 ? 'primary' : 'none'}>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                      <r.icon className="w-5 h-5 text-primary-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-heading font-semibold text-surface-900">{r.title}</h3>
                        <Badge variant={i === 0 ? 'error' : i === 1 ? 'warning' : 'neutral'} size="sm">{r.priority}</Badge>
                      </div>
                      <p className="text-sm text-surface-700 mt-1">{r.desc}</p>
                    </div>
                    <Link to="/practica">
                      <Button variant="secondary" size="sm">Practicar</Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </FadeInView>
      </div>
    </PageTransition>
  );
}
