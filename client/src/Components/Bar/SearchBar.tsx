import React, { useState, useEffect, MouseEvent } from 'react';
import axiosInstance from '../../Utils/axiosInstance';
import { useNavigate } from "react-router-dom";
import style from '../../Styles//Bar/SearchBar.module.scss'

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

interface SearchBarProps {
    dataType: string;
}





const SearchBar: React.FC<SearchBarProps> = ({ dataType }) => {

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

        // Nettoie le timeout à chaque changement de la valeur du champ de recherche
        return () => clearTimeout(debounceFunction);
    }, [searchTerm]);

    //Fonction de recherche
    // Met à jour le state `person` dans le composant Parent avec les résultats de recherche
    const search = async () => {

        try {
            const response = await axiosInstance.get(`/${dataType}?search=${searchTerm}`);
            const data = response.data
            // Initialisation du tableau de resultats
            const resultArray: any[] = [];
            if (data.count > 0) {
                // Recherche le nombre entre les deux slashs et à la fin de l'URL
                const regex = /\/(\d+)\/$/;

                //On map sur les resultats du regex
                data.results.map((element: any) => {
                    const url = element.url;
                    const match = url.match(regex);
                    if (match) {
                        const number = match[1];
                        console.log(number)
                        const id = parseInt(number);
                        element.id = id
                    }
                    //On push notre element dans le tableau
                    resultArray.push(element)
                });

                //Mise à jour de la recherche
                setSearchResult(resultArray)
                setError('')
            } else {
                setSearchResult(null)
                setError('Aucun resultat')
            }
        } catch (error) {
            setError('Aucun resultat')
        }

    };

    
    const handleGoToSearchResult = (e: MouseEvent<HTMLParagraphElement>, data: any) => {
        navigate(`/${dataType}/${data.id ? data.id : data.episode_id}`, { state: { data } });

    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className={style.searchBarContainer}>
            <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={handleInputChange}
            />
            <div className={style.searchResultContainer} style={{ display: `${!searchResult ? 'none' : 'flex'}` }}>
                {searchResult && searchResult.map((data: any, key: number) => {
                    return (
                        <div className={style.searchResult} key={key} onClick={(e) => handleGoToSearchResult(e, data)}>
                            <p>{data.name ? data.name : data.title}</p>
                            <svg fill="none" stroke="currentColor" width={25} strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    )
                })}
            </div>


            {error && <p>{error}</p>}
        </div>

    );
};

export default SearchBar;
