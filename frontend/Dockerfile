# Use the official Node.js image
FROM node:latest 

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend code
COPY . .

EXPOSE 5173

# Development environment
# This part will run your development server
CMD ["npm", "run", "dev"]
