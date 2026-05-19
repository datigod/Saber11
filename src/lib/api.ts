/**
 * API Service – Integración con la API Flask de CatBoost (Saber 11)
 * Proxy configurado en vite.config.ts: /api → http://127.0.0.1:5000
 */

const API_BASE = '/api';

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
  const res = await fetch(`${API_BASE}/info`);
  if (!res.ok) throw new Error('No se pudo conectar con la API');
  return res.json();
}

export async function predict(features: PredictionFeatures): Promise<PredictionResult> {
  const res = await fetch(`${API_BASE}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ features }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Error en la predicción');
  }
  return res.json();
}

export async function validateModelFeatures(features: PredictionFeatures): Promise<void> {
  const info = await getApiInfo();
  const required = new Set([...info.features_numericas, ...info.features_categoricas]);
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
  const params = new URLSearchParams();
  if (filters.year) params.append('year', filters.year);
  if (filters.naturaleza) params.append('naturaleza', filters.naturaleza);
  if (filters.genero) params.append('genero', filters.genero);
  if (filters.bilingue) params.append('bilingue', filters.bilingue);
  if (filters.jornada) params.append('jornada', filters.jornada);
  
  const res = await fetch(`${API_BASE}/stats?${params.toString()}`);
  if (!res.ok) throw new Error('Error al obtener estadísticas nacionales');
  return res.json();
}

export async function getPercentile(puntaje: number, year?: string): Promise<PercentileInfo> {
  const params = new URLSearchParams();
  params.append('puntaje', puntaje.toString());
  if (year) params.append('year', year);
  
  const res = await fetch(`${API_BASE}/percentil?${params.toString()}`);
  if (!res.ok) throw new Error('Error al obtener percentil');
  return res.json();
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
