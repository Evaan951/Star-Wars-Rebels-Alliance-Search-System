import React, { useState, useEffect } from 'react';
import axios from 'axios';
import axiosInstance from '../../Utils/axiosInstance';

interface PersonType {
    name: string;
    birth_year:string;
    eye_color: string;
    gender: string;
    hair_color: string;
    height: string;
    mass: string;
    species: string[];
    starships: string[];
    vehicles: string[];
}

interface SearchBarProps {
    updatePerson: (person: PersonType | null) => void;
}



const SearchBar: React.FC<SearchBarProps> = ({ updatePerson }) => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            // Appelle la fonction de recherche après un délai de 500 ms
            search();
        }, 1000);

        // Nettoie le timeout précédent à chaque changement de la valeur du champ de recherche
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const search = async () => {
        if (searchTerm) {
            try {
                const response = await axiosInstance.get(`/people?search=${searchTerm}`);
                const searchResult = response.data;
                if(searchResult.count > 0){
                    updatePerson(searchResult.results[0]);
                    setError('')
                }else{
                    updatePerson(null);
                    setError('Aucun personnage ne correspond')
                }
                // Met à jour le state `person` dans le composant Parent avec les résultats de recherche
            } catch (error) {
                setError('Aucun personnage ne correspond')
            }

        }

    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    return (
        <>
             <input
            type="text"
            placeholder="Rechercher"
            value={searchTerm}
            onChange={handleInputChange}
        />
        {error && <p>{error}</p>}
        </>
   
    );
};

export default SearchBar;
