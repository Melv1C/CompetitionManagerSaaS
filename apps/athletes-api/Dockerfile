# Use the official Node Alpine image as the base image
FROM node:20-alpine3.20

# Set the working directory to get shared package
WORKDIR /competition-manager

# Copy shared_package to the application directory
COPY shared-packages/ shared-packages/

# Copy the build-shared-package script to the application directory
COPY build-shared-packages.sh build-shared-packages.sh

# Permissions for the build-shared-package script
RUN chmod +x ./build-shared-packages.sh

# Run the build-shared-package script
RUN sh ./build-shared-packages.sh

# Set the working directory in the container
WORKDIR /competition-manager/apps/athletes-api

# Copy the application files
COPY apps/athletes-api/src src
COPY apps/athletes-api/package.json package.json
COPY apps/athletes-api/package-lock.json package-lock.json
COPY apps/athletes-api/tsconfig.json tsconfig.json

# Install the dependencies without devDependencies
RUN npm install

# Build the TypeScript project
RUN npm run build

# Start the application
CMD ["npm", "start"]