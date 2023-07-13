import React, { useState, useEffect } from 'react';
import axiosInstance from '../../Utils/axiosInstance';
import SearchBar from '../../Components/Bar/SearchBar';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import BackButton from '../../Components/Button/BackButton';
import globalStyle from '../../Styles/global.module.scss'

interface SpecieType {
    name: string;
    classification: string;
    designation: string;
    average_height: string;
    average_lifespan: string;
    eye_colors: string;
    hair_colors: string;
    skin_colors: string;
    language: string;
    homeworld: string;
    people: string[];
    films: string;
    url: string;
    id: number;
}

const Specie: React.FC = () => {
    const [specie, setSpecie] = useState<SpecieType | null>(null);
    const [error, setError] = useState<string>('')
    const location = useLocation();
    const result = location.state && location.state.specie;

    const fetchData = async () => {
        try {
            let specieID;
            const url = location.pathname
            const regex = /(\d+)$/; // Recherche le nombre en fin de chaine
            const match = url.match(regex);
            if (match) {
                const number = match[0];
                specieID = parseInt(number);
            }
            // Chargement des données depuis l'API
            const { data } = await axiosInstance.get(`/species/${specieID}`)
            setSpecie(data)
        } catch (error) {
            // Gestion des erreurs
            if (axios.isAxiosError(error)) {
                console.log(error)
                setError(error.response?.data.message)
            } else {
                setError('error')
            }

        }

    }
    /* 
     On verifie si une donnée à été passée pendant la navigation par le composant Parent
     Si oui, on met le composant à jour avec cette même donnée.
     Si non, on execute la function fetchData qui nous permet de récupérer la donnée en fonction de l'id dans notre url.
    */
    useEffect(() => {
        if (!result) {
            fetchData()
        } else {
            setSpecie(result)
        }
        return () => {
            setSpecie(null)
        }
    }, [result])

    return (
        <>
            <BackButton />
            {specie && <div className={globalStyle.detailsContainer}>
                <p>Name: {specie.name}</p>
                <p>Classification: {specie.classification}</p>
                <p>Designation: {specie.designation}</p>
                <p>Average Height: {specie.average_height}</p>
                <p>Average Lifespan: {specie.average_lifespan}</p>
                <p>Language: {specie.language}</p>
                <p>Eye Colors: {specie.eye_colors}</p>
                <p>Hair Colors: {specie.hair_colors}</p>
                <p>Skin Colors: {specie.skin_colors}</p>
            </div>
            }
            {error && <p>{error}</p>}
        </>
    );
};

export default Specie;
