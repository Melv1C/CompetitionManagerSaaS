#!/bin/bash

# Load the .env file
source .env

# Check if DOCKER_HOST is set
if [ -z "$DOCKER_HOST" ]; then
    echo "DOCKER_HOST environment variable is not set."
    exit 1
fi

APP_NAME="competition-manager-web"

# Go to the frontend directory
cd apps/competition-manager-web

# Install the dependencies
# npm install

# Build the frontend
npm run build

# Build the Docker image
docker build -t $APP_NAME .

TAG_NAME="$DOCKER_HOST/$APP_NAME"

# Tag the Docker image
docker tag $APP_NAME $TAG_NAME

# Ask if the user wants to push the image to the hub
read -p "Do you want to push the image to the Docker hub? (y/N): " PUSH_IMAGE

if [ "$PUSH_IMAGE" == "y" ]; then
    # Push the Docker image
    docker push $TAG_NAME
fi