import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './MonCompte.css';
import { AuthContext } from '../AuthContext';

function CreateGameAccountForm({ onClose, isVisible }) {
  const [login, setLogin] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleCreate = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await fetch('/api/create-game-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // ✅ important pour les cookies
        body: JSON.stringify({ Login: login, Nickname: nickname, Password: password }),
      });
      const data = await response.json();

      if (data.success) {
        setMessage('✅ Compte jeu créé avec succès !');
        setLogin('');
        setNickname('');
        setPassword('');
        setTimeout(() => onClose(), 500); // Ferme après 0.5s
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (error) {
      setMessage('❌ Erreur réseau ou serveur');
    }
  };

  return (
    <div className={`create-panel ${isVisible ? 'show' : ''}`}>
      <h3>Créer un compte jeu</h3>
      <form onSubmit={handleCreate}>
        <input
          placeholder="Login"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          required
        />
        <input
          placeholder="Pseudo"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          required
        />
        <input
          placeholder="Mot de passe"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Créer</button>
      </form>
      {message && <p className="form-message">{message}</p>}
      <button
        onClick={onClose}
        style={{ marginTop: '1rem', backgroundColor: '#ff4d4d' }}
      >
        Fermer
      </button>
    </div>
  );
}

function MonCompte() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false);
  const { fetchUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/account', {
      credentials: 'include', // ✅ pour envoyer le cookie rememberme
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUser(data.user);
        } else {
          navigate('/connexion');
        }
        setLoading(false);
      })
      .catch(() => navigate('/connexion'));
  }, [navigate]);

  const handleLogout = async () => {
    await fetch('/api/logout', {
      credentials: 'include',
      method: 'POST',
    });
    fetchUser(); // met à jour la navbar
    navigate('/connexion');
  };

  if (loading) {
    return (
      <div className="account-page">
        <div className="account-panel">
          <h2>Chargement...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="account-page">
      <div className={`account-wrapper ${panelOpen ? 'shift-left' : ''}`}>
        <div className="account-panel">
          <h2>Bienvenue, {user.Login} 👋</h2>
          <p><strong>Email :</strong> {user.Email}</p>
          <p><strong>Ogrines :</strong> {user.Ogrine}</p>

          <button onClick={() => setPanelOpen(true)}>Créer un compte jeu</button>
          <button className="logout-btn" onClick={handleLogout}>Se déconnecter</button>
        </div>

        {/* ✅ Toujours présent mais fade */}
        <CreateGameAccountForm
          onClose={() => setPanelOpen(false)}
          isVisible={panelOpen}
        />
      </div>
    </div>
  );
}

export default MonCompte;
