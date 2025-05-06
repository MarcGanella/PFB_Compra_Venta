import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/recover`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.message || "No hay ninguna cuenta con ese correo"
        );
      }
      setMessage(
        "Te hemos enviado un email con instrucciones para recuperar tu contraseña."
      );

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="forgot-password-page">
      <div className="forgot-password-container">
      <button
          type="button"
          className="back-button"
          onClick={() => navigate(-1)}
          aria-label="Volver atrás"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className="back-icon-svg"
          >
            <path
              d="M15 18l-6-6 6-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <Link to="/">
        <button className="close-button" type="button" aria-label="Cerrar">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="close-icon-svg"
            >
              <line
                x1="18"
                y1="6"
                x2="6"
                y2="18"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
              />
              <line
                x1="6"
                y1="6"
                x2="18"
                y2="18"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
              />
            </svg>
          </button>
          </Link>

        <h2>Recuperar contraseña</h2>
        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Introduce tu correo"
            />

          </div>
          <button type="submit" className="submit-button">
            Enviar
          </button>
        </form>
      </div>
    </main>
  );
};

export default ForgotPassword;

