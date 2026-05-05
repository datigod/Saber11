import { motion } from 'framer-motion';
import { GraduationCap, Database, Brain, Shield, Users, Heart, Code, ExternalLink } from 'lucide-react';
import { Card, Badge } from '../components/ui';
import { PageTransition, FadeInView, staggerContainer, staggerItem } from '../lib/animations';

const sections = [
  {
    icon: GraduationCap, title: '¿Qué es Ruta Saber 11?',
    content: 'Es una plataforma educativa que utiliza inteligencia artificial para crear rutas de aprendizaje personalizadas para estudiantes que se preparan para el examen Saber 11 en Colombia.',
  },
  {
    icon: Brain, title: 'Modelo de IA',
    content: 'Utilizamos un modelo CatBoost entrenado con datos abiertos del ICFES para predecir puntajes y recomendar planes de estudio adaptados al contexto socioeconómico y académico de cada estudiante.',
  },
  {
    icon: Database, title: 'Datos Abiertos',
    content: 'Los datos provienen de las bases de datos públicas del ICFES (Instituto Colombiano para la Evaluación de la Educación). Son procesados de forma anónima y agregada.',
  },
  {
    icon: Shield, title: 'Uso Responsable',
    content: 'Esta herramienta NO clasifica ni discrimina estudiantes. Su único propósito es recomendar apoyos, recursos y planes de estudio para potenciar el aprendizaje individual.',
  },
  {
    icon: Users, title: '¿Para quién es?',
    content: 'Estudiantes de grado 11 que se preparan para el examen, docentes que acompañan a sus estudiantes, e instituciones educativas que buscan mejorar resultados.',
  },
  {
    icon: Code, title: 'Tecnología',
    content: 'Frontend construido con React + TypeScript + Tailwind CSS. Backend con Flask + CatBoost. Diseño creado en Google Stitch. Análisis con Python, Pandas y Optuna.',
  },
];

const team = [
  { name: 'Proyecto Académico', role: 'Analítica de datos aplicada a la educación' },
];

export default function About() {
  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <FadeInView>
          <div className="text-center mb-12">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-20 h-20 rounded-3xl gradient-primary flex items-center justify-center mx-auto shadow-xl mb-6"
            >
              <GraduationCap className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-4xl font-heading font-bold text-surface-900">Sobre el Proyecto</h1>
            <p className="text-surface-700 mt-3 max-w-2xl mx-auto">
              Ruta Saber 11 nace del compromiso por democratizar el acceso a herramientas
              de preparación académica de calidad, usando datos abiertos e inteligencia artificial.
            </p>
          </div>
        </FadeInView>

        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-4">
          {sections.map((s, i) => (
            <motion.div key={i} variants={staggerItem}>
              <Card hover>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                    <s.icon className="w-6 h-6 text-primary-500" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-lg text-surface-900 mb-1">{s.title}</h3>
                    <p className="text-sm text-surface-700 leading-relaxed">{s.content}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <FadeInView delay={0.3}>
          <Card className="mt-8 text-center bg-primary-50/50 border-primary-200/30">
            <Heart className="w-8 h-8 text-primary-500 mx-auto mb-3" />
            <h3 className="font-heading font-bold text-lg text-surface-900">Hecho con ❤️ para la educación colombiana</h3>
            <p className="text-sm text-surface-700 mt-2">
              © 2024 Ruta Saber 11. Institución Educativa Superior.
            </p>
          </Card>
        </FadeInView>
      </div>
    </PageTransition>
  );
}
