# Use the official Node Alpine image as the base image
FROM node:20-alpine3.20

# Set the working directory to get shared package
WORKDIR /competition-manager

# Copy shared_package to the application directory
COPY shared-packages/schemas shared-packages/schemas
COPY shared-packages/utils shared-packages/utils
COPY shared-packages/translations shared-packages/translations

# Install the dependencies and build the shared package
WORKDIR /competition-manager/shared-packages/schemas
RUN npm install
RUN npm run build

WORKDIR /competition-manager/shared-packages/utils
RUN npm install
RUN npm run build

WORKDIR /competition-manager/shared-packages/translations
RUN npm install
RUN npm run build

# Set the working directory in the container
WORKDIR /competition-manager/apps/competition-manager-web

# Copy the application files
COPY apps/competition-manager-web .

# Install the dependencies without devDependencies
RUN npm install