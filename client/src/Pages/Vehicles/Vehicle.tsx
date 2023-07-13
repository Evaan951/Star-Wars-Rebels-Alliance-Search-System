import React, { useState, useEffect } from 'react';
import axiosInstance from '../../Utils/axiosInstance';
import SearchBar from '../../Components/Bar/SearchBar';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import BackButton from '../../Components/Button/BackButton';
import globalStyle from '../../Styles/global.module.scss'


interface VehicleType {
    name: string;
    model: string;
    vehicle_class: string;
    manufacturer: string;
    length: string;
    cost_in_credits: string;
    crew: string;
    passengers: string;
    max_atmosphering_speed: string;
    cargo_capacity: string;
    pilots: string[];
    consumables: string;
    films: string[];
    url: string;
    id: number;
}

const Vehicle: React.FC = () => {
    const [vehicle, setVehicle] = useState<VehicleType | null>(null);
    const [error, setError] = useState<string>('')
    const location = useLocation();
    const result = location.state && location.state.vehicle;

    const fetchData = async () => {
        try {
            let vehicleID;
            const url = location.pathname
            // Recherche le(s) nombre(s) en fin de chaine
            const regex = /(\d+)$/;
            const match = url.match(regex);
            if (match) {
                const number = match[0];
                vehicleID = parseInt(number);
            }
            // Chargement des données depuis notre backend
            const { data } = await axiosInstance.get(`/vehicles/${vehicleID}`)
            setVehicle(data)
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
            setVehicle(result)
        }
        return () => {
            setVehicle(null)
        }
    }, [result])

    return (
        <>
            <BackButton />

            {vehicle &&
                <div className={globalStyle.detailsContainer}>
                    <p>Name: {vehicle.name}</p>
                    <p>Model: {vehicle.model}</p>
                    <p>Vehicle Class: {vehicle.vehicle_class}</p>
                    <p>Cost in credits: {vehicle.cost_in_credits}</p>
                    <p>Length: {vehicle.length}</p>
                    <p>Capacity: {vehicle.cargo_capacity}</p>
                    <p>Crew: {vehicle.crew}</p>
                    <p>Max Atmosphering Speed: {vehicle.max_atmosphering_speed}</p>
                    <p>Consumables: {vehicle.consumables}</p>
                    <p>Manufacturer: {vehicle.manufacturer}</p>
                </div>
            }
            {error && <p>{error}</p>}
        </>
    );
};

export default Vehicle;
