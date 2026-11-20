import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NavbarTurista() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const nombreUsuario = user?.nombre || 'Carlos Mendoza';
  const iniciales = nombreUsuario
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-30 bg-white px-6 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-6">
        <Link to="/turista/home" className="flex items-center gap-2">
          <span className="text-2xl">⛰️</span>
          <div>
            <span className="font-extrabold text-base text-[#1b4332] block leading-tight">
              TurisConecta
            </span>
            <span className="text-[10px] text-emerald-700 font-semibold uppercase tracking-wider block">
              Panel del Turista
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-2 text-xs font-semibold">
          <NavLink
            to="/turista/home"
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-xl transition ${
                isActive
                  ? 'bg-emerald-50 text-[#1b4332] font-bold border border-emerald-200'
                  : 'text-slate-700 hover:bg-emerald-50'
              }`
            }
          >
            🏠 Inicio
          </NavLink>
          <NavLink
            to="/turista/planificar"
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-xl transition ${
                isActive
                  ? 'bg-emerald-50 text-[#1b4332] font-bold border border-emerald-200'
                  : 'text-slate-700 hover:bg-emerald-50'
              }`
            }
          >
            ✨ Planificar Viaje
          </NavLink>
          <NavLink
            to="/turista/itinerario"
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-xl transition ${
                isActive
                  ? 'bg-emerald-50 text-[#1b4332] font-bold border border-emerald-200'
                  : 'text-slate-700 hover:bg-emerald-50'
              }`
            }
          >
            🗺️ Mi Itinerario
          </NavLink>
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1 rounded-xl">
          <div className="w-7 h-7 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-xs">
            {iniciales || 'CM'}
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-bold text-slate-800 leading-none">{nombreUsuario}</div>
            <div className="text-[10px] text-emerald-700 font-semibold">Turista Verificado</div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="text-xs text-rose-700 hover:text-rose-900 font-medium px-3 py-1.5 rounded-xl hover:bg-rose-50 transition border border-rose-100 cursor-pointer"
        >
          🚪 Salir
        </button>
      </div>
    </header>
  );
}