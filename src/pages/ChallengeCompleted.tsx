import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Star, Zap, ArrowRight, PartyPopper, Home } from 'lucide-react';
import { Card, Badge, Button } from '../components/ui';
import { PageTransition, FadeInView } from '../lib/animations';

export default function ChallengeCompleted() {
  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center">
          {/* Confetti-like animation */}
          <motion.div className="relative inline-block">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0.5],
                  x: [0, (Math.random() - 0.5) * 120],
                  y: [0, (Math.random() - 0.5) * 120],
                }}
                transition={{ duration: 1.5, delay: i * 0.1, ease: 'easeOut' }}
                className={`absolute w-3 h-3 rounded-full ${
                  ['bg-amber-400', 'bg-primary-400', 'bg-tertiary-400', 'bg-violet-400', 'bg-rose-400'][i % 5]
                }`}
                style={{ top: '50%', left: '50%' }}
              />
            ))}
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.3 }}
              className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-2xl"
            >
              <Trophy className="w-12 h-12 text-white" />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h1 className="text-3xl font-heading font-bold text-surface-900 mt-8">¡Reto Completado!</h1>
            <p className="text-surface-700 mt-2">Has demostrado gran dedicación. ¡Sigue así!</p>
          </motion.div>

          {/* Score card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, type: 'spring' }}
          >
            <Card className="mt-8 inline-block">
              <div className="grid grid-cols-3 gap-8 px-4">
                {[
                  { icon: Star, label: 'Puntaje', value: '85%', color: 'text-amber-500' },
                  { icon: Zap, label: 'XP ganados', value: '+150', color: 'text-violet-500' },
                  { icon: PartyPopper, label: 'Racha', value: '8 días', color: 'text-red-500' },
                ].map((s, i) => (
                  <div key={i} className="text-center">
                    <s.icon className={`w-6 h-6 mx-auto mb-1 ${s.color}`} />
                    <p className="text-2xl font-heading font-bold text-surface-900">{s.value}</p>
                    <p className="text-xs text-surface-600">{s.label}</p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-8 flex justify-center gap-3"
          >
            <Link to="/retos">
              <Button variant="secondary" icon={Home}>Volver a retos</Button>
            </Link>
            <Link to="/ruta">
              <Button iconRight={ArrowRight}>Ver mi progreso</Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
