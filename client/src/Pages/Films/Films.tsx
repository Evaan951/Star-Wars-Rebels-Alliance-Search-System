import React, { useState, MouseEvent, useEffect, useContext } from 'react';
import { AxiosError } from 'axios';
import axiosInstance from '../../Utils/axiosInstance';
import SearchBar from '../../Components/Bar/SearchBar';
import { useLoaderData, useNavigate } from 'react-router-dom';
import globalStyle from '../../Styles/global.module.scss'
import BackButton from '../../Components/Button/BackButton';


interface FilmsType {
  title: string;
  episode_id: number;
  opening_crawl: string;
  director: string;
  producer: string;
  release_date: Date;
  species: string[];
  starships: string[];
  vehicles: string[];
  characters: string[];
  planets: string[];
  url: string;
}

interface FilmsResponseType {
  count: number;
  next: string | null;
  previous: string | null;
  results: FilmsType[];
}


const Films: React.FC = () => {

  const [films, setFilms] = useState<FilmsType[]>([])
  const [nextPage, setNextPage] = useState<string | null>(null)
  const [previousPage, setPreviousPage] = useState<string | null>(null)
  const fetchedData = useLoaderData() as FilmsResponseType
  const navigate = useNavigate();


  //Fonction pour passé à la page suivante
  const loadNextPage = async (e: MouseEvent) => {
    e.preventDefault()
    try {
      const { data } = await axiosInstance.get(nextPage!);
      setFilms(data.results);
      setNextPage(data.next!)
      setPreviousPage(data.previous!)
    } catch (error) {
      console.error(error);
      setFilms([])
      setNextPage(null)
      setPreviousPage(null)
    }
  };

  //Fonction pour passé à la page précedente
  const loadPreviousPage = async (e: MouseEvent) => {
    e.preventDefault();
    try {
      const { data } = await axiosInstance.get(previousPage!);
      setFilms(data.results);
      setNextPage(data.next!)
      setPreviousPage(data.previous!)
    } catch (error) {
      setFilms([])
      setNextPage(null)
      setPreviousPage(null)
    }
  };
  useEffect(() => {
    setFilms(fetchedData?.results)
    setNextPage(fetchedData?.next!)
    setPreviousPage(fetchedData?.previous!)
    return () => {
      setFilms([])
      setNextPage(null)
      setPreviousPage(null)
    }
  }, [fetchedData])

  const handleGoToFilm = (e: MouseEvent, film: FilmsType) => {
    navigate(`/films/${film.episode_id}`, { state: { film } });
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
        <SearchBar dataType='films' />
        <div className={globalStyle.cardContainer}>
          {
            fetchedData.count > 0 &&
            films.map((film: FilmsType, key: number) => {
              const url = film.url;
              const regex = /\/(\d+)\/$/; // Recherche le nombre entre les deux slashs et à la fin de l'URL
              const match = url.match(regex);
              if (match) {
                const number = match[1];
                film.episode_id = parseInt(number);
              }

              return (
                <div className={globalStyle.card} key={key} >
                  <p className={globalStyle.cardTitle}>{film.title} </p>
                  <button className={globalStyle.button} onClick={(e) => handleGoToFilm(e, film)}>Show more</button>
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

export default Films;
