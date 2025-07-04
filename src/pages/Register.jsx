import { useState } from 'react';
import './Register.css';

function Register() {
  const [email, setEmail] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage('❌ Les mots de passe ne correspondent pas');
      return;
    }

    const payload = {
      Email: email,
      Login: login,
      Password: password
    };

    try {
      const response = await fetch('/api/register', { // ✅ chemin relatif vers API Vercel
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success) {
        setMessage('✅ Compte créé avec succès !');
        // Réinitialiser le formulaire
        setEmail('');
        setLogin('');
        setPassword('');
        setConfirmPassword('');
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      setMessage('❌ Erreur réseau ou serveur');
    }
  };

  return (
    <div className="register-page">
      <div className="register-sidebar">
        <div className="register-panel">
          <h2>Création du compte web ⚙️</h2>
          <form className="register-form" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Adresse Mail"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Pseudo Web"
              value={login}
              onChange={e => setLogin(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirmer le mot de passe"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
            <button type="submit">S'inscrire</button>
          </form>
          {message && <p style={{ marginTop: '1rem', color: 'yellow' }}>{message}</p>}
          <p>Déjà inscrit ? <a href="/connexion">Connecte-toi</a></p>
        </div>
      </div>
    </div>
  );
}

export default Register;
