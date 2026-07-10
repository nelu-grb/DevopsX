# Gestor de Biblioteca de Videojuegos

## 1. Descripción del Proyecto

El proyecto Gestor de Biblioteca de Videojuegos es una aplicación web full-stack orientada a la gestión de una colección personal de videojuegos. Implementa un CRUD básico que permite registrar, consultar, actualizar y eliminar videojuegos mediante una interfaz web y una API REST.

La solución está diseñada como un ejemplo práctico de desarrollo moderno, aplicando conceptos de arquitectura de software, contenedorización, automatización y despliegue en la nube.

## 2. Arquitectura del Sistema

La aplicación sigue una arquitectura de tres capas:

- Frontend: desarrollado con HTML, CSS y JavaScript puro, servido mediante Nginx.
- Backend: API REST implementada en Node.js con Express, encargada de la lógica de negocio y del acceso a los datos.
- Base de Datos: MySQL ejecutándose en un contenedor Docker para almacenar la información de los videojuegos.

Esta arquitectura permite separar responsabilidades, facilitar el mantenimiento del sistema y simplificar su despliegue en entornos locales y cloud.

## 3. Contenedorización (Docker)

El proyecto está preparado para ejecutarse en contenedores Docker, lo que garantiza consistencia entre entornos y facilita su escalabilidad.

### Buenas prácticas aplicadas

- Uso de Dockerfiles optimizados para backend y frontend.
- Imágenes base minimalistas basadas en Alpine para reducir el tamaño de los contenedores.
- Implementación de un Dockerfile multietapa para el backend, separando la construcción de la ejecución final.
- Ejecución del contenedor con un usuario sin privilegios para mejorar la seguridad del entorno.
- Orquestación de los servicios mediante Docker Compose.

## 4. Ejecución Local

Para levantar el proyecto en un entorno local, ejecuta el siguiente comando desde la raíz del repositorio:

```bash
docker-compose up --build -d
```

Este comando iniciará los siguientes servicios:

- Base de datos MySQL
- Backend API REST
- Frontend servido con Nginx

Al finalizar, la aplicación quedará disponible en:

- Frontend: http://localhost:8080
- Backend: http://localhost:3000

## 5. Pipeline CI/CD (GitHub Actions)

El proyecto utiliza GitHub Actions para automatizar el proceso de integración y despliegue continuo.

El flujo está diseñado para:

- Construir las imágenes Docker del backend y del frontend.
- Validar la integridad del proyecto.
- Publicar las imágenes en Amazon ECR.
- Preparar el proyecto para su despliegue en un entorno de producción o laboratorio.

## 6. Despliegue en AWS Academy

El proyecto está preparado para ser desplegado en un entorno educativo de AWS Academy sobre un clúster de Amazon ECS con Fargate.

En este escenario, el despliegue se realiza siguiendo las restricciones del laboratorio académico, utilizando estrictamente el rol de ejecución proporcionado por AWS Academy, conocido como LabRole. Este enfoque permite cumplir con el principio de mínimo privilegio de IAM, evitando permisos innecesarios y manteniendo el entorno alineado con las políticas del laboratorio.

La arquitectura en AWS Academy contempla:

- Contenedores del backend y del frontend registrados en Amazon ECR.
- Ejecución de los servicios sobre Amazon ECS Fargate.
- Integración con recursos de red y seguridad del entorno del laboratorio.

## 7. Observabilidad y Seguridad

El sistema incorpora buenas prácticas de seguridad y observabilidad para entornos cloud:

- Los puertos de acceso se gestionan mediante Security Groups restrictivos, limitando el tráfico a los servicios necesarios.
- El monitoreo del sistema se realiza mediante Amazon CloudWatch, permitiendo revisar logs y métricas de los contenedores y servicios desplegados.
- Las credenciales y variables sensibles se manejan de forma segura mediante mecanismos de secretos del entorno de despliegue, evitando su exposición en el código fuente.

## 8. Tecnologías Utilizadas

- Node.js
- Express
- MySQL
- Docker
- Docker Compose
- Nginx
- GitHub Actions
- Amazon ECR
- Amazon ECS Fargate
- Amazon CloudWatch

## 9. Conclusión

Este proyecto representa una implementación práctica de una aplicación full-stack con enfoque DevOps, integrando desarrollo, contenedorización, automatización y despliegue en la nube en un contexto académico y profesional.

aaa