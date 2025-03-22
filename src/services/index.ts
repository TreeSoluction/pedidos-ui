import axios from 'axios';

const apiFuncion = () => {
  const axiosService = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
  });

  return axiosService;
};

export default apiFuncion();
