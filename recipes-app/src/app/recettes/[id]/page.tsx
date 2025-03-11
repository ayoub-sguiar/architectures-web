"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { addFavorite } from "@/services/api";
import axios from "axios";
import styles from "./RecipeDetail.module.css";

interface Recipe {
  id: string;
  name: string;
  image_url: string;
  description: string;
  cook_time: number;
  prep_time: number;
  servings: number;
  category: string;
  ingredients: string[];
  instructions: string;
  created_at: string;
}

export default function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const router = useRouter();

  useEffect(() => {
    axios
      .get(`https://gourmet.cours.quimerch.com/recipes/${id}`, {
        headers: { Accept: "application/json" },
      })
      .then((response) => setRecipe(response.data))
      .catch((error) => console.error("Erreur lors du chargement de la recette :", error));
  }, [id]);

  if (!recipe) return <p className="text-center mt-10">Chargement...</p>;

  return (
    <div className={styles.container}>
      {/* Image principale */}
      <div className={styles.imageContainer}>
        <img
          src={recipe.image_url || "/placeholder.jpg"}
          alt={recipe.name}
        />
      </div>

      {/* Titre & Infos */}
      <div className={styles.titleContainer}>
        <h1>{recipe.name}</h1>
        <p>{recipe.description}</p>

        <div className={styles.infoContainer}>
          <span>📌 {recipe.category}</span>
          <span>⏳ {recipe.prep_time + recipe.cook_time} min</span>
          <span>🍽️ {recipe.servings} personnes</span>
          {recipe.created_at && (
            <span>📅 Ajoutée le {new Date(recipe.created_at).toLocaleDateString("fr-FR")}</span>
          )}
        </div>
      </div>

      {/* Contenu principal */}
      <div className={styles.mainContent}>
        {/* Ingrédients */}
        <div className={styles.ingredients}>
          <h2>🛒 Ingrédients</h2>
          <ul>
            {recipe.ingredients?.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>

        {/* Instructions */}
        <div className={styles.instructions}>
          <h2>👨‍🍳 Instructions</h2>
          <p>{recipe.instructions}</p>
        </div>
      </div>

      {/* Bouton Favoris */}
      <div className="text-center mt-8">
        <button
          onClick={() => addFavorite(recipe.id)}
          className={styles.favoriteButton}
        >
          ⭐ Ajouter aux favoris
        </button>
      </div>
    </div>
  );
}