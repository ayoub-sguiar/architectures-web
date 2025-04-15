"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getFavorites, removeFavorite } from "@/services/api";

interface Recipe {
  id: string;
  name: string;
  image_url: string;
  description: string;
}

interface FavoriteAPIResponse {
  recipe: Recipe;

  
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteAPIResponse[] | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    if (!token || !username) {
      router.push("/login?message=Connectez-vous pour voir vos favoris");
      return;
    }

    getFavorites().then(setFavorites).catch(console.error);
  }, [router]);

  if (favorites === null) {
    return <p className="text-center mt-10 text-gray-500">Chargement...</p>;
  }

  if (favorites.length === 0) {
    return (
      <div className="container">
        <h1 className="text-center text-3xl font-bold text-green-700">⭐ Mes Recettes Favorites</h1>
        <p className="text-center text-gray-500">Aucune recette en favoris.</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="text-center text-3xl font-bold text-green-700">⭐ Mes Recettes Favorites</h1>
      <div className="recipe-list">
        {favorites.map((fav) => {
          const recipe = fav.recipe || fav; // support les deux formats (en cas de /favorites qui retourne un objet `recipe`)
          return (
          <div
            key={recipe.id}
            className="recipe-card cursor-pointer"
            onClick={() => router.push(`/recettes/${recipe.id}`)}
          >
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
            <p>{recipe.description?.substring(0, 80)}...</p>
            <button
              className="btn remove"
              onClick={async (e) => {
                e.stopPropagation(); // 👈 éviter que le clic sur le bouton redirige
                const result = await removeFavorite(recipe.id);
                if (result.success) {
                  setFavorites(favorites.filter((r) => (r.recipe || r).id !== recipe.id));
                }
                alert(result.message);
              }}
            >
              ❌ Retirer
            </button>
          </div>
          );
        })}
      </div>
    </div>
  );
}
