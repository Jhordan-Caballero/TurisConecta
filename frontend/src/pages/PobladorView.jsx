import { useState } from 'react';
import axios from 'axios';

function PobladorView() {
  const [formData, setFormData] = useState({
    tipo: 'Hospedaje',
    precio: '',
    capacidad: '',
    localidad: '',
    poblador: ''
  });
  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Preparar datos asegurando los tipos correctos (números)
    const dataToSend = {
      ...formData,
      precio: parseFloat(formData.precio),
      capacidad: parseInt(formData.capacidad)
    };

    axios.post('http://localhost:8000/servicios', dataToSend)
      .then(() => {
        setMensaje("¡Servicio publicado exitosamente!");
        setFormData({ tipo: 'Hospedaje', precio: '', capacidad: '', localidad: '', poblador: '' });
        setTimeout(() => setMensaje(""), 3000);
      })
      .catch(error => {
        console.error("Error:", error);
        setMensaje("Ocurrió un error al publicar el servicio.");
      });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 shadow-sm border border-[#e5e5e5] animate-fade-in">
      <h2 className="text-2xl font-light text-[#5c5346] mb-1">Panel del Poblador</h2>
      <p className="text-[#8b7861] font-light mb-6 text-sm">Registra un nuevo servicio directamente a la plataforma.</p>

      {mensaje && (
        <div className="mb-4 p-3 bg-[#f5f5f5] border-l-4 border-[#b3a394] text-[#5c5346] text-sm">
          {mensaje}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-[#8b7861] mb-1">Tipo de Servicio</label>
          <select 
            name="tipo" 
            value={formData.tipo} 
            onChange={handleChange}
            className="w-full border border-[#e5e5e5] p-2 bg-[#f5f5f5] text-[#4a4238] focus:outline-none focus:border-[#b3a394]"
          >
            <option value="Hospedaje">Hospedaje</option>
            <option value="Guiado">Guiado turístico</option>
            <option value="Artesanía">Venta de Artesanías</option>
            <option value="Gastronomía">Gastronomía local</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#8b7861] mb-1">Precio (S/)</label>
            <input 
              type="number" 
              name="precio" 
              value={formData.precio} 
              onChange={handleChange} 
              required min="0" step="0.5"
              className="w-full border border-[#e5e5e5] p-2 bg-[#f5f5f5] focus:outline-none focus:border-[#b3a394]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#8b7861] mb-1">Capacidad (Personas)</label>
            <input 
              type="number" 
              name="capacidad" 
              value={formData.capacidad} 
              onChange={handleChange} 
              required min="1"
              className="w-full border border-[#e5e5e5] p-2 bg-[#f5f5f5] focus:outline-none focus:border-[#b3a394]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#8b7861] mb-1">Localidad en Arequipa</label>
          <input 
            type="text" 
            name="localidad" 
            value={formData.localidad} 
            onChange={handleChange} 
            required placeholder="Ej: Chivay, Yanque..."
            className="w-full border border-[#e5e5e5] p-2 bg-[#f5f5f5] focus:outline-none focus:border-[#b3a394]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#8b7861] mb-1">Nombre del Poblador/Anfitrión</label>
          <input 
            type="text" 
            name="poblador" 
            value={formData.poblador} 
            onChange={handleChange} 
            required
            className="w-full border border-[#e5e5e5] p-2 bg-[#f5f5f5] focus:outline-none focus:border-[#b3a394]"
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-[#b3a394] hover:bg-[#8b7861] text-white py-3 uppercase tracking-widest text-sm transition-colors mt-4"
        >
          Publicar Servicio
        </button>
      </form>
    </div>
  );
}

export default PobladorView;