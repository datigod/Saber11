import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';
import { Users, BookOpen, Building2, Filter, Activity, TrendingUp, Trophy, Sparkles } from 'lucide-react';
import { PageTransition, FadeInView } from '../lib/animations';
import { getDashboardStats, DashboardStats } from '../lib/api';
import { Badge } from '../components/ui';

const COLORS = ['#0057A8', '#2bc48e', '#f59e0b', '#00407e', '#72a8ff'];

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
      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
        <div className="mb-10 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
            Datos Bogotá D.C.
          </div>
          <h1 className="text-3xl lg:text-4xl font-heading font-extrabold text-surface-900 tracking-tight flex items-center gap-3 justify-center lg:justify-start">
            <Activity className="w-10 h-10 text-primary-500" />
            Panorama Regional Saber 11
          </h1>
          <p className="text-surface-600 mt-3 text-lg max-w-2xl">
            Explora los resultados históricos de Bogotá (2017-2018) y entiende cómo se distribuyen los puntajes según distintas variables socioeducativas.
          </p>
        </div>

        {/* Filters */}
        <FadeInView className="bg-white rounded-2xl shadow-sm border border-surface-200 p-5 mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex items-center gap-2 text-surface-500 font-semibold uppercase tracking-wider text-sm">
              <Filter className="w-4 h-4" /> Filtros
            </div>
            
            <div className="flex flex-wrap gap-4 flex-1">
              <div className="flex bg-surface-100 p-1 rounded-lg">
                <button 
                  onClick={() => setFilters(f => ({ ...f, year: '' }))}
                  className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${!filters.year ? 'bg-white text-primary-700 shadow-sm' : 'text-surface-600'}`}
                >
                  Todos (17-18)
                </button>
                <button 
                  onClick={() => setFilters(f => ({ ...f, year: '2017' }))}
                  className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${filters.year === '2017' ? 'bg-white text-primary-700 shadow-sm' : 'text-surface-600'}`}
                >
                  2017
                </button>
                <button 
                  onClick={() => setFilters(f => ({ ...f, year: '2018' }))}
                  className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${filters.year === '2018' ? 'bg-white text-primary-700 shadow-sm' : 'text-surface-600'}`}
                >
                  2018
                </button>
              </div>

              <div className="flex bg-surface-100 p-1 rounded-lg">
                <button 
                  onClick={() => setFilters(f => ({ ...f, naturaleza: '' }))}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${!filters.naturaleza ? 'bg-white text-primary-700 shadow-sm' : 'text-surface-600'}`}
                >
                  Sector: Todos
                </button>
                <button 
                  onClick={() => setFilters(f => ({ ...f, naturaleza: 'OFICIAL' }))}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${filters.naturaleza === 'OFICIAL' ? 'bg-white text-primary-700 shadow-sm' : 'text-surface-600'}`}
                >
                  Oficial
                </button>
                <button 
                  onClick={() => setFilters(f => ({ ...f, naturaleza: 'NO OFICIAL' }))}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${filters.naturaleza === 'NO OFICIAL' ? 'bg-white text-primary-700 shadow-sm' : 'text-surface-600'}`}
                >
                  No Oficial
                </button>
              </div>

              <div className="flex bg-surface-100 p-1 rounded-lg">
                <button 
                  onClick={() => setFilters(f => ({ ...f, genero: '' }))}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${!filters.genero ? 'bg-white text-primary-700 shadow-sm' : 'text-surface-600'}`}
                >
                  Género: Todos
                </button>
                <button 
                  onClick={() => setFilters(f => ({ ...f, genero: 'F' }))}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${filters.genero === 'F' ? 'bg-white text-primary-700 shadow-sm' : 'text-surface-600'}`}
                >
                  Mujeres
                </button>
                <button 
                  onClick={() => setFilters(f => ({ ...f, genero: 'M' }))}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${filters.genero === 'M' ? 'bg-white text-primary-700 shadow-sm' : 'text-surface-600'}`}
                >
                  Hombres
                </button>
              </div>

              <div className="flex bg-surface-100 p-1 rounded-lg">
                <button 
                  onClick={() => setFilters(f => ({ ...f, bilingue: '' }))}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${!filters.bilingue ? 'bg-white text-primary-700 shadow-sm' : 'text-surface-600'}`}
                >
                  Bilingüe: Todos
                </button>
                <button 
                  onClick={() => setFilters(f => ({ ...f, bilingue: 'S' }))}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${filters.bilingue === 'S' ? 'bg-white text-primary-700 shadow-sm' : 'text-surface-600'}`}
                >
                  Sí
                </button>
                <button 
                  onClick={() => setFilters(f => ({ ...f, bilingue: 'N' }))}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${filters.bilingue === 'N' ? 'bg-white text-primary-700 shadow-sm' : 'text-surface-600'}`}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </FadeInView>

        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mb-4"></div>
            <p className="text-surface-500 font-medium">Calculando estadísticas...</p>
          </div>
        ) : stats ? (
          <div className="space-y-8">
            {/* Comparativa de tu Puntaje Proyectado */}
            {userPrediction && (
              <FadeInView className="bg-gradient-to-br from-primary-950 via-slate-900 to-indigo-950 rounded-3xl p-6 border border-primary-800 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
                <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-48 h-48 bg-primary-500/10 rounded-full blur-3xl"></div>
                <div className="absolute left-1/3 bottom-0 w-36 h-36 bg-success-500/5 rounded-full blur-2xl"></div>

                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10 shadow-inner">
                    <Sparkles className="w-7 h-7 text-success-300 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-heading font-extrabold text-xl tracking-tight flex items-center gap-2">
                      Tu Proyección IA vs Regional
                      <Badge variant="success" size="sm" className="bg-success-500/25 text-success-300 border-none font-bold">ACTIVA</Badge>
                    </h3>
                    <p className="text-sm text-surface-300 mt-1 max-w-lg">
                      {userPrediction.score >= stats.promedio_global 
                        ? `¡Excelente! Estás superando el promedio de Bogotá en +${(userPrediction.score - stats.promedio_global).toFixed(0)} puntos.`
                        : `Estás a ${(stats.promedio_global - userPrediction.score).toFixed(0)} puntos de alcanzar el promedio regional de Bogotá. ¡El Tutor IA te guiará!`
                      }
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 bg-white/5 rounded-2xl p-4 border border-white/10 w-full md:w-auto shrink-0 justify-around md:justify-start relative z-10">
                  <div className="text-center">
                    <p className="text-[10px] uppercase font-bold tracking-wider opacity-75">Tu Estimación</p>
                    <p className="text-3xl font-heading font-extrabold text-success-400 mt-0.5">{userPrediction.score}</p>
                  </div>
                  <div className="w-px h-8 bg-white/20"></div>
                  <div className="text-center">
                    <p className="text-[10px] uppercase font-bold tracking-wider opacity-75">Promedio Bogotá</p>
                    <p className="text-3xl font-heading font-extrabold text-white/95 mt-0.5">{Math.round(stats.promedio_global)}</p>
                  </div>
                </div>
              </FadeInView>
            )}

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FadeInView delay={0.1} className="bg-white rounded-2xl shadow-sm border border-surface-200 p-6 flex items-center gap-5">
                <div className="w-14 h-14 rounded-full bg-primary-50 flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-surface-500 uppercase tracking-wider">Estudiantes Evaluados</p>
                  <p className="text-3xl font-heading font-extrabold text-surface-900 mt-1">
                    {stats.count.toLocaleString()}
                  </p>
                </div>
              </FadeInView>
              
              <FadeInView delay={0.2} className="bg-white rounded-2xl shadow-sm border border-surface-200 p-6 flex items-center gap-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-success-50 rounded-full -translate-y-1/2 translate-x-1/4 opacity-50 blur-2xl"></div>
                <div className="w-14 h-14 rounded-full bg-success-50 flex items-center justify-center shrink-0 z-10">
                  <Trophy className="w-6 h-6 text-success-600" />
                </div>
                <div className="z-10">
                  <p className="text-sm font-semibold text-surface-500 uppercase tracking-wider">Promedio Global</p>
                  <p className="text-3xl font-heading font-extrabold text-surface-900 mt-1">
                    {stats.promedio_global} <span className="text-lg text-surface-400 font-normal">/ 500</span>
                  </p>
                </div>
              </FadeInView>

              <FadeInView delay={0.3} className="bg-white rounded-2xl shadow-sm border border-surface-200 p-6 flex items-center gap-5">
                <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                  <Building2 className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-surface-500 uppercase tracking-wider">Sector Analizado</p>
                  <p className="text-xl font-heading font-bold text-surface-900 mt-1">
                    {filters.naturaleza || 'Mixto (Nacional)'}
                  </p>
                </div>
              </FadeInView>
            </div>

            {/* Area Chart: Distribución Campana */}
            <FadeInView delay={0.35} className="bg-white rounded-2xl shadow-sm border border-surface-200 p-6">
              <h3 className="font-heading font-bold text-lg text-surface-900 mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary-500" /> Distribución de Puntajes (Campana)
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.histograma_puntajes} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0057A8" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#0057A8" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ededf5" />
                    <XAxis dataKey="rango" tick={{ fill: '#727783', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#727783', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}
                      labelStyle={{ color: '#727783', fontWeight: 'bold', marginBottom: '4px' }}
                    />
                    <Area type="monotone" dataKey="cantidad" stroke="#0057A8" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </FadeInView>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Radar Chart for Areas */}
              <FadeInView delay={0.4} className="bg-white rounded-2xl shadow-sm border border-surface-200 p-6">
                <h3 className="font-heading font-bold text-lg text-surface-900 mb-6 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary-500" /> Rendimiento por Áreas (0-100)
                </h3>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={areasData}>
                      <PolarGrid stroke="#e1e2e9" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#424751', fontSize: 12, fontWeight: 600 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#727783' }} />
                      <Radar name="Promedio" dataKey="score" stroke="#005fae" fill="#005fae" fillOpacity={0.3} />
                      <RechartsTooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}
                        itemStyle={{ color: '#005fae', fontWeight: 'bold' }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </FadeInView>

              {/* Bar Chart for Areas */}
              <FadeInView delay={0.5} className="bg-white rounded-2xl shadow-sm border border-surface-200 p-6">
                <h3 className="font-heading font-bold text-lg text-surface-900 mb-6 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-success-500" /> Comparativa Lineal de Áreas
                </h3>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={areasData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ededf5" />
                      <XAxis dataKey="subject" tick={{ fill: '#727783', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 100]} tick={{ fill: '#727783' }} axisLine={false} tickLine={false} />
                      <RechartsTooltip 
                        cursor={{ fill: '#f9f9ff' }}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}
                      />
                      <Bar dataKey="score" fill="#0057A8" radius={[6, 6, 0, 0]}>
                        {areasData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </FadeInView>
            </div>
            
            {/* Secondary Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <FadeInView delay={0.6} className="bg-white rounded-2xl shadow-sm border border-surface-200 p-6 flex flex-col items-center justify-center">
                <h3 className="font-heading font-bold text-lg text-surface-900 mb-6 self-start flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary-500" /> Distribución Demográfica
                </h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={genderData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} dataKey="value" stroke="none" label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                        {genderData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? '#0057A8' : '#2bc48e'} />
                        ))}
                      </Pie>
                      <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </FadeInView>

              <FadeInView delay={0.7} className="bg-white rounded-2xl shadow-sm border border-surface-200 p-6">
                <h3 className="font-heading font-bold text-lg text-surface-900 mb-6 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary-500" /> Promedio Bilingüismo
                </h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={bilingueData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ededf5" />
                      <XAxis dataKey="name" tick={{ fill: '#727783', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 500]} tick={{ fill: '#727783' }} axisLine={false} tickLine={false} />
                      <RechartsTooltip 
                        cursor={{ fill: '#f9f9ff' }}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}
                      />
                      <Bar dataKey="score" fill="#2bc48e" radius={[6, 6, 0, 0]}>
                        {bilingueData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? '#0057A8' : '#f59e0b'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </FadeInView>
            </div>
          </div>
        ) : null}
      </div>
    </PageTransition>
  );
}
