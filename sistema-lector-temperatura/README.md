# Sistema Lector de Temperatura (Frontend)

Interfaz de usuario para el sistema de monitoreo, desarrollada con **Next.js** y **Material UI**.

## Instalación

1.  Navega al directorio del sistema:
    ```bash
    cd sistema-lector-temperatura
    ```
2.  Instala las dependencias:
    ```bash
    npm install
    ```

## Ejecución

Para iniciar el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`.

## Scripts Disponibles

*   `npm run dev`: Inicia entorno de desarrollo con *hot-reload*.
*   `npm run build`: Compila la aplicación para producción.
*   `npm start`: Inicia la aplicación en modo producción (requiere `build` previo).
*   `npm run lint`: Ejecuta el linter para revisar calidad de código.

## Estructura del Proyecto

*   `src/app`: Rutas y páginas de la aplicación (Next.js App Router).
*   `src/components`: Componentes reutilizables de UI.
*   `src/hooks`: Hooks personalizados de React.
*   `src/api`: Funciones para comunicación con el Backend.

## Funcionalidades Clave

*   **Dashboard**: Visualización gráfica de temperaturas.
*   **Carga de Datos**: Interfaz para subir archivos Excel con registros históricos.
*   **Reportes**: Generación de reportes (PDF/Excel).
