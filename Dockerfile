# Stage 1: Build app
FROM node:18-alpine AS build

# Đặt biến môi trường cho Vite (API_URL truyền từ build-arg)
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

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

EXPOSE 5173
CMD ["nginx", "-g", "daemon off;"]
