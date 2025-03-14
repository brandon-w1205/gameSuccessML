FROM node:22

# Set the working directory
WORKDIR /app/frontend

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port
EXPOSE 3000

# Run the application
CMD ["npm", "run", "dev"]