import React, { useState, FormEvent, ChangeEvent, useContext, MouseEvent, useEffect, useRef } from 'react';
import axios, { Axios, AxiosError } from 'axios';
import { UserContext, UserContextType } from '../../Context/UserContext';
import axiosInstance from '../../Utils/axiosInstance';
import { ErrorCallback, forEachChild } from 'typescript';
import SearchBar from '../../Components/SearchBar';
import { Link, redirect, useLoaderData, useNavigate, useRouteError } from 'react-router-dom';



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


interface PeopleResponseType {
  count: number;
  next: string | null;
  previous: string | null;
  results: PersonType[];
}


const People: React.FC = () => {

  const [people, setPeople] = useState<PersonType[]>([])
  const [nextPage, setNextPage] = useState<string | null>(null)
  const [previousPage, setPreviousPage] = useState<string | null>(null)
  const fetchedData = useLoaderData() as PeopleResponseType
  const navigate = useNavigate();


  const loadNextPage = async (e: MouseEvent) => {
    e.preventDefault()
    try {
      const { data } = await axiosInstance.get(nextPage!);
      setPeople(data.results);
      setNextPage(data.next!)
      setPreviousPage(data.previous!)
    } catch (error) {
      console.error(error);
      setPeople([])
      setNextPage(null)
      setPreviousPage(null)
    }
  };

  const loadPreviousPage = async (e: MouseEvent) => {
    e.preventDefault();
    try {
      const { data } = await axiosInstance.get(previousPage!);
      setPeople(data.results);
      setNextPage(data.next!)
      setPreviousPage(data.previous!)
    } catch (error) {
      console.error(error);
      setPeople([])
      setNextPage(null)
      setPreviousPage(null)
    }
  };
  useEffect(() => {
    setPeople(fetchedData?.results)
    setNextPage(fetchedData?.next!)
    setPreviousPage(fetchedData?.previous!)
    return () => {
      setPeople([])
      setNextPage(null)
      setPreviousPage(null)
    }
  }, [fetchedData])

  const handleGoToPerson = (e: MouseEvent, person: PersonType) => {
    navigate(`/people/${person.id}`, { state: { person } });
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
        people.map((person: PersonType, key: number) => {
          const url = person.url;
          const regex = /\/(\d+)\/$/; // Recherche le nombre entre les deux slashs et à la fin de l'URL
          const match = url.match(regex);
          if (match) {
            const number = match[1];
            person.id = parseInt(number);
          }
          
          return (
            <div key={key} >
              <p>{person.name} </p>
              <button onClick={(e) => handleGoToPerson(e, person)}>En savoir plus</button>
            </div>
          )

        })
      }
      {nextPage && <button onClick={loadNextPage}>Suivant</button>}
      {previousPage && <button onClick={loadPreviousPage}>Précédent</button>}


    </div>
  );
};

export default People;
