import './Home.css';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home">
      <div className="home-hero">
        <h1 className="home-title">Bienvenue sur <span>Idle</span> ✨</h1>
        <p className="home-subtitle">
          IdleFus, un monde inspiré de Dofus où vos personnages progressent même quand vous ne jouez pas.
        </p>
        <div className="home-buttons">
          <Link to="/telecharger" className="btn">📥 Télécharger</Link>
          <Link to="/inscription" className="btn btn-secondary">📝 Créer un compte</Link>
        </div>
      </div>

      <div className="home-features">
        <h2>⚔️ Ce que propose Idle</h2>
        <div className="features-list">
          <div className="feature-card">
            <h3>🌙 Progression AFK</h3>
            <p>Vos héros gagnent de l'expérience même quand vous êtes déconnecté.</p>
          </div>
          <div className="feature-card">
            <h3>🛡️ Stuff & Évolution</h3>
            <p>Améliorez votre équipement, débloquez des compétences, et devenez plus fort.</p>
          </div>
          <div className="feature-card">
            <h3>🌍 Monde vivant</h3>
            <p>Un univers inspiré de Dofus où les joueurs laissent leur trace.</p>
          </div>
          <div className="feature-card">
            <h3>⛔ Serveur Mono-Compte</h3>
            <p>L'expérience Idle se fait avec 1 seul compte par IP et par personne.</p>
          </div>
        </div>
      </div>

      <div className="home-cta">
        <h2>Prêt à rejoindre l'aventure ?</h2>
        <Link to="/inscription" className="btn btn-highlight">Rejoindre maintenant</Link>
      </div>
    </div>
    
  );
}

export default Home;
