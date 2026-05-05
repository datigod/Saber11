import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, GraduationCap, Map, Swords, BookOpen, BarChart3, Users, Shield, Sparkles } from 'lucide-react';
import { Button, Card } from '../components/ui';
import { FadeInView, staggerContainer, staggerItem } from '../lib/animations';

const features = [
  { icon: Map, title: 'Ruta Personalizada', desc: 'Plan de estudio adaptado a tu contexto, recursos y metas académicas.' },
  { icon: Swords, title: 'Retos Diarios', desc: 'Desafíos gamificados que fortalecen tus competencias día a día.' },
  { icon: BookOpen, title: 'Práctica Inteligente', desc: 'Preguntas tipo Saber 11 con retroalimentación inmediata.' },
  { icon: BarChart3, title: 'Predicción IA', desc: 'Modelo CatBoost que estima tu puntaje y orienta tu preparación.' },
  { icon: Users, title: 'Panel Docente', desc: 'Herramientas para acompañar y orientar a tus estudiantes.' },
  { icon: Shield, title: 'Uso Responsable', desc: 'No clasificamos estudiantes. Recomendamos apoyos para potenciar el aprendizaje.' },
];

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 gradient-hero opacity-[0.04]" />
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-primary-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-tertiary-200/15 rounded-full blur-3xl" />

        <div className="relative max-w-[1280px] mx-auto px-4 md:px-8 pt-32 pb-20 lg:pt-40 lg:pb-28">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 border border-primary-200 text-primary-600 text-sm font-medium mb-6"
            >
              <Sparkles className="w-4 h-4" />
              Potenciado con Inteligencia Artificial
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 25, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold text-surface-900 leading-tight"
            >
              Prepárate mejor para{' '}
              <span className="text-gradient">Saber 11</span>{' '}
              con una ruta personalizada
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 25, delay: 0.2 }}
              className="mt-6 text-lg text-surface-700 max-w-2xl mx-auto"
            >
              Construye un plan de estudio según tu contexto, tus recursos disponibles,
              tus metas académicas y tu forma de aprender.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 25, delay: 0.3 }}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/onboarding">
                <Button size="lg" icon={GraduationCap} iconRight={ArrowRight}>
                  Comenzar mi ruta
                </Button>
              </Link>
              <Link to="/sobre">
                <Button variant="secondary" size="lg">
                  Conocer el proyecto
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-surface-100/50">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8">
          <FadeInView>
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-surface-900">
                Todo lo que necesitas para prepararte
              </h2>
              <p className="mt-3 text-surface-700 max-w-xl mx-auto">
                Una plataforma integral diseñada para estudiantes, docentes e instituciones.
              </p>
            </div>
          </FadeInView>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((f, i) => (
              <motion.div key={i} variants={staggerItem}>
                <Card hover className="h-full">
                  <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mb-4">
                    <f.icon className="w-6 h-6 text-primary-500" />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-surface-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-surface-700 leading-relaxed">{f.desc}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8">
          <FadeInView>
            <div className="gradient-primary rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
              <div className="relative">
                <h2 className="text-3xl md:text-4xl font-heading font-bold">¿Listo para conocer tu puntaje estimado?</h2>
                <p className="mt-4 text-white/80 max-w-lg mx-auto">
                  Nuestro modelo de Machine Learning puede predecir tu puntaje Saber 11
                  basado en tu contexto socioeconómico y académico.
                </p>
                <Link to="/onboarding" className="mt-8 inline-block">
                  <Button variant="ghost" size="lg" className="!bg-white !text-primary-600 hover:!bg-white/90">
                    Predecir mi puntaje
                  </Button>
                </Link>
              </div>
            </div>
          </FadeInView>
        </div>
      </section>
    </div>
  );
}
