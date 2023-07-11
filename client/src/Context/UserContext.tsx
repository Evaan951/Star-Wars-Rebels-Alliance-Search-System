import axios from 'axios';
import React, { createContext, useState, PropsWithChildren, useEffect } from 'react';


// Déclaration du type User
interface User {
    username: string | null;
    isConnected: boolean;
}

// Déclaration du type du Context
export interface UserContextType {
    user: User;
    updateUser: (username: string | null, isConnected: boolean) => void;
}

// Création du context avec les valeurs par défaut pour le user ainsi que sa fonction d'update
export const UserContext = createContext<UserContextType>({
    user: { username: null, isConnected: false },
    updateUser: () => { },
});


// Création du provider permettant de distribué les valeurs du context au éléments enfants.
export const UserProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
    const [user, setUser] = useState<User>({ username: null, isConnected: false });

    const updateUser = (username: string | null, isConnected: boolean) => {
        setUser({ username, isConnected });
    };

    // Vérifier la session utilisateur au chargement du composant
    useEffect(() => {
        const checkUserSession = async () => {
            try {
                const user = sessionStorage.getItem('user')
                const token = sessionStorage.getItem('token')
                // Effectue une requête au backend pour vérifier la session de l'utilisateur
                const payload = { user, token }
                const response = await axios.post('http://localhost:3001/checkUserSession', payload);
                const data = response.data;
                if (data.isValid) {
                    setUser({ username: sessionStorage.getItem('user'), isConnected: true });
                }
            } catch (error) {
                console.error('Erreur lors de la vérification de la session utilisateur :', error);
            }
        };

        checkUserSession();
    }, []);

    return (
        <UserContext.Provider value={{ user, updateUser }}>
            {children}
        </UserContext.Provider>
    );
};
