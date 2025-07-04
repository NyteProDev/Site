import React from "react";
import "./Download.css";

function Download() {
  return (
    <div className="download-page">
      <div className="download-panel">
        <h1>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="32"
            viewBox="0 0 24 24"
            width="32"
            fill="#20c000"
            style={{ marginRight: "0.5rem" }}
          >
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path d="M5 20h14v-2H5v2zm7-18L5.33 9h3.84v4h4.66v-4h3.84L12 2z" />
          </svg>
          Téléchargement
        </h1>
        <p>
          Téléchargez le client <strong>IdleFus</strong> à partir de votre
          hébergeur préféré :
        </p>

        <div className="download-links">
          <div className="download-card">
            <h2>Google Drive</h2>
            <p>Hébergement rapide et sécurisé.</p>
            <a
              href="https://drive.google.com/ton-lien"
              target="_blank"
              rel="noopener noreferrer"
            >
              📥 Télécharger
            </a>
          </div>

          <div className="download-card">
            <h2>Mega</h2>
            <p>Stockage fiable avec 50GB gratuits.</p>
            <a
              href="https://mega.nz/ton-lien"
              target="_blank"
              rel="noopener noreferrer"
            >
              📥 Télécharger
            </a>
          </div>

          <div className="download-card">
            <h2>MediaFire</h2>
            <p>Hébergement direct sans limite.</p>
            <a
              href="https://www.mediafire.com/ton-lien"
              target="_blank"
              rel="noopener noreferrer"
            >
              📥 Télécharger
            </a>
          </div>
        </div>

        <p className="version-info">
          Version 1.0 – Dernière mise à jour : 4 juillet 2025
        </p>
      </div>
    </div>
  );
}

export default Download;
