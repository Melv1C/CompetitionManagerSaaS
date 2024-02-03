#!/bin/bash

ALL_SERVICES="athletes competitions events nginx"

# Vérifier si le nombre d'arguments est correct
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <service_name> <docker_id>"
    echo "Existing services: $ALL_SERVICES frontend admin all"
    exit 1
fi

SERVICE_NAME=$1
DOCKER_ID=$2

# Vérifier si le service spécifié existe
for service in $ALL_SERVICES; do
    if [ "$SERVICE_NAME" == "$service" ]; then
        cd backend/$SERVICE_NAME
        
        # Vérifier si le script de build spécifié existe
        if [ -f "build.sh" ]; then
            echo "Building $SERVICE_NAME service..."
            ./build.sh "$DOCKER_ID"
            echo "Build completed for $SERVICE_NAME service."
        else
            echo "Error: Build script for $SERVICE_NAME not found."
            exit 1
        fi

        exit 0
    fi
done

# Vérifier si le service spécifié est "frontend"
if [ "$SERVICE_NAME" == "frontend" ]; then
    # go to the front-end directory
    cd frontend

    # Vérifier si le script de build spécifié existe
    if [ -f "build.sh" ]; then
        echo "Building $SERVICE_NAME service..."
        ./build.sh "$DOCKER_ID"
        echo "Build completed for $SERVICE_NAME service."

        # go back to the deploy directory
        cd ..
    else
        echo "Error: Build script for $SERVICE_NAME not found."

        # go back to the deploy directory
        cd ..

        exit 1
    fi

    exit 0
fi

# Vérifier si le service spécifié est "admin"
if [ "$SERVICE_NAME" == "admin" ]; then
    # go to the admin directory
    cd admin

    # Vérifier si le script de build spécifié existe
    if [ -f "build.sh" ]; then
        echo "Building $SERVICE_NAME service..."
        ./build.sh "$DOCKER_ID"
        echo "Build completed for $SERVICE_NAME service."

        # go back to the deploy directory
        cd ..
    else
        echo "Error: Build script for $SERVICE_NAME not found."

        # go back to the deploy directory
        cd ..

        exit 1
    fi

    exit 0
fi

if [ "$SERVICE_NAME" == "all" ]; then
    for service in $ALL_SERVICES; do
        read -p "Do you want to build the Docker image for $service? (y/n): " build_option
        if [ "$build_option" == "y" ]; then
            ./build.sh "$service" "$DOCKER_ID"
        fi
    done

    read -p "Do you want to build the Docker image for frontend? (y/n): " build_frontend_option
    if [ "$build_frontend_option" == "y" ]; then
        ./build.sh "frontend" "$DOCKER_ID"
    fi

    read -p "Do you want to build the Docker image for admin? (y/n): " build_admin_option
    if [ "$build_admin_option" == "y" ]; then
        ./build.sh "admin" "$DOCKER_ID"
    fi

    # exit the script after everything is build
    exit 0
fi

echo "Error: Invalid service name."
exit 1

