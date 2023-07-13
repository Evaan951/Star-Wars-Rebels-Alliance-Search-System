import axios from 'axios';

// Création d'une instance Axios avec la configuration de base
const axiosInstance = axios.create({
    baseURL: 'http://localhost:3001',
});

// Ajout de l'intercepteur pour toutes les requêtes sortantes
axiosInstance.interceptors.request.use(
    (config) => {
        // On récupère le jeton JWT depuis le stockage local
        const token = sessionStorage.getItem('token'); 
        if (token) {
            // Si il y'a le jeton JWT, on l'ajoute dans l'en-tête Authorization
            config.headers.Authorization = `Bearer ${token}`; 
        }


        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;