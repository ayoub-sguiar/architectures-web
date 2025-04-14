export const API_BASE_URL = "https://gourmet.cours.quimerch.com";

/**
 * 📌 Vérifie si l'utilisateur est authentifié
 */
export const isAuthenticated = (): boolean => {
  if (typeof window !== "undefined") {
    return !!localStorage.getItem("token");
  }
  return false;
};

/**
 * 📌 Connexion de l'utilisateur
 */
export async function loginUser(username: string, password: string): Promise<{ text: string; type: "success" | "error" }> {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
  
      if (!response.ok) throw new Error("Connexion échouée");
  
      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", username);
  
      return { text: "✅ Connexion réussie", type: "success" };
    } catch (error) {
      return { text: "❌ Connexion échouée", type: "error" };
    }
  };

/**
 * 📌 Déconnexion de l'utilisateur
 */
export async function logoutUser(): Promise<{ text: string; type: "success" | "error" }> {
    try {
      await fetch(`${API_BASE_URL}/logout`, {
        method: "GET",
        headers: { Accept: "application/json" },
      });
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  
    localStorage.removeItem("token");
    localStorage.removeItem("username");
  
    return { text: "✅ Déconnexion réussie", type: "success" };
  };

/**
 * 📌 Récupère la liste des recettes
 */
export const getRecipes = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/recipes`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) throw new Error("Erreur lors du chargement des recettes");

    return await response.json();
  } catch (error) {
    console.error("Erreur lors du chargement des recettes :", error);
    return [];
  }
};

/**
 * 📌 Récupère les recettes favorites de l'utilisateur
 */
export const getFavorites = async () => {
  try {
    if (typeof window === "undefined") return [];

    const token = localStorage.getItem("token");
    if (!token) return [];

    const response = await fetch(`${API_BASE_URL}/favorites`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Erreur API: ${response.status} - ${err}`);
    }

    const rawData = await response.json();

    // 🔥 Ici on extrait le champ "recipe" de chaque élément
    const recipes = rawData.map((fav: { recipe: any }) => fav.recipe);
    return recipes;

  } catch (error) {
    console.error("❌ Erreur lors de la récupération des favoris :", error);
    return [];
  }
};


/**
 * 📌 Ajoute une recette aux favoris
 */
export const addFavorite = async (recipeID: string) => {
  try {
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");

    if (!username || !token) {
      return { success: false, message: "Utilisateur non authentifié" };
    }

    const response = await fetch(`${API_BASE_URL}/users/${username}/favorites?recipeID=${recipeID}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: undefined,
    });

    if (response.status === 409) {
      // 🎯 Message personnalisé pour l'erreur de doublon
      return {
        success: true,
        message: "Cette recette est déjà dans vos favoris ✅",
      };
    }

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, message: `Erreur ${response.status} : ${errorText}` };
    }

    return { success: true, message: "Ajouté aux favoris ✅" };
  } catch (error) {
    return { success: false, message: `Échec de l'ajout ❌ ${error}` };
  }
};


/**
 * 📌 Supprime une recette des favoris
 */
export const removeFavorite = async (recipeID: string): Promise<{ success: boolean; message: string }> => {
  try {
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");
    if (!username) return { success: false, message: "Utilisateur non authentifié" };

    const response = await fetch(`${API_BASE_URL}/users/${username}/favorites?recipeID=${recipeID}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Erreur lors de la suppression des favoris");

    return { success: true, message: "Supprimé des favoris ✅" };
  } catch (error) {
    return { success: false, message: "Échec de la suppression des favoris ❌" };
  }
};

