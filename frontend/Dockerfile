# ==========================================
# Producción: Servidor Web Nginx Minimalista
# ==========================================
FROM nginx:stable-alpine

WORKDIR /usr/share/nginx/html

# OPTIMIZACIÓN: Copiamos directamente los archivos estáticos necesarios
# Evitamos copiar configuraciones de Docker o CI/CD al directorio web público
COPY app.js ./
COPY index.html ./
COPY style.css ./

# Inyectamos tu configuración de Nginx endurecida
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]