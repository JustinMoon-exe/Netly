# Stage 1: Build the React app
FROM node:18-alpine AS builder 
# Use a Node.js image for building
WORKDIR /app
COPY package*.json ./
RUN npm install # or yarn install
COPY . .
RUN npm run build # or yarn build - creates the 'build' folder

# Stage 2: Serve the static files with Nginx
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html 
# Copy built files from builder stage
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]