# Stage 1: Build Stage
FROM node:22-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the TypeScript files
RUN npm run build

# Stage 2: Deployment Stage
FROM node:22-alpine AS deploy

# Set the working directory inside the container
WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=build /app/package*.json ./
COPY --from=build /app/dist /app/dist
COPY .env.prod /app/.env

# Install only production dependencies
RUN npm install

# Expose the application port (adjust according to your app's port)
EXPOSE 8080

# Set the command to run the app (adjust for environment)
CMD ["npm", "run", "start"]