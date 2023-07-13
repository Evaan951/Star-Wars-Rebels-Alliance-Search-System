import React, { useState, MouseEvent, useEffect } from 'react';
import { AxiosError } from 'axios';
import axiosInstance from '../../Utils/axiosInstance';
import SearchBar from '../../Components/Bar/SearchBar';
import { useLoaderData, useNavigate } from 'react-router-dom';
import globalStyle from '../../Styles/global.module.scss'
import BackButton from '../../Components/Button/BackButton';



interface PlanetsType {
  name: string;
  diameter: string;
  rotation_period: string;
  orbital_period: string;
  gravity: string;
  population: Date;
  climate: string;
  terrain: string;
  surface_water: string;
  residents: string;
  films: string[];
  url: string;
  id: number;
}

interface PlanetsResponseType {
  count: number;
  next: string | null;
  previous: string | null;
  results: PlanetsType[];
}


const Planets: React.FC = () => {

  const [planets, setPlanets] = useState<PlanetsType[]>([])
  const [nextPage, setNextPage] = useState<string | null>(null)
  const [previousPage, setPreviousPage] = useState<string | null>(null)
  const fetchedData = useLoaderData() as PlanetsResponseType
  const navigate = useNavigate();

  // Fonction pour passé à la page suivante
  const loadNextPage = async (e: MouseEvent) => {
    e.preventDefault()
    try {
      const { data } = await axiosInstance.get(nextPage!);
      setPlanets(data.results);
      setNextPage(data.next!)
      setPreviousPage(data.previous!)
    } catch (error) {
      console.error(error);
      setPlanets([])
      setNextPage(null)
      setPreviousPage(null)
    }
  };

  // Fonction pour passé à la page précédente
  const loadPreviousPage = async (e: MouseEvent) => {
    e.preventDefault();
    try {
      const { data } = await axiosInstance.get(previousPage!);
      setPlanets(data.results);
      setNextPage(data.next!)
      setPreviousPage(data.previous!)
    } catch (error) {
      console.error(error);
      setPlanets([])
      setNextPage(null)
      setPreviousPage(null)
    }
  };
  useEffect(() => {
    setPlanets(fetchedData?.results)
    setNextPage(fetchedData?.next!)
    setPreviousPage(fetchedData?.previous!)
    return () => {
      setPlanets([])
      setNextPage(null)
      setPreviousPage(null)
    }
  }, [fetchedData])

  const handleGoToPlanet = (e: MouseEvent, planet: PlanetsType) => {
    navigate(`/planets/${planet.id}`, { state: { planet } });
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
        <SearchBar dataType='planets' />
        <div className={globalStyle.cardContainer}>
          {
            fetchedData.count > 0 &&
            planets.map((planet: PlanetsType, key: number) => {
              const url = planet.url;
              const regex = /\/(\d+)\/$/; // Recherche le nombre entre les deux slashs et à la fin de l'URL
              const match = url.match(regex);
              if (match) {
                const number = match[1];
                planet.id = parseInt(number);
              }

              return (
                <div className={globalStyle.card} key={key} >
                  <p className={globalStyle.cardTitle}>{planet.name} </p>
                  <button className={globalStyle.button} onClick={(e) => handleGoToPlanet(e, planet)}>Show More</button>
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

export default Planets;
