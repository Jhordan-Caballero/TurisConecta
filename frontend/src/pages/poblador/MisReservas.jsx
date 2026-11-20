import { useState } from 'react';
import SidebarPoblador from '../../components/SidebarPoblador';

export default function MisReservas() {
  const [busqueda, setBusqueda] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('Todos');

  const reservasIniciales = [
    {
      id: 1,
      turista: 'Ana Torres',
      servicio: 'Hospedaje Rural Valle Hermoso',
      fecha: '18/11/2026',
      precio: 'S/ 240',
      estado: 'Confirmada',
    },
    {
      id: 2,
      turista: 'Carlos Ruiz',
      servicio: 'Tour guiado Cañón del Colca',
      fecha: '17/11/2026',
      precio: 'S/ 180',
      estado: 'Pendiente',
    },
    {
      id: 3,
      turista: 'Lucía Fernández',
      servicio: 'Almuerzo Gastronomía Típica',
      fecha: '15/11/2026',
      precio: 'S/ 90',
      estado: 'Confirmada',
    },
    {
      id: 4,
      turista: 'Roberto Quispe',
      servicio: 'Taller artesanal de bordado Colca',
      fecha: '12/11/2026',
      precio: 'S/ 120',
      estado: 'Completada',
    },
  ];

  const reservasFiltradas = reservasIniciales.filter((r) => {
    const coincideTexto =
      r.turista.toLowerCase().includes(busqueda.toLowerCase()) ||
      r.servicio.toLowerCase().includes(busqueda.toLowerCase());
    const coincideEstado = estadoFiltro === 'Todos' || r.estado === estadoFiltro;
    return coincideTexto && coincideEstado;
  });

  const badgeClase = (estado) => {
    if (estado === 'Confirmada') return 'bg-emerald-100 text-emerald-800';
    if (estado === 'Pendiente') return 'bg-amber-100 text-amber-800';
    return 'bg-slate-100 text-slate-700';
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50">
      <SidebarPoblador />

      <main className="flex-1 p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Mis Reservas</h1>
            <p className="text-xs text-slate-500">
              Historial completo de servicios reservados asignados por el motor equitativo
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar turista o servicio..."
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
            <select
              value={estadoFiltro}
              onChange={(e) => setEstadoFiltro(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              <option value="Todos">Todos los estados</option>
              <option value="Confirmada">Confirmada</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Completada">Completada</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5 font-bold">Turista</th>
                  <th className="px-5 py-3.5 font-bold">Servicio Reservado</th>
                  <th className="px-5 py-3.5 font-bold">Fecha</th>
                  <th className="px-5 py-3.5 font-bold">Precio</th>
                  <th className="px-5 py-3.5 font-bold">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reservasFiltradas.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 transition">
                    <td className="px-5 py-4 font-semibold text-slate-900">{r.turista}</td>
                    <td className="px-5 py-4 text-slate-600">{r.servicio}</td>
                    <td className="px-5 py-4 text-slate-500">{r.fecha}</td>
                    <td className="px-5 py-4 font-bold text-slate-900">{r.precio}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${badgeClase(
                          r.estado
                        )}`}
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