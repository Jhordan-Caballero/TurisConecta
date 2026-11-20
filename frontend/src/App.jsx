import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Inicio from './pages/Inicio';
import Login from './pages/Login';
import Registro from './pages/Registro';

// Poblador
import Dashboard from './pages/poblador/Dashboard';
import MisServicios from './pages/poblador/MisServicios';
import MisValoraciones from './pages/poblador/MisValoraciones';
import ImpactoComunidad from './pages/poblador/ImpactoComunidad';
import MisReservas from './pages/poblador/MisReservas';

// Turista
import HomeTurista from './pages/turista/HomeTurista';
import PlanificarViaje from './pages/turista/PlanificarViaje';
import MiItinerario from './pages/turista/MiItinerario';
import ConfirmacionReserva from './pages/turista/ConfirmacionReserva';
import ValorarExperiencia from './pages/turista/ValorarExperiencia';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />

          {/* Poblador */}
          <Route path="/poblador/dashboard" element={<Dashboard />} />
          <Route path="/poblador/servicios" element={<MisServicios />} />
          <Route path="/poblador/valoraciones" element={<MisValoraciones />} />
          <Route path="/poblador/impacto" element={<ImpactoComunidad />} />
          <Route path="/poblador/reservas" element={<MisReservas />} />

          {/* Turista */}
          <Route path="/turista/home" element={<HomeTurista />} />
          <Route path="/turista/planificar" element={<PlanificarViaje />} />
          <Route path="/turista/itinerario" element={<MiItinerario />} />
          <Route path="/turista/confirmacion" element={<ConfirmacionReserva />} />
          <Route path="/turista/valorar" element={<ValorarExperiencia />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}