import React, { useState, MouseEvent, useEffect } from 'react';
import { AxiosError } from 'axios';
import axiosInstance from '../../Utils/axiosInstance';
import SearchBar from '../../Components/Bar/SearchBar';
import { useLoaderData, useNavigate } from 'react-router-dom';
import globalStyle from '../../Styles/global.module.scss'
import BackButton from '../../Components/Button/BackButton';



interface VehiclesType {
  name: string;
  model: string;
  vehicle_class: string;
  manufacturer: string;
  length: string;
  cost_in_credits: Date;
  crew: string;
  passengers: string;
  max_atmosphering_speed: string;
  cargo_capacity: string;
  pilots: string[];
  consumables: string;
  films: string[];
  url: string;
  id: number;
}

interface VehiclesResponseType {
  count: number;
  next: string | null;
  previous: string | null;
  results: VehiclesType[];
}


const Vehicles: React.FC = () => {

  const [vehicles, setVehicles] = useState<VehiclesType[]>([])
  const [nextPage, setNextPage] = useState<string | null>(null)
  const [previousPage, setPreviousPage] = useState<string | null>(null)
  const fetchedData = useLoaderData() as VehiclesResponseType
  const navigate = useNavigate();

  // Fonction pour passé à la page suivante
  const loadNextPage = async (e: MouseEvent) => {
    e.preventDefault()
    try {
      const { data } = await axiosInstance.get(nextPage!);
      setVehicles(data.results);
      setNextPage(data.next!)
      setPreviousPage(data.previous!)
    } catch (error) {
      console.error(error);
      setVehicles([])
      setNextPage(null)
      setPreviousPage(null)
    }
  };

  // Fonction pour passé à la page précédente
  const loadPreviousPage = async (e: MouseEvent) => {
    e.preventDefault();
    try {
      const { data } = await axiosInstance.get(previousPage!);
      setVehicles(data.results);
      setNextPage(data.next!)
      setPreviousPage(data.previous!)
    } catch (error) {
      console.error(error);
      setVehicles([])
      setNextPage(null)
      setPreviousPage(null)
    }
  };
  useEffect(() => {
    setVehicles(fetchedData?.results)
    setNextPage(fetchedData?.next!)
    setPreviousPage(fetchedData?.previous!)
    return () => {
      setVehicles([])
      setNextPage(null)
      setPreviousPage(null)
    }
  }, [fetchedData])

  const handleGoToVehicle = (e: MouseEvent, vehicle: VehiclesType) => {
    navigate(`/vehicles/${vehicle.id}`, { state: { vehicle } });
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
        <SearchBar dataType='vehicles' />
        <div className={globalStyle.cardContainer}>
          {
            fetchedData.count > 0 &&
            vehicles.map((vehicle: VehiclesType, key: number) => {
              const url = vehicle.url;
              const regex = /\/(\d+)\/$/; // Recherche le nombre entre les deux slashs et à la fin de l'URL
              const match = url.match(regex);
              if (match) {
                const number = match[1];
                vehicle.id = parseInt(number);
              }

              return (
                <div className={globalStyle.card} key={key} >
                  <p className={globalStyle.cardTitle}>{vehicle.name} </p>
                  <button className={globalStyle.button} onClick={(e) => handleGoToVehicle(e, vehicle)}>Show More</button>
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

export default Vehicles;
