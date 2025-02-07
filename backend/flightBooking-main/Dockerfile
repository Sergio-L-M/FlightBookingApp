# Etapa 1: Construcción con Gradle
FROM gradle:8.5-jdk21 AS build

WORKDIR /app

# Copiar archivos de configuración
COPY build.gradle settings.gradle ./

# Copiar el código fuente completo, incluyendo los mocks en `src/test/resources/`
COPY src src

# 🔥 Asegurar que `test/resources/` esté disponible en `build/resources/test/`
RUN mkdir -p build/resources/test && cp -r src/test/resources/. build/resources/test/

# Ejecutar Gradle para construir el JAR
RUN gradle clean build -x test --no-daemon

# 🔥 Verificar si los archivos mock realmente están en la etapa de compilación
RUN ls -l /app/src/test/resources/
RUN ls -l /app/src/test/resources/sortList/

# Etapa 2: Crear una imagen más ligera con solo el JAR y los archivos mock
FROM eclipse-temurin:21-jdk
WORKDIR /app

# Copiar el JAR desde la etapa de compilación
COPY --from=build /app/build/libs/*.jar app.jar

# 🔥 Copiar toda la carpeta `src/` a la imagen final para asegurar que los mocks están disponibles
COPY --from=build /app/src/ /app/src/

# Exponer el puerto 8080
EXPOSE 8080

# Ejecutar la aplicación
CMD ["java", "-jar", "app.jar"]
