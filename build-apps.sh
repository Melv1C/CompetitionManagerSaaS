#!/bin/bash

# Load the .env file
source .env

# Check if DOCKER_HOST is set
if [ -z "$DOCKER_HOST" ]; then
    echo "DOCKER_HOST environment variable is not set."
    exit 1
fi

# Check if app name is provided
if [ -z "$1" ]; then
    echo "Usage: $0 <app-name>"
    exit 1
fi

APP_NAME=$1
DOCKERFILE_PATH="apps/$APP_NAME/Dockerfile"

# Check if Dockerfile exists
if [ ! -f "$DOCKERFILE_PATH" ]; then
    echo "Dockerfile not found at $DOCKERFILE_PATH"
    exit 1
fi

IMAGE_NAME="$APP_NAME"

# Build the Docker image
docker build -t $IMAGE_NAME -f $DOCKERFILE_PATH .

TAG_NAME="$DOCKER_HOST/$IMAGE_NAME"

# Tag the Docker image
docker tag $IMAGE_NAME $TAG_NAME

# Ask if the user wants to push the image to the hub
read -p "Do you want to push the image to the Docker hub? (y/N): " PUSH_IMAGE

if [ "$PUSH_IMAGE" == "y" ]; then
    # Push the Docker image
    docker push $TAG_NAME
fi