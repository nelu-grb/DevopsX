# ==========================================
# Etapa 1: Construcción (Builder)
# ==========================================
FROM node:18-alpine AS builder

# Establecemos el directorio de trabajo
WORKDIR /app

# Copiamos los archivos de dependencias
COPY package*.json ./

# Instalamos TODAS las dependencias 
RUN npm install

# Copiamos el resto del código fuente
COPY . .

# ==========================================
# Etapa 2: Producción (Runner)
# ==========================================
FROM node:18-alpine

# Establecemos variables de entorno para producción
ENV NODE_ENV=production

WORKDIR /app

# Copiamos SOLO lo necesario desde la etapa 'builder'
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/server.js ./

# Exponemos el puerto de la API
EXPOSE 3000

# PRÁCTICA DE SEGURIDAD: 
# Usuario 'root' (por defecto) a un usuario sin privilegios
USER node

# Comando para iniciar la aplicación
CMD ["node", "server.js"]