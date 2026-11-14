import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import TuristaView from './pages/TuristaView';
import PobladorView from './pages/PobladorView';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#f5f5f5] text-[#4a4238] font-sans selection:bg-[#b3a394] selection:text-white">
        {/* Barra de Navegación Minimalista */}
        <nav className="bg-[#b3a394] px-8 py-4 text-white flex justify-between items-center shadow-sm">
          <div className="text-2xl font-light tracking-widest">TurisConecta</div>
          <div className="space-x-8 text-sm uppercase tracking-wide font-medium">
            <Link to="/" className="hover:text-[#f5f5f5] transition">Explorar (Turista)</Link>
            <Link to="/poblador" className="hover:text-[#f5f5f5] transition">Panel Poblador</Link>
          </div>
        </nav>

        {/* Contenedor Principal */}
        <main className="p-8 max-w-6xl mx-auto">
          <Routes>
            <Route path="/" element={<TuristaView />} />
            <Route path="/poblador" element={<PobladorView />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;