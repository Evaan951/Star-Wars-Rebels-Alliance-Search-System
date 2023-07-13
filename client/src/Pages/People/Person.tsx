import React, { useState, ChangeEvent, useEffect } from 'react';
import axiosInstance from '../../Utils/axiosInstance';
import SearchBar from '../../Components/Bar/SearchBar';
import { useLoaderData, useLocation } from 'react-router-dom';
import axios, { Axios, AxiosError } from 'axios';
import globalStyle from '../../Styles/global.module.scss';
import BackButton from '../../Components/Button/BackButton';

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
}

const Person: React.FC = () => {
  const [person, setPerson] = useState<PersonType | null>(null);
  const [error, setError] = useState<AxiosError | string>('')
  const location = useLocation();
  const result = location.state && location.state.person;

  const fetchData = async () => {
    try {
      let personID;
      const url = location.pathname
      const regex = /(\d+)$/; // Recherche le nombre en fin de chaine
      const match = url.match(regex);
      if (match) {
        const number = match[0];
        personID = parseInt(number);
      }
      // Chargement des données depuis l'API
      const { data } = await axiosInstance.get(`/people/${personID}`)
      setPerson(data)
    } catch (error) {
      // Gestion des erreurs
      if (axios.isAxiosError(error)) {
        setError(error)
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
      setPerson(result)
    }
    return () => {
      setPerson(null)
    }
  }, [result])

  return (
    <>
      <BackButton />

      {person &&
        <div className={globalStyle.detailsContainer}>
          <p>Name: <span> {person.name}</span></p>
          <p>Gender: <span> {person.gender}</span></p>
          <p>Birth Year: <span> {person.birth_year}</span></p>
          <p>Height: <span> {person.height}cm</span></p>
          <p>Mass: <span>{person.mass}kg</span></p>
          <p>Eye Color: <span>{person.eye_color}</span></p>
          <p>Hair Color: <span>{person.hair_color}</span></p>
        </div>
      }
    </>
  );
};

export default Person;
