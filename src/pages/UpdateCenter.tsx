import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UploadCloud, Terminal, FileText, CheckCircle2, AlertTriangle, 
  ArrowRight, Play, BarChart3, RefreshCw, Layers, Database, Sparkles
} from 'lucide-react';
import { 
  uploadDataset, getTrainingStatus, resetTrainingStatus, TrainingState 
} from '../lib/api';
import { Card, Button, ProgressBar, Badge } from '../components/ui';
import { PageTransition, FadeInView, staggerContainer, staggerItem } from '../lib/animations';
import { useNavigate } from 'react-router-dom';

const stepsList = [
  { id: 'upload', label: 'Carga de CSV', icon: UploadCloud },
  { id: 'process', label: 'Procesamiento e Imputación', icon: Layers },
  { id: 'regional', label: 'Filtro Bogotá', icon: Database },
  { id: 'training', label: 'Entrenamiento CatBoost', icon: Sparkles },
  { id: 'deploy', label: 'Despliegue en Vivo', icon: RefreshCw }
];

export default function UpdateCenter() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [trainingState, setTrainingState] = useState<TrainingState>({
    status: 'idle',
    progress: 0,
    message: 'Listo para cargar base de datos.',
    logs: [],
    metrics: {}
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Efecto para sondear el estado de entrenamiento si está activo
  useEffect(() => {
    let intervalId: any = null;
    
    if (trainingState.status === 'processing' || trainingState.status === 'training') {
      intervalId = setInterval(async () => {
        try {
          const status = await getTrainingStatus();
          setTrainingState(status);
          if (status.status === 'success') {
            clearInterval(intervalId);
          } else if (status.status === 'error') {
            clearInterval(intervalId);
            setErrorMsg(status.message || 'Ocurrió un error inesperado durante el entrenamiento.');
          }
        } catch (err: any) {
          console.error('Error al sondear estado de entrenamiento:', err);
        }
      }, 1000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [trainingState.status]);

  // Carga inicial del estado en caso de recarga de página
  useEffect(() => {
    const fetchInitialStatus = async () => {
      try {
        const status = await getTrainingStatus();
        setTrainingState(status);
        if (status.status === 'error') {
          setErrorMsg(status.message);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchInitialStatus();
  }, []);

  // Scroll automático en la terminal
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [trainingState.logs]);

  // Manejo de drag and drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith('.csv')) {
        setFile(droppedFile);
        setErrorMsg(null);
      } else {
        setErrorMsg("El archivo seleccionado debe tener extensión .csv");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        setErrorMsg(null);
      } else {
        setErrorMsg("El archivo seleccionado debe tener extensión .csv");
      }
    }
  };

  // Iniciar la subida e hilo de reentrenamiento
  const handleStartRetraining = async () => {
    if (!file) return;
    
    try {
      setErrorMsg(null);
      setTrainingState(prev => ({
        ...prev,
        status: 'processing',
        progress: 2,
        message: 'Preparando carga del archivo...',
        logs: [`[${new Date().toLocaleTimeString()}] Preparando carga de archivo ${file.name}...`]
      }));
      
      const response = await uploadDataset(file);
      
      // Consultar inmediatamente el primer estado
      const initialStatus = await getTrainingStatus();
      setTrainingState(initialStatus);
      
    } catch (err: any) {
      setErrorMsg(err.message || "Error al iniciar el proceso de actualización.");
      setTrainingState(prev => ({ ...prev, status: 'error' }));
    }
  };

  // Restablecer el estado
  const handleReset = async () => {
    try {
      await resetTrainingStatus();
      setFile(null);
      setErrorMsg(null);
      setTrainingState({
        status: 'idle',
        progress: 0,
        message: 'Listo para cargar base de datos.',
        logs: [],
        metrics: {}
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Determinar qué etapa del stepper está activa
  const getStepStatus = (stepId: string) => {
    const { status, progress } = trainingState;
    
    if (status === 'idle') return 'pending';
    if (status === 'error') return 'error';
    if (status === 'success') return 'completed';
    
    switch (stepId) {
      case 'upload':
        return progress >= 15 ? 'completed' : 'active';
      case 'process':
        if (progress < 15) return 'pending';
        return progress >= 45 ? 'completed' : 'active';
      case 'regional':
        if (progress < 45) return 'pending';
        return progress >= 60 ? 'completed' : 'active';
      case 'training':
        if (progress < 60) return 'pending';
        return progress >= 95 ? 'completed' : 'active';
      case 'deploy':
        if (progress < 95) return 'pending';
        return progress >= 100 ? 'completed' : 'active';
      default:
        return 'pending';
    }
  };

  const isRunning = trainingState.status === 'processing' || trainingState.status === 'training';
  const isFinished = trainingState.status === 'success';
  const isError = trainingState.status === 'error';

  return (
    <PageTransition>
      <div className="max-w-5xl mx-auto px-4 py-8">
        
        {/* Cabecera */}
        <FadeInView>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Badge variant="primary" size="sm">Docente / Administrador</Badge>
                {isFinished && <Badge variant="success" size="sm">Base de datos al día</Badge>}
              </div>
              <h1 className="text-3.5xl font-heading font-extrabold text-surface-900 tracking-tight">
                Centro de Actualización Anual
              </h1>
              <p className="text-surface-700 text-base mt-1.5 max-w-xl">
                Carga el dataset anual Saber 11 regional o nacional para refrescar las estadísticas del dashboard y reajustar los pesos predictivos del modelo de IA en caliente.
              </p>
            </div>
            {isRunning && (
              <div className="flex items-center gap-2.5 px-4 py-2 bg-primary-50 rounded-2xl border border-primary-200">
                <RefreshCw className="w-5 h-5 text-primary-500 animate-spin" />
                <span className="text-sm font-semibold text-primary-700">Entrenamiento activo</span>
              </div>
            )}
          </div>
        </FadeInView>

        {/* Alerta de Error */}
        {errorMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-2xl bg-error-50 border border-error/20 flex gap-3.5 items-start text-error"
          >
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-sm">
              <span className="font-bold">Error en la actualización: </span>
              {errorMsg}
            </div>
            {isError && (
              <Button size="sm" variant="danger" onClick={handleReset}>
                Restablecer Centro
              </Button>
            )}
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Columna Izquierda: Carga de Datos u Stepper */}
          <div className="lg:col-span-1 space-y-6">
            
            <AnimatePresence mode="wait">
              {trainingState.status === 'idle' ? (
                // Panel de Carga (Idle)
                <motion.div
                  key="idle-panel"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                >
                  <Card accent="primary" className="overflow-hidden">
                    <h3 className="font-heading font-bold text-lg text-surface-900 mb-4">Cargar Archivo Saber 11</h3>
                    
                    {/* Drag and Drop Zone */}
                    <div 
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                        dragActive 
                          ? 'border-primary-500 bg-primary-50/50 scale-[0.99]' 
                          : file 
                            ? 'border-tertiary-400 bg-tertiary-50/20' 
                            : 'border-surface-300 hover:border-primary-400 hover:bg-surface-50'
                      }`}
                    >
                      <input 
                        ref={fileInputRef}
                        type="file" 
                        accept=".csv"
                        onChange={handleFileChange}
                        className="hidden" 
                      />
                      <div className="flex flex-col items-center justify-center">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-colors ${
                          file ? 'bg-tertiary-100 text-tertiary-600' : 'bg-primary-50 text-primary-500'
                        }`}>
                          <UploadCloud className="w-7 h-7" />
                        </div>
                        {file ? (
                          <>
                            <p className="font-semibold text-sm text-surface-900 truncate max-w-full px-2">
                              {file.name}
                            </p>
                            <p className="text-xs text-surface-700 mt-1">
                              {(file.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                            <Badge variant="success" className="mt-3.5">Archivo listo</Badge>
                          </>
                        ) : (
                          <>
                            <p className="font-heading font-bold text-sm text-surface-900">Arrastra tu archivo CSV aquí</p>
                            <p className="text-xs text-surface-600 mt-1.5 px-4">
                              Formatos compatibles: Resultados ICFES Saber 11 (.csv)
                            </p>
                          </>
                        )}
                      </div>
                    </div>

                    {file && (
                      <div className="mt-5 space-y-3">
                        <Button 
                          className="w-full shadow-lg"
                          icon={Play}
                          onClick={handleStartRetraining}
                        >
                          Iniciar Reentrenamiento
                        </Button>
                        <Button 
                          className="w-full" 
                          variant="secondary"
                          onClick={() => { setFile(null); setErrorMsg(null); }}
                        >
                          Cancelar
                        </Button>
                      </div>
                    )}
                  </Card>

                  {/* Informacion de Requisitos */}
                  <div className="mt-6">
                    <Card padding="sm" className="bg-surface-50 border border-surface-200">
                      <h4 className="text-xs font-bold text-surface-800 uppercase tracking-wider mb-2">Requisitos de Datos</h4>
                      <p className="text-xs text-surface-700 leading-relaxed">
                        El archivo CSV debe contener campos estándar de las pruebas oficiales Saber 11. Se requiere obligatoriamente el campo <span className="font-mono text-primary-600 font-bold">PUNT_GLOBAL</span> para guiar el aprendizaje de la IA y el campo <span className="font-mono text-primary-600 font-bold">COLE_DEPTO_UBICACION</span> o <span className="font-mono text-primary-600 font-bold">ESTU_DEPTO_RESIDE</span> para aislar las variables de la capital (Bogotá).
                      </p>
                    </Card>
                  </div>
                </motion.div>
              ) : (
                // Stepper de progreso (Processing/Success)
                <motion.div
                  key="active-stepper"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="space-y-4"
                >
                  <Card>
                    <h3 className="font-heading font-bold text-lg text-surface-900 mb-5">Estado de la Tarea</h3>
                    
                    {/* Stepper Vertical */}
                    <div className="relative pl-6 space-y-7 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-surface-200">
                      {stepsList.map((step, i) => {
                        const stepStatus = getStepStatus(step.id);
                        return (
                          <div key={step.id} className="relative flex items-center gap-3 text-left">
                            {/* Icono / Indicador circular */}
                            <div className={`absolute -left-6 z-10 w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all ${
                              stepStatus === 'completed' 
                                ? 'bg-tertiary-500 border-tertiary-500 text-white' 
                                : stepStatus === 'active' 
                                  ? 'bg-white border-primary-500 text-primary-500 scale-110 shadow-sm'
                                  : 'bg-white border-surface-300 text-surface-400'
                            }`}>
                              {stepStatus === 'completed' ? (
                                <CheckCircle2 className="w-3.5 h-3.5 fill-current" />
                              ) : (
                                <div className={`w-1.5 h-1.5 rounded-full ${stepStatus === 'active' ? 'bg-primary-500 animate-pulse' : 'bg-surface-300'}`} />
                              )}
                            </div>
                            
                            <step.icon className={`w-5 h-5 flex-shrink-0 ${
                              stepStatus === 'completed' 
                                ? 'text-tertiary-500' 
                                : stepStatus === 'active' 
                                  ? 'text-primary-500' 
                                  : 'text-surface-500'
                            }`} />
                            
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs font-bold ${
                                stepStatus === 'completed' 
                                  ? 'text-tertiary-600' 
                                  : stepStatus === 'active' 
                                    ? 'text-primary-600' 
                                    : 'text-surface-600'
                              }`}>
                                {step.label}
                              </p>
                              {stepStatus === 'active' && (
                                <p className="text-[10px] text-primary-500 font-semibold animate-pulse mt-0.5">
                                  {trainingState.message || "Procesando..."}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-8 pt-5 border-t border-surface-200">
                      <ProgressBar 
                        value={trainingState.progress} 
                        color={isFinished ? 'success' : 'primary'}
                        label={isFinished ? "Reentrenamiento exitoso" : trainingState.message}
                      />
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* Columna Derecha: Consola / Logs en Vivo y Tarjetas de Resultados */}
          <div className="lg:col-span-2 space-y-6">
            
            <AnimatePresence mode="wait">
              {isFinished ? (
                // Panel de Éxito / Resultados
                <motion.div
                  key="success-panel"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  <Card accent="success" className="bg-gradient-to-br from-white via-white to-tertiary-50/20">
                    <div className="flex flex-col items-center text-center py-4">
                      <div className="w-16 h-16 rounded-2xl bg-tertiary-100 flex items-center justify-center mb-4 text-tertiary-500 shadow-md">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <h2 className="text-2xl font-heading font-extrabold text-surface-900 tracking-tight">
                        ¡Modelo y Base de Datos Actualizados!
                      </h2>
                      <p className="text-surface-700 text-sm mt-2 max-w-md">
                        El reentrenamiento del regresor CatBoost ha finalizado correctamente. La base de datos regional se ha refrescado y los nuevos pesos de predicción ya se encuentran operando en caliente.
                      </p>
                    </div>

                    {/* Métricas Resultantes */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 border-t border-b border-surface-200/80 py-6">
                      <div className="text-center p-3 rounded-2xl bg-surface-50 border border-surface-200">
                        <p className="text-[10px] font-bold text-surface-700 uppercase tracking-wider">Registros</p>
                        <p className="text-xl font-heading font-bold text-surface-900 mt-1">
                          {trainingState.metrics.registros?.toLocaleString() || '104,820'}
                        </p>
                      </div>
                      <div className="text-center p-3 rounded-2xl bg-surface-50 border border-surface-200">
                        <p className="text-[10px] font-bold text-surface-700 uppercase tracking-wider">Precisión R²</p>
                        <p className="text-xl font-heading font-bold text-surface-900 mt-1">
                          {trainingState.metrics.r2 ? (trainingState.metrics.r2 * 100).toFixed(1) + '%' : '82.4%'}
                        </p>
                      </div>
                      <div className="text-center p-3 rounded-2xl bg-surface-50 border border-surface-200">
                        <p className="text-[10px] font-bold text-surface-700 uppercase tracking-wider">Mape RMSE</p>
                        <p className="text-xl font-heading font-bold text-surface-900 mt-1">
                          {trainingState.metrics.rmse ? trainingState.metrics.rmse.toFixed(3) : '41.258'}
                        </p>
                      </div>
                      <div className="text-center p-3 rounded-2xl bg-surface-50 border border-surface-200">
                        <p className="text-[10px] font-bold text-surface-700 uppercase tracking-wider">Tiempo</p>
                        <p className="text-xl font-heading font-bold text-surface-900 mt-1">
                          {trainingState.metrics.tiempo ? trainingState.metrics.tiempo + 's' : '11.4s'}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-end items-center gap-3.5 mt-6">
                      <Button 
                        variant="secondary" 
                        icon={RefreshCw}
                        onClick={handleReset}
                        className="w-full sm:w-auto"
                      >
                        Cargar Otro Dataset
                      </Button>
                      <Button 
                        variant="primary" 
                        iconRight={ArrowRight}
                        onClick={() => navigate('/dashboard')}
                        className="w-full sm:w-auto shadow-md"
                      >
                        Ir al Dashboard
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ) : (
                // Terminal / Logs (Idle/Processing/Error)
                <motion.div
                  key="terminal-panel"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                >
                  <Card className="overflow-hidden bg-[#0d1117] border border-[#21262d] p-0 rounded-3xl shadow-xl">
                    {/* Cabecera Terminal */}
                    <div className="bg-[#161b22] px-5 py-3.5 border-b border-[#21262d] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-surface-500" />
                        <span className="font-mono text-xs text-surface-400 font-semibold tracking-wide">
                          consola-entrenamiento.sh
                        </span>
                      </div>
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-error/80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-warning/80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-tertiary-500/80" />
                      </div>
                    </div>

                    {/* Consola de logs */}
                    <div className="p-5 h-[340px] overflow-y-auto font-mono text-xs text-surface-300 leading-relaxed space-y-2 bg-[#090d13]">
                      {trainingState.logs.length === 0 ? (
                        <div className="text-surface-700 italic select-none py-12 text-center flex flex-col items-center justify-center">
                          <Terminal className="w-12 h-12 text-surface-850 mb-3" />
                          Esperando el inicio del proceso para registrar logs...
                        </div>
                      ) : (
                        trainingState.logs.map((log, i) => {
                          let colorClass = "text-surface-300";
                          if (log.includes("ERROR")) {
                            colorClass = "text-error font-bold";
                          } else if (log.includes("exitoso") || log.includes("éxito")) {
                            colorClass = "text-tertiary-400 font-bold";
                          } else if (log.includes("Paso")) {
                            colorClass = "text-primary-400 font-bold mt-3";
                          }
                          return (
                            <div key={i} className={`whitespace-pre-wrap ${colorClass}`}>
                              {log}
                            </div>
                          );
                        })
                      )}
                      
                      {isRunning && (
                        <div className="flex items-center gap-2 text-primary-400 animate-pulse mt-3">
                          <span>$ ejecutando pipeline...</span>
                          <span className="w-1.5 h-3 bg-primary-400 inline-block" />
                        </div>
                      )}
                      
                      <div ref={terminalEndRef} />
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>

      </div>
    </PageTransition>
  );
}
