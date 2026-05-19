import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Target, Clock, Flame, BookOpen, Calculator, ChevronRight } from 'lucide-react';
import { Card, StatCard, Badge, ProgressBar, Button, SectionHeader } from '../components/ui';
import { PageTransition, FadeInView, staggerContainer, staggerItem } from '../lib/animations';

type RouteProfile = {
  title: string;
  goals: { label: string; current: number; total: number; color: 'primary' | 'gradient' }[];
  recommendations: { icon: typeof BookOpen; title: string; desc: string; priority: string }[];
  trend: string;
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
        { icon: BookOpen, title: 'Comprensión literal', desc: 'Refuerza ideas principales y secundarias en textos cortos.', priority: 'Alta' },
        { icon: Calculator, title: 'Operaciones y álgebra', desc: 'Practica ecuaciones lineales con feedback inmediato.', priority: 'Alta' },
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

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <FadeInView>
          <div className="mb-8">
            <Badge variant="primary">Tu Ruta</Badge>
            <h1 className="text-3xl font-heading font-bold text-surface-900 mt-2">{profile.title}</h1>
            <p className="text-surface-700 mt-1">Plan personalizado según tu puntaje estimado actual.</p>
          </div>
        </FadeInView>
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
        <FadeInView>
          <Card className="mb-8">
            <SectionHeader title="Metas de la Semana" subtitle="Ajustadas a tu proyección actual" />
            <div className="space-y-5">
              {profile.goals.map((g, i) => (
                <div key={i}>
                  <ProgressBar value={g.current} max={g.total} label={g.label} color={g.color} />
                </div>
              ))}
            </div>
          </Card>
        </FadeInView>
        <FadeInView delay={0.1}>
          <SectionHeader
            title="Recomendaciones personalizadas"
            subtitle="Generadas a partir de la proyección de puntaje"
            action={<Link to="/ruta/mejora"><Button variant="ghost" size="sm" iconRight={ChevronRight}>Ver plan de mejora</Button></Link>}
          />
          <motion.div variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }} className="space-y-4">
            {profile.recommendations.map((r, i) => (
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
