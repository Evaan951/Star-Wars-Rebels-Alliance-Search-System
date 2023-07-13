import React, { useState, useEffect } from 'react';
import axiosInstance from '../../Utils/axiosInstance';
import SearchBar from '../../Components/Bar/SearchBar';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import BackButton from '../../Components/Button/BackButton';
import globalStyle from '../../Styles/global.module.scss'


interface FilmType {
    title: string;
    episode_id: number;
    opening_crawl: string;
    director: string;
    producer: string;
    release_date: Date;
    species: string[];
    starships: string[];
    vehicles: string[];
    characters: string[];
    planets: string[];
    url: string;
}

const Film: React.FC = () => {
    const [film, setFilm] = useState<FilmType | null>(null);
    const [error, setError] = useState<string>('')
    const location = useLocation();
    const result = location.state && location.state.film;

    const fetchData = async () => {
        try {
            let filmID;
            const url = location.pathname
            // Recherche le nombre en fin de chaine
            const regex = /(\d+)$/;
            const match = url.match(regex);
            if (match) {
                const number = match[0];
                filmID = parseInt(number);
            }
            // Chargement des données depuis l'API
            const { data } = await axiosInstance.get(`/films/${filmID}`)
            setFilm(data)
        } catch (error) {
            // Gestion des erreurs
            if (axios.isAxiosError(error)) {
                setError(error.response?.data.message)
            } else {
                setError('An error happened. Please try again later')
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
            setFilm(result)
        }
        return () => {
            setFilm(null)
        }
    }, [result])

    return (
        <>
            <BackButton />

            {film &&
                <div className={globalStyle.detailsContainer}>
                    <p>Title: {film.title}</p>
                    <p>Episode: {film.episode_id}</p>
                    <p>Director: {film.director}</p>
                    <p>Producer: {film.producer}</p>
                    <p>Release Date: {film.release_date.toString()}</p>
                </div>
            }
            {error && <p>{error}</p>}
        </>
    );
};

export default Film;
