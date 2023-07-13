import React, { useState, MouseEvent, useEffect } from 'react';
import { AxiosError } from 'axios';
import axiosInstance from '../../Utils/axiosInstance';
import SearchBar from '../../Components/Bar/SearchBar';
import { useLoaderData, useNavigate, } from 'react-router-dom';
import globalStyle from '../../Styles/global.module.scss'
import BackButton from '../../Components/Button/BackButton';



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

  // Fonction pour passé à la page suivante
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

  // Fonction pour passé à la page précédente
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
        <SearchBar dataType='starships' />
        <div className={globalStyle.cardContainer}>
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
                <div className={globalStyle.card} key={key} >
                  <p className={globalStyle.cardTitle}>{starship.name} </p>
                  <button className={globalStyle.button} onClick={(e) => handleGoToStarship(e, starship)}>Show More</button>
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

export default Starships;
