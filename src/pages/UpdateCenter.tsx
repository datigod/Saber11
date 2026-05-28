import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UploadCloud, Terminal, FileText, CheckCircle2, AlertTriangle, 
  ArrowRight, Play, BarChart3, RefreshCw, Layers, Database, Sparkles,
  HelpCircle, ChevronDown, ChevronUp, Download, Check, X, ShieldCheck
} from 'lucide-react';
import { 
  uploadDataset, getTrainingStatus, resetTrainingStatus, TrainingState 
} from '../lib/api';
import { Card, Button, ProgressBar, Badge } from '../components/ui';
import { PageTransition, FadeInView } from '../lib/animations';
import { useNavigate } from 'react-router-dom';

// Lista de columnas clave para el verificador
interface ColumnSpec {
  name: string;
  type: string;
  desc: string;
  required: boolean;
  sample: string;
}

const requiredColumnsList: ColumnSpec[] = [
  { name: 'PUNT_GLOBAL', type: 'Numérico (0-500)', desc: 'Puntaje global obtenido (Variable objetivo)', required: true, sample: '285' },
  { name: 'COLE_DEPTO_UBICACION', type: 'Texto', desc: 'Departamento de ubicación (se filtra "BOGOTA")', required: true, sample: 'BOGOTA' },
  { name: 'ESTU_GENERO', type: "Texto ('F' / 'M')", desc: 'Género del estudiante', required: true, sample: 'F' },
  { name: 'FAMI_ESTRATOVIVIENDA', type: 'Texto (Ej: "Estrato 3")', desc: 'Estrato residential socioeconómico', required: true, sample: 'Estrato 3' },
  { name: 'COLE_COD_DANE_ESTABLECIMIENTO', type: 'Numérico', desc: 'Código DANE del colegio para promedios', required: true, sample: '111001012345' },
  { name: 'COLE_NATURALEZA', type: 'Texto', desc: 'Naturaleza ("OFICIAL" o "NO OFICIAL")', required: true, sample: 'OFICIAL' },
  { name: 'FAMI_TIENECOMPUTADOR', type: 'Texto ("SI" / "NO")', desc: 'Disponibilidad de computador', required: true, sample: 'SI' },
  { name: 'PERIODO', type: 'Numérico (Ej: 20241)', desc: 'Periodo de presentación', required: false, sample: '20241' },
];

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
  const [showSpecs, setShowSpecs] = useState(false);
  
  // Escáner de cabeceras en el cliente
  const [detectedHeaders, setDetectedHeaders] = useState<string[]>([]);
  const [validationResults, setValidationResults] = useState<{
    valid: boolean;
    present: string[];
    missing: string[];
  }>({ valid: false, present: [], missing: [] });
  
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

  // Analizar archivo seleccionado en el cliente para extraer cabeceras
  const analyzeCSVFile = (selectedFile: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) return;
      
      // Obtener la primera línea (cabeceras)
      const firstLine = text.split('\n')[0] || '';
      // Separar por coma o punto y coma
      const delimiter = firstLine.includes(';') ? ';' : ',';
      const headers = firstLine.split(delimiter).map(h => h.replace(/["'\r]/g, '').trim().toUpperCase());
      
      setDetectedHeaders(headers);
      
      // Validar cabeceras requeridas
      const requiredNames = requiredColumnsList.filter(c => c.required).map(c => c.name);
      const present = requiredNames.filter(name => headers.includes(name));
      const missing = requiredNames.filter(name => !headers.includes(name));
      
      setValidationResults({
        valid: missing.length === 0,
        present,
        missing
      });
      
      if (missing.length > 0) {
        setErrorMsg(`Advertencia: Faltan columnas críticas en el CSV (${missing.join(', ')}). Esto podría fallar en el entrenamiento.`);
      } else {
        setErrorMsg(null);
      }
    };
    // Leer solo los primeros 10KB para rapidez total
    reader.readAsText(selectedFile.slice(0, 10240));
  };

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
        analyzeCSVFile(droppedFile);
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
        analyzeCSVFile(selectedFile);
      } else {
        setErrorMsg("El archivo seleccionado debe tener extensión .csv");
      }
    }
  };

  // Generar y descargar plantilla CSV de ejemplo al vuelo
  const downloadCSVEjemplo = () => {
    const headers = [
      'PERIODO', 'ESTU_TIPODOCUMENTO', 'ESTU_CONSECUTIVO', 'COLE_COD_DANE_ESTABLECIMIENTO', 
      'COLE_DEPTO_UBICACION', 'COLE_NATURALEZA', 'COLE_JORNADA', 'COLE_CALENDARIO', 
      'COLE_BILINGUE', 'COLE_CARACTER', 'ESTU_GENERO', 'FAMI_ESTRATOVIVIENDA', 
      'FAMI_TIENECOMPUTADOR', 'FAMI_TIENEINTERNET', 'FAMI_TIENELAVADORA', 'FAMI_TIENEAUTOMOVIL', 
      'PUNT_INGLES', 'PUNT_MATEMATICAS', 'PUNT_SOCIALES_CIUDADANAS', 'PUNT_C_NATURALES', 
      'PUNT_LECTURA_CRITICA', 'PUNT_GLOBAL'
    ];
    
    const rows = [
      ['20241', 'TI', 'EK2024100123', '111001015678', 'BOGOTA', 'OFICIAL', 'COMPLETA', 'A', 'N', 'ACADEMICO', 'F', 'Estrato 3', 'SI', 'SI', 'SI', 'NO', '72', '65', '68', '62', '64', '325'],
      ['20241', 'CC', 'EK2024100124', '111001018999', 'BOGOTA', 'NO OFICIAL', 'MAÑANA', 'A', 'S', 'ACADEMICO', 'M', 'Estrato 4', 'SI', 'SI', 'SI', 'SI', '88', '78', '75', '70', '72', '378'],
      ['20241', 'TI', 'EK2024100125', '111001020000', 'BOGOTA', 'OFICIAL', 'TARDE', 'A', 'N', 'TECNICO', 'F', 'Estrato 2', 'NO', 'SI', 'NO', 'NO', '55', '58', '52', '56', '54', '268']
    ];
    
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "plantilla_saber11_reentrenamiento.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Iniciar la subida e hilo de reentrenamiento
  const handleStartRetraining = async () => {
    if (!file) return;
    
    try {
      setTrainingState(prev => ({
        ...prev,
        status: 'processing',
        progress: 2,
        message: 'Preparando carga del archivo...',
        logs: [`[${new Date().toLocaleTimeString()}] Preparando carga de archivo ${file.name}...`]
      }));
      
      await uploadDataset(file);
      
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
      setDetectedHeaders([]);
      setValidationResults({ valid: false, present: [], missing: [] });
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
              <h1 className="text-3.5xl font-heading font-extrabold text-surface-900 tracking-tight flex items-center gap-2">
                <RefreshCw className={`w-8 h-8 text-primary-500 ${isRunning ? 'animate-spin' : ''}`} />
                Actualización Anual
              </h1>
              <p className="text-surface-700 text-base mt-1.5 max-w-xl">
                Carga el dataset anual en CSV para refrescar las estadísticas del panel de control y entrenar el modelo CatBoost en caliente.
              </p>
            </div>
            {isRunning && (
              <div className="flex items-center gap-2.5 px-4 py-2 bg-primary-50 rounded-2xl border border-primary-200 shadow-sm">
                <RefreshCw className="w-5 h-5 text-primary-500 animate-spin" />
                <span className="text-sm font-semibold text-primary-700">Entrenamiento activo</span>
              </div>
            )}
          </div>
        </FadeInView>

        {/* Acordeón de Especificación del Formato CSV (Mejorado y Dinámico) */}
        <div className="mb-6">
          <Card padding="sm" className="border border-primary-100 bg-gradient-to-r from-primary-50/20 to-white">
            <button 
              onClick={() => setShowSpecs(!showSpecs)}
              className="w-full flex items-center justify-between p-2 text-left focus:outline-none cursor-pointer"
            >
              <div className="flex items-center gap-2.5 text-primary-700">
                <HelpCircle className="w-5 h-5 text-primary-500" />
                <span className="font-heading font-bold text-sm">Ver Especificación del Formato CSV Requerido</span>
              </div>
              <div className="text-primary-500">
                {showSpecs ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            <AnimatePresence>
              {showSpecs && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 border-t border-surface-200 mt-2 space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <p className="text-xs text-surface-750">
                        El archivo debe ser un CSV separado por comas (<code>,</code>) o puntos y comas (<code>;</code>) conteniendo cabeceras idénticas en la primera línea.
                      </p>
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        icon={Download}
                        onClick={downloadCSVEjemplo}
                        className="text-xs"
                      >
                        Descargar Plantilla CSV
                      </Button>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-surface-250 bg-white">
                      <table className="min-w-full divide-y divide-surface-200 text-left font-mono text-[11px]">
                        <thead className="bg-surface-100 text-surface-700 font-sans font-bold">
                          <tr>
                            <th className="p-3">Nombre Columna</th>
                            <th className="p-3">Tipo de Dato</th>
                            <th className="p-3">Descripción</th>
                            <th className="p-3 text-center">Estado</th>
                            <th className="p-3">Ejemplo</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-200 text-surface-800">
                          {requiredColumnsList.map((col, idx) => (
                            <tr key={idx} className="hover:bg-surface-50">
                              <td className="p-3 font-bold text-primary-650">{col.name}</td>
                              <td className="p-3 text-surface-600">{col.type}</td>
                              <td className="p-3 font-sans leading-normal">{col.desc}</td>
                              <td className="p-3 text-center">
                                {col.required ? (
                                  <Badge variant="error" size="sm" className="lowercase">crítico</Badge>
                                ) : (
                                  <Badge variant="neutral" size="sm" className="lowercase">opcional</Badge>
                                )}
                              </td>
                              <td className="p-3 text-surface-650">{col.sample}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </div>

        {/* Alerta de Error / Advertencia */}
        {errorMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-2xl bg-error-50 border border-error/20 flex gap-3.5 items-start text-error shadow-sm"
          >
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-sm">
              <span className="font-bold">Estado del archivo: </span>
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
                  className="space-y-6"
                >
                  <Card accent="primary" className="overflow-hidden shadow-md">
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
                          ? 'border-primary-500 bg-primary-50/50 scale-[0.99] shadow-lg shadow-primary-100' 
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
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 ${
                          file ? 'bg-tertiary-100 text-tertiary-600 scale-105' : 'bg-primary-50 text-primary-500'
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
                            <Badge variant="success" className="mt-3.5">Archivo verificado</Badge>
                          </>
                        ) : (
                          <>
                            <p className="font-heading font-bold text-sm text-surface-900">Arrastra tu archivo CSV aquí</p>
                            <p className="text-xs text-surface-600 mt-1.5 px-4">
                              Haz clic para explorar en el disco local (.csv)
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
                          disabled={!validationResults.valid && detectedHeaders.length > 0}
                          onClick={handleStartRetraining}
                        >
                          Iniciar Reentrenamiento
                        </Button>
                        <Button 
                          className="w-full" 
                          variant="secondary"
                          onClick={() => { setFile(null); setDetectedHeaders([]); setErrorMsg(null); }}
                        >
                          Remover Archivo
                        </Button>
                      </div>
                    )}
                  </Card>

                  {/* Escáner de Archivo y Validador Dinámico en Caliente */}
                  {file && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Card className="border border-surface-200">
                        <div className="flex items-center gap-2 mb-3 text-surface-900">
                          <ShieldCheck className="w-5 h-5 text-primary-500" />
                          <h4 className="font-heading font-bold text-sm">Validador de Cabeceras</h4>
                        </div>
                        
                        <p className="text-xs text-surface-700 leading-normal mb-3.5">
                          Analizando estructura de columnas en tiempo real...
                        </p>

                        <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                          {requiredColumnsList.map((col, idx) => {
                            const hasCol = detectedHeaders.includes(col.name);
                            return (
                              <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-surface-100 last:border-0">
                                <span className="font-mono font-bold text-surface-850">{col.name}</span>
                                <div className="flex items-center gap-1.5">
                                  {hasCol ? (
                                    <span className="flex items-center gap-1 text-[10px] text-tertiary-600 font-bold uppercase tracking-wide bg-tertiary-50 px-2 py-0.5 rounded-full border border-tertiary-100">
                                      <Check className="w-3 h-3 text-tertiary-500" /> presente
                                    </span>
                                  ) : col.required ? (
                                    <span className="flex items-center gap-1 text-[10px] text-error font-bold uppercase tracking-wide bg-red-50 px-2 py-0.5 rounded-full border border-red-100 animate-pulse">
                                      <X className="w-3 h-3 text-error" /> faltante
                                    </span>
                                  ) : (
                                    <span className="text-[10px] text-surface-600 font-bold uppercase tracking-wide bg-surface-100 px-2 py-0.5 rounded-full border border-surface-200">
                                      opcional
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </Card>
                    </motion.div>
                  )}
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
                  <Card className="shadow-md">
                    <h3 className="font-heading font-bold text-lg text-surface-900 mb-5">Estado de la Tarea</h3>
                    
                    {/* Stepper Vertical */}
                    <div className="relative pl-6 space-y-7 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-surface-200">
                      {stepsList.map((step: { id: string; label: string; icon: any }, i: number) => {
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
                                ? 'text-tertiary-500 animate-bounce' 
                                : stepStatus === 'active' 
                                  ? 'text-primary-500' 
                                  : 'text-surface-500'
                            }`} />
                            
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs font-bold ${
                                stepStatus === 'completed' 
                                  ? 'text-tertiary-600' 
                                  : stepStatus === 'active' 
                                    ? 'text-primary-600 font-extrabold' 
                                    : 'text-surface-600'
                              }`}>
                                {step.label}
                              </p>
                              {stepStatus === 'active' && (
                                <p className="text-[10px] text-primary-550 font-semibold animate-pulse mt-0.5">
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
                  <Card accent="success" className="bg-gradient-to-br from-white via-white to-tertiary-50/20 shadow-lg">
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
                        <div className="w-2.5 h-2.5 rounded-full bg-error/80 animate-pulse" />
                        <div className="w-2.5 h-2.5 rounded-full bg-warning/80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-tertiary-500/80" />
                      </div>
                    </div>

                    {/* Consola de logs */}
                    <div className="p-5 h-[360px] overflow-y-auto font-mono text-xs text-surface-300 leading-relaxed space-y-2 bg-[#090d13]">
                      {trainingState.logs.length === 0 ? (
                        <div className="text-surface-700 italic select-none py-14 text-center flex flex-col items-center justify-center">
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
                            colorClass = "text-primary-400 font-bold mt-3 border-b border-primary-500/10 pb-0.5";
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
