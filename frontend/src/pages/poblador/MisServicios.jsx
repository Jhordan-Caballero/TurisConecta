import { useState } from 'react';
import SidebarPoblador from '../../components/SidebarPoblador';

const IMAGEN_POR_CATEGORIA = {
  Hospedaje:
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
  Guiado:
    'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80',
  Gastronomía:
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80',
  Artesanía:
    'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=600&q=80',
};

export default function MisServicios() {
  const [servicios, setServicios] = useState([
    {
      id: 1,
      categoria: 'Hospedaje',
      titulo: 'Hospedaje Rural Colca',
      descripcion: 'Habitación matrimonial con vista a las terrazas preincaicas y fogata.',
      precio: 80,
      unidad: 'noche',
      img: IMAGEN_POR_CATEGORIA.Hospedaje,
    },
    {
      id: 2,
      categoria: 'Guiado',
      titulo: 'Tour al Mirador Cruz del Cóndor',
      descripcion: 'Caminata ecológica guiada por comunero certificado, avistamiento y leyendas.',
      precio: 60,
      unidad: 'persona',
      img: IMAGEN_POR_CATEGORIA.Guiado,
    },
    {
      id: 3,
      categoria: 'Gastronomía',
      titulo: 'Gastronomía Típica Tradicional',
      descripcion: 'Rocoto relleno, pastel de papa y chicha de guiñapo cocinado a leña en picantería.',
      precio: 25,
      unidad: 'plato',
      img: IMAGEN_POR_CATEGORIA.Gastronomía,
    },
  ]);

  const [mostrarForm, setMostrarForm] = useState(false);
  const [nuevo, setNuevo] = useState({
    titulo: '',
    categoria: 'Hospedaje',
    precio: '',
    unidad: 'persona',
    descripcion: '',
    imagenUrl: '',
    imagenPreview: '',
  });

  const handleArchivoImagen = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setNuevo((prev) => ({
      ...prev,
      imagenPreview: preview,
      imagenUrl: '',
    }));
  };

  const handleAgregar = (e) => {
    e.preventDefault();
    if (!nuevo.titulo.trim() || !nuevo.precio) return;

    const imagenFinal =
      nuevo.imagenPreview ||
      nuevo.imagenUrl.trim() ||
      IMAGEN_POR_CATEGORIA[nuevo.categoria] ||
      IMAGEN_POR_CATEGORIA.Hospedaje;

    setServicios([
      ...servicios,
      {
        id: Date.now(),
        categoria: nuevo.categoria,
        titulo: nuevo.titulo.trim(),
        descripcion:
          nuevo.descripcion.trim() || 'Experiencia comunitaria auténtica en Arequipa.',
        precio: Number(nuevo.precio),
        unidad: nuevo.unidad,
        img: imagenFinal,
      },
    ]);

    setNuevo({
      titulo: '',
      categoria: 'Hospedaje',
      precio: '',
      unidad: 'persona',
      descripcion: '',
      imagenUrl: '',
      imagenPreview: '',
    });
    setMostrarForm(false);
  };

  const handleEliminar = (id) => {
    setServicios(servicios.filter((s) => s.id !== id));
  };

  const vistaPreviaActual =
    nuevo.imagenPreview ||
    nuevo.imagenUrl.trim() ||
    IMAGEN_POR_CATEGORIA[nuevo.categoria];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50">
      <SidebarPoblador />

      <main className="flex-1 p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Mis Servicios Ofrecidos</h1>
            <p className="text-xs text-slate-500">
              Gestiona tus hospedajes, guiados, gastronomía y artesanías para los turistas
            </p>
          </div>
          <button
            type="button"
            onClick={() => setMostrarForm(!mostrarForm)}
            className="bg-[#1b4332] hover:bg-[#2d6a4f] text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition cursor-pointer"
          >
            <span>{mostrarForm ? '✕' : '➕'}</span>
            <span>{mostrarForm ? 'Cancelar' : 'Agregar Servicio'}</span>
          </button>
        </div>

        {mostrarForm && (
          <form
            onSubmit={handleAgregar}
            className="mt-6 bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm space-y-4"
          >
            <h2 className="text-sm font-bold text-[#1b4332]">Nuevo Servicio Comunitario</h2>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <input
                type="text"
                placeholder="Título del servicio"
                value={nuevo.titulo}
                onChange={(e) => setNuevo({ ...nuevo, titulo: e.target.value })}
                className="sm:col-span-2 px-3 py-2 text-xs rounded-xl border border-slate-200"
                required
              />
              <select
                value={nuevo.categoria}
                onChange={(e) => setNuevo({ ...nuevo, categoria: e.target.value })}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
              >
                <option>Hospedaje</option>
                <option>Guiado</option>
                <option>Gastronomía</option>
                <option>Artesanía</option>
              </select>
              <input
                type="number"
                placeholder="Precio (S/)"
                value={nuevo.precio}
                onChange={(e) => setNuevo({ ...nuevo, precio: e.target.value })}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200"
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Descripción breve del servicio"
                value={nuevo.descripcion}
                onChange={(e) => setNuevo({ ...nuevo, descripcion: e.target.value })}
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200"
              />
              <button
                type="submit"
                className="bg-[#1b4332] hover:bg-[#2d6a4f] text-white px-5 py-2 rounded-xl text-xs font-bold cursor-pointer"
              >
                Guardar Servicio
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1">
              <label className="text-xs font-semibold text-slate-700 cursor-pointer bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl hover:bg-slate-100 transition">
                📷 Subir imagen
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleArchivoImagen}
                  className="hidden"
                />
              </label>

              <input
                type="text"
                placeholder="O pega una URL de imagen (opcional)"
                value={nuevo.imagenUrl}
                onChange={(e) =>
                  setNuevo({
                    ...nuevo,
                    imagenUrl: e.target.value,
                    imagenPreview: e.target.value.trim() ? '' : nuevo.imagenPreview,
                  })
                }
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200"
              />

              {vistaPreviaActual && (
                <img
                  src={vistaPreviaActual}
                  alt="Vista previa del servicio"
                  className="w-16 h-11 rounded-lg object-cover border border-slate-200 shrink-0"
                />
              )}
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
          {servicios.map((servicio) => (
            <div
              key={servicio.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col"
            >
              <div
                className="h-36 bg-cover bg-center relative"
                style={{ backgroundImage: `url('${servicio.img}')` }}
              >
                <span className="absolute top-2.5 right-2.5 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  ● Disponible
                </span>
                <span className="absolute bottom-2.5 left-2.5 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-md">
                  {servicio.categoria}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{servicio.titulo}</h3>
                  <p className="text-xs text-slate-500 mt-1">{servicio.descripcion}</p>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-3 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-extrabold text-[#1b4332]">
                      S/ {servicio.precio.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-slate-400"> / {servicio.unidad}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleEliminar(servicio.id)}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg text-xs cursor-pointer"
                    title="Eliminar servicio"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}