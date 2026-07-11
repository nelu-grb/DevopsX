# ==========================================
# Etapa 1: Construcción (Builder)
# ==========================================
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

# ==========================================
# Etapa 2: Producción (Runner)
# ==========================================
FROM node:18-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules

# OPTIMIZACIÓN: Copiamos explícitamente solo los archivos del backend
COPY package.json ./
COPY server.js ./


EXPOSE 3000

USER node

CMD ["node", "server.js"]