import api from './axiosConfig';

export const getExperiencias = async () => {
  try {
    const response = await api.get('/experiencias');
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error en experiencias:", error);
    return [];
  }
};