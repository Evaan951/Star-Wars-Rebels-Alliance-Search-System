import React, { useState, MouseEvent, useEffect } from 'react';
import { AxiosError } from 'axios';
import axiosInstance from '../../Utils/axiosInstance';
import SearchBar from '../../Components/Bar/SearchBar';
import { useLoaderData, useNavigate } from 'react-router-dom';
import globalStyle from '../../Styles/global.module.scss'
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


  // Fonction pour passé à la page suivante
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
  
  // Fonction pour passé à la page précedente
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

  // On vérifie si les données passé depuis le loader ne sont pas instance de AxiosError.
  // Si oui on retourne un message d'erreur 
  if (fetchedData instanceof AxiosError) {
    if (fetchedData.response?.data.message === 'Missing authentication') {
      return (<p className={globalStyle.errorMessage}>Please login to access data.</p>)

    }
    return (<p className={globalStyle.errorMessage}>An error occured. Please try again later</p>)
  }
  return (
    <>
      <BackButton />
      <div className={globalStyle.listContainer}>
        <SearchBar dataType='people'/>
        <div className={globalStyle.cardContainer}>
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
                <div className={globalStyle.card} key={key} >
                  <p className={globalStyle.cardTitle}>{person.name} </p>
                  <button className={globalStyle.button} onClick={(e) => handleGoToPerson(e, person)}>Show More</button>
                </div>
              )

            })
          }
        </div>
        <div className={globalStyle.buttonContainer}>
          {nextPage && <button className={globalStyle.button} onClick={loadNextPage}>Next</button>}
          {previousPage && <button className={globalStyle.button} onClick={loadPreviousPage}>Back</button>}
        </div>
      </div>
    </>
  );
};

export default People;
