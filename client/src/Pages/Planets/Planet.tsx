import React, { useState, useEffect } from 'react';
import axiosInstance from '../../Utils/axiosInstance';
import SearchBar from '../../Components/Bar/SearchBar';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import BackButton from '../../Components/Button/BackButton';
import globalStyle from '../../Styles/global.module.scss'

interface PlanetType {
    name: string;
    diameter: string;
    rotation_period: string;
    orbital_period: string;
    gravity: string;
    population: string;
    climate: string;
    terrain: string;
    surface_water: string;
    residents: string[];
    films: string[];
    url: string;
    id: number;
}

const Planet: React.FC = () => {
    const [planet, setPlanet] = useState<PlanetType | null>(null);
    const [error, setError] = useState<string>('')
    const location = useLocation();
    const result = location.state && location.state.planet;

    const fetchData = async () => {
        try {
            let planetID;
            const url = location.pathname
            const regex = /(\d+)$/; // Recherche le nombre en fin de chaine
            const match = url.match(regex);
            if (match) {
                const number = match[0];
                planetID = parseInt(number);
            }
            // Chargement des données depuis l'API
            const { data } = await axiosInstance.get(`/planets/${planetID}`)
            setPlanet(data)
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
            setPlanet(result)
        }
        return () => {
            setPlanet(null)
        }
    }, [result])

    return (
        <>
            <BackButton />

            {planet &&
                <div className={globalStyle.detailsContainer}>
                    <p>Name: {planet.name}</p>
                    <p>Diameter: {planet.diameter}</p>
                    <p>Population: {planet.population}</p>
                    <p>Climate: {planet.climate}</p>
                    <p>Terrain: {planet.terrain}</p>
                    <p>Surface Water: {planet.surface_water}</p>
                    <p>Gravity: {planet.gravity}</p>
                    <p>Orbital Periode: {planet.orbital_period}</p>
                    <p>Rotation Period: {planet.rotation_period}</p>
                </div>
            }
            {error && <p>{error}</p>}
        </>
    );
};

export default Planet;
