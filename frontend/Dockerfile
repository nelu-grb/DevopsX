FROM node:18-alpine AS builder
WORKDIR /app

# Copy frontend sources (no build step for plain HTML/JS)
COPY . .

FROM nginx:stable-alpine

# Copy static files into nginx html dir
COPY --from=builder /app /usr/share/nginx/html

# Replace default nginx config with our hardened config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]