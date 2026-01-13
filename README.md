# Sistema Lector de Temperatura

Este proyecto es una solución integral para el monitoreo y registro de temperaturas (particularmente para incubadoras), compuesto por una API RESTful y una aplicación web Frontend.

## Estructura del Proyecto

El repositorio está dividido en dos componentes principales:

*   **[api-lector-temperatura](./api-lector-temperatura)**: Backend desarrollado en Node.js con Express y Sequelize. Maneja la lógica de negocio, conexión a base de datos y autenticación.
*   **[sistema-lector-temperatura](./sistema-lector-temperatura)**: Frontend desarrollado con Next.js y Material UI. Proporciona la interfaz de usuario para visualizar datos, gráficos y gestionar la carga de información.

## Requisitos Previos

*   Node.js (versión LTS recomendada)
*   Base de datos SQL (MySQL o SQL Server, configurable en la API)

## Inicio Rápido

Para poner en marcha el sistema completo, deberás iniciar tanto el backend como el frontend. Consulta la documentación específica de cada carpeta para instrucciones detalladas:

1.  **Configurar e iniciar la API**: [Ver documentación de API](./api-lector-temperatura/README.md)
2.  **Configurar e iniciar el Frontend**: [Ver documentación de Frontend](./sistema-lector-temperatura/README.md)
