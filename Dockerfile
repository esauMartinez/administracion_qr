# Etapa 1: Build
FROM node:20-alpine AS build

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos
COPY package*.json ./
RUN npm install

COPY . .

# Compilar el proyecto (carpeta dist)
RUN npm run build

# Etapa 2: Servir con Nginx
FROM nginx:stable-alpine

# Eliminar configuración por defecto
RUN rm -rf /usr/share/nginx/html/*

# Copiar los archivos compilados desde la etapa anterior
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar una configuración personalizada de Nginx (opcional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3300

CMD ["nginx", "-g", "daemon off;"]