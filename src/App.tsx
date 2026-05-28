import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Navbar, Sidebar, Footer, BottomNav } from './components/layout/Layout';

// Pages
import Landing from './pages/Landing';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import LearningMap from './pages/LearningMap';
import LearningMapDetail from './pages/LearningMapDetail';
import MyRoute from './pages/MyRoute';
import RouteProgress from './pages/RouteProgress';
import ImprovementRoute from './pages/ImprovementRoute';
import ChallengeCenter from './pages/ChallengeCenter';
import ActiveChallenges from './pages/ActiveChallenges';
import DailyChallenge from './pages/DailyChallenge';
import PracticeQuestion from './pages/PracticeQuestion';
import ChallengeCompleted from './pages/ChallengeCompleted';
import Profile from './pages/Profile';
import Achievements from './pages/Achievements';
import Habits from './pages/Habits';
import TeacherGuide from './pages/TeacherGuide';
import TeacherPanel from './pages/TeacherPanel';
import InstitutionalPanel from './pages/InstitutionalPanel';
import About from './pages/About';
import UpdateCenter from './pages/UpdateCenter';

export default function App() {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem('sidebar_collapsed') === 'true';
  });

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('sidebar_collapsed', String(next));
      return next;
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-50">
      <Navbar />

      <div className={`flex flex-1 pt-16 ${!isLanding ? (sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64') : ''} transition-all duration-300`}>
        {!isLanding && <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />}

        <main className={`flex-grow flex flex-col min-w-0 ${!isLanding ? 'pb-20 lg:pb-0' : ''}`}>
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Landing />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/mapa" element={<LearningMap />} />
                <Route path="/mapa/detalle" element={<LearningMapDetail />} />
                <Route path="/ruta" element={<MyRoute />} />
                <Route path="/ruta/progreso" element={<RouteProgress />} />
                <Route path="/ruta/mejora" element={<ImprovementRoute />} />
                <Route path="/retos" element={<ChallengeCenter />} />
                <Route path="/retos/activos" element={<ActiveChallenges />} />
                <Route path="/retos/diario" element={<DailyChallenge />} />
                <Route path="/practica" element={<PracticeQuestion />} />
                <Route path="/retos/completado" element={<ChallengeCompleted />} />
                <Route path="/perfil" element={<Profile />} />
                <Route path="/logros" element={<Achievements />} />
                <Route path="/habitos" element={<Habits />} />
                <Route path="/docente" element={<TeacherGuide />} />
                <Route path="/docente/panel" element={<TeacherPanel />} />
                <Route path="/docente/actualizacion" element={<UpdateCenter />} />
                <Route path="/institucional" element={<InstitutionalPanel />} />
                <Route path="/sobre" element={<About />} />
              </Routes>
            </AnimatePresence>
          </div>
          <Footer />
        </main>
      </div>

      {!isLanding && <BottomNav />}
    </div>
  );
}
