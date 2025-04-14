"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loginUser, logoutUser } from "@/services/api";
import "./login.css";

export default function LoginPage() {
  return (
    <Suspense fallback={<p className="text-center mt-10 text-gray-500">Chargement...</p>}>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<string | null>(null);
  const [popupMessage, setPopupMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams(); // ✅ Toujours dans le Suspense

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Vérifie si l'utilisateur est déjà connecté
      const storedUsername = localStorage.getItem("username");
      setUser(storedUsername || null);

      // Vérifie si un message est présent dans l'URL
      const msg = searchParams.get("message");
      if (msg) setWarningMessage(msg);
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await loginUser(username, password);
    setPopupMessage(result);

    if (result.type === "success") {
      setUser(username);
      localStorage.setItem("username", username);

      setTimeout(() => router.push("/"), 2000); // 🔹 Redirection plus fluide après 2s
    }
  };

  const handleLogout = async () => {
    const result = await logoutUser();
    setPopupMessage(result);
    setUser(null);
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    localStorage.removeItem("sessionInitialized"); // 🔄 Permet la déconnexion auto si il revient plus tard
  };
  

  return (
    <div className="login-container">
      {/* 🔹 Messages pop-up en bas à gauche */}
      {popupMessage && (
        <div className={`popup ${popupMessage.type}`}>
          {popupMessage.text}
        </div>
      )}

      <div className="login-box">
        {/* 🔹 Message d'avertissement pour favoris */}
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
              <input
                type="text"
                placeholder="Nom d'utilisateur"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit" className="btn login">Se connecter</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
