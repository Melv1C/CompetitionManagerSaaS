# Use the official Node.js image as the base image
FROM node:20-alpine3.20

# Set the working directory
WORKDIR /competition-manager

# Copy prisma folder to the application directory
COPY prisma/ prisma/

# Copy package.json and package-lock.json to the application directory
COPY package.json package.json
COPY package-lock.json package-lock.json

# Install the dependencies
RUN npm install

# Migrate the database
CMD ["npm", "run", "migrate:prod"]