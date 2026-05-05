import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Clock, CalendarCheck, Sun, Moon, Coffee, BookOpen, Plus, Check, X } from 'lucide-react';
import { Card, Badge, Button, SectionHeader } from '../components/ui';
import { PageTransition, FadeInView, staggerContainer, staggerItem } from '../lib/animations';

const habits = [
  { id: 1, title: 'Lectura matutina', time: '7:00 AM', icon: Sun, days: [true, true, false, true, true, false, false], active: true },
  { id: 2, title: 'Práctica de matemáticas', time: '4:00 PM', icon: BookOpen, days: [true, false, true, false, true, false, false], active: true },
  { id: 3, title: 'Reto del día', time: '6:00 PM', icon: CalendarCheck, days: [true, true, true, true, true, true, true], active: true },
];

const dayNames = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

const reminders = [
  { time: '7:00 AM', message: 'Hora de tu lectura matutina ☀️', enabled: true },
  { time: '4:00 PM', message: 'Es momento de practicar matemáticas 📐', enabled: true },
  { time: '6:00 PM', message: 'No olvides tu reto del día 🔥', enabled: true },
  { time: '9:00 PM', message: 'Resumen de tu día de estudio 📊', enabled: false },
];

export default function Habits() {
  const [activeReminders, setActiveReminders] = useState(reminders.map(r => r.enabled));

  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <FadeInView>
          <Badge variant="primary">Hábitos</Badge>
          <h1 className="text-3xl font-heading font-bold text-surface-900 mt-2">Hábitos y Recordatorios</h1>
          <p className="text-surface-700 mt-1">Construye una rutina de estudio consistente.</p>
        </FadeInView>

        {/* Habits */}
        <div className="mt-8">
          <SectionHeader
            title="Mis hábitos de estudio"
            action={<Button variant="ghost" size="sm" icon={Plus}>Nuevo hábito</Button>}
          />
          <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-4">
            {habits.map(h => (
              <motion.div key={h.id} variants={staggerItem}>
                <Card hover>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                      <h.icon className="w-5 h-5 text-primary-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-heading font-semibold text-surface-900">{h.title}</h3>
                        <span className="text-xs text-surface-600 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {h.time}
                        </span>
                      </div>
                      <div className="flex gap-1.5">
                        {h.days.map((done, di) => (
                          <motion.div
                            key={di}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: di * 0.05, type: 'spring' }}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold ${
                              done ? 'bg-primary-500 text-white' : 'bg-surface-200 text-surface-600'
                            }`}
                          >
                            {dayNames[di]}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                    <Badge variant={h.active ? 'success' : 'neutral'}>
                      {h.active ? 'Activo' : 'Pausado'}
                    </Badge>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Reminders */}
        <div className="mt-10">
          <SectionHeader title="Recordatorios" subtitle="Notificaciones para no perder el ritmo" />
          <motion.div variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }} className="space-y-3">
            {reminders.map((r, i) => (
              <motion.div key={i} variants={staggerItem}>
                <Card padding="sm" className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                    <Bell className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-surface-900">{r.message}</p>
                    <p className="text-xs text-surface-600">{r.time}</p>
                  </div>
                  <button
                    onClick={() => {
                      const next = [...activeReminders];
                      next[i] = !next[i];
                      setActiveReminders(next);
                    }}
                    className={`w-10 h-6 rounded-full transition-all duration-200 flex items-center cursor-pointer ${
                      activeReminders[i] ? 'bg-primary-500 justify-end' : 'bg-surface-300 justify-start'
                    }`}
                  >
                    <motion.div
                      layout
                      className="w-5 h-5 rounded-full bg-white shadow-md mx-0.5"
                    />
                  </button>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
