# Use the official Node Alpine image as the base image
FROM node:20-alpine

# Take all the environment variables from the .env file
# ARG is use for the dockerfile itself and ENV is for the build and can be acces in the container 
ARG PORT

ENV PORT=$PORT

# Set the working directory to get shared package
WORKDIR /root

# Copy shared_package to the application directory
COPY ../../shared_package /shared_package

# Set the working directory to the application directory
WORKDIR /root/apps/CHANGEME-api

# Copy the application files
COPY src /root/apps/CHANGEME-api/src
COPY package.json /root/apps/CHANGEME-api/package.json
COPY tsconfig.json /root/apps/CHANGEME-api/tsconfig.json

# Install the dependencies without devDependencies
RUN npm install --omit=dev

# Expose a port (may need a to be changed)
EXPOSE $PORT

# Build the TypeScript project
RUN npm run build

# Start the application
CMD ["npm", "start"]