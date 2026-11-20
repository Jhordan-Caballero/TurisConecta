import { Link } from 'react-router-dom';
import SidebarPoblador from '../../components/SidebarPoblador';
import { useAuth } from '../../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();

  const metricas = [
    { icon: '📋', valor: '5', label: 'Servicios activos', bg: 'bg-emerald-50 text-emerald-700' },
    { icon: '🗓️', valor: '28', label: 'Reservas este mes', bg: 'bg-blue-50 text-blue-700' },
    { icon: '🪙', valor: 'S/ 4,250', label: 'Ingresos del mes', bg: 'bg-amber-50 text-amber-700' },
    { icon: '📊', valor: '82%', label: 'Ocupación estimada', bg: 'bg-purple-50 text-purple-700' },
  ];

  const ultimasReservas = [
    {
      iniciales: 'AT',
      turista: 'Ana Torres (Lima)',
      servicio: 'Hospedaje Rural Valle Hermoso',
      fecha: '18/11/2026',
      monto: 'S/ 240',
      estado: 'Confirmado',
    },
    {
      iniciales: 'CR',
      turista: 'Carlos Ruiz (Cusco)',
      servicio: 'Tour guiado Cruz del Cóndor',
      fecha: '17/11/2026',
      monto: 'S/ 180',
      estado: 'Pendiente',
    },
    {
      iniciales: 'LF',
      turista: 'Lucía Fernández (Santiago)',
      servicio: 'Almuerzo Gastronomía Típica',
      fecha: '16/11/2026',
      monto: 'S/ 90',
      estado: 'Confirmado',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50">
      <SidebarPoblador />

      <main className="flex-1 p-6 lg:p-8">
        <div className="flex items-center justify-between pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              ¡Hola, {user?.nombre || 'María López'}!
            </h1>
            <p className="text-xs text-slate-500">
              Aquí tienes el resumen de tu actividad en Chivay, Colca
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-slate-800">
                {user?.nombre || 'María López C.'}
              </div>
              <div className="text-[10px] text-emerald-700 font-semibold">Anfitriona & Artesana</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-200 border-2 border-emerald-600 flex items-center justify-center font-bold text-emerald-900 text-xs">
              ML
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
          {metricas.map((m) => (
            <div
              key={m.label}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${m.bg}`}>
                {m.icon}
              </div>
              <div>
                <div className="text-xl font-extrabold text-slate-900">{m.valor}</div>
                <div className="text-[11px] text-slate-500">{m.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-sm text-slate-800">Últimas reservas asignadas</h2>
            <Link
              to="/poblador/reservas"
              className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold"
            >
              Ver todas las reservas →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3 font-semibold">Turista</th>
                  <th className="px-5 py-3 font-semibold">Servicio Asignado</th>
                  <th className="px-5 py-3 font-semibold">Fecha</th>
                  <th className="px-5 py-3 font-semibold">Monto</th>
                  <th className="px-5 py-3 font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ultimasReservas.map((r) => (
                  <tr key={r.turista} className="hover:bg-slate-50/80 transition">
                    <td className="px-5 py-3 font-medium text-slate-900 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-slate-200 text-[10px] flex items-center justify-center font-bold">
                        {r.iniciales}
                      </span>
                      {r.turista}
                    </td>
                    <td className="px-5 py-3 text-slate-600">{r.servicio}</td>
                    <td className="px-5 py-3 text-slate-500">{r.fecha}</td>
                    <td className="px-5 py-3 font-bold text-slate-900">{r.monto}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          r.estado === 'Confirmado'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {r.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}