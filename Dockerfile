# Stage 1: Build app
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve app với Nginx
FROM nginx:alpine

# Copy file build sang nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copy config nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy script để inject env vào runtime
COPY entrypoint.sh /docker-entrypoint.d/10-env.sh
RUN chmod +x /docker-entrypoint.d/10-env.sh

EXPOSE 5173
CMD ["nginx", "-g", "daemon off;"]
