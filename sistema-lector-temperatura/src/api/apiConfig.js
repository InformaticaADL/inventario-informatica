import axios from 'axios';
import Cookies from 'js-cookie'; // ✅ IMPORTANTE: Importamos js-cookie

const api = axios.create({
  baseURL: 'http://192.168.10.52:8001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Interceptor de Solicitudes (Request) Corregido
api.interceptors.request.use(
  (config) => {
    // 1. AHORA BUSCAMOS EN LAS COOKIES (donde lo guardó el Login)
    const token = Cookies.get('token'); 

    // --- DEBUG LOGS ---
    console.group("🚀 Interceptor Axios");
    console.log("📍 URL:", config.url);
    console.log("🍪 Token en Cookies:", token ? "Encontrado" : "No encontrado"); 
    
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    } else {
        console.warn("⚠️ ALERTA: No hay token en las Cookies.");
    }
    console.groupEnd();
    // ------------------

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de Respuestas (Response) - Igual que antes
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('Error respuesta:', error.response.data);
    } else if (error.request) {
      console.error('No hubo respuesta:', error.request);
    } else {
      console.error('Error configuración:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;