set -euxo pipefail

echo "Deploying!"

 sshpass -p "$PASS" scp -r ./src/* santorini:~/

 sshpass -p "$PASS" ssh santorini "docker compose pull && docker compose up -d --remove-orphans && docker image prune -f && docker compose logs -f"
