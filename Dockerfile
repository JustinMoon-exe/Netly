# Stage 1: Build the React app
FROM node:18-alpine AS builder 
WORKDIR /app
COPY package*.json ./
RUN npm install 
COPY . .
RUN npm run build 

# Stage 2: Serve the static files with Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
