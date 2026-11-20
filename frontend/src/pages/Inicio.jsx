import { Link } from 'react-router-dom';

export default function Inicio() {
  const destinos = [
    {
      zona: 'Valle del Colca',
      rating: '★ 4.9',
      titulo: 'Cañón del Colca & Cruz del Cóndor',
      desc: 'Admira el vuelo de cóndores andinos y comparte vivencias en Chivay, Yanque y Coporaque con familias anfitrionas.',
      img: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=700&q=80',
    },
    {
      zona: 'Centro Histórico',
      rating: '★ 4.8',
      titulo: 'Plaza de Armas & Catedral de Sillar',
      desc: 'Arquitectura colonial labrada en sillar blanco, monasterios barrocos y degustación en picanterías centenarias.',
      img: 'https://images.unsplash.com/photo-1589556264800-08ae9e129a8c?auto=format&fit=crop&w=700&q=80',
    },
    {
      zona: 'Yanahuara',
      rating: '★ 4.8',
      titulo: 'Mirador de Yanahuara y Volcán Misti',
      desc: 'Arcos tradicionales con poesías arequipeñas talladas y la postal más célebre del majestuoso volcán Misti.',
      img: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=700&q=80',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-xl bg-[#1b4332] text-white flex items-center justify-center text-lg font-bold">
            ⛰️
          </span>
          <div>
            <span className="font-black text-base text-[#1b4332] block leading-tight">
              TurisConecta
            </span>
            <span className="text-[10px] text-emerald-700 font-semibold uppercase tracking-wider block">
              Arequipa • Turismo Comunitario
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/login"
            className="text-xs font-bold text-slate-700 hover:text-emerald-900 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-emerald-50 transition"
          >
            👤 Iniciar sesión
          </Link>
          <Link
            to="/registro"
            className="text-xs font-bold bg-[#1b4332] hover:bg-[#2d6a4f] text-white px-4 py-2 rounded-xl shadow-sm transition"
          >
            ✨ Registrarse
          </Link>
        </div>
      </header>

      <section
        className="text-white py-20 px-6 text-center"
        style={{
          background:
            "linear-gradient(135deg, rgba(27,67,50,0.88), rgba(15,23,42,0.92)), url('https://images.unsplash.com/photo-1589556264800-08ae9e129a8c?auto=format&fit=crop&w=1600&q=80') center/cover",
        }}
      >
        <div className="max-w-3xl mx-auto">
          <span className="inline-block px-3.5 py-1 bg-emerald-500/20 text-emerald-200 text-xs font-bold rounded-full border border-emerald-400/30 mb-4">
            🌱 Turismo Comunitario Sostenible & Equitativo
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            El turismo que conecta viajeros con el corazón de los pueblos de Arequipa
          </h1>
          <p className="text-sm sm:text-base text-slate-200 mt-4 max-w-2xl mx-auto">
            Descubre itinerarios a tu medida y presupuesto mientras apoyas directamente a familias
            locales. <strong>El 75% de los ingresos se queda en la comunidad</strong>.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/login"
              className="w-full sm:w-auto bg-[#e76f51] hover:bg-[#d45d3f] text-white px-6 py-3 rounded-xl font-bold text-xs shadow-lg transition"
            >
              🎒 Ingresar como Turista
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3 rounded-xl font-bold text-xs transition"
            >
              🏡 Acceso para Pobladores
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto py-14 px-6">
        <h2 className="text-2xl font-extrabold text-slate-900 mb-6">
          Lugares Turísticos Emblemáticos de Arequipa
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {destinos.map((item) => (
            <div
              key={item.titulo}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm"
            >
              <div
                className="h-44 bg-cover bg-center"
                style={{ backgroundImage: `url('${item.img}')` }}
              />
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    {item.zona}
                  </span>
                  <span className="text-xs text-amber-500 font-bold">{item.rating}</span>
                </div>
                <h3 className="font-bold text-sm text-slate-900">{item.titulo}</h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}