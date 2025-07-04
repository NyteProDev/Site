import { NavLink, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../AuthContext';
import './Navbar.css';

function Navbar() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await fetch('/api/logout', {
  credentials: 'include',
  method: 'POST',
});
    setUser(null); // remet le contexte à null
    navigate('/connexion'); // redirige vers login
  };

  return (
    <nav className="navbar">
      <div className="navbar-center navbar-links">
        <NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""}>Accueil</NavLink>
        <NavLink to="/telecharger" className={({ isActive }) => isActive ? "active" : ""}>Télécharger</NavLink>
        {!user && (
          <>
            <NavLink to="/inscription" className={({ isActive }) => isActive ? "active" : ""}>Inscription</NavLink>
            <NavLink to="/connexion" className={({ isActive }) => isActive ? "active" : ""}>Connexion</NavLink>
          </>
        )}
        {user && (
          <>
            <NavLink to="/moncompte" className={({ isActive }) => isActive ? "active" : ""}>{user.Login}</NavLink>
            <button onClick={handleLogout} className="btn-logout-navbar">Déconnexion</button>
          </>
        )}
      </div>
      <div className="navbar-discord">
        <a
          href="https://discord.gg/TON-LIEN"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-discord-navbar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 0 245 240" fill="currentColor">
            <path d="M104.4 104.3c-5.7 0-10.2 5-10.2 11.2s4.6 11.2 10.2 11.2c5.7 0 10.2-5 10.2-11.2.1-6.2-4.5-11.2-10.2-11.2zm36.3 0c-5.7 0-10.2 5-10.2 11.2s4.6 11.2 10.2 11.2c5.7 0 10.2-5 10.2-11.2s-4.5-11.2-10.2-11.2z"/>
            <path d="M189.5 20h-134C39.8 20 20 39.8 20 65.5v109c0 25.7 19.8 45.5 45.5 45.5h112.3l-5.3-18.5 12.7 11.8 12 11.2 21.3 18.3V65.5c0-25.7-19.8-45.5-45.5-45.5zM162 163s-5.3-6.3-9.7-11.8c19.3-5.5 26.6-17.5 26.6-17.5-6 4-11.7 6.8-16.8 8.7-7.3 3.1-14.3 5.1-21.1 6.3-14 2.6-26.8 1.9-37.9-0.1-8.3-1.6-15.4-3.9-21.3-6.3-3.3-1.3-6.9-2.9-10.5-5-0.4-0.2-0.8-0.4-1.2-0.6-0.3-0.2-0.5-0.3-0.8-0.5-3.6-2-5.6-3.4-5.6-3.4s7.1 12 25.8 17.5c-4.4 5.5-9.8 12-9.8 12-32.4-1-44.7-22.3-44.7-22.3 0-47.2 21.1-85.6 21.1-85.6C78.7 45 92 46.3 92 46.3l2.2 2.6C75.4 55.5 69.6 63.3 69.6 63.3s3.1-1.8 8.3-4.2c15-6.6 26.9-8.4 31.8-8.8 0.8-0.1 1.5-0.2 2.3-0.2 8.2-1.1 17.5-1.4 27.3-0.3 12.8 1.5 26.5 5.3 40.5 13.1 0 0-6.5-8-20.4-14.5l3.1-3.5s13.3-1.3 27.4 4.7c0 0 21.1 38.4 21.1 85.6 0 0-12.5 21.3-45 22.3z"/>
          </svg>
          <span>Discord</span>
        </a>
      </div>
    </nav>
  );
}

export default Navbar;
