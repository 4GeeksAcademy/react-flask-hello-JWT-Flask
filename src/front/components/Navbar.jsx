import React from 'react';
import { Link } from 'react-router-dom';
import { Logout } from './Logout';

export const Navbar = () => {
  const token = sessionStorage.getItem('access_token');

  return (
    <nav>
      <ul style={{ display: 'flex', listStyleType: 'none', padding: 0 }}>
        {/* Enlace a la página de inicio */}
        <li style={{ margin: '0 10px' }}>
          <Link to="/">Home</Link>
        </li>

        {/* Si el usuario no está autenticado */}
        {!token ? (
          <>
            <li style={{ margin: '0 10px' }}>
              <Link to="/loginSignup">Sign Up</Link>
            </li>
          </>
        ) : (
          <>
            {/* Si el usuario está autenticado */}
            <li style={{ margin: '0 10px' }}>
              <Link to="/private">Private</Link>
            </li>
            <li style={{ margin: '0 10px' }}>
              <Logout />
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

