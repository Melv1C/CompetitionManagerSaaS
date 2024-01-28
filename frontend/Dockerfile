# Use the official Node Alpine image as the base image
FROM node:20-alpine

# Dockerize React App

# Install curl
# RUN apk update && apk add curl

# Set the working directory inside the container
WORKDIR /app

# Copy package.json src and public to the working directory
COPY package.json .
COPY src src
COPY public public

# Install dependencies
RUN npm install

# Start the microservice
CMD ["npm", "start"]
