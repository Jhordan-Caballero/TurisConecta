import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavbarTurista from '../../components/NavbarTurista';

export default function HomeTurista() {
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState('');

  const slides = [
    {
      titulo: 'Descubre Arequipa',
      subtitulo:
        'Vive una experiencia única con nuestras comunidades del Valle del Colca y la Ciudad Blanca.',
      img: 'https://images.unsplash.com/photo-1589556264800-08ae9e129a8c?auto=format&fit=crop&w=1200&q=80',
    },
    {
      titulo: 'Valle y Cañón del Colca',
      subtitulo:
        'Hospédate en casas tradicionales, admira el vuelo del cóndor y apoya la economía local.',
      img: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    },
    {
      titulo: 'Gastronomía & Tradición',
      subtitulo:
        'Saborea la auténtica cocina arequipeña cocinada a leña por anfitrionas nativas.',
      img: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1200&q=80',
    },
  ];

  const [indice, setIndice] = useState(0);

  const destinos = [
    {
      titulo: 'Cañón del Colca',
      sub: 'Chivay, Yanque y Coporaque',
      img: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=500&q=80',
    },
    {
      titulo: 'Arequipa Colonial',
      sub: 'Santa Catalina y Claustros',
      img: 'https://images.unsplash.com/photo-1589556264800-08ae9e129a8c?auto=format&fit=crop&w=500&q=80',
    },
    {
      titulo: 'Valle de los Volcanes',
      sub: 'Andagua y Huambo',
      img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=500&q=80',
    },
    {
      titulo: 'Yanahuara Tradicional',
      sub: 'Miradores y Picanterías',
      img: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=500&q=80',
    },
  ];

  const handleBuscar = (e) => {
    e.preventDefault();
    navigate('/turista/planificar', { state: { busqueda } });
  };

  const slideActual = slides[indice];

  return (
    <div className="min-h-screen bg-slate-50">
      <NavbarTurista />

      <section
        className="relative bg-slate-900 h-[380px] flex items-center justify-center text-center px-4 overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(15,23,42,0.45), rgba(27,67,50,0.8)), url('${slideActual.img}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <button
          type="button"
          onClick={() => setIndice((indice - 1 + slides.length) % slides.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 text-white hover:bg-white/35 flex items-center justify-center text-sm cursor-pointer"
        >
          ❮
        </button>

        <button
          type="button"
          onClick={() => setIndice((indice + 1) % slides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 text-white hover:bg-white/35 flex items-center justify-center text-sm cursor-pointer"
        >
          ❯
        </button>

        <div className="relative z-10 max-w-2xl mx-auto text-white">
          <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-semibold uppercase text-emerald-200 mb-3 border border-white/20">
            Turismo Comunitario Inteligente
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{slideActual.titulo}</h1>
          <p className="text-sm text-slate-100 mt-2 max-w-lg mx-auto">{slideActual.subtitulo}</p>

          <form
            onSubmit={handleBuscar}
            className="mt-6 max-w-md mx-auto bg-white p-2 rounded-2xl shadow-xl flex items-center gap-2"
          >
            <span className="text-slate-400 pl-3">🔍</span>
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="¿Qué estás buscando? (ej. Hospedaje Colca...)"
              className="flex-1 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-[#1b4332] hover:bg-[#2d6a4f] text-white px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Buscar
            </button>
          </form>

          <div className="flex items-center justify-center gap-2 mt-5">
            {slides.map((s, idx) => (
              <button
                key={s.titulo}
                type="button"
                onClick={() => setIndice(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  idx === indice ? 'w-6 bg-white' : 'w-2 bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto p-6 sm:p-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-base text-slate-900">
              Destinos y Comunidades Destacadas
            </h2>
            <p className="text-xs text-slate-500">
              Poblados locales listos para recibirte con calidez
            </p>
          </div>
          <Link
            to="/turista/planificar"
            className="text-xs text-emerald-700 hover:text-emerald-900 font-bold"
          >
            Planificar viaje →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {destinos.map((d) => (
            <Link
              key={d.titulo}
              to="/turista/planificar"
              className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition"
            >
              <div
                className="h-28 bg-cover bg-center group-hover:scale-105 transition duration-300"
                style={{ backgroundImage: `url('${d.img}')` }}
              />
              <div className="p-3">
                <h3 className="font-bold text-xs text-slate-900">{d.titulo}</h3>
                <p className="text-[11px] text-slate-500">{d.sub}</p>
                <span className="inline-block mt-1 text-[10px] text-emerald-700 font-bold">
                  ✨ Planificar ruta →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}