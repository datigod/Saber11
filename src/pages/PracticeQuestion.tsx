import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ChevronRight, BookOpen, CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import { Card, Badge, Button, ProgressBar } from '../components/ui';
import { PageTransition } from '../lib/animations';

const questionsList = [
  {
    id: 1,
    category: 'Lectura Crítica',
    text: 'Según el texto, ¿cuál es la principal razón por la que el autor argumenta que la educación pública necesita una reforma estructural?',
    context: '"La educación pública en Colombia enfrenta desafíos que van más allá del presupuesto. Se trata de repensar los modelos pedagógicos, la formación docente y el acceso equitativo a recursos tecnológicos. Sin estos cambios, las brechas seguirán ampliándose."',
    options: [
      { id: 'A', text: 'El presupuesto es insuficiente para cubrir las necesidades básicas.' },
      { id: 'B', text: 'Los cambios necesarios abarcan múltiples dimensiones del sistema educativo.' },
      { id: 'C', text: 'La tecnología es el único factor determinante en la calidad educativa.' },
      { id: 'D', text: 'Los docentes no están preparados para enseñar en escuelas públicas.' },
    ],
    correct: 'B',
    explanation: 'El autor menciona explícitamente que los desafíos "van más allá del presupuesto" e incluyen modelos pedagógicos, formación docente y acceso tecnológico, lo que indica un enfoque multidimensional.',
  },
  {
    id: 2,
    category: 'Matemáticas',
    text: 'Si el puntaje promedio de Matemáticas a nivel nacional es de 52, y un colegio obtuvo 58 con una desviación estándar de 4. ¿Cuántas desviaciones estándar por encima del promedio está el colegio?',
    context: 'El análisis de resultados estandarizados permite ubicar el rendimiento de una institución frente a la media nacional.',
    options: [
      { id: 'A', text: '1.0' },
      { id: 'B', text: '1.5' },
      { id: 'C', text: '2.0' },
      { id: 'D', text: '0.5' },
    ],
    correct: 'B',
    explanation: 'La diferencia es 58 - 52 = 6 puntos. Si una desviación estándar es 4, entonces 6 / 4 = 1.5 desviaciones estándar por encima.',
  },
  {
    id: 3,
    category: 'Ciencias Naturales',
    text: '¿Cuál es la función principal de los cloroplastos en las células vegetales?',
    context: 'Las células vegetales tienen orgánulos especializados que no se encuentran en células animales, adaptados a las necesidades específicas de los organismos autótrofos.',
    options: [
      { id: 'A', text: 'Generar energía a partir de la respiración celular.' },
      { id: 'B', text: 'Almacenar agua y nutrientes para la planta.' },
      { id: 'C', text: 'Convertir la energía solar en azúcares mediante la fotosíntesis.' },
      { id: 'D', text: 'Proteger la célula mediante una pared rígida.' },
    ],
    correct: 'C',
    explanation: 'Los cloroplastos contienen clorofila y son el sitio principal donde ocurre la fotosíntesis, convirtiendo la energía lumínica en energía química (azúcares).',
  }
];

export default function PracticeQuestion() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const question = questionsList[currentIndex];
  const isLastQuestion = currentIndex === questionsList.length - 1;

  const handleAnswer = () => {
    if (selected) {
      setAnswered(true);
      if (selected === question.correct) {
        setScore(score + 1);
      }
    }
  };

  const handleNext = () => {
    if (isLastQuestion) return;
    setCurrentIndex(prev => prev + 1);
    setSelected(null);
    setAnswered(false);
  };

  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Badge variant="primary">{question.category}</Badge>
          <div className="flex items-center gap-3">
            <span className="text-sm text-surface-600 flex items-center gap-1">
              <Clock className="w-4 h-4" /> 12:34
            </span>
            <span className="text-sm font-medium text-surface-800">
              {currentIndex + 1} / {questionsList.length}
            </span>
          </div>
        </div>

        <ProgressBar value={currentIndex + 1} max={questionsList.length} showValue={false} size="sm" color="primary" />

        {/* Context */}
        <Card className="mt-6 bg-surface-100/50 border-surface-300/50">
          <div className="flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-surface-800 italic leading-relaxed">{question.context}</p>
          </div>
        </Card>

        {/* Question */}
        <div className="mt-6">
          <h2 className="text-lg font-heading font-bold text-surface-900 leading-snug">{question.text}</h2>
        </div>

        {/* Options */}
        <div className="mt-6 space-y-3">
          {question.options.map((opt) => {
            const isCorrect = answered && opt.id === question.correct;
            const isWrong = answered && opt.id === selected && opt.id !== question.correct;
            const isSelected = selected === opt.id;

            return (
              <motion.button
                key={opt.id}
                whileHover={!answered ? { scale: 1.01 } : {}}
                whileTap={!answered ? { scale: 0.99 } : {}}
                onClick={() => !answered && setSelected(opt.id)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                  isCorrect ? 'border-tertiary-400 bg-tertiary-50' :
                  isWrong ? 'border-error bg-red-50' :
                  isSelected && !answered ? 'border-primary-500 bg-primary-50' :
                  'border-surface-300 bg-white hover:border-primary-300 hover:bg-primary-50/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-heading font-bold text-sm flex-shrink-0 ${
                    isCorrect ? 'bg-tertiary-400 text-white' :
                    isWrong ? 'bg-error text-white' :
                    isSelected ? 'bg-primary-500 text-white' :
                    'bg-surface-200 text-surface-700'
                  }`}>
                    {isCorrect ? <CheckCircle className="w-4 h-4" /> :
                     isWrong ? <XCircle className="w-4 h-4" /> :
                     opt.id}
                  </div>
                  <p className="text-sm text-surface-900 pt-1">{opt.text}</p>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Explanation */}
        <AnimatePresence>
          {answered && (
            <motion.div
              initial={{ opacity: 0, y: 20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="mt-6"
            >
              <Card accent={selected === question.correct ? 'success' : 'primary'} className="bg-surface-50">
                <div className="flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-heading font-semibold text-sm text-surface-900">
                      {selected === question.correct ? '✅ ¡Correcto!' : '❌ Incorrecto'}
                    </p>
                    <p className="text-sm text-surface-700 mt-1">{question.explanation}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="mt-6 flex justify-between">
          {!answered ? (
            <Button onClick={handleAnswer} disabled={!selected} iconRight={ChevronRight} className="ml-auto">
              Responder
            </Button>
          ) : (
            <div className="flex gap-3 ml-auto">
              {isLastQuestion ? (
                <Link to="/retos/completado">
                  <Button iconRight={ChevronRight}>Finalizar Reto</Button>
                </Link>
              ) : (
                <Button onClick={handleNext} iconRight={ChevronRight}>Siguiente pregunta</Button>
              )}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
