# Use the official Node Alpine image as the base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json src and public to the working directory
COPY package.json .
COPY src src
COPY public public

# Install dependencies
RUN npm install

# Start the application
CMD ["npm", "start"]
