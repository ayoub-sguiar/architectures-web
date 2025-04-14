#!/bin/bash

# 🔴 1. Arrêter et supprimer tous les containers actifs
echo "🛑 Arrêt et suppression des containers en cours..."
docker stop $(docker ps -q) 2>/dev/null
docker rm $(docker ps -aq) 2>/dev/null

# 🗑️ 2. Supprimer toutes les images Docker
echo "🗑️ Suppression des images Docker..."
docker rmi $(docker images -q) -f 2>/dev/null

# 🧹 3. Nettoyer les volumes et les réseaux inutilisés
echo "🧹 Nettoyage des volumes et réseaux..."
docker volume prune -f
docker network prune -f

# 🚀 4. Nettoyage global Docker
echo "🚀 Suppression de tout ce qui n'est pas utilisé..."
docker system prune -a --volumes -f

# 🔧 5. Build de l'image Docker
echo "⚙️ Build de l'image Docker..."
docker build -t ayoubsg/archiwebsite .

# ✅ 6. Vérification de l'image
echo "✅ Liste des images Docker :"
docker images

# 🌍 7. Lancer le conteneur en local
# 🛠️ Changer les ports pour refléter la configuration Dockerfile (port 80)
echo "🚀 Démarrage du conteneur sur http://localhost"
docker run -d -p 80:80 ayoubsg/archiwebsite

# 🔐 8. Login Docker Hub (si besoin)
echo "🔐 Connexion à Docker Hub..."
docker login

# ☁️ 9. Pousser l’image sur Docker Hub
echo "☁️ Pushing l'image sur Docker Hub..."
docker push ayoubsg/archiwebsite

echo "🎉 Tout est prêt ! Ton image est disponible sur : https://hub.docker.com/r/ayoubsg/archiwebsite"
