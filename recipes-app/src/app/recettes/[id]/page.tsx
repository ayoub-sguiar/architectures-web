"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

interface Recipe {
  name: string;
  image_url: string;
  description: string;
  cook_time: number;
  prep_time: number;
  servings: number;
  category: string;
}

export default function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    axios.get(`https://gourmet.cours.quimerch.com/recipes/${id}`, {
      headers: { Accept: "application/json" }
    })
    .then(response => setRecipe(response.data))
    .catch(error => console.error("Erreur lors du chargement de la recette :", error));
  }, [id]);

  if (!recipe) return <p>Chargement...</p>;

  return (
    <div className="container">
      <h1>{recipe.name}</h1>
      <img src={recipe.image_url} alt={recipe.name} />
      <p><strong>Catégorie :</strong> {recipe.category}</p>
      <p><strong>Temps de préparation :</strong> {recipe.prep_time} min</p>
      <p><strong>Temps de cuisson :</strong> {recipe.cook_time} min</p>
      <p><strong>Portions :</strong> {recipe.servings}</p>
      <p>{recipe.description}</p>
    </div>
  );
}
