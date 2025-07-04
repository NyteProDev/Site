import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Vérifie si un utilisateur est connecté
  const fetchUser = () => {
    fetch('/api/account', { // ✅ Utilise chemin relatif vers API Vercel
      credentials: 'include', // ✅ important pour envoyer le cookie
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null));
  };

  useEffect(() => {
    fetchUser(); // Vérifie au chargement
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}
