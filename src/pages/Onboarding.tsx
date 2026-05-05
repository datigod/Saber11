import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, ArrowLeft, Laptop, Wifi, Car, WashingMachine, GraduationCap, School, 
  Brain, UserRound, Check, Home, Building2, Calendar, Clock, BookOpen, Star, User, Info, Sparkles 
} from 'lucide-react';
import { Button, Card, Badge, ProgressBar } from '../components/ui';
import { PageTransition, FadeInView } from '../lib/animations';
import { predict, getPercentile, getDefaultFeatures, featureLabels, categoricalOptions, type PredictionFeatures, type PercentileInfo } from '../lib/api';

const steps = [
  { id: 1, title: 'Sobre ti', subtitle: 'Datos básicos', icon: User },
  { id: 2, title: 'Recursos', subtitle: 'Herramientas disponibles', icon: Home },
  { id: 3, title: 'Colegio', subtitle: 'Tu contexto académico', icon: School },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [features, setFeatures] = useState<PredictionFeatures>(getDefaultFeatures());
  const [prediction, setPrediction] = useState<number | null>(null);
  const [percentileData, setPercentileData] = useState<PercentileInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const updateFeature = (key: keyof PredictionFeatures, value: string | number) => {
    setFeatures(prev => ({ ...prev, [key]: value }));
  };

  const handlePredict = async () => {
    setLoading(true);
    setError('');
    
    // Smooth scroll to top for loading screen
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep(3); // Move to loading/prediction screen
    
    try {
      // Calculate derived features automatically
      const tienePc = features.FAMI_TIENECOMPUTADOR === 'SI';
      const tieneInternet = features.FAMI_TIENEINTERNET === 'SI';
      const tieneLavadora = features.FAMI_TIENELAVADORA === 'SI';
      const tieneAuto = features.FAMI_TIENEAUTOMOVIL === 'SI';

      const payload: PredictionFeatures = {
        ...features,
        FAMI_ESTRATOVIVIENDA: Math.round(Number(features.FAMI_ESTRATOVIVIENDA)),
        COLE_MEAN_SCORE: Math.round(Number(features.COLE_MEAN_SCORE)),
        EDU_PADRES_MAX: Math.max(features.EDU_PADRE_NUM, features.EDU_MADRE_NUM),
        FAMI_INDICE_RECURSOS: (tienePc ? 1 : 0) + (tieneInternet ? 1 : 0) + (tieneLavadora ? 1 : 0) + (tieneAuto ? 1 : 0),
        FAMI_ACCESO_DIGITAL: (tienePc && tieneInternet) ? 1 : 0,
      };

      // Add artificial delay for the loading modal UX
      await new Promise(resolve => setTimeout(resolve, 2500));

      const result = await predict(payload);
      const roundedPred = Math.round(result.prediccion_punt_global);
      setPrediction(roundedPred);
      
      // Fetch percentile data asynchronously
      try {
        const perc = await getPercentile(roundedPred, '2018'); // Compare against 2018 by default
        setPercentileData(perc);
      } catch (err) {
        console.error("No se pudo obtener el percentil:", err);
      }
    } catch (e: any) {
      setError(e.message || 'Error al conectar con la API. Asegúrate de que el servidor Flask esté corriendo.');
      setPrediction(null);
    } finally {
      setLoading(false);
    }
  };

  const eduOptions = [
    { value: 0, label: 'Ninguno' },
    { value: 1, label: 'Primaria incompleta' },
    { value: 2, label: 'Primaria completa' },
    { value: 3, label: 'Secundaria incompleta' },
    { value: 4, label: 'Bachiller (Secundaria completa)' },
    { value: 5, label: 'Técnica/tecnológica incompleta' },
    { value: 6, label: 'Técnica/tecnológica completa' },
    { value: 7, label: 'Profesional incompleta' },
    { value: 8, label: 'Pregrado (Profesional completa)' },
    { value: 9, label: 'Postgrado' },
  ];

  const EduChipsField = ({ label, name }: { label: string, name: keyof PredictionFeatures }) => (
    <div>
      <label className="block font-semibold text-surface-900 mb-3">{label}</label>
      <div className="flex flex-wrap gap-2">
        {eduOptions.map(opt => {
          const isSelected = features[name] === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => updateFeature(name, opt.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                isSelected 
                  ? 'bg-primary-500 text-white shadow-md shadow-primary-500/20 scale-105' 
                  : 'bg-white border border-surface-200 text-surface-600 hover:border-primary-300 hover:bg-surface-50'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );

  const SelectableCard = ({ title, icon: Icon, selected, onClick, className = '' }: any) => (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col sm:flex-row items-center sm:gap-3 p-4 rounded-xl border-2 transition-all text-center sm:text-left w-full ${
        selected 
          ? 'border-primary-500 bg-primary-50 shadow-sm' 
          : 'border-surface-200 bg-white hover:border-primary-200 hover:bg-surface-50'
      } ${className}`}
    >
      <div className={`p-2 rounded-lg mb-2 sm:mb-0 ${selected ? 'bg-primary-100 text-primary-700' : 'bg-surface-100 text-surface-500'}`}>
        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
      </div>
      <div className="flex-1 font-medium text-surface-800 text-sm sm:text-base">{title}</div>
      <div className={`hidden sm:flex w-5 h-5 rounded-full border items-center justify-center transition-colors ${selected ? 'border-primary-500 bg-primary-500 text-white' : 'border-surface-300'}`}>
        {selected && <Check className="w-3 h-3" />}
      </div>
    </button>
  );

  const ToggleCard = ({ title, description, icon: Icon, value, onChange }: any) => (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border-2 transition-all ${value === 'SI' ? 'border-primary-500 bg-primary-50 shadow-sm' : 'border-surface-200 bg-white hover:border-surface-300'}`}>
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl shrink-0 ${value === 'SI' ? 'bg-primary-100 text-primary-700' : 'bg-surface-100 text-surface-500'}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-semibold text-surface-900">{title}</h4>
          <p className="text-sm text-surface-600 mt-1">{description}</p>
        </div>
      </div>
      <div className="flex bg-surface-100 p-1.5 rounded-lg shrink-0 self-start sm:self-center w-full sm:w-auto">
        <button 
          type="button"
          onClick={() => onChange('NO')}
          className={`flex-1 sm:flex-none px-6 py-2 text-sm font-semibold rounded-md transition-all ${value === 'NO' ? 'bg-white text-surface-900 shadow-sm' : 'text-surface-600 hover:text-surface-900'}`}
        >
          No
        </button>
        <button 
          type="button"
          onClick={() => onChange('SI')}
          className={`flex-1 sm:flex-none px-6 py-2 text-sm font-semibold rounded-md transition-all ${value === 'SI' ? 'bg-primary-500 text-white shadow-sm' : 'text-surface-600 hover:text-surface-900'}`}
        >
          Sí
        </button>
      </div>
    </div>
  );

  const ModernSlider = ({ label, min, max, value, onChange, showInput = false, tooltip = '' }: any) => {
    // Calculamos el porcentaje para colorear el trayecto del slider, dando un efecto premium y fluido
    const fillPercentage = ((value - min) / (max - min)) * 100;

    return (
      <div className="bg-white border border-surface-200 rounded-xl p-5 shadow-sm hover:border-surface-300 transition-colors">
        <div className="flex justify-between items-center mb-4">
          <div>
            <label className="font-semibold text-surface-900 block">{label}</label>
            {tooltip && <p className="text-xs text-surface-500 mt-0.5">{tooltip}</p>}
          </div>
          {showInput ? (
            <input 
              type="number"
              value={Math.round(value)}
              onChange={e => {
                const val = Number(e.target.value);
                if (val >= min && val <= max) onChange(val);
              }}
              className="w-20 text-center font-bold text-primary-700 bg-primary-50 border border-primary-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          ) : (
            <span className="text-primary-700 font-bold bg-primary-50 px-3 py-1.5 rounded-lg border border-primary-100 text-sm shadow-sm">
              {Math.round(value)}
            </span>
          )}
        </div>
        <div className="relative pt-2 pb-1">
          <input
            type="range"
            value={value}
            onChange={e => onChange(Number(e.target.value))}
            min={min}
            max={max}
            step="0.01"
            className="w-full h-2.5 bg-surface-200 rounded-lg appearance-none cursor-pointer accent-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            style={{
              background: `linear-gradient(to right, var(--color-primary-500) ${fillPercentage}%, var(--color-surface-200) ${fillPercentage}%)`
            }}
          />
          <div className="flex justify-between text-xs font-semibold text-surface-400 mt-3 px-1">
            <span>{min}</span>
            <span>{max}</span>
          </div>
        </div>
      </div>
    );
  };

  const InfoAlert = ({ children }: { children: React.ReactNode }) => (
    <div className="bg-amber-50 border border-amber-200/50 rounded-xl p-4 flex gap-3">
      <div className="shrink-0 p-1 bg-amber-100 rounded-full h-fit">
        <Info className="w-4 h-4 text-amber-600" />
      </div>
      <div className="text-sm text-surface-700 leading-relaxed">
        {children}
      </div>
    </div>
  );

  // Loading Modal Content
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const loadingTexts = [
    "Organizando tus retos diarios...",
    "Seleccionando recursos recomendados...",
    "Preparando tu plan de estudio...",
    "Activando tu camino de aprendizaje..."
  ];
  
  useEffect(() => {
    if (loading && step === 3) {
      const interval = setInterval(() => {
        setLoadingTextIndex(i => (i + 1) % loadingTexts.length);
      }, 800);
      return () => clearInterval(interval);
    }
  }, [loading, step]);

  const numRespuestas = Object.keys(features).length;

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto px-4 py-8 lg:py-12 flex flex-col lg:flex-row gap-8">
        
        {/* Main Form Content */}
        <div className="flex-1 max-w-3xl mx-auto lg:mx-0 w-full">
          
          {step < 3 && (
            <div className="mb-10 text-center lg:text-left">
              <h1 className="text-3xl lg:text-4xl font-heading font-extrabold text-surface-900 tracking-tight">Construyamos tu ruta de aprendizaje</h1>
              <p className="text-surface-600 mt-3 text-lg max-w-2xl">
                Responde algunas preguntas para crear una ruta de estudio personalizada, con retos diarios, recursos y recomendaciones.
              </p>
              <div className="mt-4 inline-block bg-surface-100 border border-surface-200 text-surface-600 text-xs font-medium px-3 py-1.5 rounded-full">
                Tus respuestas no se usan para juzgarte ni clasificarte. Nos ayudan a recomendar apoyos adecuados.
              </div>
            </div>
          )}

          {/* Stepper Progress */}
          {step < 3 && (
            <div className="mb-10">
              <div className="flex items-center justify-between relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-surface-200 rounded-full z-0 hidden sm:block">
                  <div 
                    className="h-full bg-primary-500 rounded-full transition-all duration-700 ease-out" 
                    style={{ width: `${(step / (steps.length - 1)) * 100}%` }} 
                  />
                </div>
                
                {steps.map((s, i) => {
                  const isActive = i === step;
                  const isCompleted = i < step;
                  const Icon = s.icon;
                  
                  return (
                    <div key={s.id} className="relative z-10 flex flex-col items-center flex-1 sm:flex-none">
                      <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center transition-all duration-500 ${
                        isActive ? 'bg-primary-500 border-primary-100 text-white shadow-lg shadow-primary-500/30 scale-110' :
                        isCompleted ? 'bg-primary-500 border-white text-white' :
                        'bg-white border-surface-200 text-surface-400'
                      }`}>
                        {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                      </div>
                      <div className="mt-3 text-center hidden sm:block">
                        <span className={`block text-sm font-bold ${isActive ? 'text-primary-700' : isCompleted ? 'text-surface-900' : 'text-surface-400'}`}>{s.title}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step content */}
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={step < 3 ? "bg-white rounded-3xl shadow-sm border border-surface-200 p-6 sm:p-10" : ""}
          >
            {step === 0 && (
              <div className="space-y-8">
                <div className="mb-8">
                  <h2 className="text-2xl font-heading font-bold text-surface-900">Sobre ti</h2>
                  <p className="text-surface-600 mt-1">Comencemos con algunos datos básicos para orientar mejor tu ruta.</p>
                </div>

                <div>
                  <label className="block font-semibold text-surface-900 mb-3">Género</label>
                  <div className="grid grid-cols-2 gap-4">
                    <SelectableCard 
                      title="Mujer" icon={UserRound} 
                      selected={features.ESTU_GENERO === 'F'} 
                      onClick={() => updateFeature('ESTU_GENERO', 'F')} 
                    />
                    <SelectableCard 
                      title="Hombre" icon={User} 
                      selected={features.ESTU_GENERO === 'M'} 
                      onClick={() => updateFeature('ESTU_GENERO', 'M')} 
                    />
                  </div>
                </div>

                <ModernSlider 
                  label="Estrato de vivienda" 
                  value={features.FAMI_ESTRATOVIVIENDA}
                  onChange={(v: number) => updateFeature('FAMI_ESTRATOVIVIENDA', v)}
                  min={1} max={6}
                  tooltip="Este dato nos ayuda a contextualizar recursos disponibles. No se usa para juzgarte."
                />

                <div className="space-y-8">
                  <EduChipsField label="Educación del padre" name="EDU_PADRE_NUM" />
                  <EduChipsField label="Educación de la madre" name="EDU_MADRE_NUM" />
                  <p className="text-xs text-surface-500 pl-1">Si no aplica o no conoces la información, selecciona la opción más cercana.</p>
                </div>
                
                <InfoAlert>
                  Estos datos solo ayudan a personalizar recomendaciones. No definen tu capacidad ni tu resultado.
                </InfoAlert>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-8">
                <div className="mb-8">
                  <h2 className="text-2xl font-heading font-bold text-surface-900">Recursos de estudio</h2>
                  <p className="text-surface-600 mt-1">Cuéntanos con qué herramientas cuentas para adaptar mejor tu plan.</p>
                </div>

                <div className="space-y-4">
                  <ToggleCard 
                    title="Computador o dispositivo" 
                    description="Para acceder a recursos digitales, guías y prácticas."
                    icon={Laptop}
                    value={features.FAMI_TIENECOMPUTADOR}
                    onChange={(v: string) => updateFeature('FAMI_TIENECOMPUTADOR', v)}
                  />
                  <ToggleCard 
                    title="Internet en casa" 
                    description="Para estudiar en línea y participar en sesiones colaborativas."
                    icon={Wifi}
                    value={features.FAMI_TIENEINTERNET}
                    onChange={(v: string) => updateFeature('FAMI_TIENEINTERNET', v)}
                  />
                  <ToggleCard 
                    title="Automóvil" 
                    description="Dato de contexto usado solo para orientar la estimación."
                    icon={Car}
                    value={features.FAMI_TIENEAUTOMOVIL}
                    onChange={(v: string) => updateFeature('FAMI_TIENEAUTOMOVIL', v)}
                  />
                </div>

                <InfoAlert>
                  Calculamos automáticamente un indicador de recursos disponibles. Este indicador no se muestra como etiqueta ni se usa para comparar estudiantes.
                </InfoAlert>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8">
                <div className="mb-8">
                  <h2 className="text-2xl font-heading font-bold text-surface-900">Tu contexto académico</h2>
                  <p className="text-surface-600 mt-1">Esta información permite ajustar la ruta a tu entorno escolar y recursos disponibles.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div>
                    <label className="block font-semibold text-surface-900 mb-3">Naturaleza del colegio</label>
                    <div className="grid grid-cols-1 gap-3">
                      {categoricalOptions.COLE_NATURALEZA.map(opt => (
                        <SelectableCard 
                          key={opt} title={opt} icon={Building2}
                          selected={features.COLE_NATURALEZA === opt} 
                          onClick={() => updateFeature('COLE_NATURALEZA', opt)} 
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-surface-900 mb-3">Jornada</label>
                    <div className="grid grid-cols-1 gap-3">
                      {categoricalOptions.COLE_JORNADA.map(opt => (
                        <SelectableCard 
                          key={opt} title={opt} icon={Clock}
                          selected={features.COLE_JORNADA === opt} 
                          onClick={() => updateFeature('COLE_JORNADA', opt)} 
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-surface-900 mb-3">¿Colegio Bilingüe?</label>
                  <div className="flex bg-surface-100 p-1.5 rounded-xl w-fit">
                    <button 
                      type="button" onClick={() => updateFeature('COLE_BILINGUE', 'S')}
                      className={`px-8 py-2.5 font-semibold rounded-lg transition-all ${features.COLE_BILINGUE === 'S' ? 'bg-white text-primary-700 shadow-sm' : 'text-surface-600 hover:text-surface-900'}`}
                    >
                      Sí
                    </button>
                    <button 
                      type="button" onClick={() => updateFeature('COLE_BILINGUE', 'N')}
                      className={`px-8 py-2.5 font-semibold rounded-lg transition-all ${features.COLE_BILINGUE === 'N' ? 'bg-white text-primary-700 shadow-sm' : 'text-surface-600 hover:text-surface-900'}`}
                    >
                      No
                    </button>
                  </div>
                </div>

                <ModernSlider 
                  label="Referencia académica del colegio" 
                  value={features.COLE_MEAN_SCORE}
                  onChange={(v: number) => updateFeature('COLE_MEAN_SCORE', v)}
                  min={100} max={450}
                  showInput={true}
                  tooltip="Si no conoces este dato, usa un valor sugerido intermedio (ej. 250)."
                />
              </div>
            )}

            {step === 3 && (
              <div className="py-12">
                {loading ? (
                  <div className="max-w-md mx-auto bg-white rounded-3xl shadow-sm border border-surface-200 p-10 text-center">
                    <div className="w-24 h-24 mx-auto bg-primary-50 rounded-2xl flex items-center justify-center mb-8 relative">
                      <div className="absolute inset-0 bg-primary-100 rounded-2xl animate-ping opacity-20"></div>
                      <Sparkles className="w-10 h-10 text-primary-500 animate-pulse" />
                    </div>
                    <h2 className="text-2xl font-heading font-bold text-surface-900 mb-2">Estamos construyendo tu ruta</h2>
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={loadingTextIndex}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="text-primary-600 font-medium"
                      >
                        {loadingTexts[loadingTextIndex]}
                      </motion.p>
                    </AnimatePresence>
                    <div className="mt-8 w-full bg-surface-100 h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-primary-500 w-full animate-progress origin-left"></div>
                    </div>
                  </div>
                ) : prediction !== null ? (
                  <FadeInView className="max-w-xl mx-auto bg-white rounded-3xl shadow-sm border border-surface-200 p-10 text-center relative overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-2 gradient-primary"></div>
                    <div className="w-20 h-20 rounded-full gradient-primary mx-auto flex items-center justify-center mb-6 shadow-lg shadow-primary-500/20">
                      <Brain className="w-10 h-10 text-white" />
                    </div>
                    <Badge variant="success" size="md" className="mb-6 inline-flex">¡Ruta generada!</Badge>
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.1 }}
                      className="bg-surface-50 rounded-2xl p-8 mb-8 border border-surface-100"
                    >
                      <p className="text-surface-500 text-sm font-semibold uppercase tracking-wider mb-2">Estimación aproximada inicial</p>
                      <div className="flex items-baseline justify-center gap-2">
                        <span className="text-7xl font-heading font-extrabold text-gradient">{Math.round(prediction)}</span>
                        <span className="text-2xl font-bold text-surface-400">/ 500</span>
                      </div>
                      <div className="mt-6">
                        <ProgressBar value={Math.round(prediction)} max={500} color="gradient" />
                      </div>
                    </motion.div>
                    
                    <InfoAlert>
                      Esta es solo una estimación basada en variables del entorno. <b>¡Tu esfuerzo y la ruta que inicias hoy determinarán tu resultado real!</b>
                    </InfoAlert>
                    
                    {percentileData && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                        className="mt-6 bg-surface-50 border border-surface-200 rounded-xl p-5 text-center shadow-sm"
                      >
                        <p className="text-sm text-surface-600 mb-2">Comparativa Nacional Oficial (2018)</p>
                        <p className="font-medium text-surface-900">
                          Tu puntaje estimado está por encima del <span className="font-bold text-primary-600 text-lg">{percentileData.percentil}%</span> de los estudiantes a nivel nacional.
                        </p>
                        <div className="w-full bg-surface-200 h-1.5 rounded-full mt-3 overflow-hidden">
                          <div className="bg-primary-500 h-full rounded-full" style={{ width: `${percentileData.percentil}%` }}></div>
                        </div>
                      </motion.div>
                    )}
                    
                    <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                      <Button variant="secondary" size="lg" onClick={() => { setStep(0); setPrediction(null); setPercentileData(null); }}>Actualizar datos</Button>
                      <Button size="lg" onClick={() => navigate('/ruta')} icon={ArrowRight}>Comenzar mi ruta</Button>
                    </div>
                  </FadeInView>
                ) : (
                  <FadeInView className="max-w-md mx-auto bg-white rounded-3xl shadow-sm border border-surface-200 p-10 text-center">
                    <div className="w-20 h-20 rounded-2xl bg-amber-50 mx-auto flex items-center justify-center mb-6">
                      <School className="w-10 h-10 text-amber-500" />
                    </div>
                    <h3 className="font-heading font-bold text-xl text-surface-900">API no conectada</h3>
                    <p className="text-surface-600 mt-3 mb-8">
                      {error || 'Por favor, inicia el servidor Flask localmente para obtener predicciones reales.'}
                    </p>
                    <div className="flex flex-col gap-3">
                      <Button onClick={handlePredict} loading={loading} icon={Brain}>Reintentar predicción</Button>
                      <Button variant="secondary" onClick={() => navigate('/mapa')}>Explorar mapa de prueba</Button>
                    </div>
                  </FadeInView>
                )}
              </div>
            )}
          </motion.div>

          {/* Navigation buttons */}
          {step < 3 && (
            <div className="flex flex-col-reverse sm:flex-row justify-between mt-8 gap-4">
              <Button
                variant="ghost"
                onClick={() => setStep(s => Math.max(0, s - 1))}
                disabled={step === 0}
                icon={ArrowLeft}
                className="w-full sm:w-auto text-surface-500 hover:text-surface-900 border border-surface-200 sm:border-none bg-white sm:bg-transparent"
              >
                Anterior
              </Button>
              {step < 2 ? (
                <Button 
                  onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setStep(s => s + 1); }} 
                  iconRight={ArrowRight}
                  className="w-full sm:w-auto shadow-md shadow-primary-500/20 py-3"
                >
                  Siguiente
                </Button>
              ) : (
                <Button 
                  onClick={handlePredict} 
                  loading={loading} 
                  icon={Sparkles}
                  className="w-full sm:w-auto shadow-md shadow-primary-500/20 py-3 bg-gradient-to-r from-primary-600 to-primary-500"
                >
                  Generar mi ruta
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Sidebar Summary (Desktop only) */}
        {step < 3 && (
          <div className="hidden lg:block w-80 shrink-0">
            <div className="sticky top-24 bg-white rounded-2xl border border-surface-200 shadow-sm p-6">
              <h3 className="font-bold text-surface-900 mb-4">Tu ruta se está construyendo</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-surface-900">Tiempo estimado</p>
                    <p className="text-xs text-surface-500">2 minutos</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-success-50 flex items-center justify-center shrink-0">
                    <Star className="w-4 h-4 text-success-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-surface-900">Resultado esperado</p>
                    <p className="text-xs text-surface-500">Plan personalizado + reto diario</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-surface-100">
                <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Progreso del perfil</p>
                <div className="space-y-2">
                  {steps.map((s, i) => (
                    <div key={s.id} className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                        i < step ? 'bg-success-500 border-success-500 text-white' : 
                        i === step ? 'border-primary-500 bg-primary-50' : 
                        'border-surface-200 bg-surface-50'
                      }`}>
                        {i < step && <Check className="w-2.5 h-2.5" />}
                      </div>
                      <span className={`text-sm ${i <= step ? 'text-surface-700 font-medium' : 'text-surface-400'}`}>
                        {s.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
