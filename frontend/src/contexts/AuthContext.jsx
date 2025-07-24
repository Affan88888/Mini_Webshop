/*
 * AuthContext.jsx
 *
 * Ovaj fajl definiše AuthContext koji upravlja autentikacijom korisnika
 * širom React aplikacije koristeći React Context API i HTTP-only cookies.
 * Omogućava provjeru autentikacije prilikom reload-a stranice, logout funkcionalnost
 * i globalni pristup podacima usera.
 */
import { createContext, useContext, useState, useEffect } from "react";
import { API_BASE_URL } from "../config";

const AuthContext = createContext();

// `AuthProvider`: Komponenta koja pruža kontekst i omotava aplikaciju, omogućavajući pristup
// trenutnom korisniku (`user`) i funkcijama za autentikaciju (`setUser`, `logout`).
// Provjerava da li je korisnik već prijavljen pri svakom reloadu aplikacije.
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // useEffect hook koji se izvršava jednom prilikom mountovanja komponente
  // Automatski provjerava da li postoji aktivna sesija usera (npr. preko cookie-ja)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/check-auth`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user); // Primjer: { "email": "x" , "username": "y", "role": "z"}
        }
      } catch (err) {
        setUser(null); // U slučaju greške resetuje korisnika
      }
    };

    checkAuth();
  }, []);

  // `logout()`: Funkcija za odjavu korisnika. Poziva odgovarajući backend endpoint
  // i briše korisničke podatke iz state-a.
  const logout = async () => {
    await fetch(`${API_BASE_URL}/logout`, {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// `useAuth()`: Prilagođeni React hook koji omogućava pristup AuthContext-u
// iz bilo koje komponente unutar aplikacije.
export const useAuth = () => useContext(AuthContext);
