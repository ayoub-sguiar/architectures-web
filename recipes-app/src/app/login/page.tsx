"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loginUser, logoutUser } from "@/services/api";
import "./login.css";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<string | null>(null);
  const [popupMessage, setPopupMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUsername = localStorage.getItem("username");
      if (storedUsername) {
        setUser(storedUsername);
      } else {
        setUser(null);
        router.push("/login"); // Redirect to login page if not logged in
      }
    }
    const msg = searchParams.get("message");
    if (msg) {
      setWarningMessage(msg);
    }
  }, [searchParams, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await loginUser(username, password);
    setPopupMessage(result);
    if (result.type === "success") {
      setUser(username); // Set the user state
      localStorage.setItem("username", username); // Store the username in local storage
      setTimeout(() => router.push("/"), 3000);
    }
  };

  const handleLogout = async () => {
    const result = await logoutUser();
    setPopupMessage(result);
    setUser(null);
    localStorage.removeItem("username"); // Clear the stored username on logout
  };

  return (
    <div className="login-container">
      <div className="popup-container">
        {popupMessage && (
          <div className={`popup ${popupMessage.type}`}>
            {popupMessage.text}
          </div>
        )}
      </div>

      <div className="login-box">
        {warningMessage && <div className="warning-message">⚠️ {warningMessage}</div>}
        {user ? (
          <>
            <h2>Bonjour, {user} 👋</h2>
            <button onClick={handleLogout} className="btn logout">Se déconnecter</button>
          </>
        ) : (
          <>
            <h2>Connexion</h2>
            <form onSubmit={handleLogin}>
              <input type="text" placeholder="Nom d'utilisateur" value={username} onChange={(e) => setUsername(e.target.value)} required />
              <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="submit" className="btn login">Se connecter</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}