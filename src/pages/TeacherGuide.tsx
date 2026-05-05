import { motion } from 'framer-motion';
import { GraduationCap, Users, Trophy, Target, Sparkles, BookOpen, ArrowRight } from 'lucide-react';
import { Card, Badge, ProgressBar, Button, SectionHeader } from '../components/ui';
import { PageTransition, FadeInView, staggerContainer, staggerItem } from '../lib/animations';
import { Link } from 'react-router-dom';

const students = [
  { name: 'Carlos R.', level: 7, xp: 3200, streak: 12, predicted: 310, trend: '+20' },
  { name: 'Ana M.', level: 5, xp: 2100, streak: 5, predicted: 275, trend: '+8' },
  { name: 'Luis G.', level: 3, xp: 1400, streak: 2, predicted: 220, trend: '+5' },
  { name: 'Sofía L.', level: 6, xp: 2800, streak: 9, predicted: 295, trend: '+15' },
];

const tools = [
  { icon: Trophy, title: 'Tabla de clasificación', desc: 'Competencia amistosa.', color: 'bg-amber-500' },
  { icon: Target, title: 'Misiones de grupo', desc: 'Retos colaborativos.', color: 'bg-primary-500' },
  { icon: Sparkles, title: 'Recompensas', desc: 'Badges personalizados.', color: 'bg-violet-500' },
];

export default function TeacherGuide() {
  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <FadeInView>
          <Badge variant="primary">Docentes</Badge>
          <h1 className="text-3xl font-heading font-bold text-surface-900 mt-2">Orientación Docente</h1>
          <p className="text-surface-700 mt-1">Herramientas gamificadas para acompañar estudiantes.</p>
        </FadeInView>

        <div className="mt-8">
          <SectionHeader title="Herramientas de Gamificación" />
          <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tools.map((a, i) => (
              <motion.div key={i} variants={staggerItem}>
                <Card hover className="text-center h-full">
                  <div className={`w-14 h-14 rounded-2xl ${a.color} flex items-center justify-center mx-auto shadow-lg mb-4`}>
                    <a.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-heading font-bold text-surface-900 mb-1">{a.title}</h3>
                  <p className="text-sm text-surface-700">{a.desc}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className="mt-10">
          <SectionHeader title="Estudiantes destacados" action={
            <Link to="/docente/panel"><Button variant="secondary" size="sm" iconRight={ArrowRight}>Panel completo</Button></Link>
          } />
          <Card>
            {students.map((s, i) => (
              <FadeInView key={i} delay={i * 0.05}>
                <div className="flex items-center gap-4 py-3 border-b border-surface-200 last:border-0">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    i === 0 ? 'bg-amber-100 text-amber-600' : 'bg-surface-200 text-surface-600'
                  }`}>{i + 1}</span>
                  <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-xs">
                    {s.name.split(' ').map(w => w[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{s.name}</p>
                    <div className="flex gap-2 mt-0.5">
                      <Badge variant="primary" size="sm">Nivel {s.level}</Badge>
                      <span className="text-xs text-surface-600">{s.xp} XP</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-heading font-bold">{s.predicted}</p>
                    <p className="text-xs text-tertiary-400">{s.trend}</p>
                  </div>
                </div>
              </FadeInView>
            ))}
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
