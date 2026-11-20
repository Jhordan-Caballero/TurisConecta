import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarTurista from '../../components/NavbarTurista';

export default function ValorarExperiencia() {
  const navigate = useNavigate();
  const [estrellas, setEstrellas] = useState(5);
  const [comentario, setComentario] = useState('');
  const [enviado, setEnviado] = useState(false);

  const etiquetas = {
    1: '1 de 5 estrellas - Puede mejorar',
    2: '2 de 5 estrellas - Regular',
    3: '3 de 5 estrellas - Bueno',
    4: '4 de 5 estrellas - ¡Muy bueno!',
    5: '5 de 5 estrellas - ¡Excelente!',
  };

  const handleEnviar = (e) => {
    e.preventDefault();
    setEnviado(true);
    setTimeout(() => {
      navigate('/turista/home');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <NavbarTurista />

      <div className="max-w-5xl mx-auto p-6 sm:p-8">
        <div className="bg-white rounded-3xl shadow-md border border-slate-200 overflow-hidden grid grid-cols-1 md:grid-cols-12">
          <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              <div className="text-center mb-6">
                <span className="text-3xl">⭐</span>
                <h1 className="text-2xl font-bold text-slate-900 mt-2">Califica tu experiencia</h1>
                <p className="text-xs text-slate-500 mt-1">
                  Tu opinión ayuda a mejorar la reputación de los pobladores y a orientar a otros
                  viajeros.
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 my-4">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setEstrellas(num)}
                    className={`text-3xl transition cursor-pointer ${
                      num <= estrellas ? 'text-amber-400 scale-105' : 'text-slate-300'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
              <p className="text-center text-xs font-bold text-emerald-800 mb-4">
                {etiquetas[estrellas]}
              </p>

              {enviado ? (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold text-center">
                  ¡Gracias! Tu valoración se registró y volverás al inicio del turista.
                </div>
              ) : (
                <form onSubmit={handleEnviar} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Escribe tu opinión
                    </label>
                    <textarea
                      rows="4"
                      value={comentario}
                      onChange={(e) => setComentario(e.target.value)}
                      placeholder="¿Qué tal fue la atención de los anfitriones, la comida y el guiado?..."
                      className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-600 focus:outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#1b4332] hover:bg-[#2d6a4f] text-white py-3 rounded-xl font-bold text-xs shadow-md transition cursor-pointer"
                  >
                    Enviar valoración
                  </button>
                </form>
              )}
            </div>
          </div>

          <div
            className="hidden md:flex md:col-span-5 bg-emerald-950 p-8 flex-col justify-between text-white"
            style={{
              background:
                "linear-gradient(135deg, rgba(27,67,50,0.9), rgba(15,23,42,0.9)), url('https://images.unsplash.com/photo-1589556264800-08ae9e129a8c?auto=format&fit=crop&w=800&q=80') center/cover",
            }}
          >
            <div>
              <span className="text-xs text-amber-300 font-bold uppercase tracking-wider">
                Reputación Comunitaria
              </span>
              <h2 className="text-xl font-extrabold mt-1">Valoraciones transparentes</h2>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed my-auto">
              Cada reseña refleja la calidad del servicio local y fortalece la confianza entre
              turistas y familias anfitrionas de Arequipa.
            </p>
            <div className="text-[11px] text-slate-300">TurisConecta Arequipa</div>
          </div>
        </div>
      </div>
    </div>
  );
}