# Use the official Node Alpine image as the base image
FROM node:20-alpine

# Set the working directory to get shared package
WORKDIR /root

# Copy shared_package to the application directory
COPY /shared-packages /shared-packages

# Set the working directory to the application directory
WORKDIR /root/apps/athletes-api-api

# Copy the application files
COPY apps/athletes-api-api/src src
COPY apps/athletes-api-api/package.json package.json
COPY apps/athletes-api-api/tsconfig.json tsconfig.json

# Install the dependencies without devDependencies
RUN npm install

# Build the TypeScript project
RUN npm run build

# Start the application
CMD ["npm", "start"]