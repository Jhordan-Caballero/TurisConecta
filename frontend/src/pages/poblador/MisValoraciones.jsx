import SidebarPoblador from '../../components/SidebarPoblador';

export default function MisValoraciones() {
  const distribucionEstrellas = [
    { label: '5 estrellas', porcentaje: 70 },
    { label: '4 estrellas', porcentaje: 20 },
    { label: '3 estrellas', porcentaje: 6 },
    { label: '2 estrellas', porcentaje: 2 },
    { label: '1 estrella', porcentaje: 2 },
  ];

  const resenas = [
    {
      iniciales: 'MP',
      autor: 'María Pérez (Lima)',
      fecha: '18/11/2026',
      estrellas: '★★★★★',
      comentario:
        'Excelente experiencia en el hospedaje rural. La señora María nos atendió de maravilla y la comida a leña fue inolvidable. ¡100% recomendado!',
    },
    {
      iniciales: 'JM',
      autor: 'Jorge Mamani (Puno)',
      fecha: '14/11/2026',
      estrellas: '★★★★★',
      comentario:
        'El guiado hacia la Cruz del Cóndor fue muy puntual y lleno de historias locales que no te cuentan las agencias.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50">
      <SidebarPoblador />

      <main className="flex-1 p-6 lg:p-8">
        <div className="pb-6 border-b border-slate-200">
          <h1 className="text-xl font-bold text-slate-900">Mis Valoraciones</h1>
          <p className="text-xs text-slate-500">
            Opiniones verificadas dejadas por los turistas al finalizar su itinerario
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 my-6 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-4 text-center border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0">
            <div className="text-5xl font-black text-slate-900 tracking-tight">4.6</div>
            <div className="text-amber-400 text-lg my-1">★★★★★</div>
            <p className="text-xs text-slate-500">Basado en 124 reseñas de turistas</p>
          </div>

          <div className="md:col-span-8 space-y-2 text-xs">
            {distribucionEstrellas.map((fila) => (
              <div key={fila.label} className="flex items-center gap-3">
                <span className="w-16 text-slate-600 font-medium">{fila.label}</span>
                <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-400 h-full rounded-full"
                    style={{ width: `${fila.porcentaje}%` }}
                  />
                </div>
                <span className="w-8 text-right font-bold text-slate-700">{fila.porcentaje}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
            Comentarios recientes
          </h2>
          {resenas.map((r) => (
            <div
              key={r.autor}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-xs">
                {r.iniciales}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{r.autor}</span>
                  <span className="text-[10px] text-slate-400">{r.fecha}</span>
                </div>
                <div className="text-amber-400 text-xs my-0.5">{r.estrellas}</div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">"{r.comentario}"</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}