"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { getRecipes } from "@/services/api";
import { useRouter } from "next/navigation";

interface Recipe {
  id: string;
  name: string;
  image_url?: string;
  description: string;
}

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const router = useRouter();

  // ✅ Déconnexion automatique à l'arrivée sur le site
  useEffect(() => {
    if (typeof window !== "undefined") {
      const alreadyInitialized = localStorage.getItem("sessionInitialized");
  
      if (!alreadyInitialized) {
        // Première visite → on déconnecte et on marque la session comme "initialisée"
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.setItem("sessionInitialized", "true");
        console.log("👋 Première visite : utilisateur déconnecté");
      } else {
        console.log("🔁 Session déjà initialisée, pas de déconnexion");
      }
    }
  }, []);
  

  useEffect(() => {
    getRecipes()
      .then(setRecipes)
      .catch(error => console.error("Erreur lors du chargement des recettes :", error));
  }, []);

  return (
    <div className="container">
      <h1 className="text-center text-3xl font-bold text-green-700">🍽️ Liste des Recettes</h1>
          <div className="recipe-list">
        {recipes.map(recipe => (
          <div key={recipe.id} className="recipe-card" onClick={() => router.push(`/recettes/${recipe.id}`)}>
            <Image
              src={recipe.image_url || "/placeholder.jpg"}
              alt={recipe.name}
              width={300}
              height={200}
              quality={50} // Réduction importante
              unoptimized={true} // force l'optimisation si possible
              className="rounded-lg object-cover"
            />
            <h3>{recipe.name}</h3>
            <p>{recipe.description.substring(0, 80)}...</p>
          </div>
        ))}
      </div>
    </div>
  );
}
