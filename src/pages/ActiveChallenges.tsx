import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swords, Flame, Clock, Zap, ChevronRight } from 'lucide-react';
import { Card, Badge, ProgressBar, Button, SectionHeader } from '../components/ui';
import { PageTransition, FadeInView, staggerContainer, staggerItem } from '../lib/animations';

const activeChallenges = [
  { id: 1, title: 'Maratón de Lectura', progress: 60, questionsLeft: 4, xp: 150, deadline: '2h restantes' },
  { id: 2, title: 'Desafío Numérico', progress: 30, questionsLeft: 7, xp: 200, deadline: '5h restantes' },
];

const completedToday = [
  { id: 3, title: 'Quiz Relámpago', score: 80, xp: 100, time: 'Hace 1h' },
  { id: 4, title: 'Vocabulario Rápido', score: 95, xp: 75, time: 'Hace 3h' },
];

export default function ActiveChallenges() {
  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <FadeInView>
          <Badge variant="primary">En Progreso</Badge>
          <h1 className="text-3xl font-heading font-bold text-surface-900 mt-2">Centro de Retos</h1>
          <p className="text-surface-700 mt-1">Tus retos activos y completados hoy.</p>
        </FadeInView>

        {/* Active */}
        <div className="mt-8">
          <SectionHeader title="Retos activos" />
          <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-4">
            {activeChallenges.map(c => (
              <motion.div key={c.id} variants={staggerItem}>
                <Card hover accent="primary">
                  <div className="flex items-center gap-4">
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-md"
                    >
                      <Swords className="w-6 h-6 text-white" />
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="font-heading font-semibold text-surface-900">{c.title}</h3>
                      <ProgressBar value={c.progress} size="sm" color="primary" />
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-surface-600 flex items-center gap-1"><Clock className="w-3 h-3" />{c.deadline}</span>
                        <span className="text-xs text-surface-600">{c.questionsLeft} preguntas restantes</span>
                      </div>
                    </div>
                    <Link to="/practica"><Button size="sm">Continuar</Button></Link>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Completed */}
        <div className="mt-10">
          <SectionHeader title="Completados hoy" />
          <motion.div variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }} className="space-y-3">
            {completedToday.map(c => (
              <motion.div key={c.id} variants={staggerItem}>
                <Card padding="sm" className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-tertiary-50 flex items-center justify-center">
                    <Flame className="w-5 h-5 text-tertiary-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm text-surface-900">{c.title}</h3>
                    <p className="text-xs text-surface-600">{c.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-heading font-bold text-surface-900">{c.score}%</p>
                    <p className="text-xs text-amber-500">+{c.xp} XP</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
