import axios from 'axios';

export const SESSION_KEY = 'turisconecta_sesion';
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = axios.create({ baseURL: API_URL });

// Adjunta el token JWT guardado en la sesión a cada petición.
api.interceptors.request.use((config) => {
  try {
    const sesion = JSON.parse(localStorage.getItem(SESSION_KEY));
    if (sesion?.token) config.headers.Authorization = `Bearer ${sesion.token}`;
  } catch {
    // Sin localStorage (modo privado, por ejemplo): la petición sale sin token.
  }
  return config;
});

// Convierte los distintos formatos de error de FastAPI en un mensaje legible.
export function mensajeError(error) {
  if (!error?.response) {
    return 'No se pudo conectar con el servidor. Revisa que el backend esté encendido.';
  }
  const detail = error.response.data?.detail;
  if (typeof detail === 'string') return detail;
  if (detail?.mensaje) return detail.mensaje;
  if (Array.isArray(detail)) return detail.map((d) => d.msg).join('. ');
  return 'Ocurrió un error. Inténtalo de nuevo.';
}
