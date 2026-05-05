import { motion } from 'framer-motion';
import { User, BookOpen, Target, Flame, Clock, TrendingUp, Calendar, Settings } from 'lucide-react';
import { Card, StatCard, Badge, ProgressBar, Button, Avatar, SectionHeader } from '../components/ui';
import { PageTransition, FadeInView, staggerContainer, staggerItem } from '../lib/animations';

const subjectScores = [
  { name: 'Lectura Crítica', score: 72, color: 'bg-blue-500' },
  { name: 'Matemáticas', score: 58, color: 'bg-violet-500' },
  { name: 'Ciencias', score: 45, color: 'bg-emerald-500' },
  { name: 'Sociales', score: 63, color: 'bg-amber-500' },
  { name: 'Inglés', score: 70, color: 'bg-rose-500' },
];

export default function Profile() {
  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile header */}
        <FadeInView>
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 gradient-hero opacity-5" />
            <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <Avatar name="María García" size="lg" />
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl font-heading font-bold text-surface-900">María García</h1>
                <p className="text-surface-700">Estudiante · Grado 11</p>
                <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                  <Badge variant="primary">Nivel 5</Badge>
                  <Badge variant="success">2,450 XP</Badge>
                  <Badge variant="warning">🔥 7 días</Badge>
                </div>
              </div>
              <Button variant="ghost" size="sm" icon={Settings}>Editar</Button>
            </div>
          </Card>
        </FadeInView>

        {/* Stats */}
        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          {[
            { label: 'Puntaje estimado', value: '285', icon: Target, color: 'primary' },
            { label: 'Retos completos', value: '23', icon: Flame, color: 'warning' },
            { label: 'Horas de estudio', value: '42h', icon: Clock, color: 'secondary' },
            { label: 'Mejora mensual', value: '+15%', icon: TrendingUp, color: 'success' },
          ].map((s, i) => (
            <motion.div key={i} variants={staggerItem}>
              <StatCard {...s} />
            </motion.div>
          ))}
        </motion.div>

        {/* Subject performance */}
        <FadeInView delay={0.2}>
          <Card className="mt-8">
            <SectionHeader title="Mi Perfil de Aprendizaje" subtitle="Rendimiento por materia" />
            <div className="space-y-5">
              {subjectScores.map((s, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${s.color}`} />
                  <div className="flex-1">
                    <ProgressBar value={s.score} label={s.name} color="primary" size="sm" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </FadeInView>

        {/* Activity calendar placeholder */}
        <FadeInView delay={0.3}>
          <Card className="mt-6">
            <SectionHeader title="Actividad reciente" />
            <div className="grid grid-cols-7 gap-1">
              {[...Array(28)].map((_, i) => {
                const intensity = Math.random();
                return (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.02, type: 'spring' }}
                    className={`aspect-square rounded-sm ${
                      intensity > 0.7 ? 'bg-primary-500' :
                      intensity > 0.4 ? 'bg-primary-300' :
                      intensity > 0.2 ? 'bg-primary-100' :
                      'bg-surface-200'
                    }`}
                  />
                );
              })}
            </div>
            <p className="text-xs text-surface-600 mt-3 text-center">Últimos 28 días</p>
          </Card>
        </FadeInView>
      </div>
    </PageTransition>
  );
}
