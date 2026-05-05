import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swords, Flame, Clock, Star, Trophy, Zap, ChevronRight, Filter } from 'lucide-react';
import { Card, Badge, ProgressBar, Button, SectionHeader } from '../components/ui';
import { PageTransition, FadeInView, staggerContainer, staggerItem, ScaleOnHover } from '../lib/animations';

const challenges = [
  { id: 1, title: 'Maratón de Lectura', desc: 'Resuelve 10 preguntas de lectura crítica consecutivas.', xp: 150, time: '25 min', difficulty: 'Medio', category: 'Lectura', active: true },
  { id: 2, title: 'Desafío Numérico', desc: 'Problemas matemáticos de complejidad creciente.', xp: 200, time: '30 min', difficulty: 'Difícil', category: 'Matemáticas', active: true },
  { id: 3, title: 'Quiz Relámpago', desc: '5 preguntas mixtas en 5 minutos. ¿Podrás lograrlo?', xp: 100, time: '5 min', difficulty: 'Fácil', category: 'Mixto', active: false },
  { id: 4, title: 'Laboratorio de Ciencias', desc: 'Análisis de datos experimentales y gráficos.', xp: 175, time: '20 min', difficulty: 'Medio', category: 'Ciencias', active: false },
  { id: 5, title: 'Ciudadanía Activa', desc: 'Casos de estudio sobre participación ciudadana.', xp: 125, time: '15 min', difficulty: 'Fácil', category: 'Sociales', active: false },
];

export default function ChallengeCenter() {
  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <FadeInView>
          <div className="flex items-center justify-between mb-8">
            <div>
              <Badge variant="primary">Centro de Retos</Badge>
              <h1 className="text-3xl font-heading font-bold text-surface-900 mt-2">Centro de Retos</h1>
              <p className="text-surface-700 mt-1">Desafíos gamificados para fortalecer tus competencias.</p>
            </div>
            <Link to="/retos/diario">
              <Button icon={Flame}>Reto del Día</Button>
            </Link>
          </div>
        </FadeInView>

        {/* Stats bar */}
        <FadeInView delay={0.1}>
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Retos completados', value: '23', icon: Trophy, color: 'bg-amber-50 text-amber-500' },
              { label: 'Racha actual', value: '7 días', icon: Flame, color: 'bg-red-50 text-red-500' },
              { label: 'XP total', value: '2,450', icon: Zap, color: 'bg-violet-50 text-violet-500' },
            ].map((s, i) => (
              <Card key={i} padding="sm" className="text-center">
                <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center mx-auto mb-2`}>
                  <s.icon className="w-5 h-5" />
                </div>
                <p className="text-xl font-heading font-bold text-surface-900">{s.value}</p>
                <p className="text-xs text-surface-600 mt-0.5">{s.label}</p>
              </Card>
            ))}
          </div>
        </FadeInView>

        {/* Challenge list */}
        <SectionHeader title="Retos disponibles" action={
          <Button variant="ghost" size="sm" icon={Filter}>Filtrar</Button>
        } />
        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-4">
          {challenges.map((c) => (
            <motion.div key={c.id} variants={staggerItem}>
              <Card hover>
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${
                    c.difficulty === 'Fácil' ? 'bg-tertiary-400' :
                    c.difficulty === 'Medio' ? 'bg-primary-500' : 'bg-violet-500'
                  }`}>
                    <Swords className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-heading font-semibold text-surface-900">{c.title}</h3>
                      <Badge variant={c.difficulty === 'Fácil' ? 'success' : c.difficulty === 'Medio' ? 'primary' : 'error'} size="sm">
                        {c.difficulty}
                      </Badge>
                    </div>
                    <p className="text-sm text-surface-700">{c.desc}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-surface-600 flex items-center gap-1"><Clock className="w-3 h-3" /> {c.time}</span>
                      <span className="text-xs text-amber-500 flex items-center gap-1"><Zap className="w-3 h-3" /> {c.xp} XP</span>
                      <Badge variant="neutral" size="sm">{c.category}</Badge>
                    </div>
                  </div>
                  <Link to="/retos/diario">
                    <Button size="sm" iconRight={ChevronRight}>Iniciar</Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </PageTransition>
  );
}
