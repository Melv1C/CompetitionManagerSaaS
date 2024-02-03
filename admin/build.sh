#!/bin/bash

# check if the user has provided a Docker ID
if [ -z "$1" ]; then
    echo "Please provide a Docker ID as an argument."
    exit 1
fi

# Define the service name and Docker ID
SERVICE_NAME="cm-admin"
DOCKER_ID=$1

# Build the Docker image
echo "Building the Docker image..."
docker build -t $SERVICE_NAME .

# Tag the Docker image with the Docker ID
echo "Tagging the Docker image with Docker ID..."
docker tag $SERVICE_NAME $DOCKER_ID/$SERVICE_NAME

# Ask if you want to push the Docker image to Docker Hub
read -p "Do you want to push the Docker image ($SERVICE_NAME) to Docker Hub? (y/n): " push_option

if [ "$push_option" == "y" ]; then
    # Push the Docker image to Docker Hub
    echo "Pushing the Docker image to Docker Hub..."
    docker push $DOCKER_ID/$SERVICE_NAME
    echo "Image pushed successfully."
else
    echo "Image not pushed to Docker Hub."
fi

echo "Script completed."