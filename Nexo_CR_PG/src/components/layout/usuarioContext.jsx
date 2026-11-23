import { createContext, useContext } from 'react';

export const UsuarioContext = createContext(null);

export function useUsuario() {
  const contexto = useContext(UsuarioContext);

  if (!contexto) {
    throw new Error('useUsuario debe utilizarse dentro de UsuarioContext.Provider.');
  }

  return contexto;
}
