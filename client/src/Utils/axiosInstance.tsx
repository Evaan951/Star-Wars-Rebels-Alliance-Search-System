import axios from 'axios';

// Crée une instance d'Axios avec une configuration de base
const axiosInstance = axios.create({
    baseURL: 'http://localhost:3001',
});

// Ajoute l'intercepteur pour toutes les requêtes sortantes
axiosInstance.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('token'); // Récupère le jeton JWT depuis le stockage local
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // Ajoute le jeton JWT dans l'en-tête Authorization
        }


        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;