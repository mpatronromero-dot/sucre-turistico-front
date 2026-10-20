import api from './axiosConfig';

export const getDestinos = async () => {
  try {
    const response = await api.get('/destinos');
    // Tu backend devuelve un objeto con "status" y "data", así que extraemos el "data"
    return response.data.data; 
  } catch (error) {
    console.error("Error al obtener los destinos:", error);
    return [];
  }
};