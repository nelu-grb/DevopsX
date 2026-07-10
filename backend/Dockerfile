# ==========================================
# Etapa 1: Construcción (Builder)
# ==========================================
FROM node:18-alpine AS builder

WORKDIR /app

# Copiamos los archivos de dependencias
COPY package*.json ./

# Usamos npm install en lugar de npm ci para evitar el error del package-lock.json faltante.
# Omitimos las dependencias de desarrollo (como jest y supertest) para mantener la imagen ligera.
RUN npm install --omit=dev

# ==========================================
# Etapa 2: Producción (Runner)
# ==========================================
FROM node:18-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Copiamos solo la carpeta node_modules ya procesada desde la etapa builder
COPY --from=builder /app/node_modules ./node_modules

# Copiamos el resto del código fuente (server.js, etc.)
COPY . .

EXPOSE 3000

# PRÁCTICA DE SEGURIDAD: 
# Cambiamos del usuario 'root' (por defecto) a un usuario sin privilegios
USER node

CMD ["node", "server.js"]