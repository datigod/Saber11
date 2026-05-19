import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home, Map, Route, Swords, GraduationCap, User, Trophy, CalendarCheck,
  BookOpen, School, Building2, Info, Menu, X, Activity
} from 'lucide-react';
import { LogoIcon } from '../ui/LogoIcon';
import { useState, useEffect } from 'react';

const studentLinks = [
  { to: '/', label: 'Inicio', icon: Home },
  { to: '/mapa', label: 'Mapa', icon: Map },
  { to: '/ruta', label: 'Mi Ruta', icon: Route },
  { to: '/retos', label: 'Retos', icon: Swords },
  { to: '/practica', label: 'Práctica', icon: BookOpen },
  { to: '/perfil', label: 'Perfil', icon: User },
  { to: '/logros', label: 'Logros', icon: Trophy },
  { to: '/habitos', label: 'Hábitos', icon: CalendarCheck },
];

const docenteLinks = [
  { to: '/dashboard', label: 'Panorama General', icon: Activity },
  { to: '/docente', label: 'Orientación', icon: GraduationCap },
  { to: '/docente/panel', label: 'Panel Docente', icon: School },
  { to: '/institucional', label: 'Institucional', icon: Building2 },
];

const extraLinks = [
  { to: '/sobre', label: 'Sobre el proyecto', icon: Info },
];

