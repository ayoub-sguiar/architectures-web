"use client";

import { useRouter } from "next/navigation";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const goToFavorites = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      // ✅ Supprime le message de la barre de navigation en attendant la redirection
      setTimeout(() => {
        router.push("/login?message=connectez-vous pour voir vos favoris");
      }, 0);
    } else {
      router.push("/favorites");
    }
  };

  return (
    <html lang="fr">
      <body>
        <nav className="navbar">
          <div className="logo" onClick={() => router.push("/")}>🍽️ Recettes</div>
          <div>
            <button className="btn" onClick={goToFavorites}>⭐ Favoris</button>
            <button className="btn login" onClick={() => router.push("/login")}>Connexion</button>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
