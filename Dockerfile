FROM node:20
WORKDIR /app

# Install build dependencies including CMake
RUN apt-get update && \
    apt-get install -y python3 make g++ cmake && \
    rm -rf /var/lib/apt/lists/*

# Install all dependencies including devDependencies
COPY package*.json ./
RUN npm install --build-from-source

# Copy source code and build
COPY . .
RUN npm run build

EXPOSE 4000
CMD ["npm", "run", "start:prod"]