import { useEffect, useState } from 'react';
import SidebarPoblador from '../../components/SidebarPoblador';
import { api, mensajeError } from '../../services/api';

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

const FORM_VACIO = {
  titulo: '',
  categoria: 'Hospedaje',
  precio: '',
  capacidad: 4,
  descripcion: '',
  imagenUrl: '',
};

// El backend cobra por noche en hospedaje y por persona en los demás servicios.
const unidadDe = (categoria) => (categoria === 'Hospedaje' ? 'noche' : 'persona');

// Adapta la respuesta del backend al formato que usa la tarjeta.
const aVista = (s) => ({
  id: s.id,
  categoria: s.categoria,
  titulo: s.titulo,
  descripcion: s.descripcion || 'Experiencia comunitaria auténtica en Arequipa.',
  precio: s.precio,
  unidad: unidadDe(s.categoria),
  img: s.imagenUrl || IMAGEN_POR_CATEGORIA[s.categoria],
});

export default function MisServicios() {
  const [servicios, setServicios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [nuevo, setNuevo] = useState(FORM_VACIO);
  const [previewArchivo, setPreviewArchivo] = useState('');

  const cargar = async () => {
    try {
      const { data } = await api.get('/servicios/mios');
      setServicios(data.map(aVista));
      setError('');
    } catch (err) {
      setError(mensajeError(err));
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const handleArchivoImagen = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreviewArchivo(URL.createObjectURL(file));
  };

  const handleAgregar = async (e) => {
    e.preventDefault();
    setError('');
    setGuardando(true);
    try {
      await api.post('/servicios', {
        titulo: nuevo.titulo.trim(),
        categoria: nuevo.categoria,
        precio: Number(nuevo.precio),
        capacidad: Number(nuevo.capacidad),
        descripcion: nuevo.descripcion.trim(),
        imagenUrl: nuevo.imagenUrl.trim() || null,
      });
      setNuevo(FORM_VACIO);
      setPreviewArchivo('');
      setMostrarForm(false);
      await cargar();
    } catch (err) {
      setError(mensajeError(err));
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Quitar este servicio? Las reservas existentes se conservan.')) return;
    try {
      await api.delete(`/servicios/${id}`);
      setServicios((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      setError(mensajeError(err));
    }
  };

  const vistaPreviaActual =
    previewArchivo || nuevo.imagenUrl.trim() || IMAGEN_POR_CATEGORIA[nuevo.categoria];

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

        {error && (
          <p className="mt-4 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        {mostrarForm && (
          <form
            onSubmit={handleAgregar}
            className="mt-6 bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm space-y-4"
          >
            <h2 className="text-sm font-bold text-[#1b4332]">Nuevo Servicio Comunitario</h2>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              <input
                type="text"
                placeholder="Título del servicio"
                value={nuevo.titulo}
                onChange={(e) => setNuevo({ ...nuevo, titulo: e.target.value })}
                className="sm:col-span-2 px-3 py-2 text-xs rounded-xl border border-slate-200"
                minLength={3}
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
                min="0.01"
                step="0.01"
                placeholder="Precio (S/)"
                value={nuevo.precio}
                onChange={(e) => setNuevo({ ...nuevo, precio: e.target.value })}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200"
                required
              />
              <input
                type="number"
                min="1"
                max="100"
                placeholder="Capacidad (personas)"
                value={nuevo.capacidad}
                onChange={(e) => setNuevo({ ...nuevo, capacidad: e.target.value })}
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
                disabled={guardando}
                className="bg-[#1b4332] hover:bg-[#2d6a4f] disabled:opacity-60 text-white px-5 py-2 rounded-xl text-xs font-bold cursor-pointer"
              >
                {guardando ? 'Guardando…' : 'Guardar Servicio'}
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
                onChange={(e) => {
                  setNuevo({ ...nuevo, imagenUrl: e.target.value });
                  if (e.target.value.trim()) setPreviewArchivo('');
                }}
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
            <p className="text-[11px] text-slate-400">
              Por ahora solo se guarda la imagen por URL. La subida de archivos muestra la vista previa,
              pero aún no se guarda.
            </p>
          </form>
        )}

        {cargando ? (
          <p className="mt-6 text-xs text-slate-500">Cargando tus servicios…</p>
        ) : servicios.length === 0 ? (
          <p className="mt-6 text-xs text-slate-500">
            Aún no tienes servicios. Agrega el primero para que los turistas puedan reservarlo.
          </p>
        ) : (
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
                        S/ {Number(servicio.precio).toFixed(2)}
                      </span>
                      <span className="text-[10px] text-slate-400"> / {servicio.unidad}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleEliminar(servicio.id)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg text-xs cursor-pointer"
                      title="Quitar servicio"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
