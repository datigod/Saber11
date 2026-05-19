import { Link } from 'react-router-dom';
import { useMemo, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, Clock, Flame, BookOpen, Calculator, ChevronRight, 
  Sparkles, Send, Bot, User, RefreshCw, HelpCircle, GraduationCap 
} from 'lucide-react';
import { Card, StatCard, Badge, ProgressBar, Button, SectionHeader } from '../components/ui';
import { PageTransition, FadeInView, staggerContainer, staggerItem } from '../lib/animations';

type RouteProfile = {
  title: string;
  goals: { label: string; current: number; total: number; color: 'primary' | 'gradient' }[];
  recommendations: { icon: typeof BookOpen; title: string; desc: string; priority: string }[];
  trend: string;
};

type Message = {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: Date;
};

const getRouteProfile = (score: number): RouteProfile => {
  if (score < 260) {
    return {
      title: 'Ruta de fortalecimiento base',
      trend: '+25 pts esperados',
      goals: [
        { label: 'Lectura Crítica', current: 2, total: 5, color: 'primary' },
        { label: 'Matemáticas', current: 1, total: 4, color: 'primary' },
        { label: 'Retos completados', current: 4, total: 10, color: 'gradient' },
      ],
      recommendations: [
        { icon: BookOpen, title: 'Comprensión de Textos Cortos', desc: 'Identifica ideas principales y vocabulario básico.', priority: 'Alta' },
        { icon: Calculator, title: 'Operaciones Básicas', desc: 'Practica regla de tres, porcentajes y operaciones aritméticas esenciales.', priority: 'Alta' },
        { icon: Target, title: 'Micro-reto diario', desc: 'Completa un reto corto para consolidar hábitos.', priority: 'Sugerida' },
      ],
    };
  }

  if (score < 330) {
    return {
      title: 'Ruta de consolidación',
      trend: '+15 pts esperados',
      goals: [
        { label: 'Lectura Crítica', current: 3, total: 5, color: 'primary' },
        { label: 'Matemáticas', current: 2, total: 4, color: 'primary' },
        { label: 'Retos completados', current: 7, total: 10, color: 'gradient' },
      ],
      recommendations: [
        { icon: BookOpen, title: 'Refuerza inferencias', desc: 'Practica lectura argumentativa para subir precisión.', priority: 'Alta' },
        { icon: Calculator, title: 'Repasa álgebra', desc: 'Sube velocidad y exactitud en problemas de modelación.', priority: 'Media' },
        { icon: Target, title: 'Reto semanal', desc: 'Cubre las áreas con mayor potencial de mejora.', priority: 'Sugerida' },
      ],
    };
  }

  return {
    title: 'Ruta de alto rendimiento',
    trend: '+8 pts esperados',
    goals: [
      { label: 'Lectura Crítica', current: 4, total: 5, color: 'primary' },
      { label: 'Matemáticas', current: 3, total: 4, color: 'primary' },
      { label: 'Retos completados', current: 8, total: 10, color: 'gradient' },
    ],
    recommendations: [
      { icon: BookOpen, title: 'Textos complejos', desc: 'Entrena con preguntas de alta dificultad y tiempo limitado.', priority: 'Alta' },
      { icon: Calculator, title: 'Resolución avanzada', desc: 'Trabaja estrategias de eliminación y verificación rápida.', priority: 'Media' },
      { icon: Target, title: 'Simulacro completo', desc: 'Evalúa consistencia y administra mejor el tiempo.', priority: 'Sugerida' },
    ],
  };
};

