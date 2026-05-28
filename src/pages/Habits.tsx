import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Clock, CalendarCheck, Sun, Moon, Coffee, BookOpen, Plus, Check, X, Edit2 } from 'lucide-react';
import { Card, Badge, Button, SectionHeader } from '../components/ui';
import { PageTransition, FadeInView, staggerContainer, staggerItem } from '../lib/animations';

interface Habit {
  id: number;
  title: string;
  time: string; // "HH:MM" 24h format
  icon: any;
  days: boolean[];
  active: boolean;
}

interface Reminder {
  id: number;
  time: string; // "HH:MM" 24h format
  message: string;
  enabled: boolean;
}

const initialHabits: Habit[] = [
  { id: 1, title: 'Lectura matutina', time: '07:00', icon: Sun, days: [true, true, false, true, true, false, false], active: true },
  { id: 2, title: 'Práctica de matemáticas', time: '16:00', icon: BookOpen, days: [true, false, true, false, true, false, false], active: true },
  { id: 3, title: 'Reto del día', time: '18:00', icon: CalendarCheck, days: [true, true, true, true, true, true, true], active: true },
];

const dayNames = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

const initialReminders: Reminder[] = [
  { id: 1, time: '07:00', message: 'Hora de tu lectura matutina ☀️', enabled: true },
  { id: 2, time: '16:00', message: 'Es momento de practicar matemáticas 📐', enabled: true },
  { id: 3, time: '18:00', message: 'No olvides tu reto del día 🔥', enabled: true },
  { id: 4, time: '21:00', message: 'Resumen de tu día de estudio 📊', enabled: false },
];

export default function Habits() {
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const [reminders, setReminders] = useState<Reminder[]>(initialReminders);

  const formatTime12h = (time24: string) => {
    try {
      const [hourStr, minStr] = time24.split(':');
      const hour = parseInt(hourStr, 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minStr} ${ampm}`;
    } catch {
      return time24;
    }
  };

  const handleHabitTimeChange = (id: number, newTime: string) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, time: newTime } : h));
  };

  const handleReminderTimeChange = (id: number, newTime: string) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, time: newTime } : r));
  };

  const toggleReminder = (id: number) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const toggleHabitActive = (id: number) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, active: !h.active } : h));
  };

  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <FadeInView>
          <Badge variant="primary">Hábitos</Badge>
          <h1 className="text-3xl font-heading font-bold text-surface-900 mt-2">Hábitos y Recordatorios</h1>
          <p className="text-surface-700 mt-1">Construye una rutina de estudio consistente y personaliza tus horarios de alerta.</p>
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
                <Card hover className="relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <h.icon className="w-5 h-5 text-primary-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <h3 className="font-heading font-semibold text-surface-900">{h.title}</h3>
                          
                          {/* Interactive Time Picker */}
                          <div className="relative flex items-center gap-1.5 text-xs text-primary-600 bg-primary-50 hover:bg-primary-100/80 px-2 py-1 rounded-lg transition-colors border border-primary-100 cursor-pointer group">
                            <Clock className="w-3.5 h-3.5" />
                            <span className="font-semibold">{formatTime12h(h.time)}</span>
                            <input 
                              type="time" 
                              value={h.time}
                              onChange={(e) => handleHabitTimeChange(h.id, e.target.value)}
                              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                            />
                            <Edit2 className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity ml-0.5" />
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {h.days.map((done, di) => (
                            <motion.div
                              key={di}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: di * 0.05, type: 'spring' }}
                              className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shadow-sm transition-colors ${
                                done ? 'bg-primary-500 text-white' : 'bg-surface-200 text-surface-600'
                              }`}
                            >
                              {dayNames[di]}
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => toggleHabitActive(h.id)}
                      className="self-end sm:self-center cursor-pointer"
                    >
                      <Badge variant={h.active ? 'success' : 'neutral'}>
                        {h.active ? 'Activo' : 'Pausado'}
                      </Badge>
                    </button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Reminders */}
        <div className="mt-10">
          <SectionHeader title="Recordatorios" subtitle="Notificaciones configurables para no perder el ritmo" />
          <motion.div variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }} className="space-y-3">
            {reminders.map((r) => (
              <motion.div key={r.id} variants={staggerItem}>
                <Card padding="sm" className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Bell className="w-4 h-4 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-surface-900">{r.message}</p>
                      
                      {/* Interactive Time Picker */}
                      <div className="relative inline-flex items-center gap-1.5 text-xs text-surface-600 hover:text-surface-900 mt-1 cursor-pointer group bg-surface-100 hover:bg-surface-200/60 px-2 py-0.5 rounded-md transition-colors">
                        <Clock className="w-3 h-3" />
                        <span className="font-semibold">{formatTime12h(r.time)}</span>
                        <input 
                          type="time" 
                          value={r.time}
                          onChange={(e) => handleReminderTimeChange(r.id, e.target.value)}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                        <Edit2 className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity ml-0.5" />
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => toggleReminder(r.id)}
                    className={`w-10 h-6 rounded-full transition-all duration-200 flex items-center cursor-pointer ${
                      r.enabled ? 'bg-primary-500 justify-end' : 'bg-surface-300 justify-start'
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
