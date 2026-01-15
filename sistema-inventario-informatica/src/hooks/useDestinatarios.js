// hooks/useDestinatarios.js
import { useState, useEffect, useCallback } from 'react';
import api from '@/api/apiConfig';
import { toast } from 'react-toastify';

// 1. Aceptamos idRotulado como parámetro (por defecto null)
export const useDestinatarios = (idRotulado = null) => {
  const [availableRecipients, setAvailableRecipients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Usamos useCallback para que la función sea estable y no cause loops en useEffect
  const fetchDestinatarios = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`🔍 Solicitando destinatarios PVE${idRotulado ? ` (Filtro Rotulado: ${idRotulado})` : ''}...`);
      
      // 2. Construimos la URL dinámicamente con el query param
      const url = idRotulado 
        ? `/destinatarios?idRotulado=${idRotulado}` 
        : '/destinatarios';

      const response = await api.get(url);
      
      // console.log('📨 Respuesta del servidor:', response);

      if (response.data.success) {
        setAvailableRecipients(response.data.destinatarios);
        console.log(`✅ ${response.data.destinatarios.length} destinatarios cargados.`);
      } else {
        throw new Error(response.data.message || 'Error al cargar destinatarios PVE');
      }

    } catch (error) {
      console.error('❌ Error cargando destinatarios:', error);
      const errorMessage = error.response?.data?.message || error.message;
      setError(errorMessage);
      // Opcional: Mostrar toast solo si es crítico, a veces molesta al cargar la página
      // toast.error(`Error al cargar destinatarios: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, [idRotulado]); // Dependencia clave: si cambia el ID, se recrea la función

  useEffect(() => {
    fetchDestinatarios();
  }, [fetchDestinatarios]); // 3. Se ejecuta cuando cambia fetchDestinatarios (que depende de idRotulado)

  return { 
    availableRecipients, 
    loading, 
    error, 
    refetch: fetchDestinatarios 
  };
};