import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame, Clock, Zap, BookOpen, Brain, ArrowRight, Sparkles } from 'lucide-react';
import { Card, Badge, Button } from '../components/ui';
import { PageTransition, FadeInView } from '../lib/animations';

export default function DailyChallenge() {
  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <FadeInView>
          <div className="text-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-red-500 mx-auto flex items-center justify-center shadow-xl mb-6"
            >
              <Flame className="w-10 h-10 text-white" />
            </motion.div>
            <Badge variant="warning" size="md">Reto del Día</Badge>
            <h1 className="text-3xl font-heading font-bold text-surface-900 mt-4">Iniciar Reto Diario</h1>
            <p className="text-surface-700 mt-2 max-w-md mx-auto">
              Completa el reto de hoy para mantener tu racha y ganar recompensas especiales.
            </p>
          </div>
        </FadeInView>

        <FadeInView delay={0.2}>
          <Card className="mt-8">
            <div className="text-center py-4">
              <h2 className="font-heading font-bold text-xl text-surface-900 mb-6">Detalles del reto</h2>
              <div className="grid grid-cols-3 gap-6">
                {[
                  { icon: BookOpen, label: 'Preguntas', value: '8' },
                  { icon: Clock, label: 'Tiempo', value: '15 min' },
                  { icon: Zap, label: 'Recompensa', value: '120 XP' },
                ].map((d, i) => (
                  <div key={i}>
                    <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mx-auto mb-2">
                      <d.icon className="w-6 h-6 text-primary-500" />
                    </div>
                    <p className="text-2xl font-heading font-bold text-surface-900">{d.value}</p>
                    <p className="text-xs text-surface-600 mt-0.5">{d.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </FadeInView>

        <FadeInView delay={0.3}>
          <Card className="mt-4 bg-primary-50/50 border-primary-200/30">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-primary-500 mt-0.5" />
              <div>
                <p className="font-heading font-semibold text-sm text-primary-700">Reto adaptativo</p>
                <p className="text-sm text-primary-600 mt-1">
                  Las preguntas se adaptan a tu nivel. Si aciertas, la dificultad sube. Si fallas, recibes explicaciones.
                </p>
              </div>
            </div>
          </Card>
        </FadeInView>

        <FadeInView delay={0.4}>
          <div className="mt-8 text-center">
            <Link to="/practica">
              <Button size="lg" icon={Flame} iconRight={ArrowRight} className="w-full sm:w-auto">
                ¡Comenzar reto!
              </Button>
            </Link>
            <p className="text-xs text-surface-600 mt-3">
              🔥 Racha actual: <strong className="text-amber-500">7 días</strong>
            </p>
          </div>
        </FadeInView>
      </div>
    </PageTransition>
  );
}
