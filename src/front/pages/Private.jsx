import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

export const Private = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar si el token JWT está presente en sessionStorage
    const token = sessionStorage.getItem('access_token');
    if (token) {
      setIsAuthenticated(true);  // Usuario autenticado
    }
  }, []);

  if (!isAuthenticated) {
    // Si no está autenticado, redirigir al login
    return <Navigate to="/login" />;
  }

  return <h1>Welcome to the private page!</h1>;
};


