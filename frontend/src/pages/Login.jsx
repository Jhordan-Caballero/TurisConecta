import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api, mensajeError } from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      const { data } = await api.post('/auth/login', { email: email.trim(), password });
      login(data, email.trim());
      navigate(data.rol === 'poblador' ? '/poblador/dashboard' : '/turista/home');
    } catch (err) {
      setError(mensajeError(err));
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-12 bg-white text-slate-900">
      {/* Panel izquierdo */}
      <div
        className="hidden lg:flex lg:col-span-7 relative flex-col justify-between p-10 text-white bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1589556264800-08ae9e129a8c?auto=format&fit=crop&w=1400&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-slate-950/60" />

        <div className="relative z-10 flex items-center gap-2 font-bold text-lg">
          <span>🏔️</span>
          <span>TurisConecta</span>
        </div>

        <div className="relative z-10 max-w-xl space-y-3">
          <span className="inline-block bg-emerald-900/80 border border-emerald-500/40 text-emerald-100 text-xs px-3 py-1 rounded-full">
            Turismo Sostenible Arequipa
          </span>
          <h1 className="text-4xl font-extrabold leading-tight text-white">
            Conectando viajeros con la calidez del pueblo arequipeño.
          </h1>
          <p className="text-sm text-slate-200">
            Directo del poblador a tu viaje, garantizando que el 75% del valor
            permanezca en las familias locales del Colca y Arequipa.
          </p>
        </div>

        <div className="relative z-10 flex items-center justify-between text-xs text-slate-300">
          <span>Plaza de Armas y Catedral de Sillar</span>
          <span>Arequipa, Perú</span>
        </div>
      </div>

      {/* Panel derecho */}
      <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 sm:p-10 bg-white">
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
          <div className="text-center mb-6">
            <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-lg">
              🌱
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">Bienvenido</h2>
            <p className="text-xs text-slate-500 mt-1">
              Inicia sesión para continuar en TurisConecta
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-[#1b4332] hover:bg-[#2d6a4f] disabled:opacity-60 text-white py-3 rounded-xl font-bold text-sm shadow-sm transition cursor-pointer"
          >
            {cargando ? 'Ingresando…' : 'Iniciar sesión'}
          </button>

          <div className="pt-3 text-center space-y-2 text-xs text-slate-500">
            <p>
              ¿No tienes una cuenta?{' '}
              <Link to="/registro" className="font-bold text-emerald-800 hover:underline">
                Registrarse
              </Link>
            </p>
            <div>
              <Link to="/" className="hover:underline text-slate-500">
                ← Volver al inicio general
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
