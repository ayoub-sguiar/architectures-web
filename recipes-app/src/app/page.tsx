"use client";

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
            <img src={recipe.image_url || "/placeholder.jpg"} alt={recipe.name} />
            <h3>{recipe.name}</h3>
            <p>{recipe.description.substring(0, 80)}...</p>
          </div>
        ))}
      </div>
    </div>
  );
}
