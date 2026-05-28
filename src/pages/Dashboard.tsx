import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { Users, BookOpen, Building2, Filter, Activity, TrendingUp, Trophy, Sparkles, AlertCircle, Info } from 'lucide-react';
import { PageTransition, FadeInView } from '../lib/animations';
import { getDashboardStats, isMockModeActive, type DashboardStats } from '../lib/api';
import { Badge, Card } from '../components/ui';

const COLORS = ['#1155F2', '#22C5F0', '#8DD400', '#0B2D6B', '#3b82f6'];

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [userPrediction, setUserPrediction] = useState<{ score: number } | null>(null);
  const [filters, setFilters] = useState({
    year: '',
    naturaleza: '',
    genero: '',
    bilingue: '',
    jornada: ''
  });
  const [activeMockBanner, setActiveMockBanner] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem('saber11_prediction');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed.score === 'number') {
          setUserPrediction(parsed);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      try {
        const data = await getDashboardStats(filters);
        setStats(data);
        // Mostrar banner si el API falló y se activó el mock mode en el cliente
        setActiveMockBanner(isMockModeActive);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [filters]);

  const areasData = stats ? Object.entries(stats.areas).map(([name, value]) => ({
    subject: name,
    score: value,
    fullMark: 100
  })) : [];

  const genderData = stats ? Object.entries(stats.distribucion_genero).map(([name, value]) => ({
    name: name === 'F' ? 'Mujeres' : name === 'M' ? 'Hombres' : name,
    value
  })) : [];

  const bilingueData = stats ? Object.entries(stats.promedios_bilinguismo).map(([name, value]) => ({
    name: name === 'S' ? 'Bilingüe' : 'No Bilingüe',
    score: value
  })) : [];

  return (
    <PageTransition>
      {/* Background soft blur highlights */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-primary-200/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 left-5 w-80 h-80 bg-secondary-200/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12 relative z-10">
        
        {/* Mock Mode Alert Banner */}
        {activeMockBanner && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 rounded-2xl bg-amber-500/10 backdrop-blur-md border border-amber-500/35 flex flex-col sm:flex-row items-center sm:justify-between gap-4 text-amber-900 shadow-md shadow-amber-500/5"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-700 shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-sm font-bold text-amber-800">Modo Demostración Local Activo</p>
                <p className="text-xs text-amber-700 mt-0.5">
                  El servidor Flask local no está conectado. Mostrando estadísticas históricas dinámicas simuladas.
                </p>
              </div>
            </div>
            <button 
              onClick={() => setActiveMockBanner(false)}
              className="text-xs font-bold text-amber-800 hover:text-amber-900 bg-amber-500/20 hover:bg-amber-500/30 px-3 py-1.5 rounded-lg border border-amber-500/25 transition-all"
            >
              Entendido
            </button>
          </motion.div>
        )}

        {/* Dashboard Header */}
        <div className="mb-10 text-center lg:text-left relative">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-primary-100/60 border border-primary-200 text-primary-700 rounded-full text-xs font-bold uppercase tracking-wider mb-4 shadow-sm backdrop-blur-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-primary-500 animate-pulse"></span>
            Observatorio Educativo Bogotá D.C.
          </div>
          
          <h1 className="text-3xl lg:text-5xl font-heading font-extrabold text-surface-900 tracking-tight flex items-center gap-4 justify-center lg:justify-start">
            <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center text-white shadow-lg shadow-primary-500/35">
              <Activity className="w-6 h-6" />
            </div>
            <span>Panorama General Saber 11</span>
          </h1>
          
          <p className="text-surface-600 mt-4 text-base lg:text-lg max-w-3xl leading-relaxed">
            Explora las métricas y el rendimiento de los estudiantes en la capital. Modifica los filtros a continuación para analizar cómo varían las calificaciones en distintas poblaciones.
          </p>
        </div>

        {/* Filters Toolbar */}
        <FadeInView className="bg-white/80 backdrop-blur-md rounded-3xl shadow-lg shadow-primary-500/[0.02] border border-surface-200/80 p-6 mb-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
            <div className="flex items-center gap-2.5 text-surface-800 font-bold uppercase tracking-wider text-xs border-r border-surface-200/80 pr-6 mr-2 shrink-0">
              <Filter className="w-4.5 h-4.5 text-primary-500" />
              <span>Filtrar Datos</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
              {/* Year Filter */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-surface-500 uppercase tracking-wider pl-1">Año de Evaluación</label>
                <div className="flex bg-surface-150/70 p-1 rounded-xl border border-surface-200/40">
                  <button 
                    onClick={() => setFilters(f => ({ ...f, year: '' }))}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${!filters.year ? 'bg-white text-primary-600 shadow-sm' : 'text-surface-600 hover:text-surface-900'}`}
                  >
                    Todos
                  </button>
                  <button 
                    onClick={() => setFilters(f => ({ ...f, year: '2017' }))}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${filters.year === '2017' ? 'bg-white text-primary-600 shadow-sm' : 'text-surface-600 hover:text-surface-900'}`}
                  >
                    2017
                  </button>
                  <button 
                    onClick={() => setFilters(f => ({ ...f, year: '2018' }))}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${filters.year === '2018' ? 'bg-white text-primary-600 shadow-sm' : 'text-surface-600 hover:text-surface-900'}`}
                  >
                    2018
                  </button>
                </div>
              </div>

              {/* Sector Filter */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-surface-500 uppercase tracking-wider pl-1">Sector (Naturaleza)</label>
                <div className="flex bg-surface-150/70 p-1 rounded-xl border border-surface-200/40">
                  <button 
                    onClick={() => setFilters(f => ({ ...f, naturaleza: '' }))}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${!filters.naturaleza ? 'bg-white text-primary-600 shadow-sm' : 'text-surface-600 hover:text-surface-900'}`}
                  >
                    Todos
                  </button>
                  <button 
                    onClick={() => setFilters(f => ({ ...f, naturaleza: 'OFICIAL' }))}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${filters.naturaleza === 'OFICIAL' ? 'bg-white text-primary-600 shadow-sm' : 'text-surface-600 hover:text-surface-900'}`}
                  >
                    Oficial
                  </button>
                  <button 
                    onClick={() => setFilters(f => ({ ...f, naturaleza: 'NO OFICIAL' }))}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${filters.naturaleza === 'NO OFICIAL' ? 'bg-white text-primary-600 shadow-sm' : 'text-surface-600 hover:text-surface-900'}`}
                  >
                    No Of.
                  </button>
                </div>
              </div>

              {/* Gender Filter */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-surface-500 uppercase tracking-wider pl-1">Género del Estudiante</label>
                <div className="flex bg-surface-150/70 p-1 rounded-xl border border-surface-200/40">
                  <button 
                    onClick={() => setFilters(f => ({ ...f, genero: '' }))}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${!filters.genero ? 'bg-white text-primary-600 shadow-sm' : 'text-surface-600 hover:text-surface-900'}`}
                  >
                    Todos
                  </button>
                  <button 
                    onClick={() => setFilters(f => ({ ...f, genero: 'F' }))}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${filters.genero === 'F' ? 'bg-white text-primary-600 shadow-sm' : 'text-surface-600 hover:text-surface-900'}`}
                  >
                    Mujeres
                  </button>
                  <button 
                    onClick={() => setFilters(f => ({ ...f, genero: 'M' }))}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${filters.genero === 'M' ? 'bg-white text-primary-600 shadow-sm' : 'text-surface-600 hover:text-surface-900'}`}
                  >
                    Hombres
                  </button>
                </div>
              </div>

              {/* Bilingual Filter */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-surface-500 uppercase tracking-wider pl-1">Bilingüismo del Colegio</label>
                <div className="flex bg-surface-150/70 p-1 rounded-xl border border-surface-200/40">
                  <button 
                    onClick={() => setFilters(f => ({ ...f, bilingue: '' }))}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${!filters.bilingue ? 'bg-white text-primary-600 shadow-sm' : 'text-surface-600 hover:text-surface-900'}`}
                  >
                    Todos
                  </button>
                  <button 
                    onClick={() => setFilters(f => ({ ...f, bilingue: 'S' }))}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${filters.bilingue === 'S' ? 'bg-white text-primary-600 shadow-sm' : 'text-surface-600 hover:text-surface-900'}`}
                  >
                    Sí
                  </button>
                  <button 
                    onClick={() => setFilters(f => ({ ...f, bilingue: 'N' }))}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${filters.bilingue === 'N' ? 'bg-white text-primary-600 shadow-sm' : 'text-surface-600 hover:text-surface-900'}`}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          </div>
        </FadeInView>

        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center">
            <div className="w-14 h-14 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mb-4 shadow-sm"></div>
            <p className="text-surface-500 font-bold text-sm tracking-wide">Calculando estadísticas...</p>
          </div>
        ) : stats ? (
          <div className="space-y-8">
            
            {/* Projected Score Callout (Student Only) */}
            {userPrediction && (
              <FadeInView className="bg-gradient-to-br from-primary-950 via-slate-900 to-indigo-950 rounded-3xl p-8 border border-primary-800 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
                <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute left-1/3 bottom-0 w-44 h-44 bg-tertiary-500/5 rounded-full blur-2xl pointer-events-none"></div>

                <div className="flex items-start sm:items-center gap-5 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10 shadow-inner">
                    <Sparkles className="w-7 h-7 text-tertiary-300 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-heading font-extrabold text-xl tracking-tight flex items-center gap-2.5">
                      Tu Proyección Estimada vs Regional
                      <Badge variant="success" className="bg-tertiary-500/20 text-tertiary-400 border-none font-bold">ACTIVA</Badge>
                    </h3>
                    <p className="text-sm text-surface-300 mt-2 max-w-xl leading-relaxed">
                      {userPrediction.score >= stats.promedio_global 
                        ? `¡Excelente! Estás superando el promedio de la región de Bogotá en +${(userPrediction.score - stats.promedio_global).toFixed(0)} puntos. Mantén este ritmo.`
                        : `Estás a ${(stats.promedio_global - userPrediction.score).toFixed(0)} puntos de alcanzar la media regional de Bogotá. ¡Tu ruta personalizada te ayudará a lograrlo!`
                      }
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 bg-white/5 backdrop-blur-sm rounded-2xl p-4.5 border border-white/10 w-full md:w-auto shrink-0 justify-around md:justify-start relative z-10">
                  <div className="text-center">
                    <p className="text-[10px] uppercase font-bold tracking-wider opacity-75">Tu Estimación</p>
                    <p className="text-3xl font-heading font-extrabold text-tertiary-400 mt-1">{userPrediction.score}</p>
                  </div>
                  <div className="w-px h-8 bg-white/20"></div>
                  <div className="text-center">
                    <p className="text-[10px] uppercase font-bold tracking-wider opacity-75">Promedio Bogotá</p>
                    <p className="text-3xl font-heading font-extrabold text-white mt-1">{Math.round(stats.promedio_global)}</p>
                  </div>
                </div>
              </FadeInView>
            )}

            {/* KPI Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Cards wrapper with beautiful shadows and hover states */}
              <FadeInView delay={0.05} className="bg-white rounded-3xl shadow-md shadow-primary-500/[0.01] border border-surface-200/80 p-6 flex items-center gap-5 hover:border-primary-400/40 hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center shrink-0 shadow-inner">
                  <Users className="w-6 h-6 text-primary-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-surface-500 uppercase tracking-wider">Estudiantes Evaluados</p>
                  <p className="text-3xl font-heading font-extrabold text-surface-900 mt-1">
                    {stats.count.toLocaleString()}
                  </p>
                </div>
              </FadeInView>
              
              <FadeInView delay={0.1} className="bg-white rounded-3xl shadow-md shadow-primary-500/[0.01] border border-surface-200/80 p-6 flex items-center gap-5 relative overflow-hidden hover:border-tertiary-400/40 hover:shadow-lg transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-tertiary-50/50 rounded-full -translate-y-1/2 translate-x-1/4 opacity-40 blur-2xl"></div>
                <div className="w-14 h-14 rounded-2xl bg-tertiary-50 flex items-center justify-center shrink-0 shadow-inner z-10">
                  <Trophy className="w-6 h-6 text-tertiary-500" />
                </div>
                <div className="z-10">
                  <p className="text-xs font-bold text-surface-500 uppercase tracking-wider">Promedio Global</p>
                  <p className="text-3xl font-heading font-extrabold text-surface-900 mt-1">
                    {stats.promedio_global} <span className="text-sm text-surface-400 font-normal">/ 500 pts</span>
                  </p>
                </div>
              </FadeInView>

              <FadeInView delay={0.15} className="bg-white rounded-3xl shadow-md shadow-primary-500/[0.01] border border-surface-200/80 p-6 flex items-center gap-5 hover:border-amber-400/40 hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0 shadow-inner">
                  <Building2 className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-surface-500 uppercase tracking-wider">Sector Analizado</p>
                  <p className="text-lg font-heading font-extrabold text-surface-900 mt-2 truncate max-w-[180px]">
                    {filters.naturaleza || 'Todos (Público/Privado)'}
                  </p>
                </div>
              </FadeInView>
            </div>

            {/* Gaussian Curve / Score Distribution */}
            <FadeInView delay={0.2} className="bg-white rounded-3xl shadow-md shadow-primary-500/[0.01] border border-surface-200/80 p-6 sm:p-8">
              <h3 className="font-heading font-bold text-lg text-surface-900 mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary-500" /> 
                <span>Distribución Histórica de los Puntajes Globales</span>
                <span className="text-xs font-normal text-surface-400 italic ml-2">(Campana de Gauss)</span>
              </h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.histograma_puntajes} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1155F2" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#1155F2" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f3f7" />
                    <XAxis dataKey="rango" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', fontFamily: 'Inter' }}
                      labelStyle={{ color: '#64748b', fontWeight: 'bold', fontSize: 12, marginBottom: '4px' }}
                    />
                    <Area type="monotone" dataKey="cantidad" name="Estudiantes" stroke="#1155F2" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </FadeInView>

            {/* Radar and Linear Bar Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Radar Chart (Subject comparison) */}
              <FadeInView delay={0.25} className="bg-white rounded-3xl shadow-md shadow-primary-500/[0.01] border border-surface-200/80 p-6 sm:p-8 flex flex-col items-center">
                <h3 className="font-heading font-bold text-lg text-surface-900 mb-6 flex items-center gap-2.5 self-start">
                  <BookOpen className="w-5 h-5 text-primary-500" /> 
                  <span>Promedio por Áreas de Conocimiento</span>
                  <span className="text-xs font-normal text-surface-400 italic">(Escala 0-100)</span>
                </h3>
                <div className="h-80 w-full max-w-[420px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={areasData}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#334155', fontSize: 11, fontWeight: 700 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 9 }} />
                      <Radar name="Promedio Bogotá" dataKey="score" stroke="#1155F2" fill="#1155F2" fillOpacity={0.15} strokeWidth={2.5} />
                      <RechartsTooltip 
                        contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', fontFamily: 'Inter' }}
                        itemStyle={{ color: '#1155F2', fontWeight: 'bold' }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </FadeInView>

              {/* Bar Chart (Subject comparisons in columns) */}
              <FadeInView delay={0.3} className="bg-white rounded-3xl shadow-md shadow-primary-500/[0.01] border border-surface-200/80 p-6 sm:p-8">
                <h3 className="font-heading font-bold text-lg text-surface-900 mb-6 flex items-center gap-2.5">
                  <TrendingUp className="w-5 h-5 text-tertiary-500" /> 
                  <span>Comparativa Directa de Desempeño</span>
                </h3>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={areasData} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f3f7" />
                      <XAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 650 }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                      <RechartsTooltip 
                        cursor={{ fill: '#f8fafc', opacity: 0.8 }}
                        contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}
                      />
                      <Bar dataKey="score" name="Puntaje Promedio" fill="#1155F2" radius={[8, 8, 0, 0]} maxBarSize={45}>
                        {areasData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </FadeInView>
            </div>
            
            {/* Demographic Distribution & Bilingualism charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Pie Chart (Demographics) */}
              <FadeInView delay={0.35} className="bg-white rounded-3xl shadow-md shadow-primary-500/[0.01] border border-surface-200/80 p-6 sm:p-8 flex flex-col items-center">
                <h3 className="font-heading font-bold text-lg text-surface-900 mb-6 flex items-center gap-2.5 self-start">
                  <Users className="w-5 h-5 text-primary-500" /> 
                  <span>Distribución Demográfica de Evaluados</span>
                </h3>
                <div className="h-64 w-full max-w-[380px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie 
                        data={genderData} 
                        cx="50%" 
                        cy="50%" 
                        innerRadius={65} 
                        outerRadius={85} 
                        dataKey="value" 
                        stroke="none"
                        paddingAngle={3}
                        label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                      >
                        {genderData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? '#1155F2' : '#22C5F0'} />
                        ))}
                      </Pie>
                      <RechartsTooltip contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </FadeInView>

              {/* Bar Chart (Bilingualism) */}
              <FadeInView delay={0.4} className="bg-white rounded-3xl shadow-md shadow-primary-500/[0.01] border border-surface-200/80 p-6 sm:p-8">
                <h3 className="font-heading font-bold text-lg text-surface-900 mb-6 flex items-center gap-2.5">
                  <Building2 className="w-5 h-5 text-primary-500" /> 
                  <span>Impacto del Bilingüismo en el Puntaje Global</span>
                </h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={bilingueData} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f3f7" />
                      <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 650 }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 400]} tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                      <RechartsTooltip 
                        cursor={{ fill: '#f8fafc', opacity: 0.8 }}
                        contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}
                      />
                      <Bar dataKey="score" name="Puntaje Global" fill="#22C5F0" radius={[8, 8, 0, 0]} maxBarSize={60}>
                        {bilingueData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? '#1155F2' : '#f59e0b'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </FadeInView>
            </div>

            {/* Educational Info Note */}
            <FadeInView delay={0.45} className="p-5 rounded-3xl bg-slate-50 border border-surface-200 flex items-start gap-4 shadow-sm">
              <div className="w-10 h-10 rounded-2xl bg-white border border-surface-200 flex items-center justify-center shrink-0 shadow-sm text-primary-500">
                <Info className="w-5 h-5" />
              </div>
              <div className="text-xs sm:text-sm text-surface-600 leading-relaxed">
                <b>Nota Metodológica:</b> Los datos corresponden a los periodos 20171, 20172, 20181 y 20182 en el Distrito Capital de Bogotá D.C. Las correlaciones demográficas representan tendencias promedio y no implican una limitación individual para el desempeño final de ningún estudiante.
              </div>
            </FadeInView>

          </div>
        ) : null}
      </div>
    </PageTransition>
  );
}
