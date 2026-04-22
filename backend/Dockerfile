# Use lightweight Node
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy only package files first for caching
COPY package*.json ./

# Install dependencies (including devDependencies)
RUN npm install

# Copy the rest of the application code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose your backend port
EXPOSE 3000

# Use the start command defined in package.json
CMD ["npm", "run", "start"]