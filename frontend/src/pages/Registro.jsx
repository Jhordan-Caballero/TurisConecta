import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Registro() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('turista');

  const handleSubmit = (e) => {
    e.preventDefault();
    login({
      nombre: nombre.trim() || (rol === 'poblador' ? 'María López' : 'Carlos Mendoza'),
      email: email.trim() || 'usuario@turisconecta.pe',
      rol,
    });
    navigate(rol === 'poblador' ? '/poblador/dashboard' : '/turista/home');
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-12 bg-white">
      <div
        className="md:col-span-6 lg:col-span-7 relative bg-emerald-950 flex flex-col justify-between p-8 text-white"
        style={{
          background:
            "linear-gradient(135deg, rgba(27,67,50,0.85), rgba(15,23,42,0.85)), url('https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1000&q=80') center/cover",
        }}
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl">⛰️</span>
          <span className="font-extrabold text-xl tracking-tight">TurisConecta</span>
        </div>

        <div className="max-w-md my-auto py-10">
          <span className="inline-block px-3 py-1 bg-amber-400/20 rounded-full text-xs font-medium text-amber-200 mb-3 border border-amber-300/30">
            Únete a la Red Local
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight leading-tight">
            Elige tu papel en el turismo de Arequipa.
          </h2>
          <div className="mt-4 space-y-3 text-xs text-slate-200">
            <div className="flex items-start gap-2.5">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>
                <strong>Como Turista:</strong> Obtén itinerarios calculados a tu presupuesto exacto y
                viaja apoyando a comunidades.
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>
                <strong>Como Poblador:</strong> Ofrece hospedajes, comida, guiados o artesanías sin
                intermediarios abusivos.
              </span>
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-300 flex items-center justify-between border-t border-white/10 pt-4">
          <span>Mirador de Yanahuara y Volcán Misti</span>
          <span>Arequipa Patrimonio</span>
        </div>
      </div>

      <div className="md:col-span-6 lg:col-span-5 p-8 sm:p-12 flex flex-col justify-center bg-white">
        <div className="max-w-sm mx-auto w-full">
          <div className="text-center mb-5">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Crear cuenta</h3>
            <p className="text-xs text-slate-500 mt-1">Únete a nuestra comunidad turística</p>
          </div>

          <form className="space-y-3.5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nombre completo
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Carlos Mendoza"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div className="pt-1">
              <label className="block text-xs font-bold text-slate-800 mb-2">
                ¿Cómo te registras?
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <label
                  className={`flex items-center p-3 rounded-xl border cursor-pointer transition ${
                    rol === 'turista'
                      ? 'border-emerald-400 bg-emerald-50/70'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="rol"
                    value="turista"
                    checked={rol === 'turista'}
                    onChange={() => setRol('turista')}
                    className="accent-emerald-700"
                  />
                  <div className="ml-2.5">
                    <span className="block text-xs font-bold text-slate-900">🎒 Turista</span>
                    <span className="block text-[10px] text-slate-500">Viajar y planificar</span>
                  </div>
                </label>

                <label
                  className={`flex items-center p-3 rounded-xl border cursor-pointer transition ${
                    rol === 'poblador'
                      ? 'border-emerald-400 bg-emerald-50/70'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="rol"
                    value="poblador"
                    checked={rol === 'poblador'}
                    onChange={() => setRol('poblador')}
                    className="accent-emerald-700"
                  />
                  <div className="ml-2.5">
                    <span className="block text-xs font-bold text-slate-900">🏡 Poblador</span>
                    <span className="block text-[10px] text-slate-500">Ofrecer servicios</span>
                  </div>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-3 bg-[#1b4332] hover:bg-[#2d6a4f] text-white py-2.5 rounded-xl font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>✨</span> Crear cuenta y Acceder
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="text-emerald-700 font-bold hover:underline">
              Inicia sesión
            </Link>
          </div>
          <div className="mt-3 text-center">
            <Link to="/" className="text-xs text-slate-400 hover:text-emerald-800 transition">
              ← Volver al inicio general
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}