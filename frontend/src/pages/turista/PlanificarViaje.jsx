import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarTurista from '../../components/NavbarTurista';
import { api, mensajeError } from '../../services/api';

// "valor" es lo que se envía al backend: vacío significa todas las localidades.
const LOCALIDADES = [
  { label: 'Todas las localidades (Colca + Ciudad)', valor: '' },
  { label: 'Chivay & Valle del Colca', valor: 'Chivay & Valle del Colca' },
  { label: 'Yanque & Coporaque', valor: 'Yanque & Coporaque' },
  { label: 'Arequipa Centro Histórico', valor: 'Arequipa Centro Histórico' },
];

const OPCIONES_INTERES = [
  { label: '🧗 Aventura', valor: 'Aventura' },
  { label: '🏛️ Cultura', valor: 'Cultura' },
  { label: '🍲 Comida', valor: 'Comida' },
  { label: '🌿 Naturaleza', valor: 'Naturaleza' },
];

export default function PlanificarViaje() {
  const navigate = useNavigate();

  const [presupuesto, setPresupuesto] = useState(500);
  const [dias, setDias] = useState(3);
  const [personas, setPersonas] = useState(2);
  const [localidad, setLocalidad] = useState('');
  const [intereses, setIntereses] = useState(OPCIONES_INTERES.map((o) => o.valor));
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const toggleInteres = (valor) => {
    setIntereses((prev) => {
      if (prev.includes(valor)) {
        // El backend exige al menos un interés.
        return prev.length === 1 ? prev : prev.filter((item) => item !== valor);
      }
      return [...prev, valor];
    });
  };

  const handleGenerar = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    const cuerpo = {
      presupuesto: Number(presupuesto),
      dias: Number(dias),
      personas: Number(personas),
      intereses,
      localidad: localidad || null,
    };

    try {
      const { data } = await api.post('/itinerario', cuerpo);
      navigate('/turista/itinerario', {
        state: {
          plan: data,
          presupuesto: Number(presupuesto),
          personas: Number(personas),
          dias: Number(dias),
          localidad: LOCALIDADES.find((l) => l.valor === localidad).label,
        },
      });
    } catch (err) {
      setError(mensajeError(err));
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <NavbarTurista />

      <div className="max-w-6xl mx-auto p-6 sm:p-8">
        <div className="bg-white rounded-3xl shadow-md border border-slate-200 overflow-hidden grid grid-cols-1 md:grid-cols-12">
          <div className="md:col-span-7 p-6 sm:p-10">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Motor Inteligente de Itinerarios
            </span>
            <h1 className="text-2xl font-bold text-slate-900 mt-2">Planifica tu viaje a medida</h1>
            <p className="text-xs text-slate-500 mt-1">
              Ingresa tu presupuesto y gustos para armar un plan ajustado sin pasarte del límite y
              con reparto equitativo a pobladores.
            </p>

            <form onSubmit={handleGenerar} className="space-y-4 mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Presupuesto (S/)
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={presupuesto}
                    onChange={(e) => setPresupuesto(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Días de viaje
                  </label>
                  <select
                    value={dias}
                    onChange={(e) => setDias(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? 'día' : 'días'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Personas</label>
                  <select
                    value={personas}
                    onChange={(e) => setPersonas(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium"
                  >
                    {[1, 2, 3, 4].map((n) => (
                      <option key={n} value={n}>
                        {n === 4 ? '4+ personas' : `${n} ${n === 1 ? 'persona' : 'personas'}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Intereses y gustos
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {OPCIONES_INTERES.map((op) => {
                    const activo = intereses.includes(op.valor);
                    return (
                      <label
                        key={op.valor}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer text-xs font-medium ${
                          activo
                            ? 'border-emerald-400 bg-emerald-50/70 text-slate-900'
                            : 'border-slate-200 bg-white text-slate-600'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={activo}
                          onChange={() => toggleInteres(op.valor)}
                          className="accent-emerald-700"
                        />
                        <span>{op.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Localidad de preferencia
                </label>
                <select
                  value={localidad}
                  onChange={(e) => setLocalidad(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                >
                  {LOCALIDADES.map((l) => (
                    <option key={l.label} value={l.valor}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>

              {error && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={cargando}
                className="w-full mt-2 bg-[#1b4332] hover:bg-[#2d6a4f] disabled:opacity-60 text-white py-3 rounded-xl font-bold text-xs shadow-md transition cursor-pointer"
              >
                {cargando ? 'Armando tu plan…' : '✨ Generar Itinerario Inteligente'}
              </button>
            </form>
          </div>

          <div
            className="hidden md:flex md:col-span-5 bg-emerald-950 p-8 flex-col justify-between text-white"
            style={{
              background:
                "linear-gradient(135deg, rgba(27,67,50,0.88), rgba(15,23,42,0.9)), url('https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=800&q=80') center/cover",
            }}
          >
            <div>
              <span className="text-xs text-emerald-300 font-bold uppercase tracking-wider">
                Garantía TurisConecta
              </span>
              <h2 className="text-xl font-extrabold mt-1">Presupuesto y equidad</h2>
            </div>
            <div className="space-y-3 text-xs text-slate-200 my-auto">
              <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                <div className="font-bold text-white mb-0.5">💰 Sin pasarse del presupuesto</div>
                <p className="text-[11px] text-slate-300">
                  El plan se ajusta al monto que ingreses para que nunca tengas sorpresas.
                </p>
              </div>
              <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                <div className="font-bold text-white mb-0.5">⚖️ Reparto equitativo</div>
                <p className="text-[11px] text-slate-300">
                  Rota oportunidades entre familias anfitrionas y guías locales.
                </p>
              </div>
            </div>
            <div className="text-[11px] text-emerald-200">TurisConecta Arequipa</div>
          </div>
        </div>
      </div>
    </div>
  );
}
