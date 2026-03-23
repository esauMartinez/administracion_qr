# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Construir aplicación
RUN npm run build

# Stage 2: Production
FROM nginx:alpine

# Copiar archivos construidos
COPY --from=builder /app/dist /usr/share/nginx/html

# Configuración de nginx para SPA
RUN echo 'server { \n\
    listen 3500; \n\
    server_name localhost; \n\
    root /usr/share/nginx/html; \n\
    index index.html; \n\
    location / { \n\
        try_files $uri $uri/ /index.html; \n\
    } \n\
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ { \n\
        expires 1y; \n\
        add_header Cache-Control "public, immutable"; \n\
    } \n\
}' > /etc/nginx/conf.d/default.conf

EXPOSE 3500

CMD ["nginx", "-g", "daemon off;"]