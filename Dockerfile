# Stage 1: Build app
FROM node:18-alpine AS build

WORKDIR /app

# Copy package và cài deps
COPY package*.json ./
RUN npm install

# Copy toàn bộ source code
COPY . .

# Nhận env khi build (API_URL, ENV, ...)
ARG VITE_API_BASE_URL
ARG NODE_ENV=production

# Truyền env vào build
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV NODE_ENV=$NODE_ENV

RUN npm run build

# Stage 2: Serve app với Nginx
FROM nginx:alpine

# Copy file build sang nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copy config nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 5173
CMD ["nginx", "-g", "daemon off;"]
