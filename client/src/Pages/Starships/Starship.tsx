import React, { useState, ChangeEvent, useEffect } from 'react';
import axiosInstance from '../../Utils/axiosInstance';
import SearchBar from '../../Components/SearchBar';
import { useLoaderData, useLocation } from 'react-router-dom';
import axios from 'axios';

interface StarshipsType {
  MGLT: string;
  cargo_capacity: string;
  consumables: string;
  gender: string;
  cost_in_credits: string;
  hyperdrive_rating: string;
  name: string;
  model: string[];
  passengers: string[];
  manufacturer: string[];
  pilots: string[];
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
    <div>
      <SearchBar />
      {starship && <p>{starship.name}</p>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default Starship;
