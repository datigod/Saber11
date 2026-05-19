import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, GraduationCap, Rocket, PlayCircle, LineChart, BrainCircuit, 
  Flame, Calculator, BookOpen, FlaskConical, Globe2, Target, TrendingUp, 
  Users, Sparkles, ClipboardCheck, Route, BarChart3
} from 'lucide-react';
import { Button } from '../components/ui';
import { FadeInView } from '../lib/animations';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-surface-50 to-white -z-20" />
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-primary-200/20 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-success-200/15 rounded-full blur-3xl -z-10" />

        <div className="max-w-[1280px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Copy & CTA */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-col gap-6"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1155F2]/10 text-[#1155F2] text-sm font-semibold border border-[#1155F2]/20 self-start">
                <GraduationCap className="w-4 h-4" />
                Tu preparación, tu futuro
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold text-[#0B2D6B] leading-[1.15]">
                Prepárate mejor para <span className="text-[#1155F2]">Saber 11</span> con una ruta personalizada
              </h1>
              
              <p className="text-lg text-surface-600 max-w-lg leading-relaxed">
                Construye un plan de estudio a tu medida según tu contexto, tus recursos y tus metas. Accede a recursos de calidad, acompañamiento inteligente y seguimiento constante.
              </p>
              
              <div className="flex flex-wrap items-center gap-4 mt-2">
                <Link to="/onboarding">
                  <Button size="lg" className="bg-[#1155F2] hover:bg-[#0B2D6B] text-white shadow-lg shadow-[#1155F2]/25">
                    <Rocket className="w-5 h-5 mr-2" />
                    Comenzar diagnóstico
                  </Button>
                </Link>
                <Link to="/sobre">
                  <Button variant="secondary" size="lg" className="border-surface-200 hover:bg-surface-50 bg-white">
                    <PlayCircle className="w-5 h-5 mr-2 text-[#1155F2]" />
                    Conocer el proyecto
                  </Button>
                </Link>
              </div>
              
              <div className="flex flex-wrap items-center gap-6 mt-6">
                <div className="flex items-center gap-2 text-sm font-medium text-surface-600">
                  <Sparkles className="w-4 h-4 text-[#8DD400]" /> Plan personalizado
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-surface-600">
                  <LineChart className="w-4 h-4 text-[#22C5F0]" /> Seguimiento continuo
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-surface-600">
                  <BrainCircuit className="w-4 h-4 text-purple-500" /> Modelo Predictivo
                </div>
              </div>
            </motion.div>

            {/* Right Column: Dashboard Mockup */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              className="relative lg:h-[600px] flex items-center justify-center w-full"
            >
              {/* Decorative blobs for mockup */}
              <div className="absolute top-10 right-10 w-72 h-72 bg-[#8DD400]/20 rounded-full blur-3xl -z-10" />
              <div className="absolute bottom-10 left-10 w-72 h-72 bg-[#1155F2]/20 rounded-full blur-3xl -z-10" />
              
              {/* Main Card */}
              <div className="w-full max-w-[560px] bg-white rounded-[2rem] shadow-2xl border border-surface-100/50 p-6 relative">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-heading font-extrabold text-xl text-surface-900">¡Hola, Valentina! 👋</h3>
                    <p className="text-sm text-surface-500">Este es tu progreso esta semana.</p>
                  </div>
                  <div className="flex items-center gap-3 bg-surface-50 rounded-2xl p-1.5 pr-3 border border-surface-100">
                    <div className="flex items-center gap-2 bg-white rounded-xl px-2 py-1 shadow-sm border border-surface-100/50">
                      <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                      <div>
                        <div className="text-sm font-bold text-surface-900 leading-none">12</div>
                        <div className="text-[9px] text-surface-500 uppercase tracking-wider font-semibold">Días de racha</div>
                      </div>
                    </div>
                    <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Avatar" className="w-9 h-9 rounded-full object-cover" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Left Column: Progress */}
                  <div className="bg-surface-50/50 rounded-2xl p-4 border border-surface-100">
                    <h4 className="text-sm font-semibold text-surface-900 mb-4">Tu progreso por área</h4>
                    <div className="space-y-4">
                      {/* Math */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-[#1155F2] flex items-center justify-center">
                              <Calculator className="w-3.5 h-3.5 text-white" />
                            </div>
                            <span className="text-xs font-medium text-surface-700">Matemáticas</span>
                          </div>
                          <span className="text-xs font-bold text-surface-900">78%</span>
                        </div>
                        <div className="h-1.5 bg-surface-200 rounded-full w-full"><div className="h-full bg-[#1155F2] rounded-full w-[78%]"></div></div>
                      </div>
                      {/* Reading */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-[#8DD400] flex items-center justify-center">
                              <BookOpen className="w-3.5 h-3.5 text-white" />
                            </div>
                            <span className="text-xs font-medium text-surface-700">Lectura Crítica</span>
                          </div>
                          <span className="text-xs font-bold text-surface-900">65%</span>
                        </div>
                        <div className="h-1.5 bg-surface-200 rounded-full w-full"><div className="h-full bg-[#8DD400] rounded-full w-[65%]"></div></div>
                      </div>
                      {/* Science */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-[#22C5F0] flex items-center justify-center">
                              <FlaskConical className="w-3.5 h-3.5 text-white" />
                            </div>
                            <span className="text-xs font-medium text-surface-700">Ciencias Naturales</span>
                          </div>
                          <span className="text-xs font-bold text-surface-900">72%</span>
                        </div>
                        <div className="h-1.5 bg-surface-200 rounded-full w-full"><div className="h-full bg-[#22C5F0] rounded-full w-[72%]"></div></div>
                      </div>
                      {/* English */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-purple-500 flex items-center justify-center">
                              <Globe2 className="w-3.5 h-3.5 text-white" />
                            </div>
                            <span className="text-xs font-medium text-surface-700">Inglés</span>
                          </div>
                          <span className="text-xs font-bold text-surface-900">58%</span>
                        </div>
                        <div className="h-1.5 bg-surface-200 rounded-full w-full"><div className="h-full bg-purple-500 rounded-full w-[58%]"></div></div>
                      </div>
                    </div>
                    <Link to="/mapa" className="block mt-4 text-xs font-semibold text-[#1155F2] hover:underline">Ver detalle por competencias →</Link>
                  </div>

                  {/* Right Column: Goal & Estimate */}
                  <div className="flex flex-col gap-4">
                    {/* Weekly Goal */}
                    <div className="bg-white rounded-2xl p-4 border border-surface-100 shadow-sm flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-4 h-4 text-[#1155F2]" />
                        <h4 className="text-xs font-semibold text-surface-700">Meta semanal</h4>
                      </div>
                      <p className="text-xs text-surface-600 mb-2">Completa 15 actividades</p>
                      <div className="flex items-baseline gap-1 mb-2">
                        <span className="text-2xl font-bold text-[#1155F2]">11</span>
                        <span className="text-xs text-surface-500">/ 15</span>
                      </div>
                      <div className="h-1.5 bg-surface-100 rounded-full w-full mb-1"><div className="h-full bg-[#8DD400] rounded-full w-[73%]"></div></div>
                      <p className="text-[10px] text-surface-400">4 actividades restantes</p>
                    </div>

                    {/* Score Estimate */}
                    <div className="bg-white rounded-2xl p-4 border border-surface-100 shadow-sm flex-1 relative overflow-hidden">
                      <h4 className="text-[11px] font-semibold text-surface-700 mb-2">Puntaje estimado Saber 11 ⓘ</h4>
                      <div className="flex items-end justify-between mb-4">
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-heading font-extrabold text-[#0B2D6B]">329</span>
                          <span className="text-[10px] text-surface-500">/ 500</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-[#8DD400] flex items-center justify-end">↑ 28 pts</span>
                          <span className="text-[8px] text-surface-400 block mt-0.5">vs. diagnóstico inicial</span>
                        </div>
                      </div>
                      
                      {/* Sparkline Chart SVG */}
                      <div className="h-8 w-full relative mt-2 -mb-2 -mx-1">
                        <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-[105%] h-full overflow-visible">
                          {/* Gradient below line */}
                          <path d="M0 25 L20 20 L40 22 L60 15 L80 18 L100 5 L100 30 L0 30 Z" fill="url(#sparkline-gradient)" />
                          {/* Line */}
                          <path d="M0 25 L20 20 L40 22 L60 15 L80 18 L100 5" fill="none" stroke="#1155F2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <circle cx="0" cy="25" r="2" fill="#1155F2" />
                          <circle cx="20" cy="20" r="2" fill="#1155F2" />
                          <circle cx="40" cy="22" r="2" fill="#1155F2" />
                          <circle cx="60" cy="15" r="2" fill="#1155F2" />
                          <circle cx="80" cy="18" r="2" fill="#1155F2" />
                          <circle cx="100" cy="5" r="3" fill="white" stroke="#1155F2" strokeWidth="2" />
                          <defs>
                            <linearGradient id="sparkline-gradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#1155F2" stopOpacity="0.15" />
                              <stop offset="100%" stopColor="#1155F2" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Badges */}
                <motion.div 
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, type: 'spring' }}
                  className="absolute -top-5 right-4 sm:-top-6 sm:right-10 bg-white rounded-xl py-2 px-3 sm:px-4 shadow-xl shadow-surface-200/50 border border-surface-100 flex items-center gap-2 z-10"
                >
                  <TrendingUp className="w-4 h-4 text-[#1155F2]" />
                  <span className="text-xs sm:text-sm font-bold text-[#0B2D6B]">Progreso semanal</span>
                </motion.div>
                
                <motion.div 
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, type: 'spring' }}
                  className="absolute -bottom-4 left-4 sm:-bottom-5 sm:left-10 bg-white rounded-xl py-2 px-3 sm:px-4 shadow-xl shadow-surface-200/50 border border-surface-100 flex items-center gap-2 z-10"
                >
                  <Users className="w-5 h-5 text-[#1155F2]" />
                  <span className="text-[10px] sm:text-xs font-bold text-surface-700 leading-tight">Acompañamiento<br/>siempre contigo</span>
                </motion.div>

                <motion.div 
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.7, type: 'spring' }}
                  className="absolute top-1/2 -right-4 sm:-right-8 bg-white rounded-xl py-2 px-2 sm:px-3 shadow-xl shadow-surface-200/50 border border-surface-100 flex items-center flex-col gap-1 z-10"
                >
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  <span className="text-[9px] sm:text-[10px] font-bold text-surface-700 text-center leading-tight">Modelo<br/>Predictivo</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Así funciona tu camino hacia el éxito */}
      <section className="py-24 bg-white relative">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8">
          <FadeInView>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-[#0B2D6B]">
                Así funciona tu <span className="text-[#1155F2]">camino hacia el éxito</span>
              </h2>
            </div>
          </FadeInView>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <FadeInView delay={0.1}>
              <div className="bg-surface-50 rounded-3xl p-8 flex items-start gap-4 border border-surface-100 relative group overflow-hidden h-full">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#1155F2]/5 rounded-bl-full -z-10 transition-transform duration-500 group-hover:scale-[1.3] group-hover:bg-[#1155F2]/10 origin-top-right"></div>
                <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 border-4 border-[#1155F2]/10 group-hover:border-[#1155F2]/20 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-[#1155F2] flex items-center justify-center">
                    <ClipboardCheck className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="flex flex-col h-full">
                  <h3 className="font-heading font-bold text-[#0B2D6B] mb-2 text-lg">1. Diagnóstico inicial</h3>
                  <p className="text-sm text-surface-600 mb-6 leading-relaxed">
                    Evalúa tus conocimientos actuales y descubre tus fortalezas y áreas por mejorar de forma inmediata.
                  </p>
                  <Link to="/onboarding" className="mt-auto self-end w-8 h-8 rounded-full bg-[#1155F2] flex items-center justify-center hover:bg-[#0B2D6B] transition-colors cursor-pointer">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </Link>
                </div>
              </div>
            </FadeInView>

            {/* Step 2 */}
            <FadeInView delay={0.2}>
              <div className="bg-surface-50 rounded-3xl p-8 flex items-start gap-4 border border-surface-100 relative group overflow-hidden h-full">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#8DD400]/10 rounded-bl-full -z-10 transition-transform duration-500 group-hover:scale-[1.3] group-hover:bg-[#8DD400]/20 origin-top-right"></div>
                <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 border-4 border-[#8DD400]/20 group-hover:border-[#8DD400]/30 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-[#8DD400] flex items-center justify-center">
                    <Route className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="flex flex-col h-full">
                  <h3 className="font-heading font-bold text-success-700 mb-2 text-lg">2. Ruta de estudio</h3>
                  <p className="text-sm text-surface-600 mb-6 leading-relaxed">
                    Recibe un plan personalizado con contenidos, actividades y metas semanales claras y alcanzables.
                  </p>
                  <Link to="/ruta" className="mt-auto self-end w-8 h-8 rounded-full bg-[#8DD400] flex items-center justify-center hover:bg-success-600 transition-colors cursor-pointer">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </Link>
                </div>
              </div>
            </FadeInView>

            {/* Step 3 */}
            <FadeInView delay={0.3}>
              <div className="bg-surface-50 rounded-3xl p-8 flex items-start gap-4 border border-surface-100 relative group overflow-hidden h-full">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#22C5F0]/10 rounded-bl-full -z-10 transition-transform duration-500 group-hover:scale-[1.3] group-hover:bg-[#22C5F0]/20 origin-top-right"></div>
                <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 border-4 border-[#22C5F0]/20 group-hover:border-[#22C5F0]/30 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-[#22C5F0] flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="flex flex-col h-full">
                  <h3 className="font-heading font-bold text-cyan-800 mb-2 text-lg">3. Seguimiento de progreso</h3>
                  <p className="text-sm text-surface-600 mb-6 leading-relaxed">
                    Monitorea tu avance, ajusta tu plan y mejora constantemente con datos claros del modelo predictivo.
                  </p>
                  <Link to="/perfil" className="mt-auto self-end w-8 h-8 rounded-full bg-[#22C5F0] flex items-center justify-center hover:bg-cyan-500 transition-colors cursor-pointer">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </Link>
                </div>
              </div>
            </FadeInView>
          </div>
        </div>
      </section>

      {/* Footer minimal CTA */}
      <section className="py-20 bg-surface-50 border-t border-surface-200">
        <div className="max-w-[800px] mx-auto px-4 text-center">
          <FadeInView>
            <h2 className="text-3xl font-heading font-extrabold text-[#0B2D6B] mb-4">¿Listo para mejorar tu futuro?</h2>
            <p className="text-surface-600 mb-8">Descubre cómo nuestra plataforma puede ayudarte a alcanzar tus metas académicas.</p>
            <Link to="/onboarding">
              <Button size="lg" className="bg-[#1155F2] hover:bg-[#0B2D6B] text-white">
                Comenzar ahora
              </Button>
            </Link>
          </FadeInView>
        </div>
      </section>
    </div>
  );
}
