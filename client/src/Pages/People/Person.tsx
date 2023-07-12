import React, { useState, ChangeEvent, useEffect } from 'react';
import axiosInstance from '../../Utils/axiosInstance';
import SearchBar from '../../Components/SearchBar';
import { useLoaderData, useLocation } from 'react-router-dom';
import axios, { Axios, AxiosError } from 'axios';

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
      console.log(url)
      const regex = /(\d+)$/; // Recherche le nombre en fin de chaine
      const match = url.match(regex);
      console.log(match)
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
  console.log(location)

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
  console.log(person)

  return (
    <div>
      <SearchBar />
      {person && <p>{person.name}</p>}
    </div>
  );
};

export default Person;
