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

ENV STRIPE_SECRET_KEY=sk_test_51OiIRTCcnwEqU3PDvQExq6xxjjlw6EyuVxgLQnYMhmLeUDJTXEGPXT5TYZ0zBROzL7d5lMnW1LjUU7Fw7ksoci0b00AzgEbjt6

# Start the microservice
CMD ["npm", "start"]


