/**
 * API Service – Integración con la API Flask de CatBoost (Saber 11)
 * Proxy configurado en vite.config.ts: /api → http://127.0.0.1:5000
 */

const API_BASE = import.meta.env.VITE_API_URL || '/api';

// Variable de estado para indicar si estamos usando datos de demostración locales
export let isMockModeActive = false;

export function setMockMode(active: boolean) {
  isMockModeActive = active;
}

export interface PredictionFeatures {
  FAMI_ESTRATOVIVIENDA: number;
  FAMI_INDICE_RECURSOS: number;
  EDU_PADRE_NUM: number;
  EDU_MADRE_NUM: number;
  EDU_PADRES_MAX: number;
  FAMI_ACCESO_DIGITAL: number;
  COLE_MEAN_SCORE: number;
  ESTU_GENERO: string;
  COLE_NATURALEZA: string;
  COLE_BILINGUE: string;
  COLE_CALENDARIO: string;
  COLE_JORNADA: string;
  COLE_CARACTER: string;
  FAMI_TIENECOMPUTADOR: string;
  FAMI_TIENEINTERNET: string;
  FAMI_TIENELAVADORA: string;
  FAMI_TIENEAUTOMOVIL: string;
}

export interface PredictionResult {
  prediccion_punt_global: number;
  nota: string;
}

export interface ApiInfo {
  features_numericas: string[];
  features_categoricas: string[];
  total_features: number;
  ejemplo_request: {
    url: string;
    body: { features: Record<string, unknown> };
  };
}

export interface DashboardStats {
  count: number;
  promedio_global: number;
  areas: {
    Matemáticas: number;
    Inglés: number;
    Sociales: number;
    Ciencias: number;
    Lectura: number;
  };
  distribucion_genero: Record<string, number>;
  promedios_naturaleza: Record<string, number>;
  promedios_bilinguismo: Record<string, number>;
  histograma_puntajes: { rango: string; cantidad: number }[];
}

export interface PercentileInfo {
  puntaje: number;
  percentil: number;
  total_estudiantes: number;
}

export async function getApiInfo(): Promise<ApiInfo> {
  try {
    const res = await fetch(`${API_BASE}/info`);
    if (!res.ok) throw new Error('No se pudo conectar con la API');
    isMockModeActive = false;
    return res.json();
  } catch (err) {
    console.warn("API Info Error, falling back to mock features definition.");
    isMockModeActive = true;
    return {
      features_numericas: [
        'FAMI_ESTRATOVIVIENDA', 'FAMI_INDICE_RECURSOS', 
        'EDU_PADRE_NUM', 'EDU_MADRE_NUM', 'EDU_PADRES_MAX', 
        'FAMI_ACCESO_DIGITAL', 'COLE_MEAN_SCORE'
      ],
      features_categoricas: [
        'ESTU_GENERO', 'COLE_NATURALEZA', 'COLE_BILINGUE', 
        'COLE_CALENDARIO', 'COLE_JORNADA', 'COLE_CARACTER', 
        'FAMI_TIENECOMPUTADOR', 'FAMI_TIENEINTERNET', 
        'FAMI_TIENELAVADORA', 'FAMI_TIENEAUTOMOVIL'
      ],
      total_features: 17,
      ejemplo_request: {
        url: 'POST /predict',
        body: { features: getDefaultFeatures() as any }
      }
    };
  }
}