export function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Top navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-surface-200 shadow-sm">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
              <LogoIcon className="w-full h-full" />
            </div>
            <span className="font-heading text-lg font-bold text-primary-600 hidden sm:block">
              Ruta Saber 11
            </span>
          </Link>

          {/* Desktop nav tabs */}
          <div className="hidden lg:flex items-center gap-1">
            {['Estudiantes', 'Docentes', 'Instituciones'].map((tab, i) => {
              const isDocenteRoute = location.pathname.startsWith('/docente') || location.pathname === '/dashboard';
              const isInstiRoute = location.pathname.startsWith('/institucional');
              
              let isActive = false;
              if (i === 0) isActive = !isDocenteRoute && !isInstiRoute;
              else if (i === 1) isActive = isDocenteRoute;
              else if (i === 2) isActive = isInstiRoute;

              return (
                <Link
                  key={tab}
                  to={i === 0 ? '/mapa' : i === 1 ? '/dashboard' : '/institucional'}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-500 text-white shadow-md'
                      : 'text-surface-700 hover:bg-surface-200 hover:text-surface-900'
                  }`}
                >
                  {tab}
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-200 transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed inset-0 z-40 bg-white/95 backdrop-blur-lg pt-20 px-6 lg:hidden overflow-y-auto"
        >
          <div className="space-y-1">
            <p className="text-xs font-semibold text-surface-700 uppercase tracking-wider px-3 mb-2">Estudiantes</p>
            {studentLinks.map(l => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === l.to
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-surface-700 hover:bg-surface-100'
                }`}
              >
                <l.icon className="w-5 h-5" />
                {l.label}
              </Link>
            ))}
            <div className="h-px bg-surface-300 my-4" />
            <p className="text-xs font-semibold text-surface-700 uppercase tracking-wider px-3 mb-2">Docentes</p>
            {docenteLinks.map(l => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === l.to
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-surface-700 hover:bg-surface-100'
                }`}
              >
                <l.icon className="w-5 h-5" />
                {l.label}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </>
  );
}

export function Sidebar() {
  const location = useLocation();
  const isDocente = location.pathname.startsWith('/docente') || location.pathname.startsWith('/institucional') || location.pathname === '/dashboard';
  const links = isDocente ? docenteLinks : studentLinks;

  const [prediction, setPrediction] = useState<{ score: number; timestamp: string } | null>(null);

  useEffect(() => {
    const checkPrediction = () => {
      const raw = localStorage.getItem('saber11_prediction');
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed.score === 'number') {
            setPrediction(parsed);
            return;
          }
        } catch (e) {
          console.error(e);
        }
      }
      setPrediction(null);
    };

    checkPrediction();
    // Escuchar actualizaciones si cambian en otra pestaña o tras el onboarding
    window.addEventListener('storage', checkPrediction);
    const interval = setInterval(checkPrediction, 1000); // Check local updates quickly
    return () => {
      window.removeEventListener('storage', checkPrediction);
      clearInterval(interval);
    };
  }, []);

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-[calc(100vh-4rem)] fixed top-16 left-0 border-r border-surface-200 bg-white p-4 gap-1 overflow-y-auto">
      <p className="text-xs font-semibold text-surface-700 uppercase tracking-wider px-3 mb-2 mt-2">
        {isDocente ? 'Panel Docente' : 'Navegación'}
      </p>
      {links.map((l) => {
        const isActive = location.pathname === l.to;
        return (
          <Link
            key={l.to}
            to={l.to}
            className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'bg-primary-50 text-primary-600'
                : 'text-surface-700 hover:bg-surface-100 hover:text-surface-900'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="sidebar-active"
                className="absolute left-0 top-1 bottom-1 w-1 rounded-full bg-primary-500"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
            <l.icon className="w-5 h-5" />
            {l.label}
          </Link>
        );
      })}

      {!isDocente && (
        <>
          <div className="h-px bg-surface-300 my-3" />
          <p className="text-xs font-semibold text-surface-700 uppercase tracking-wider px-3 mb-2">Más</p>
          {[...docenteLinks, ...extraLinks].map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                location.pathname === l.to
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-surface-700 hover:bg-surface-100 hover:text-surface-900'
              }`}
            >
              <l.icon className="w-5 h-5" />
              {l.label}
            </Link>
          ))}
        </>
      )}

      {/* Dynamic AI Score Projection Card */}
      <div className="mt-auto pt-4">
        {!isDocente && prediction ? (
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-4 rounded-2xl bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-800 text-white shadow-lg relative overflow-hidden"
          >
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <Activity className="w-20 h-20 text-white" />
            </div>
            <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider opacity-90">
              <span className="w-1.5 h-1.5 rounded-full bg-success-400 animate-ping"></span>
              Proyección Estimada
            </div>
            <div className="flex items-baseline gap-1 mt-1.5">
              <span className="text-3.5xl font-heading font-extrabold tracking-tight">{prediction.score}</span>
              <span className="text-xs opacity-75">/ 500 pts</span>
            </div>
            <div className="mt-2 w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
              <div className="h-full bg-success-400" style={{ width: `${(prediction.score / 500) * 100}%` }}></div>
            </div>
            <Link
              to="/ruta"
              className="mt-3 block text-center py-2 px-3 bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-xs font-bold rounded-xl border border-white/10"
            >
              🗺️ Ver Mi Ruta
            </Link>
          </motion.div>
        ) : (
          <Link
            to="/onboarding"
            className="block w-full p-4 rounded-xl gradient-primary text-white text-center shadow-lg hover:shadow-xl transition-shadow"
          >
            <p className="font-heading font-bold text-sm">🎯 Predecir puntaje</p>
            <p className="text-xs opacity-80 mt-1">Usa nuestro modelo predictivo</p>
          </Link>
        )}
      </div>
    </aside>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-surface-300/50 bg-white/60 backdrop-blur-sm mt-auto">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 flex items-center justify-center">
                <LogoIcon className="w-full h-full" />
              </div>
              <span className="font-heading font-bold text-primary-600">Ruta Saber 11</span>
            </div>
            <p className="text-sm text-surface-700 max-w-md">
              Esta herramienta no clasifica estudiantes. Su propósito es recomendar apoyos, recursos y
              planes de estudio para potenciar el aprendizaje individual.
            </p>
          </div>
          <div>
            <p className="font-heading font-semibold text-sm mb-3">Enlaces</p>
            <div className="flex flex-col gap-2">
              <Link to="/sobre" className="text-sm text-surface-700 hover:text-primary-500 transition-colors">Sobre el proyecto</Link>
              <Link to="/onboarding" className="text-sm text-surface-700 hover:text-primary-500 transition-colors">Comenzar</Link>
              <Link to="/mapa" className="text-sm text-surface-700 hover:text-primary-500 transition-colors">Mapa de aprendizaje</Link>
            </div>
          </div>
          <div>
            <p className="font-heading font-semibold text-sm mb-3">Datos</p>
            <div className="flex flex-col gap-2">
              <span className="text-sm text-surface-700">Uso responsable</span>
              <span className="text-sm text-surface-700">Datos abiertos</span>
              <span className="text-sm text-surface-700">Créditos</span>
            </div>
          </div>
        </div>
        <div className="h-px bg-surface-300 my-6" />
        <p className="text-xs text-surface-700 text-center">
          © 2024 Ruta Saber 11. Institución Educativa Superior.
        </p>
      </div>
    </footer>
  );
}

/** Bottom mobile navigation */
export function BottomNav() {
  const location = useLocation();
  const mobileLinks = studentLinks.slice(0, 5);

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass-card border-t border-surface-300/50 safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {mobileLinks.map(l => {
          const isActive = location.pathname === l.to;
          return (
            <Link
              key={l.to}
              to={l.to}
              className={`flex flex-col items-center justify-center gap-0.5 w-16 py-1 rounded-lg transition-all ${
                isActive ? 'text-primary-500' : 'text-surface-700'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="bottom-active"
                  className="absolute -top-0.5 w-8 h-0.5 rounded-full bg-primary-500"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <l.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{l.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
