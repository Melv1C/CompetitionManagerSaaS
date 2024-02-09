# Use the official Node Alpine image as the base image
FROM node:20-alpine

# Install curl
# RUN apk update && apk add curl

# Set the working directory inside the container
WORKDIR /app

# Copy package.json to the working directory
COPY package.json .

# Install dependencies
RUN npm install

# Copy src folder 
COPY src src

# Expose the port on which the microservice will run
EXPOSE 3000

# Start the microservice
CMD ["npm", "start"]
