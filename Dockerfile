FROM node:18-alpine

WORKDIR /app

# Instalar http-server globalmente
RUN npm install -g http-server

# Copiar todos los archivos estáticos
COPY . .

# Exponer puerto
EXPOSE 8080

# Ejecutar http-server
CMD ["http-server", "-p", "3500", "-a", "0.0.0.0"]