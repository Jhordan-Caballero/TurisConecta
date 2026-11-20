import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SidebarPoblador() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const links = [
    { to: '/poblador/dashboard', label: 'Inicio', icon: '📊' },
    { to: '/poblador/servicios', label: 'Mis Servicios', icon: '🏡' },
    { to: '/poblador/valoraciones', label: 'Valoraciones', icon: '⭐' },
    { to: '/poblador/impacto', label: 'Impacto', icon: '📈' },
    { to: '/poblador/reservas', label: 'Mis Reservas', icon: '📅' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="w-full lg:w-64 bg-[#e9f0ea] p-5 border-b lg:border-b-0 lg:border-r border-emerald-900/10 flex flex-col justify-between shrink-0 lg:min-h-screen">
      <div>
        <div className="flex items-center gap-2.5 px-2 py-2 mb-6">
          <span className="text-2xl">⛰️</span>
          <div>
            <h4 className="font-extrabold text-sm text-[#1b4332] leading-none">TurisConecta</h4>
            <span className="text-[10px] text-emerald-800 font-semibold">Panel del Poblador</span>
          </div>
        </div>

        <nav className="space-y-1 text-xs font-semibold">
          {links.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                  isActive
                    ? 'bg-[#1b4332] text-white shadow-sm'
                    : 'text-slate-700 hover:bg-emerald-100/70'
                }`
              }
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="pt-5 mt-6 border-t border-emerald-900/10 space-y-3">
        <div className="text-xs font-bold text-[#1b4332] px-2">
          👤 {user?.nombre || 'María López'}
        </div>
        <button
          onClick={handleLogout}
          className="w-full bg-rose-100 hover:bg-rose-200 text-rose-800 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
        >
          <span>🚪</span> Cerrar sesión
        </button>
      </div>
    </aside>
  );
}