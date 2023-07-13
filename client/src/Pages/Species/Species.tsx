import React, { useState, MouseEvent, useEffect } from 'react';
import { AxiosError } from 'axios';
import axiosInstance from '../../Utils/axiosInstance';
import SearchBar from '../../Components/Bar/SearchBar';
import { useLoaderData, useNavigate } from 'react-router-dom';
import globalStyle from '../../Styles/global.module.scss'
import BackButton from '../../Components/Button/BackButton';



interface SpeciesType {
  name: string;
  classification: string;
  designation: string;
  average_height: string;
  average_lifespan: string;
  eye_colors: Date;
  hair_colors: string;
  skin_colors: string;
  language: string;
  homeworld: string;
  people: string[];
  films: string;
  url: string;
  id: number;
}

interface SpeciesResponseType {
  count: number;
  next: string | null;
  previous: string | null;
  results: SpeciesType[];
}


const Species: React.FC = () => {

  const [species, setSpecies] = useState<SpeciesType[]>([])
  const [nextPage, setNextPage] = useState<string | null>(null)
  const [previousPage, setPreviousPage] = useState<string | null>(null)
  const fetchedData = useLoaderData() as SpeciesResponseType
  const navigate = useNavigate();

  // Fonction pour passé à la page suivante
  const loadNextPage = async (e: MouseEvent) => {
    e.preventDefault()
    try {
      const { data } = await axiosInstance.get(nextPage!);
      setSpecies(data.results);
      setNextPage(data.next!)
      setPreviousPage(data.previous!)
    } catch (error) {
      console.error(error);
      setSpecies([])
      setNextPage(null)
      setPreviousPage(null)
    }
  };
  // Fonction pour passé à la page précédente
  const loadPreviousPage = async (e: MouseEvent) => {
    e.preventDefault();
    try {
      const { data } = await axiosInstance.get(previousPage!);
      setSpecies(data.results);
      setNextPage(data.next!)
      setPreviousPage(data.previous!)
    } catch (error) {
      console.error(error);
      setSpecies([])
      setNextPage(null)
      setPreviousPage(null)
    }
  };
  useEffect(() => {
    setSpecies(fetchedData?.results)
    setNextPage(fetchedData?.next!)
    setPreviousPage(fetchedData?.previous!)
    return () => {
      setSpecies([])
      setNextPage(null)
      setPreviousPage(null)
    }
  }, [fetchedData])

  const handleGoToSpecies = (e: MouseEvent, specie: SpeciesType) => {
    navigate(`/species/${specie.id}`, { state: { specie } });
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
        <SearchBar dataType='species' />
        <div className={globalStyle.cardContainer}>
          {
            fetchedData.count > 0 &&
            species.map((specie: SpeciesType, key: number) => {
              const url = specie.url;
              const regex = /\/(\d+)\/$/; // Recherche le nombre entre les deux slashs et à la fin de l'URL
              const match = url.match(regex);
              if (match) {
                const number = match[1];
                specie.id = parseInt(number);
              }

              return (
                <div className={globalStyle.card} key={key} >
                  <p className={globalStyle.cardTitle}>{specie.name} </p>
                  <button className={globalStyle.button} onClick={(e) => handleGoToSpecies(e, specie)}>Show More</button>
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

export default Species;
