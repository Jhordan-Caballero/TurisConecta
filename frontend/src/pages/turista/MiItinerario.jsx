import { useLocation, useNavigate, Link } from 'react-router-dom';
import NavbarTurista from '../../components/NavbarTurista';

const IMAGEN_POR_CATEGORIA = {
  Hospedaje:
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=300&q=80',
  Guiado:
    'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=300&q=80',
  Gastronomía:
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=300&q=80',
  Artesanía:
    'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=300&q=80',
};

const soles = (n) => `S/ ${Number(n).toFixed(2)}`;

export default function MiItinerario() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const plan = state?.plan;

  if (!plan) {
    return (
      <div className="min-h-screen bg-slate-50">
        <NavbarTurista />
        <div className="max-w-xl mx-auto p-10 text-center space-y-3">
          <h1 className="text-xl font-bold text-slate-900">Aún no hay un plan para mostrar</h1>
          <p className="text-xs text-slate-500">
            Genera un itinerario desde el planificador para verlo aquí.
          </p>
          <Link
            to="/turista/planificar"
            className="inline-block bg-[#1b4332] text-white px-4 py-2.5 rounded-xl text-xs font-bold"
          >
            Planificar viaje
          </Link>
        </div>
      </div>
    );
  }

  const { alojamiento, dias, total, presupuesto, restante, impacto, pobladores_beneficiados } = plan;

  // Una tarjeta por alojamiento (si hay) y una por cada día.
  const tarjetas = [
    ...(alojamiento ? [{ clave: 'alojamiento', encabezado: 'Alojamiento', item: alojamiento }] : []),
    ...dias.map((d) => ({ clave: `dia-${d.dia}`, encabezado: `Día ${d.dia}`, item: d.actividad })),
  ];

  const dentroDelLimite = total <= presupuesto;

  return (
    <div className="min-h-screen bg-slate-50">
      <NavbarTurista />

      <div className="max-w-6xl mx-auto p-6 sm:p-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Tu Itinerario Personalizado</h1>
            <p className="text-xs text-slate-500">
              Plan organizado por días con asignación justa a familias locales
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            🎯 Total estimado: {soles(total)} de {soles(presupuesto)}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-6">
            {tarjetas.map(({ clave, encabezado, item }) => (
              <div key={clave} className="relative pl-8 border-l-2 border-emerald-600">
                <div className="mb-2">
                  <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wide">
                    {encabezado}
                  </span>
                  <h2 className="font-bold text-sm text-slate-900">{item.localidad}</h2>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center">
                  <img
                    src={IMAGEN_POR_CATEGORIA[item.categoria]}
                    alt={item.titulo}
                    className="w-full sm:w-28 h-20 rounded-xl object-cover"
                  />
                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-slate-900">{item.titulo}</span>
                      <span className="font-bold text-emerald-800">{soles(item.costo_total)}</span>
                    </div>
                    <p className="text-slate-500 mt-1">
                      Con {item.poblador_nombre}
                      {item.categoria === 'Hospedaje' &&
                        ` · ${item.unidades} ${item.unidades === 1 ? 'noche' : 'noches'}`}
                    </p>
                    <span className="inline-block mt-2 text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md font-semibold">
                      {item.categoria}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-md sticky top-20">
            <h2 className="font-bold text-base text-slate-900 pb-3 border-b border-slate-100">
              Resumen del plan
            </h2>

            <div className="space-y-3 py-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Duración:</span>
                <span className="font-bold text-slate-800">
                  {dias.length} {dias.length === 1 ? 'día' : 'días'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Personas:</span>
                <span className="font-bold text-slate-800">{state.personas ?? '—'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Localidad:</span>
                <span className="font-bold text-slate-800">{state.localidad ?? '—'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Pobladores beneficiados:</span>
                <span className="font-bold text-slate-800">{pobladores_beneficiados}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Se queda en la comunidad:</span>
                <span className="font-bold text-emerald-700">
                  {soles(impacto.ingreso_comunidad)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Si lo gestionara una agencia:</span>
                <span className="font-bold text-slate-500">
                  {soles(impacto.ingreso_si_agencia)}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400">Total a pagar:</span>
                <div className="text-2xl font-black text-emerald-900">{soles(total)}</div>
                <span className="text-[11px] text-slate-400">Te quedan {soles(restante)}</span>
              </div>
              {dentroDelLimite && (
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-1 rounded">
                  Dentro del límite
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() =>
                navigate('/turista/confirmacion', {
                  state: { total, dias: `${dias.length} días`, plan },
                })
              }
              className="w-full mt-5 bg-[#1b4332] hover:bg-[#2d6a4f] text-white py-3 rounded-xl font-bold text-xs shadow-md transition cursor-pointer"
            >
              Confirmar reserva
            </button>

            <div className="mt-3 text-center">
              <Link to="/turista/planificar" className="text-xs text-slate-500 hover:underline">
                ← Ajustar presupuesto o gustos
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
