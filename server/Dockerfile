FROM node:23-slim AS builder

# Thu muc lam viec
WORKDIR /src

# Copy file package
COPY package*.json ./

RUN apt-get update -y && apt-get install -y openssl
# Cai dat dependencies
RUN npm install 

# Copy source
COPY . .

# Stage 2: Runtime Stage
FROM node:23-slim AS production

# Thu muc lam viec
WORKDIR /src

# Copy file package
COPY package*.json ./

ENV NODE_ENV=production

# Cai dac dependencies 
RUN npm install --omit=dev

EXPOSE 3000

CMD ["npm", "run" ,"dev"]