import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Users, TrendingUp, AlertTriangle, School, BookOpen, Activity } from 'lucide-react';
import { Card, StatCard, Badge, ProgressBar, SectionHeader, Button } from '../components/ui';
import { PageTransition, FadeInView, staggerContainer, staggerItem } from '../lib/animations';
import { useNavigate } from 'react-router-dom';

const groups = [
  { name: '11-A', students: 35, avgScore: 290, trend: '+12', risk: 3 },
  { name: '11-B', students: 32, avgScore: 265, trend: '+8', risk: 5 },
  { name: '11-C', students: 38, avgScore: 310, trend: '+15', risk: 2 },
];

export default function TeacherPanel() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Vista General');

  return (
    <PageTransition>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <FadeInView>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mt-2 gap-4">
            <div>
              <h1 className="text-3xl font-heading font-bold text-surface-900 mt-2">Panel Docente</h1>
              <p className="text-surface-700 mt-1">Vista general del rendimiento de tus grupos.</p>
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

        {/* Tabs navigation */}
        <div className="flex overflow-x-auto border-b border-surface-200 mt-8 mb-6 hide-scrollbar">
          {['Vista General', 'Retos Grupales', 'Alertas y Riesgos'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-semibold text-sm whitespace-nowrap transition-colors relative ${
                activeTab === tab ? 'text-primary-600' : 'text-surface-500 hover:text-surface-800'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div layoutId="teacherTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500" />
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'Vista General' && (
            <motion.div
              key="vista-general"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-10"
            >
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total estudiantes', value: '105', icon: Users, color: 'primary' },
                  { label: 'Puntaje promedio', value: '288', icon: BarChart3, color: 'secondary' },
                  { label: 'Mejora promedio', value: '+12%', icon: TrendingUp, color: 'success' },
                  { label: 'Estudiantes en riesgo', value: '10', icon: AlertTriangle, color: 'warning' },
                ].map((s, i) => (
                  <motion.div key={i} variants={staggerItem}><StatCard {...s} /></motion.div>
                ))}
              </div>

              <div>
                <SectionHeader title="Mis Grupos" />
                <div className="space-y-4">
            {groups.map((g, i) => (
              <motion.div key={i} variants={staggerItem}>
                <Card hover>
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center shadow-md">
                      <School className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading font-bold text-lg text-surface-900">Grupo {g.name}</h3>
                      <p className="text-sm text-surface-600">{g.students} estudiantes</p>
                    </div>
                    <div className="grid grid-cols-3 gap-6 text-center">
                      <div>
                        <p className="text-xs text-surface-600">Promedio</p>
                        <p className="text-xl font-heading font-bold text-surface-900">{g.avgScore}</p>
                      </div>
                      <div>
                        <p className="text-xs text-surface-600">Tendencia</p>
                        <p className="text-xl font-heading font-bold text-tertiary-400">{g.trend}</p>
                      </div>
                      <div>
                        <p className="text-xs text-surface-600">En riesgo</p>
                        <p className="text-xl font-heading font-bold text-error">{g.risk}</p>
                      </div>
                    </div>
                    
                    {/* Botón de acción agregado para que la UI sea usable */}
                    <div className="mt-4 flex justify-end">
                      <Button variant="secondary" size="sm" onClick={() => navigate('/dashboard')}>
                        Comparar con Nacional
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
            </div>
            </div>
          </motion.div>
          )}

          {activeTab === 'Retos Grupales' && (
            <motion.div
              key="retos-grupales"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="flex justify-between items-center mb-6">
                <SectionHeader title="Retos Activos" subtitle="Supervisa la participación de tus grupos en los retos asignados." />
                <Button>Asignar Nuevo Reto</Button>
              </div>

              <div className="space-y-4">
                {[
                  { id: 1, title: 'Simulacro Lectura Crítica', group: '11-A', progress: 75, date: 'Termina en 2 días' },
                  { id: 2, title: 'Reto Matemáticas Avanzadas', group: '11-B', progress: 40, date: 'Termina en 5 días' },
                  { id: 3, title: 'Cuestionario de Ciencias', group: '11-C', progress: 95, date: 'Termina hoy' }
                ].map(reto => (
                  <Card key={reto.id} hover>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                          <BookOpen className="w-6 h-6 text-primary-500" />
                        </div>
                        <div>
                          <h3 className="font-heading font-bold text-surface-900">{reto.title}</h3>
                          <div className="flex gap-3 text-sm text-surface-600 mt-1">
                            <span className="font-semibold text-primary-700">Grupo {reto.group}</span>
                            <span>•</span>
                            <span className="text-warning-600">{reto.date}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-1 sm:max-w-xs w-full">
                        <div className="flex justify-between text-xs font-semibold mb-1">
                          <span className="text-surface-700">Completitud</span>
                          <span className="text-primary-600">{reto.progress}%</span>
                        </div>
                        <ProgressBar value={reto.progress} max={100} showValue={false} color="primary" size="sm" />
                      </div>
                      
                      <Button variant="secondary" size="sm">Ver Resultados</Button>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'Alertas y Riesgos' && (
            <motion.div
              key="alertas"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="text-center py-16 bg-surface-50 rounded-2xl border border-surface-200">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <AlertTriangle className="w-8 h-8 text-warning-500" />
                </div>
                <h3 className="font-heading font-bold text-xl text-surface-900">Alertas Académicas</h3>
                <p className="text-surface-600 max-w-md mx-auto mt-2">
                  El sistema está procesando los resultados de los simulacros recientes para identificar estudiantes que requieran acompañamiento prioritario.
                </p>
                <Button variant="secondary" className="mt-6">Actualizar Reporte</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
