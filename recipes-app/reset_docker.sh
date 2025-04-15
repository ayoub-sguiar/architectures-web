#!/bin/bash

# 🛑 1. Stop & remove containers
echo "🛑 Arrêt & suppression des containers..."
docker stop $(docker ps -q) 2>/dev/null
docker rm $(docker ps -aq) 2>/dev/null

# 🗑️ 2. Remove old images
echo "🗑️ Suppression des images Docker..."
docker rmi $(docker images -q) -f 2>/dev/null

# 🧼 3. Clean up volumes & networks
echo "🧹 Nettoyage volumes et réseaux..."
docker volume prune -f
docker network prune -f

# 🚀 4. Docker system prune
echo "🚀 Nettoyage global Docker..."
docker system prune -a --volumes -f

# 🔧 5. Build optimisée de l'image Docker
echo "⚙️ Build de l'image Docker optimisée..."
docker build -t ayoubsg/archiwebsite .

# ✅ 6. Vérification de l'image
echo "✅ Liste des images Docker :"
docker images | grep archiwebsite

# 🌍 7. Run container sur port 80
echo "🚀 Lancement du conteneur sur http://localhost"
docker run -d -p 80:80 --name archiwebsite-container ayoubsg/archiwebsite

# 🔐 8. Login (si nécessaire)
echo "🔐 Docker Hub login (si requis)..."
docker login

# ☁️ 9. Push vers Docker Hub
echo "☁️ Pushing l'image vers Docker Hub..."
docker push ayoubsg/archiwebsite

echo "🎉 Fini ! Ton image est dispo ici : https://hub.docker.com/r/ayoubsg/archiwebsite"
