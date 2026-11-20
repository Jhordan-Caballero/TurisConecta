import { Link, useLocation } from 'react-router-dom';
import NavbarTurista from '../../components/NavbarTurista';

export default function ConfirmacionReserva() {
  const { state } = useLocation();
  const total = state?.total || 480;
  const dias = state?.dias || '3 días';
  const aporteComunidad = Math.round(total * 0.75);

  return (
    <div className="min-h-screen bg-slate-50">
      <NavbarTurista />

      <div className="p-8 sm:p-14 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-3xl font-black mb-4 ring-8 ring-emerald-50">
          ✓
        </div>

        <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 mb-2">
          Código: #TC-2026-984
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          ¡Reserva realizada con éxito!
        </h1>
        <p className="text-xs text-slate-500 max-w-md mt-2 leading-relaxed">
          Tu itinerario quedó registrado. Las familias anfitrionas y guías de Arequipa y el Colca
          recibieron la notificación de tu visita.
        </p>

        <div className="my-6 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm max-w-sm w-full text-xs text-left space-y-2">
          <div className="flex justify-between text-slate-600">
            <span>Monto total abonado:</span>
            <span className="font-bold text-slate-900">S/ {total}.00</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Duración:</span>
            <span className="font-bold text-slate-900">{dias}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Impacto comunitario (75%):</span>
            <span className="font-bold text-emerald-700">S/ {aporteComunidad} a familias locales</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
          <Link
            to="/turista/itinerario"
            className="w-full bg-[#1b4332] hover:bg-[#2d6a4f] text-white py-2.5 rounded-xl font-bold text-xs shadow-md transition text-center"
          >
            Ver mi itinerario
          </Link>
          <Link
            to="/turista/valorar"
            className="w-full border border-emerald-800 text-emerald-900 hover:bg-emerald-50 py-2.5 rounded-xl font-bold text-xs transition text-center"
          >
            ⭐ Valorar experiencia
          </Link>
        </div>
      </div>
    </div>
  );
}