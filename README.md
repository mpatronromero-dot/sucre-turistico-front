# 🌊 Sucre Turístico - Plataforma Web Full Stack

Plataforma web basada en arquitectura de microservicios para la promoción, consulta y gestión de información turística del Golfo de Morrosquillo (Coveñas, Santiago de Tolú y San Onofre).

## 🛠️ Stack Tecnológico
- **Front-End:** React, Vite, Bootstrap, Axios, React Router.
- **Back-End:** Node.js, Express (API Gateway y 6 Microservicios).
- **Bases de Datos y Búsqueda:** MySQL y Elasticsearch.

## 🚀 Requisitos Previos
- [Node.js](https://nodejs.org/) (Versión 18 o superior).
- Gestor de paquetes `npm` instalado y configurado en el PATH.

## ⚙️ Instrucciones de Instalación y Ejecución

El proyecto está dividido en dos entornos independientes que deben ejecutarse en terminales separadas.

### 1. Despliegue del Back-End (API Gateway y Microservicios)
1. Abre una terminal y navega a la carpeta del backend (`destinos-service`).
2. Instala las dependencias limpias omitiendo los módulos preexistentes:
   ```bash
   npm install