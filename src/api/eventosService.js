import api from './axiosConfig';

export const getEventos = async () => {
  try {
    const response = await api.get('/eventos');
    return response.data.data || response.data;
  } catch (error) {
    return [];
  }
};