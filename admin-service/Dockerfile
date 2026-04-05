FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
# Instalamos solo dependencias de producción para ahorrar espacio
COPY package*.json ./
RUN npm install --omit=dev
# Traemos solo el código compilado de la etapa anterior
COPY --from=builder /app/dist ./dist

CMD ["node", "dist/server.js"]