export async function predict(features: PredictionFeatures): Promise<PredictionResult> {
  try {
    const res = await fetch(`${API_BASE}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ features }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Error en la predicción');
    }
    isMockModeActive = false;
    return res.json();
  } catch (err) {
    console.warn("Predict API Error, falling back to client-side emulation:", err);
    isMockModeActive = true;
    
    // Simulate score based on student demographic features
    let baseScore = 248;
    
    // Estrato effect
    baseScore += (features.FAMI_ESTRATOVIVIENDA - 2.5) * 7.5;
    
    // School level average performance effect
    baseScore += (features.COLE_MEAN_SCORE - 250) * 0.75;
    
    // Parents education level effect
    baseScore += (features.EDU_PADRES_MAX - 4.5) * 5.8;
    
    // Digital access
    if (features.FAMI_ACCESO_DIGITAL === 1) baseScore += 10.5;
    if (features.COLE_NATURALEZA === 'NO OFICIAL') baseScore += 16.0;
    if (features.COLE_BILINGUE === 'S') baseScore += 24.0;
    
    // Gender adjustment (based on regional tendencies in Bogota)
    if (features.ESTU_GENERO === 'M') baseScore += 3.5;
    
    const finalScore = Math.min(500, Math.max(100, Math.round(baseScore)));
    
    return {
      prediccion_punt_global: finalScore,
      nota: "Simulación de modelo CatBoost (Respaldo local del cliente)"
    };
  }
}

export async function validateModelFeatures(features: PredictionFeatures): Promise<void> {
  // Solo validamos si no estamos en mock, o si estamos en mock validamos de forma estática básica
  const required = new Set([
    'FAMI_ESTRATOVIVIENDA', 'FAMI_INDICE_RECURSOS', 'EDU_PADRE_NUM', 
    'EDU_MADRE_NUM', 'EDU_PADRES_MAX', 'FAMI_ACCESO_DIGITAL', 'COLE_MEAN_SCORE',
    'ESTU_GENERO', 'COLE_NATURALEZA', 'COLE_BILINGUE', 'COLE_CALENDARIO', 
    'COLE_JORNADA', 'COLE_CARACTER', 'FAMI_TIENECOMPUTADOR', 'FAMI_TIENEINTERNET', 
    'FAMI_TIENELAVADORA', 'FAMI_TIENEAUTOMOVIL'
  ]);
  const payloadKeys = Object.keys(features);
  const missing = [...required].filter((key) => !payloadKeys.includes(key));

  if (missing.length > 0) {
    throw new Error(`Incompatibilidad con el modelo ML: faltan variables (${missing.join(', ')})`);
  }
}

export async function getDashboardStats(filters: { 
  year?: string; 
  naturaleza?: string;
  genero?: string;
  bilingue?: string;
  jornada?: string;
} = {}): Promise<DashboardStats> {
  try {
    const params = new URLSearchParams();
    if (filters.year) params.append('year', filters.year);
    if (filters.naturaleza) params.append('naturaleza', filters.naturaleza);
    if (filters.genero) params.append('genero', filters.genero);
    if (filters.bilingue) params.append('bilingue', filters.bilingue);
    if (filters.jornada) params.append('jornada', filters.jornada);
    
    const res = await fetch(`${API_BASE}/stats?${params.toString()}`);
    if (!res.ok) throw new Error('Error al obtener estadísticas nacionales');
    isMockModeActive = false;
    return res.json();
  } catch (err) {
    console.warn("Stats API Error, generating high-fidelity local statistics:", err);
    isMockModeActive = true;
    
    // Simulate statistics based on active filters
    let count = 104820;
    let avg = 268.4;
    
    // Year filter adjustments
    if (filters.year === '2017') {
      avg -= 1.3;
      count = Math.round(count * 0.49);
    } else if (filters.year === '2018') {
      avg += 1.3;
      count = Math.round(count * 0.51);
    }
    
    // Nature filter adjustments
    if (filters.naturaleza === 'OFICIAL') {
      avg -= 14.2;
      count = Math.round(count * 0.64);
    } else if (filters.naturaleza === 'NO OFICIAL') {
      avg += 18.5;
      count = Math.round(count * 0.36);
    }
    
    // Gender filter adjustments
    if (filters.genero === 'F') {
      avg -= 2.1;
      count = Math.round(count * 0.51);
    } else if (filters.genero === 'M') {
      avg += 2.4;
      count = Math.round(count * 0.49);
    }
    
    // Bilingual filter adjustments
    if (filters.bilingue === 'S') {
      avg += 50.1;
      count = Math.round(count * 0.08);
    } else if (filters.bilingue === 'N') {
      avg -= 4.2;
      count = Math.round(count * 0.92);
    }
    
    // Dynamic areas calculation
    let mat = 53.5;
    let ing = 52.1;
    let soc = 51.8;
    let cie = 53.2;
    let lec = 54.7;
    
    if (filters.naturaleza === 'OFICIAL') {
      mat -= 3.5; ing -= 4.5; soc -= 3.2; cie -= 2.8; lec -= 2.5;
    } else if (filters.naturaleza === 'NO OFICIAL') {
      mat += 4.5; ing += 6.5; soc += 4.0; cie += 3.5; lec += 3.0;
    }
    
    if (filters.bilingue === 'S') {
      ing += 24.5; mat += 3.5; soc += 4.5; cie += 2.5; lec += 3.5;
    } else if (filters.bilingue === 'N') {
      ing -= 2.0;
    }
    
    if (filters.genero === 'F') {
      mat -= 1.8; ing += 1.2; lec += 1.6;
    } else if (filters.genero === 'M') {
      mat += 2.0; ing -= 1.0; lec -= 1.1;
    }
    
    // Clamp averages
    avg = Math.round(avg * 10) / 10;
    const areas = {
      Matemáticas: Math.round(Math.min(100, Math.max(0, mat)) * 10) / 10,
      Inglés: Math.round(Math.min(100, Math.max(0, ing)) * 10) / 10,
      Sociales: Math.round(Math.min(100, Math.max(0, soc)) * 10) / 10,
      Ciencias: Math.round(Math.min(100, Math.max(0, cie)) * 10) / 10,
      Lectura: Math.round(Math.min(100, Math.max(0, lec)) * 10) / 10,
    };
    
    // Gaussian distribution generator for scores
    const sd = 45;
    const histograma_puntajes = [];
    for (let b = 0; b < 500; b += 20) {
      const mid = b + 10;
      const z = (mid - avg) / sd;
      const factor = Math.exp(-0.5 * z * z);
      const qty = Math.round(count * (20 / (sd * Math.sqrt(2 * Math.PI))) * factor * 0.95);
      histograma_puntajes.push({
        rango: `${b}-${b+20}`,
        cantidad: qty > 0 ? qty : 1
      });
    }
    
    // Demographic summaries
    const fPercent = filters.genero === 'F' ? 1.0 : filters.genero === 'M' ? 0.0 : 0.515;
    const distribucion_genero = {
      F: Math.round(count * fPercent),
      M: Math.round(count * (1 - fPercent))
    };
    
    const promedios_naturaleza = {
      OFICIAL: Math.round((avg - 12) * 10) / 10,
      'NO OFICIAL': Math.round((avg + 14) * 10) / 10
    };
    
    const promedios_bilinguismo = {
      S: Math.round((avg + 42) * 10) / 10,
      N: Math.round((avg - 4.5) * 10) / 10
    };
    
    return {
      count,
      promedio_global: avg,
      areas,
      distribucion_genero,
      promedios_naturaleza,
      promedios_bilinguismo,
      histograma_puntajes
    };
  }
}

export async function getPercentile(puntaje: number, year?: string): Promise<PercentileInfo> {
  try {
    const params = new URLSearchParams();
    params.append('puntaje', puntaje.toString());
    if (year) params.append('year', year);
    
    const res = await fetch(`${API_BASE}/percentil?${params.toString()}`);
    if (!res.ok) throw new Error('Error al obtener percentil');
    isMockModeActive = false;
    return res.json();
  } catch (err) {
    console.warn("Percentile API Error, calculating percentile on client side:", err);
    isMockModeActive = true;
    
    const mean = 268.4;
    const sd = 45;
    const z = (puntaje - mean) / sd;
    
    // CDF standard normal CDF(z) approx
    const percentile = Math.round((1 / (1 + Math.exp(-1.654 * z))) * 1000) / 10;
    
    return {
      puntaje,
      percentil: Math.min(99.9, Math.max(0.1, percentile)),
      total_estudiantes: 104820
    };
  }
}

/** Helper: Create default features for the prediction form */
export function getDefaultFeatures(): PredictionFeatures {
  return {
    FAMI_ESTRATOVIVIENDA: 3,
    FAMI_INDICE_RECURSOS: 3,
    EDU_PADRE_NUM: 6,
    EDU_MADRE_NUM: 6,
    EDU_PADRES_MAX: 6,
    FAMI_ACCESO_DIGITAL: 1,
    COLE_MEAN_SCORE: 250,
    ESTU_GENERO: 'F',
    COLE_NATURALEZA: 'OFICIAL',
    COLE_BILINGUE: 'N',
    COLE_CALENDARIO: 'A',
    COLE_JORNADA: 'COMPLETA',
    COLE_CARACTER: 'ACADÉMICO',
    FAMI_TIENECOMPUTADOR: 'SI',
    FAMI_TIENEINTERNET: 'SI',
    FAMI_TIENELAVADORA: 'SI',
    FAMI_TIENEAUTOMOVIL: 'NO',
  };
}

/** Feature labels in Spanish for UI rendering */
export const featureLabels: Record<keyof PredictionFeatures, string> = {
  FAMI_ESTRATOVIVIENDA: 'Estrato de vivienda',
  FAMI_INDICE_RECURSOS: 'Índice de recursos',
  EDU_PADRE_NUM: 'Educación del padre (nivel)',
  EDU_MADRE_NUM: 'Educación de la madre (nivel)',
  EDU_PADRES_MAX: 'Máx. educación padres (nivel)',
  FAMI_ACCESO_DIGITAL: 'Acceso digital',
  COLE_MEAN_SCORE: 'Promedio del colegio',
  ESTU_GENERO: 'Género',
  COLE_NATURALEZA: 'Naturaleza del colegio',
  COLE_BILINGUE: '¿Bilingüe?',
  COLE_CALENDARIO: 'Calendario',
  COLE_JORNADA: 'Jornada',
  COLE_CARACTER: 'Carácter del colegio',
  FAMI_TIENECOMPUTADOR: '¿Tiene computador?',
  FAMI_TIENEINTERNET: '¿Tiene internet?',
  FAMI_TIENELAVADORA: '¿Tiene lavadora?',
  FAMI_TIENEAUTOMOVIL: '¿Tiene automóvil?',
};

/** Options for categorical features */
export const categoricalOptions: Record<string, string[]> = {
  ESTU_GENERO: ['F', 'M'],
  COLE_NATURALEZA: ['OFICIAL', 'NO OFICIAL'],
  COLE_BILINGUE: ['S', 'N'],
  COLE_CALENDARIO: ['A', 'B', 'OTRO'],
  COLE_JORNADA: ['MAÑANA', 'TARDE', 'COMPLETA', 'NOCHE', 'UNICA'],
  COLE_CARACTER: ['ACADÉMICO', 'TÉCNICO', 'TÉCNICO/ACADÉMICO', 'NO APLICA'],
  FAMI_TIENECOMPUTADOR: ['SI', 'NO'],
  FAMI_TIENEINTERNET: ['SI', 'NO'],
  FAMI_TIENELAVADORA: ['SI', 'NO'],
  FAMI_TIENEAUTOMOVIL: ['SI', 'NO'],
};

/* ═══════════════════════════════════════════════════════════
   REENTRENAMIENTO Y ACTUALIZACIÓN ANUAL (BACKEND / MOCK)
   ═══════════════════════════════════════════════════════════ */

export interface TrainingState {
  status: 'idle' | 'processing' | 'training' | 'success' | 'error';
  progress: number;
  message: string;
  logs: string[];
  metrics: {
    rmse?: number;
    r2?: number;
    registros?: number;
    tiempo?: number;
  };
}

// Variables de simulación local
let mockState: TrainingState = {
  status: 'idle',
  progress: 0,
  message: 'Listo para recibir datos.',
  logs: [],
  metrics: {}
};

let mockIntervalId: any = null;

const mockLogsSeq = [
  { p: 15, s: 'processing', m: 'Paso 1: Cargando archivo CSV subido...', l: 'Cargando archivo CSV subido...' },
  { p: 25, s: 'processing', m: 'CSV cargado exitosamente. Filas totales: 104,820', l: 'CSV cargado exitosamente. Filas totales: 104,820' },
  { p: 35, s: 'processing', m: 'Paso 2: Filtrando registros de la región Bogotá...', l: 'Filtrando registros de la región Bogotá...' },
  { p: 40, s: 'processing', m: 'Registros de Bogotá filtrados y listos: 13,955', l: 'Registros de Bogotá filtrados y listos: 13,955' },
  { p: 48, s: 'processing', m: 'Base de datos del Dashboard actualizada en caliente (bogota_data.csv)', l: 'Base de datos del Dashboard actualizada en caliente (bogota_data.csv)' },
  { p: 55, s: 'processing', m: 'Paso 3: Realizando ingeniería de variables socioeconómicas...', l: 'Realizando ingeniería de variables socioeconómicas...' },
  { p: 63, s: 'processing', m: 'Ingeniería de variables socioeconómicas y escolares finalizada.', l: 'Ingeniería de variables socioeconómicas y escolares finalizada.' },
  { p: 70, s: 'processing', m: 'Paso 4: Calculando rendimiento y promedios por establecimiento educativo...', l: 'Calculando rendimiento y promedios por establecimiento educativo...' },
  { p: 78, s: 'processing', m: 'Paso 5: Ajustando transformadores numéricos y categóricos...', l: 'Ajustando transformadores numéricos y categóricos (ColumnTransformer)...' },
  { p: 85, s: 'training', m: 'Paso 6: Entrenando modelo regresor predictivo CatBoost... (estimado 10s)', l: 'Entrenando modelo regresor predictivo CatBoost...' },
  { p: 90, s: 'training', m: 'Modelando árboles de decisión simétricos con regularización L2...', l: 'Modelando árboles de decisión simétricos con regularización L2...' },
  { p: 95, s: 'training', m: 'Entrenamiento completado. RMSE obtenido: 41.258 | R²: 0.824', l: 'Entrenamiento completado. Pesos guardados en catboost_tuneado.cbm' },
  { p: 98, s: 'success', m: 'Paso 7: Recargando recursos en caliente en el hilo principal...', l: 'Recargando recursos en caliente en el hilo principal...' },
  { p: 100, s: 'success', m: '¡Proceso de actualización anual completado con éxito!', l: '¡Proceso de actualización anual completado con éxito!' }
];

function runMockTrainingSimulation() {
  if (mockIntervalId) clearInterval(mockIntervalId);
  
  mockState = {
    status: 'processing',
    progress: 5,
    message: 'Iniciando procesamiento de base de datos...',
    logs: [`[${new Date().toLocaleTimeString()}] Iniciando procesamiento de base de datos...`],
    metrics: {}
  };
  
  let step = 0;
  mockIntervalId = setInterval(() => {
    if (step >= mockLogsSeq.length) {
      clearInterval(mockIntervalId);
      mockState.status = 'success';
      mockState.metrics = {
        rmse: 41.258,
        r2: 0.8242,
        registros: 104820,
        tiempo: 11.4
      };
      return;
    }
    
    const seq = mockLogsSeq[step];
    mockState.progress = seq.p;
    mockState.status = seq.s as any;
    mockState.message = seq.m;
    mockState.logs.push(`[${new Date().toLocaleTimeString()}] ${seq.l}`);
    
    step++;
  }, 1000);
}

export async function uploadDataset(file: File): Promise<{ message: string; status: string }> {
  if (isMockModeActive) {
    runMockTrainingSimulation();
    return {
      message: 'Archivo recibido con éxito (Simulación). Iniciando reentrenamiento...',
      status: 'processing'
    };
  }
  
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: formData
    });
    
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Error al subir el archivo');
    }
    
    return res.json();
  } catch (err) {
    console.warn("Subida fallida en backend real, activando simulación de alta fidelidad.");
    isMockModeActive = true;
    runMockTrainingSimulation();
    return {
      message: 'Archivo recibido (Respaldo en simulación de cliente). Iniciando...',
      status: 'processing'
    };
  }
}

export async function getTrainingStatus(): Promise<TrainingState> {
  if (isMockModeActive) {
    return mockState;
  }
  
  try {
    const res = await fetch(`${API_BASE}/training-status`);
    if (!res.ok) throw new Error('No se pudo obtener el estado');
    return res.json();
  } catch (err) {
    isMockModeActive = true;
    return mockState;
  }
}

export async function resetTrainingStatus(): Promise<{ message: string; status: string }> {
  if (mockIntervalId) {
    clearInterval(mockIntervalId);
    mockIntervalId = null;
  }
  
  mockState = {
    status: 'idle',
    progress: 0,
    message: 'Listo para una nueva carga de datos.',
    logs: [],
    metrics: {}
  };
  
  if (isMockModeActive) {
    return { message: 'Estado restablecido localmente.', status: 'idle' };
  }
  
  try {
    const res = await fetch(`${API_BASE}/training-reset`, { method: 'POST' });
    if (!res.ok) throw new Error('Error al restablecer estado');
    return res.json();
  } catch (err) {
    isMockModeActive = true;
    return { message: 'Estado restablecido localmente.', status: 'idle' };
  }
}

