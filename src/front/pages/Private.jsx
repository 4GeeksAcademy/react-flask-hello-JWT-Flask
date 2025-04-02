import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

export const Private = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null para el estado inicial
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    // Verificamos el token con el backend
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/private`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => {
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch(() => setIsAuthenticated(false))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando...</p>;

  if (!isAuthenticated) {
    return <Navigate to="/loginSignup" />;
  }

  return (
    <div className="container text-center mt-5">
      <h1 className="mb-4">Bienvenido a tu zona privada</h1>
      <button
        className="btn btn-danger"
        onClick={() => {
          sessionStorage.removeItem('token');
          window.location.href = '/';
        }}
      >
        Cerrar sesión
      </button>
    </div>
  );
};
