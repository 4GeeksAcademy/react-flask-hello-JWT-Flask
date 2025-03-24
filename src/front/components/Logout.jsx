import React from 'react';
import { useNavigate } from 'react-router-dom';  // Usar useNavigate en lugar de useHistory

export const Logout = () => {
  const navigate = useNavigate();  // Usar navigate para redirigir

  const handleLogout = () => {
    // Eliminar el token JWT del sessionStorage
    sessionStorage.removeItem('access_token');
    
    // Redirigir al login
    navigate('/login');
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
};

