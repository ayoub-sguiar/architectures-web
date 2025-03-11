"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface Recipe {
  id: string;
  name: string;
  image_url: string;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const router = useRouter();

  useEffect(() => {
    if (!token) return;
    axios.get("https://gourmet.cours.quimerch.com/favorites", {
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` }
    })
    .then(response => setFavorites(response.data || []))
    .catch(error => console.error("Erreur lors du chargement des favoris :", error));
  }, [token]);

  if (!token) {
    return (
      <div className="container">
        <h2>⚠️ Vous devez être connecté pour voir vos favoris.</h2>
        <button className="btn" onClick={() => router.push("/login")}>Se connecter</button>
      </div>
    );
  }

  const addFavorite = async (recipe: Recipe) => {
    try {
      await fetch(`https://gourmet.cours.quimerch.com/users/${username}/favorites?recipeID=${recipe.id}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(recipe)
      });
      setFavorites([...favorites, recipe]);
    } catch (error) {
      console.error("Erreur lors de l'ajout aux favoris :", error);
    }
  };

  const removeFavorite = async (recipeID: string) => {
    try {
      await fetch(`https://gourmet.cours.quimerch.com/users/${username}/favorites?recipeID=${recipeID}`, {
        method: "DELETE",
        headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
      });
      setFavorites(favorites.filter(recipe => recipe.id !== recipeID));
    } catch (error) {
      console.error("Erreur lors de la suppression des favoris :", error);
    }
  };

  return (
    <div className="container">
      <h1>⭐ Mes Recettes Favorites</h1>
      {favorites.length === 0 ? <p>Aucune recette en favoris.</p> : (
        <div className="recipe-list">
          {favorites.map(recipe => (
            <div key={recipe.id} className="recipe-card">
              <img src={recipe.image_url} alt={recipe.name} />
              <h3>{recipe.name}</h3>
              <button className="btn remove" onClick={() => removeFavorite(recipe.id)}>❌ Retirer</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}