import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const LoginSignup = () => {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignup, setIsSignup] = useState(false);  // Para saber si estamos en el flujo de signup o login
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const dataUser = { name, email, password };

            if (isSignup) {
                // Llamada a la API para registrarse
                const response = await fetch(`${import.meta.env.VARIABLE_NAME}/api/signup`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dataUser)
                });

                if (!response.ok) {
                    throw new Error('Error al registrarse');
                }

                const data = await response.json();
                const token = data.token;
                if (!token) {
                    throw new Error('No se recibió el token');
                }

                sessionStorage.setItem('token', token);  // Guardar el token en sessionStorage
                setSuccessMessage('Usuario registrado exitosamente');
                setTimeout(() => {
                    setIsSignup(false);  // Cambiar a login después del registro exitoso
                }, 2000);
            } else {
                // Llamada a la API para hacer login
                const response = await fetch(`${import.meta.env.VARIABLE_NAME}/api/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                if (!response.ok) {
                    throw new Error('Error al iniciar sesión');
                }

                const data = await response.json();
                const token = data.token;
                if (!token) {
                    throw new Error('No se recibió el token');
                }

                sessionStorage.setItem('token', token);  // Guardar el token en sessionStorage
                navigate('/private');  // Redirigir al usuario a la página privada
            }

            // Limpiar los campos después de la solicitud
            setName('');
            setEmail('');
            setPassword('');
        } catch (error) {
            setError(error.message || 'Error al procesar la solicitud.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100" 
            style={{
                background: "",
                backgroundSize: "cover",
                padding: "2rem"
            }}
        >
            <div className="card shadow-lg p-5" style={{
                width: "100%",
                maxWidth: "35rem",
                borderRadius: "20px",
                backgroundColor: "#ffffff",
                border: "none",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)"
            }}>
                <div className="card-body text-center">
                    <h2 className="mb-4" style={{ color: "#333", fontWeight: "bold" }}>
                        {isSignup ? "Regístrate" : "Iniciar sesión"}
                    </h2>

                    <form onSubmit={handleSubmit}>
                        {isSignup && (
                            <div className="mb-3">
                                <input
                                    type="text"
                                    className="form-control p-3"
                                    placeholder="Nombre"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    style={{ borderRadius: "10px", border: "2px solid #ddd" }}
                                />
                            </div>
                        )}

                        <div className="mb-3">
                            <input
                                type="email"
                                className="form-control p-3"
                                placeholder="Correo electrónico"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{ borderRadius: "10px", border: "2px solid #ddd" }}
                            />
                        </div>

                        <div className="mb-3">
                            <input
                                type="password"
                                className="form-control p-3"
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{ borderRadius: "10px", border: "2px solid #ddd" }}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn w-100 py-2"
                            style={{
                                backgroundColor: loading ? "#6c757d" : "#007bff",
                                color: "#ffffff",
                                fontSize: "1.1rem",
                                borderRadius: "10px",
                                transition: "0.3s ease-in-out",
                                cursor: loading ? "not-allowed" : "pointer",
                            }}
                            disabled={loading}
                        >
                            {loading ? "Cargando..." : isSignup ? "Registrar" : "Iniciar sesión"}
                        </button>

                        {error && <p className="text-danger text-center mt-2">{error}</p>}
                        {successMessage && <p className="text-success text-center mt-2">{successMessage}</p>}
                    </form>

                    <p className="text-center mt-3">
                        {isSignup ? (
                            <>
                                ¿Ya tienes cuenta? <span className="text-primary" style={{ cursor: "pointer" }} onClick={() => setIsSignup(false)}>Inicia sesión</span>
                            </>
                        ) : (
                            <>
                                ¿No tienes cuenta? <span className="text-primary" style={{ cursor: "pointer" }} onClick={() => setIsSignup(true)}>Regístrate</span>
                            </>
                        )}
                    </p>

                    {!isSignup && (
                        <p className="text-center mt-1">
                            <Link to="/RecuperacionContraseña" className="text-primary">¿Olvidaste tu contraseña?</Link>
                        </p>
                    )}

                    <Link to="/" className="d-block mt-3 text-secondary" style={{ fontSize: "1rem", textDecoration: "none" }}>
                        <i className="bi bi-arrow-left"></i> Volver a la página principal
                    </Link>
                </div>
            </div>
        </div>
    );
};
