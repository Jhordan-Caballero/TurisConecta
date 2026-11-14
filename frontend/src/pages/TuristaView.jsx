import { useEffect, useState } from 'react';
import axios from 'axios';

function TuristaView() {
  const [servicios, setServicios] = useState([]);

  useEffect(() => {
    // Conexión con la API en Python
    axios.get('http://localhost:8000/servicios')
      .then(response => setServicios(response.data))
      .catch(error => console.error("Error cargando servicios:", error));
  }, []);

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-light mb-2 text-[#5c5346]">Descubre Arequipa</h1>
      <p className="text-[#8b7861] mb-8 font-light tracking-wide">Experiencias auténticas directamente con las comunidades.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {servicios.length === 0 ? (
          <p className="text-[#8b7861] italic col-span-3">No hay servicios disponibles en este momento.</p>
        ) : (
          servicios.map((s, idx) => (
            <div key={idx} className="bg-white p-6 shadow-sm border border-[#e5e5e5] hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <span className="bg-[#f5f5f5] text-[#8b7861] text-xs font-semibold px-3 py-1 uppercase tracking-wider">
                  {s.tipo}
                </span>
                <span className="text-[#b3a394] font-medium text-lg">S/ {s.precio.toFixed(2)}</span>
              </div>
              <h3 className="text-xl font-normal text-[#4a4238]">{s.localidad}</h3>
              <p className="text-[#8b7861] mt-2 text-sm">Anfitrión: {s.poblador}</p>
              <p className="text-[#8b7861] text-sm">Capacidad máxima: {s.capacidad} personas</p>
              
              <button className="mt-6 w-full bg-[#b3a394] hover:bg-[#8b7861] text-white py-2 transition-colors text-sm uppercase tracking-wide">
                Añadir al itinerario
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TuristaView;