import { motion } from 'framer-motion';
import { Building2, Users, BarChart3, TrendingUp, AlertTriangle, Award, School, Target, Activity } from 'lucide-react';
import { Card, StatCard, Badge, ProgressBar, SectionHeader, Button } from '../components/ui';
import { PageTransition, FadeInView, staggerContainer, staggerItem } from '../lib/animations';
import { useNavigate } from 'react-router-dom';

const jornadas = [
  { name: 'Jornada Mañana', students: 450, avg: 285, improvement: '+8%' },
  { name: 'Jornada Tarde', students: 380, avg: 272, improvement: '+5%' },
  { name: 'Jornada Completa', students: 120, avg: 310, improvement: '+12%' },
];

const subjects = [
  { name: 'Lectura Crítica', avg: 68, national: 55 },
  { name: 'Matemáticas', avg: 55, national: 52 },
  { name: 'Ciencias Naturales', avg: 58, national: 54 },
  { name: 'Sociales y Ciudadanas', avg: 62, national: 56 },
  { name: 'Inglés', avg: 52, national: 48 },
];

export default function InstitutionalPanel() {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <FadeInView>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mt-2 gap-4">
            <div>
              <h1 className="text-3xl font-heading font-bold text-surface-900 mt-2">Panel Institucional</h1>
              <p className="text-surface-700 mt-1">Visión global del rendimiento institucional.</p>
            </div>
            <Button 
              icon={Activity} 
              onClick={() => navigate('/dashboard')}
              className="shadow-sm"
            >
              Panorama Regional Oficial
            </Button>
          </div>
        </FadeInView>

        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {[
            { label: 'Total estudiantes', value: '950', icon: Users, color: 'primary' },
            { label: 'Puntaje promedio', value: '285', icon: BarChart3, color: 'secondary' },
            { label: 'Mejora semestral', value: '+8.5%', icon: TrendingUp, color: 'success' },
            { label: 'Docentes activos', value: '28', icon: School, color: 'warning' },
          ].map((s, i) => (
            <motion.div key={i} variants={staggerItem}><StatCard {...s} /></motion.div>
          ))}
        </motion.div>

        {/* By jornada */}
        <div className="mt-10">
          <SectionHeader title="Rendimiento por Jornada" />
          <motion.div variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {jornadas.map((j, i) => (
              <motion.div key={i} variants={staggerItem}>
                <Card hover className="text-center">
                  <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center mx-auto shadow-md mb-3">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-heading font-bold text-surface-900">{j.name}</h3>
                  <p className="text-xs text-surface-600 mb-3">{j.students} estudiantes</p>
                  <p className="text-3xl font-heading font-bold text-surface-900">{j.avg}</p>
                  <Badge variant="success" size="sm">{j.improvement}</Badge>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Subject comparison */}
        <div className="mt-10">
          <SectionHeader title="Comparación por Materia" subtitle="Institución vs Promedio Nacional" />
          <Card>
            <div className="space-y-5">
              {subjects.map((s, i) => (
                <FadeInView key={i} delay={i * 0.05}>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-surface-800">{s.name}</span>
                      <div className="flex gap-3 text-xs">
                        <span className="text-primary-500 font-semibold">Institución: {s.avg}%</span>
                        <span className="text-surface-500">Nacional: {s.national}%</span>
                      </div>
                    </div>
                    <div className="relative h-3 bg-surface-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${s.national}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="absolute h-full bg-surface-400 rounded-full"
                      />
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${s.avg}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="absolute h-full bg-primary-500 rounded-full"
                      />
                    </div>
                  </div>
                </FadeInView>
              ))}
            </div>
            {/* Botón de acción agregado para que la UI sea usable */}
            <div className="mt-6 flex justify-end border-t border-surface-200 pt-4">
              <Button variant="secondary" onClick={() => navigate('/dashboard')}>
                Ver Estadísticas Regionales Detalladas
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
