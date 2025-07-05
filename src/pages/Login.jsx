import React, { useState } from 'react';
import './Login.css';
import Swal from 'sweetalert2'; // ✅ import de SweetAlert2
import 'sweetalert2/dist/sweetalert2.min.css'; // ✅ styles SweetAlert2

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // ✅ important pour le cookie
        body: JSON.stringify({ Email: email, Password: password }),
      });

      const data = await response.json();

      if (data.success) {
        // ✅ Affiche une popup stylée
        Swal.fire({
          title: 'Connexion réussie 🎉',
          text: 'Redirection vers votre compte...',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
        });

        // ✅ Attends 2 secondes avant de rediriger
        setTimeout(() => {
          window.location.href = '/MonCompte';
        }, 2000);
      } else {
        setError(data.message || 'Erreur de connexion');
      }
    } catch (err) {
      setError('Erreur serveur');
    }
  };

  return (
    <div className="login-page">
      <div className="login-panel">
        <h2>Connexion 🔑</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Adresse mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Se connecter</button>
        </form>
        {error && <p className="error">{error}</p>}
        <p>
          Pas encore de compte ? <a href="/inscription">Inscris-toi</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
