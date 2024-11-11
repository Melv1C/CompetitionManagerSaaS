# Utilise une image de base légère
FROM alpine:latest

# Crée un répertoire pour le contenu statique
RUN mkdir -p /app/competition-manager-web

# Copie le contenu du dossier local 'static' dans l'image
COPY dist /app/competition-manager-web

# Commande pour garder le conteneur actif (par exemple, avec tail)
CMD ["tail", "-f", "/dev/null"]


