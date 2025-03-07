"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem("isAuthenticated"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    router.push("/login");
  };

  return (
    <html lang="fr">
      <body>
        <nav className="navbar">
          <div className="logo" onClick={() => router.push("/")}>🍽️ Recettes</div>
          <div>
            {isAuthenticated ? (
              <button className="btn" onClick={handleLogout}>Se déconnecter</button>
            ) : (
              <button className="btn" onClick={() => router.push("/login")}>Se connecter</button>
            )}
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
