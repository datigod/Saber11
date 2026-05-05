import { motion } from 'framer-motion';
import { Trophy, Star, Flame, Zap, Medal, Award, Crown, Shield, Target, BookOpen } from 'lucide-react';
import { Card, Badge, SectionHeader } from '../components/ui';
import { PageTransition, FadeInView, staggerContainer, staggerItem } from '../lib/animations';

const achievements = [
  { icon: Flame, title: 'Racha de 7 días', desc: 'Estudia 7 días consecutivos', unlocked: true, color: 'from-amber-400 to-red-500', date: 'Hace 2 días' },
  { icon: Star, title: 'Primera estrella', desc: 'Obtén 90%+ en un reto', unlocked: true, color: 'from-yellow-400 to-amber-500', date: 'Hace 5 días' },
  { icon: BookOpen, title: 'Lector voraz', desc: 'Completa 10 unidades de lectura', unlocked: true, color: 'from-blue-400 to-indigo-500', date: 'Hace 1 semana' },
  { icon: Target, title: 'Tirador preciso', desc: 'Responde 5 preguntas seguidas correctamente', unlocked: true, color: 'from-green-400 to-emerald-500', date: 'Hace 1 semana' },
  { icon: Crown, title: 'Maestro del módulo', desc: 'Completa un módulo entero con 80%+', unlocked: false, color: 'from-purple-400 to-violet-500', progress: 65 },
  { icon: Medal, title: 'Maratonista', desc: 'Completa 50 retos', unlocked: false, color: 'from-rose-400 to-pink-500', progress: 46 },
  { icon: Shield, title: 'Racha legendaria', desc: 'Mantén una racha de 30 días', unlocked: false, color: 'from-cyan-400 to-blue-500', progress: 23 },
  { icon: Award, title: 'Explorador total', desc: 'Intenta al menos un reto de cada materia', unlocked: false, color: 'from-teal-400 to-green-500', progress: 60 },
];

export default function Achievements() {
  const unlocked = achievements.filter(a => a.unlocked);
  const locked = achievements.filter(a => !a.unlocked);

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <FadeInView>
          <div className="text-center mb-10">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center mx-auto shadow-xl mb-4"
            >
              <Trophy className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-heading font-bold text-surface-900">Reconocimientos y Logros</h1>
            <p className="text-surface-700 mt-2">
              {unlocked.length} de {achievements.length} logros desbloqueados
            </p>
          </div>
        </FadeInView>

        {/* Unlocked */}
        <SectionHeader title="Desbloqueados" subtitle={`${unlocked.length} logros obtenidos`} />
        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {unlocked.map((a, i) => (
            <motion.div key={i} variants={staggerItem}>
              <Card hover className="flex items-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 15 }}
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${a.color} flex items-center justify-center shadow-lg flex-shrink-0`}
                >
                  <a.icon className="w-7 h-7 text-white" />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading font-bold text-surface-900">{a.title}</h3>
                  <p className="text-xs text-surface-600 mt-0.5">{a.desc}</p>
                  <p className="text-xs text-primary-500 mt-1">{a.date}</p>
                </div>
                <Badge variant="success">✓</Badge>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Locked */}
        <SectionHeader title="Por desbloquear" subtitle={`${locked.length} logros pendientes`} />
        <motion.div variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {locked.map((a, i) => (
            <motion.div key={i} variants={staggerItem}>
              <Card className="flex items-center gap-4 opacity-70">
                <div className="w-14 h-14 rounded-2xl bg-surface-200 flex items-center justify-center flex-shrink-0">
                  <a.icon className="w-7 h-7 text-surface-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading font-bold text-surface-700">{a.title}</h3>
                  <p className="text-xs text-surface-600 mt-0.5">{a.desc}</p>
                  <div className="mt-2 w-full h-1.5 bg-surface-300 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-300 rounded-full" style={{ width: `${a.progress}%` }} />
                  </div>
                  <p className="text-[10px] text-surface-500 mt-1">{a.progress}% completado</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </PageTransition>
  );
}
