# frontend/Dockerfile
FROM nginx:alpine

# Copiar los archivos estáticos al directorio por defecto de Nginx
COPY index.html /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/
COPY app.js /usr/share/nginx/html/

# Exponer el puerto 80
EXPOSE 80

# Nginx se inicia automáticamente, no requiere CMD explícito