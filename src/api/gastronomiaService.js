import api from './axiosConfig';

export const getGastronomia = async () => {
  try {
    const response = await api.get('/gastronomia'); // Ruta del backend
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error al obtener la gastronomía:", error);
    return [];
  }
};