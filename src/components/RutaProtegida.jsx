import React from 'react';
import { Navigate } from 'react-router-dom';

export const RutaProtegida = ({ children }) => {
  // Buscamos si el usuario tiene su carnet (token) guardado en la memoria
  const token = localStorage.getItem('token');

  // Si no hay token, lo expulsamos inmediatamente a la página de login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Si tiene token, le abrimos la puerta y lo dejamos ver el panel
  return children;
};