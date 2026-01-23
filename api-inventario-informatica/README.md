# API Inventario Informática

Backend del sistema de inventario informático, construido con Node.js, Express y Sequelize.

## Requisitos

*   Node.js
*   Acceso a base de datos MySQL o SQL Server

## Instalación

1.  Navega al directorio de la API:
    ```bash
    cd api-lector-temperatura
    ```
2.  Instala las dependencias:
    ```bash
    npm install
    ```

## Configuración

Asegúrate de tener un archivo `.env` en la raíz de este directorio con las variables de configuración necesarias (Base de datos, Puerto, etc.).
*Ejemplo de variables comunes (ajustar según tu `config/` o `.env` real):*

```env
PORT=9001
HOST_IP=192.168.10.52
# Variables de conexión a BD...
```

## Ejecución

Para iniciar el servidor en modo desarrollo (usando `nodemon`):

```bash
nodemon app.js
```

O si tienes scripts configurados en `package.json`:
```bash
npm start
```

El servidor se iniciará por defecto en el puerto **9001** (o el definido en `PORT`).
URL base: `http://localhost:9001` (o la IP configurada).

## Estructura

*   `controllers/`: Lógica de negocio para cada entidad.
*   `models/`: Definiciones de tablas (Sequelize).
*   `routes/`: Definición de endpoints de la API.
*   `config/`: Configuración de base de datos y entorno.

## Endpoints Principales

### Usuarios (`/api/usuario`)
*   Se encarga de la gestión y autenticación de usuarios.

### Incubadora (`/api/incubadora`)
*   Maneja la carga y consulta de datos históricos de temperatura.
*   Soporta carga de archivos Excel.

## Notas de Desarrollo
*   El proyecto utiliza **CORS** configurado para permitir conexiones desde el frontend local y en red específica.