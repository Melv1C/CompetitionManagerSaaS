# Use the official Node Alpine image as the base image
FROM node:20-alpine

# Set the working directory to get shared package
WORKDIR /root

# Copy shared_package to the application directory
COPY ../../shared-packages /shared-packages

# Set the working directory to the application directory
WORKDIR /root/apps/CHANGEME-api

# Copy the application files
COPY src /root/apps/CHANGEME-api/src
COPY package.json /root/apps/CHANGEME-api/package.json
COPY tsconfig.json /root/apps/CHANGEME-api/tsconfig.json

# Install the dependencies without devDependencies
RUN npm install --omit=dev

# Build the TypeScript project
RUN npm run build

# Start the application
CMD ["npm", "start"]