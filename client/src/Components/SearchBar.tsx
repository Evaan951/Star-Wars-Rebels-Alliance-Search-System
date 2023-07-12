import React, { useState, useEffect, MouseEventHandler, MouseEvent } from 'react';
import axios from 'axios';
import axiosInstance from '../Utils/axiosInstance';
import { redirect, useNavigate } from "react-router-dom";

interface PersonType {
    name: string;
    birth_year: string;
    eye_color: string;
    gender: string;
    hair_color: string;
    height: string;
    mass: string;
    species: string[];
    starships: string[];
    vehicles: string[];
    id: number;
    url: string;
}




const SearchBar: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchResult, setSearchResult] = useState<PersonType[] | null>(null)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate();
    useEffect(() => {
        const debounceFunction = setTimeout(() => {
            // Appelle la fonction de recherche après un délai et vérification si searchTerm n'est pas vide
            if (searchTerm != "")
                search();
        }, 500);

        // Nettoie le timeout précédent à chaque changement de la valeur du champ de recherche
        return () => clearTimeout(debounceFunction);
    }, [searchTerm]);

    const search = async () => {

        try {
            const response = await axiosInstance.get(`/people?search=${searchTerm}`);
            const data = response.data
            const resultArray: PersonType[] = [];
            if (data.count > 0) {
                const regex = /\/(\d+)\/$/; // Recherche le nombre entre les deux slashs et à la fin de l'URL

                data.results.map((element: PersonType) => {
                    const url = element.url;
                    const match = url.match(regex);
                    if (match) {
                        const number = match[1];
                        console.log(number)
                        const id = parseInt(number);
                        element.id = id
                    }
                    resultArray.push(element)
                });

                setSearchResult(resultArray)
                setError('')
            } else {
                setSearchResult(null)
                setError('Aucun personnage ne correspond')
            }
            // Met à jour le state `person` dans le composant Parent avec les résultats de recherche
        } catch (error) {
            setError('Aucun personnage ne correspond')
        }

    };

    const handleGoToSearchResult = (e: MouseEvent<HTMLParagraphElement>, person: PersonType) => {
        navigate(`/people/${person.id}`, { state: { person } });

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
                {searchResult && searchResult.map((person:PersonType, key:number) => {
                    return (
                        <div key={key} onClick={(e) => handleGoToSearchResult(e, person)}>
                            <p>{person.name}</p>
                        </div>
                    )
                })}

            {error && <p>{error}</p>}
        </>

    );
};

export default SearchBar;
