# # Build Angular
# FROM node:20 AS build
# WORKDIR /app

# COPY package*.json ./
# RUN npm install

# COPY . .
# RUN npm run build --prod

# # Run with nginx
# FROM nginx:alpine
# COPY nginx.conf /etc/nginx/conf.d/default.conf
# COPY --from=build /app/dist/client/browser/ /usr/share/nginx/html

# EXPOSE 80

# ---------- build stage ----------
FROM node:20 AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ---------- nginx stage ----------
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/client/browser/ /usr/share/nginx/html

EXPOSE 80
