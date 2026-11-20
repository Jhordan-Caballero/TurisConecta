import { useLocation, useNavigate, Link } from 'react-router-dom';
import NavbarTurista from '../../components/NavbarTurista';

export default function MiItinerario() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const presupuestoLimite = state?.presupuesto || 500;
  const diasTexto = state?.dias || '3 días';
  const personasTexto = state?.personas || '2 personas';
  const localidadTexto = state?.localidad || 'Arequipa, Chivay, Yanque';

  const actividades = [
    {
      dia: 'Día 1',
      titulo: 'Arequipa Colonial y Tradición',
      actividad: 'Visita Plaza de Armas & Monasterio Santa Catalina',
      costo: 70,
      detalle:
        'Guiado histórico con comunero/guía local y almuerzo en picantería tradicional.',
      etiqueta: 'Guiado local + Degustación',
      img: 'https://images.unsplash.com/photo-1589556264800-08ae9e129a8c?auto=format&fit=crop&w=300&q=80',
    },
    {
      dia: 'Día 2',
      titulo: 'Valle del Colca y Cruz del Cóndor',
      actividad: 'Excursión Cañón del Colca & Hospedaje Chivay',
      costo: 260,
      detalle:
        'Avistamiento de cóndores, miradores de Yanque y pernocte en hospedaje rural comunitario.',
      etiqueta: 'Hospedaje + Excursión',
      img: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=300&q=80',
    },
    {
      dia: 'Día 3',
      titulo: 'Termas de Chacapi y Artesanías',
      actividad: 'Aguas termales y taller vivencial de artesanas',
      costo: 150,
      detalle:
        'Baños termomedicinales en Yanque y compra directa de textiles de alpaca a artesanas.',
      etiqueta: 'Bienestar + Artesanía viva',
      img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=300&q=80',
    },
  ];

  const totalCalculado = actividades.reduce((acc, item) => acc + item.costo, 0);
  const totalFinal = Math.min(totalCalculado, presupuestoLimite);

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
            🎯 Total estimado: S/ {totalFinal} de S/ {presupuestoLimite}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-6">
            {actividades.map((item) => (
              <div key={item.dia} className="relative pl-8 border-l-2 border-emerald-600">
                <div className="mb-2">
                  <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wide">
                    {item.dia}
                  </span>
                  <h2 className="font-bold text-sm text-slate-900">{item.titulo}</h2>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center">
                  <img
                    src={item.img}
                    alt={item.actividad}
                    className="w-full sm:w-28 h-20 rounded-xl object-cover"
                  />
                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-slate-900">{item.actividad}</span>
                      <span className="font-bold text-emerald-800">S/ {item.costo}</span>
                    </div>
                    <p className="text-slate-500 mt-1">{item.detalle}</p>
                    <span className="inline-block mt-2 text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md font-semibold">
                      {item.etiqueta}
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
                <span className="font-bold text-slate-800">{diasTexto}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Personas:</span>
                <span className="font-bold text-slate-800">{personasTexto}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Localidad:</span>
                <span className="font-bold text-slate-800">{localidadTexto}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Aporte directo (75%):</span>
                <span className="font-bold text-emerald-700">
                  S/ {Math.round(totalFinal * 0.75)}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400">Total a pagar:</span>
                <div className="text-2xl font-black text-emerald-900">S/ {totalFinal}</div>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-1 rounded">
                Dentro del límite
              </span>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate('/turista/confirmacion', { state: { total: totalFinal, dias: diasTexto } })
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