export default function MyRoute() {
  const predictedScore = useMemo(() => {
    const raw = localStorage.getItem('saber11_prediction');
    if (!raw) return 285;
    try {
      const parsed = JSON.parse(raw) as { score?: number };
      return typeof parsed.score === 'number' ? parsed.score : 285;
    } catch {
      return 285;
    }
  }, []);

  const studentFeatures = useMemo(() => {
    const raw = localStorage.getItem('saber11_features');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }, []);

  const profile = useMemo(() => getRouteProfile(predictedScore), [predictedScore]);

  // AI Tutor States
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Inicializar conversación con el Tutor IA
  useEffect(() => {
    setIsTyping(true);
    const timer = setTimeout(() => {
      const name = studentFeatures?.ESTU_GENERO === 'F' ? 'estudiante' : 'estudiante';
      const welcomeText = `¡Hola! Soy tu **Tutor Académico Inteligente**. 🧠✨

He analizado los resultados de la predicción y veo que tu puntaje estimado es de **${predictedScore} puntos**.

Basado en tu perfil escolar y familiar, he diseñado tu **${profile.title}**. ¿Quieres que te explique detalladamente qué factores influyeron en tu puntaje o prefieres que armemos un plan de estudio acelerado?`;

      setMessages([
        {
          id: 'welcome',
          sender: 'ai',
          text: welcomeText,
          timestamp: new Date()
        }
      ]);
      setIsTyping(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [predictedScore, studentFeatures, profile.title]);

  // Auto Scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const generateAIResponse = (userText: string): string => {
    const text = userText.toLowerCase();

    // 1. Explicación de la estimación
    if (text.includes('explicaci') || text.includes('factores') || text.includes('estimaci') || text.includes('por qué') || text.includes('por que')) {
      const colegNaturaleza = studentFeatures?.COLE_NATURALEZA || 'Oficial';
      const internet = studentFeatures?.FAMI_TIENEINTERNET || 'SI';
      const pc = studentFeatures?.FAMI_TIENECOMPUTADOR || 'SI';
      const coleMean = studentFeatures?.COLE_MEAN_SCORE || 250;

      return `### 🔍 Diagnóstico del Modelo Predictivo (CatBoost)

Tu estimación de **${predictedScore} puntos** se calculó analizando múltiples variables. Aquí están los factores clave que el modelo identificó:

1. **Contexto de tu Institución (Impacto: Alto):** Tu colegio tiene un promedio de referencia de **${coleMean} puntos**. El modelo utiliza este dato como ancla base.
2. **Entorno Digital (Impacto: Medio-Alto):** Tienes acceso a **Internet: ${internet}** y **Computador: ${pc}**. Contar con estas herramientas digitales según nuestro modelo de IA suma una ventaja de aproximadamente **+15 a +25 puntos** frente a estudiantes que no disponen de ellos, al facilitar el acceso a simulacros en línea.
3. **Naturaleza Escolar (Impacto: Medio):** Estudiar en un colegio de sector **${colegNaturaleza}** ajusta la curva estadística nacional.

**💡 Mi recomendación de Tutor:** Aunque el entorno socioeducativo influye estadísticamente en los modelos de predicción masivos, el estudio activo e individual en la plataforma puede **romper el promedio del colegio y aumentar tu resultado hasta en +80 puntos**. ¡Vamos a lograrlo!`;
    }

    // 2. Subir puntos en matemáticas
    if (text.includes('matemat') || text.includes('mate') || text.includes('números') || text.includes('calculo')) {
      return `### 📐 Plan de Aceleración de Matemáticas (+30 puntos)

Para dar un salto gigante en Matemáticas de cara a la prueba Saber 11, enfoquémonos en los tres pilares evaluados por el ICFES:

1. **Interpretación y Representación (40% de la prueba):**
   * **Estrategia:** No te limites a resolver ecuaciones. Practica interpretar gráficos de barras, circulares y tablas de datos. ¡Siempre hay de 3 a 5 preguntas de pura lectura de gráficos!
2. **Formulación y Ejecución (45% de la prueba):**
   * **Estrategia:** Domina la **regla de tres simple y compuesta**, el **cálculo de porcentajes** y los conceptos básicos de probabilidad. Son las herramientas más rentables para responder rápido.
3. **Razonamiento Cuantitativo:**
   * **Estrategia:** Aprende a descartar opciones absurdas. Por ejemplo, en preguntas de geometría, muchas respuestas pueden eliminarse simplemente comparando proporciones visuales.

**🛠️ Acción inmediata:** Ve a la sección **Práctica** y selecciona el módulo de **Matemáticas: Estadística Básica**.`;
    }

    // 3. Plan de Lectura Crítica
    if (text.includes('lectura') || text.includes('lenguaje') || text.includes('escribir') || text.includes('textos')) {
      return `### 📚 Método de Lectura Crítica de Alto Rendimiento

La prueba de Lectura Crítica requiere resistencia física y mental. El plan ideal para tu nivel consta de estas fases:

1. **Fase 1: Lectura Activa (Durante el simulacro):**
   * No leas el texto de corrido de una sola vez. **Primero lee las preguntas**. Así sabrás exactamente qué buscar (ej. opiniones del autor, contradicciones, palabras clave) cuando leas el texto.
2. **Fase 2: Identificación de Tipos de Texto:**
   * *Continuos (Novelas, Ensayos):* Busca la tesis principal en el primer y último párrafo.
   * *Discontinuos (Caricaturas, Infografías):* Analiza la relación entre el dibujo/gráfico y las palabras. El humor o la ironía suelen ser la clave de la pregunta.
3. **Fase 3: La Técnica de descarte lógico:**
   * Las opciones incorrectas suelen ser "demasiado extremas" (usan palabras como *siempre*, *nunca*, *absolutamente*) o mezclan información del texto pero sacan conclusiones falsas.

**🎯 Reto para esta semana:** Dedica **15 minutos diarios** a leer editoriales de periódicos de opinión y trata de resumir la postura del autor en una sola frase. ¡Esto entrenará tu cerebro al instante!`;
    }

    // 4. Pocos recursos o tiempo
    if (text.includes('recurso') || text.includes('tiempo') || text.includes('horario') || text.includes('organizar') || text.includes('estudiar')) {
      const pc = studentFeatures?.FAMI_TIENECOMPUTADOR || 'SI';
      const tieneInternet = studentFeatures?.FAMI_TIENEINTERNET || 'SI';

      let extraTip = "";
      if (pc === 'NO' || tieneInternet === 'NO') {
        extraTip = `* **Uso Offline:** Puedes descargar las guías PDF del ICFES cuando tengas red pública o en el colegio, y resolverlas en tu celular en modo avión. ¡El estudio sin distracciones es 2 veces más rápido!`;
      } else {
        extraTip = `* **Bloques Pomodoro:** Estudia en bloques de 25 minutos muy enfocados, seguidos de 5 minutos de descanso. Es ideal si estudias después de la jornada escolar escolar o trabajas.`;
      }

      return `### ⏰ Planificación Estratégica de Tiempo y Recursos

No necesitas estudiar 6 horas al día para obtener un excelente puntaje. Lo que necesitas es **consistencia**. Aquí está tu micro-esquema semanal adaptado:

* **Lunes a Viernes (El hábito):** Dedica solo **20 minutos diarios** a resolver el **Reto Diario** en la plataforma. Esto mantendrá tu cerebro activo y construirá memoria a largo plazo.
* **Sábados (El análisis):** Dedica **1 hora** a revisar las preguntas que respondiste mal durante la semana. Entender *por qué* te equivocaste vale más que responder 100 preguntas nuevas de forma automática.
${extraTip}
* **Bibliotecas Públicas / Colegios:** Aprovecha las herramientas de simulacro de la plataforma que guardan tu progreso. Todo lo que hagas en tu celular se guardará automáticamente en tu perfil.`;
    }

    // 5. Default/Custom
    return `¡Excelente pregunta! Como tu **Tutor Académico IA**, te sugiero abordar esto con una estrategia paso a paso. 

Para darte una respuesta de precisión milimétrica:
* ¿Te gustaría que nos enfoquemos en mejorar alguna materia en específico (Matemáticas, Lectura Crítica, Ciencias Naturales, Sociales o Inglés)?
* ¿O prefieres que hagamos un simulacro interactivo rápido con preguntas reales aquí mismo?

Dime cuál es tu materia más difícil y te daré un truco inmediato para resolver sus preguntas difíciles. 🚀`;
  };

  const handleSendMessage = (textToSend = inputValue) => {
    const trimmed = textToSend.trim();
    if (!trimmed) return;

    // Agregar mensaje del usuario
    const userMsg: Message = {
      id: Math.random().toString(),
      sender: 'user',
      text: trimmed,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simular retraso de la IA (efecto premium de escritura)
    setTimeout(() => {
      const aiResponse = generateAIResponse(trimmed);
      setMessages(prev => [...prev, {
        id: Math.random().toString(),
        sender: 'ai',
        text: aiResponse,
        timestamp: new Date()
      }]);
      setIsTyping(false);
    }, 1200);
  };

  const quickQuestions = [
    { text: '🔍 ¿Por qué tengo este puntaje estimado?', short: 'Explicación detallada de mi estimación' },
    { text: '📐 ¿Cómo subo +30 pts en Matemáticas?', short: 'Estrategias clave para Matemáticas' },
    { text: '📚 Plan de Lectura Crítica', short: 'Plan estructurado de Lectura' },
    { text: '⏰ ¿Cómo organizo mi horario de estudio?', short: 'Organizar mi tiempo de estudio' },
  ];

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Header Section */}
        <FadeInView>
          <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <Badge variant="primary" className="mb-2">Mi Ruta Dinámica</Badge>
              <h1 className="text-3xl font-heading font-bold text-surface-900 mt-2">{profile.title}</h1>
              <p className="text-surface-700 mt-1">Plan de estudio personalizado actualizado en tiempo real según tu predicción actual.</p>
            </div>
            
            <Link to="/onboarding">
              <Button variant="secondary" size="sm" iconRight={RefreshCw}>Recalcular Proyección</Button>
            </Link>
          </div>
        </FadeInView>

        {/* Stats Grid */}
        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Días activos', value: '12', icon: Flame, trend: { value: '+3 esta semana', positive: true }, color: 'warning' },
            { label: 'Puntaje estimado', value: `${predictedScore}`, icon: Target, trend: { value: profile.trend, positive: true }, color: 'primary' },
            { label: 'Unidades completas', value: '18', icon: BookOpen, color: 'success' },
            { label: 'Tiempo de estudio', value: '8.5h', icon: Clock, color: 'secondary' },
          ].map((s, i) => (
            <motion.div key={i} variants={staggerItem}>
              <StatCard {...s} />
            </motion.div>
          ))}
        </motion.div>

        {/* Goals & Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          {/* Metas */}
          <FadeInView className="md:col-span-5 h-full">
            <Card className="h-full">
              <SectionHeader title="Metas Semanales" subtitle="Ajustadas a tu proyección de puntaje" />
              <div className="space-y-6 mt-4">
                {profile.goals.map((g, i) => (
                  <div key={i}>
                    <ProgressBar value={g.current} max={g.total} label={g.label} color={g.color} />
                  </div>
                ))}
              </div>
            </Card>
          </FadeInView>

          {/* Recomendaciones */}
          <FadeInView delay={0.1} className="md:col-span-7 h-full">
            <Card className="h-full">
              <SectionHeader
                title="Acciones Recomendadas"
                subtitle="Sugerencias del modelo inteligente"
              />
              <div className="space-y-4 mt-4">
                {profile.recommendations.map((r, i) => (
                  <div key={i} className="flex items-start gap-4 p-3 rounded-xl border border-surface-200 bg-surface-50">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                      <r.icon className="w-5 h-5 text-primary-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-heading font-semibold text-surface-900 text-sm truncate">{r.title}</h4>
                        <Badge variant={i === 0 ? 'error' : i === 1 ? 'warning' : 'neutral'} size="sm">{r.priority}</Badge>
                      </div>
                      <p className="text-xs text-surface-700 mt-1">{r.desc}</p>
                    </div>
                    <Link to="/practica">
                      <Button variant="ghost" size="sm" className="px-2.5 py-1 text-xs">Entrenar</Button>
                    </Link>
                  </div>
                ))}
              </div>
            </Card>
          </FadeInView>
        </div>

        {/* AI Tutor Chatbot Integration (premium & stunning visual layout) */}
        <FadeInView delay={0.2}>
          <div className="relative rounded-3xl border border-primary-200/60 shadow-xl overflow-hidden bg-white mb-8">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-primary-500 via-indigo-500 to-primary-600"></div>
            
            {/* AI Coach Header */}
            <div className="p-5 border-b border-surface-200 flex items-center justify-between bg-gradient-to-b from-primary-50/50 to-white">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-primary-500 to-indigo-600 flex items-center justify-center text-white shadow-md relative">
                  <Bot className="w-6 h-6 animate-pulse" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-success-400 border-2 border-white"></span>
                </div>
                <div>
                  <h3 className="font-heading font-bold text-surface-900 flex items-center gap-1.5">
                    Orientador Académico IA
                    <Badge variant="primary" size="sm" className="bg-primary-100 text-primary-800 font-bold border-none">INTEGRADO</Badge>
                  </h3>
                  <p className="text-xs text-surface-500">Coach personalizado basado en tu modelo predictivo CatBoost</p>
                </div>
              </div>
              <div title="El Tutor analiza tus datos socioeducativos para darte las mejores estrategias" className="cursor-help">
                <HelpCircle className="w-5 h-5 text-surface-400 hover:text-primary-500 transition-colors" />
              </div>
            </div>

            {/* Chat Messages Log */}
            <div className="h-96 overflow-y-auto p-6 bg-surface-50/30 flex flex-col gap-4">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}
                  >
                    {/* Icon */}
                    <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center shadow-sm text-xs font-semibold ${
                      msg.sender === 'user' ? 'bg-indigo-100 text-indigo-700' : 'bg-primary-500 text-white'
                    }`}>
                      {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>

                    {/* Speech bubble */}
                    <div className={`p-4 rounded-2xl shadow-sm border text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-white border-primary-500 rounded-tr-none'
                        : 'bg-white text-surface-800 border-surface-200 rounded-tl-none font-normal'
                    }`}>
                      {/* Formateador básico de markdown para títulos y negrita */}
                      <div className="prose prose-sm max-w-none break-words">
                        {msg.text.split('\n').map((line, idx) => {
                          let formattedLine = line;
                          // Encabezados h3
                          if (formattedLine.startsWith('### ')) {
                            return <h4 key={idx} className="font-bold text-surface-900 mt-2 mb-1.5 flex items-center gap-1.5">{formattedLine.replace('### ', '')}</h4>;
                          }
                          // Negritas y listas
                          const boldRegex = /\*\*(.*?)\*\*/g;
                          const parts = [];
                          let lastIdx = 0;
                          let match;
                          while ((match = boldRegex.exec(formattedLine)) !== null) {
                            if (match.index > lastIdx) {
                              parts.push(formattedLine.substring(lastIdx, match.index));
                            }
                            parts.push(<strong key={match.index} className={msg.sender === 'user' ? 'text-white font-extrabold' : 'text-primary-800 font-bold'}>{match[1]}</strong>);
                            lastIdx = boldRegex.lastIndex;
                          }
                          if (lastIdx < formattedLine.length) {
                            parts.push(formattedLine.substring(lastIdx));
                          }
                          
                          const displayContent = parts.length > 0 ? parts : formattedLine;

                          if (formattedLine.startsWith('* ') || formattedLine.startsWith('- ')) {
                            return <li key={idx} className="ml-4 list-disc pl-1 py-0.5">{displayContent}</li>;
                          }
                          if (/^\d+\./.test(formattedLine)) {
                            return <div key={idx} className="ml-2 pl-1 py-1 font-medium">{displayContent}</div>;
                          }
                          return <p key={idx} className="mb-1.5 last:mb-0 min-h-[0.5rem]">{displayContent}</p>;
                        })}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex gap-3 self-start max-w-[80%]"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="px-4 py-3 bg-white border border-surface-200 rounded-2xl rounded-tl-none flex items-center gap-1.5 shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts Panel */}
            <div className="px-6 py-4 bg-surface-50 border-t border-surface-200">
              <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2.5 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-primary-500" /> Consultar rápidamente:
              </p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(q.short)}
                    className="px-3.5 py-2 text-xs font-medium text-surface-700 bg-white border border-surface-200 rounded-xl hover:border-primary-400 hover:text-primary-600 transition-all shadow-sm active:scale-95"
                  >
                    {q.text}
                  </button>
                ))}
              </div>
            </div>

            {/* Message Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-4 bg-white border-t border-surface-200 flex gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Escribe una pregunta a tu Tutor Académico IA... (ej: ¿cómo mejoro en inglés?)"
                className="flex-1 px-4 py-3 text-sm border border-surface-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 bg-surface-50/50 hover:bg-white focus:bg-white transition-all"
              />
              <Button type="submit" variant="primary" className="rounded-xl px-5 shadow-sm shrink-0" iconRight={Send}>
                Preguntar
              </Button>
            </form>
          </div>
        </FadeInView>

      </div>
    </PageTransition>
  );
}
