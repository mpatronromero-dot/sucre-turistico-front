import api from './axiosConfig';

export const getAlojamientos = async () => {
  try {
    const response = await api.get('/alojamientos'); // Asegúrate de que esta ruta exista en el backend de tu compañero
    return response.data.data || response.data; // Dependiendo de cómo envíe el JSON
  } catch (error) {
    console.error("Error al obtener los alojamientos:", error);
    return [];
  }
};