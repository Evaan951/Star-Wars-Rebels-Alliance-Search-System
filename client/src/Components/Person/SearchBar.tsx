import React, { useState, useEffect, MouseEventHandler, MouseEvent } from 'react';
import axios from 'axios';
import axiosInstance from '../../Utils/axiosInstance';
import { redirect } from "react-router-dom";

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
    id:number;
}

interface SearchBarProps {
    updatePerson: (person: PersonType | null) => void;
}



const SearchBar: React.FC<SearchBarProps> = ({ updatePerson }) => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchResult, setSearchResult] = useState<PersonType | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            // Appelle la fonction de recherche après un délai de 1s et vérification si searchTerm n'est pas vide
            if(searchTerm != "")
            search();
        }, 1000);

        // Nettoie le timeout précédent à chaque changement de la valeur du champ de recherche
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const search = async () => {
        if (searchTerm) {
            try {
                const response = await axiosInstance.get(`/people?search=${searchTerm}`);
                const data = response.data;
                if(data.count > 0){
                    const personURL = data.results[0].url
                    const id = personURL.charAt(personURL.length - 2);
                    data.results[0].id = id
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

    const handleGoToSearchResult = (e: MouseEvent<HTMLButtonElement>)=>{
        updatePerson(searchResult);
        redirect(`/person/${searchResult?.id}`)
    }

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
        <button onClick={handleGoToSearchResult}></button>
        {error && <p>{error}</p>}
        </>
   
    );
};

export default SearchBar;
