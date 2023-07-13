import React, { useState, useEffect } from 'react';
import axiosInstance from '../../Utils/axiosInstance';
import SearchBar from '../../Components/Bar/SearchBar';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import BackButton from '../../Components/Button/BackButton';
import globalStyle from '../../Styles/global.module.scss'


interface StarshipsType {
  MGLT: string;
  cargo_capacity: string;
  consumables: string;
  length: string;
  cost_in_credits: string;
  hyperdrive_rating: string;
  name: string;
  model: string;
  passengers: string;
  manufacturer: string;
  pilots: string[];
  films: string[];
  id: number;
  url: string;
}

const Starship: React.FC = () => {
  const [starship, setStarship] = useState<StarshipsType | null>(null);
  const [error, setError] = useState<string>('')
  const location = useLocation();
  const result = location.state && location.state.starship;

  const fetchData = async () => {
    try {
      let starshipID;
      const url = location.pathname
      console.log(url)
      const regex = /(\d+)$/; // Recherche le nombre en fin de chaine
      const match = url.match(regex);
      console.log(match)
      if (match) {
        const number = match[0];
        starshipID = parseInt(number);
      }
      // Chargement des données depuis l'API
      const { data } = await axiosInstance.get(`/starships/${starshipID}`)
      setStarship(data)
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
  console.log(location)

  /* 
    On verifie si une donnée à été passée pendant la navigation par le composant Parent
    Si oui, on met le composant à jour avec cette même donnée.
    Si non, on execute la function fetchData qui nous permet de récupérer la donnée en fonction de l'id dans notre url.
  */
  useEffect(() => {
    if (!result) {
      fetchData()
    } else {
      setStarship(result)
    }
    return () => {
      setStarship(null)
    }
  }, [result])

  return (
    <>
      <BackButton />
      {starship &&
        <div className={globalStyle.detailsContainer}>
          <p>Name: {starship.name}</p>
          <p>Cargo Capacity: {starship.cargo_capacity}</p>
          <p>Consumables: {starship.consumables}</p>
          <p>Length: {starship.length}</p>
          <p>Cost in credits: {starship.cost_in_credits}</p>
          <p>Hyperdrive Rating: {starship.hyperdrive_rating}</p>
          <p>Model: {starship.model}</p>
          <p>Passengers: {starship.passengers}</p>
          <p>Manufacturer: {starship.manufacturer}</p>


        </div>

      }
      {error && <p>{error}</p>}
    </>
  );
};

export default Starship;
