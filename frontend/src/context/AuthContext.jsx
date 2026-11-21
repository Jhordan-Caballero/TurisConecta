import { createContext, useContext, useState } from 'react';
import { SESSION_KEY } from '../services/api';

const AuthContext = createContext(null);

function leerSesion() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY)) || null;
  } catch {
    return null;
  }
}

function guardarSesion(sesion) {
  try {
    if (sesion) localStorage.setItem(SESSION_KEY, JSON.stringify(sesion));
    else localStorage.removeItem(SESSION_KEY);
  } catch {
    // Sin localStorage la sesión dura solo mientras la pestaña esté abierta.
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(leerSesion);

  // datos: respuesta de /auth/login o /auth/registro (access_token, id, nombre, rol)
  const login = (datos, email) => {
    const sesion = {
      id: datos.id,
      nombre: datos.nombre,
      rol: datos.rol,
      email,
      token: datos.access_token,
    };
    guardarSesion(sesion);
    setUser(sesion);
  };

  const logout = () => {
    guardarSesion(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
