import React, { useState, FormEvent, ChangeEvent, useContext, MouseEvent, useEffect, useRef } from 'react';
import axios, { Axios, AxiosError } from 'axios';
import { UserContext, UserContextType } from '../../Context/UserContext';
import axiosInstance from '../../Utils/axiosInstance';
import { ErrorCallback, forEachChild } from 'typescript';
import SearchBar from '../../Components/SearchBar';
import { Link, redirect, useLoaderData, useNavigate, useRouteError } from 'react-router-dom';



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
  pilots:string[];
  id: number;
  url: string;
}


interface StarshipsResponseType {
  count: number;
  next: string | null;
  previous: string | null;
  results: StarshipsType[];
}


const Starships: React.FC = () => {

  const [starships, setStarships] = useState<StarshipsType[]>([])
  const [nextPage, setNextPage] = useState<string | null>(null)
  const [previousPage, setPreviousPage] = useState<string | null>(null)
  const fetchedData = useLoaderData() as StarshipsResponseType
  const navigate = useNavigate();


  const loadNextPage = async (e: MouseEvent) => {
    e.preventDefault()
    try {
      const { data } = await axiosInstance.get(nextPage!);
      setStarships(data.results);
      setNextPage(data.next!)
      setPreviousPage(data.previous!)
    } catch (error) {
      console.error(error);
      setStarships([])
      setNextPage(null)
      setPreviousPage(null)
    }
  };

  const loadPreviousPage = async (e: MouseEvent) => {
    e.preventDefault();
    try {
      const { data } = await axiosInstance.get(previousPage!);
      setStarships(data.results);
      setNextPage(data.next!)
      setPreviousPage(data.previous!)
    } catch (error) {
      console.error(error);
      setStarships([])
      setNextPage(null)
      setPreviousPage(null)
    }
  };
  useEffect(() => {
    setStarships(fetchedData?.results)
    setNextPage(fetchedData?.next!)
    setPreviousPage(fetchedData?.previous!)
    return () => {
      setStarships([])
      setNextPage(null)
      setPreviousPage(null)
    }
  }, [fetchedData])

  const handleGoToStarship = (e: MouseEvent, starship: StarshipsType) => {
    navigate(`/starships/${starship.id}`, { state: { starship } });
  };


  if (fetchedData instanceof AxiosError) {
    if (fetchedData.response?.data.message === 'Missing authentication') {
      return (<p>Veuillez vous connecter pour accéder au données</p>)

    }
    return (<p>Une erreur est survenue pendant le chargement des données. Veuillez ressayer ultérieurement</p>)
  }
  return (
    <div>
      <SearchBar/>
      {
        fetchedData.count > 0 &&
        starships.map((starship: StarshipsType, key: number) => {
          const url = starship.url;
          const regex = /\/(\d+)\/$/; // Recherche le nombre entre les deux slashs et à la fin de l'URL
          const match = url.match(regex);
          if (match) {
            const number = match[1];
            starship.id = parseInt(number);
          }
          
          return (
            <div key={key} >
              <p>{starship.name} </p>
              <button onClick={(e) => handleGoToStarship(e, starship)}>En savoir plus</button>
            </div>
          )

        })
      }
      {nextPage && <button onClick={loadNextPage}>Suivant</button>}
      {previousPage && <button onClick={loadPreviousPage}>Précédent</button>}


    </div>
  );
};

export default Starships;
