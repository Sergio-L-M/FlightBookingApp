# Etapa 1: Construcción de la aplicación
FROM node:18 AS builder

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de dependencias y las instala
COPY package.json package-lock.json ./
RUN npm install

# Copia todo el código fuente
COPY . .

# Construye la aplicación para producción
RUN npm run build

# Etapa 2: Servir la aplicación con Nginx
FROM nginx:alpine

# Copia los archivos construidos en la primera etapa
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia configuración personalizada de Nginx (opcional)


# Expone el puerto 80
EXPOSE 80

# Inicia Nginx
CMD ["nginx", "-g", "daemon off;"]
