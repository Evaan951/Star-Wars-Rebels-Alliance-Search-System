import React, { useState, FormEvent, ChangeEvent, useContext, MouseEvent, useEffect, useRef } from 'react';
import axios, { Axios, AxiosError } from 'axios';
import { UserContext, UserContextType } from '../../Context/UserContext';
import axiosInstance from '../../Utils/axiosInstance';
import { ErrorCallback, forEachChild } from 'typescript';
import SearchBar from '../Person/SearchBar';
import { Link, redirect, useLoaderData, useNavigate } from 'react-router-dom';


interface PeopleType {
  name: string;
  eye_color: string;
  gender: string;
  hair_color: string;
  height: string;
  mass: string;
  species: string[];
  starships: string[]
  vehicles: string[]
}


interface PeopleResponseType {
  count: number;
  next: string | null;
  previous: string | null;
  results: PeopleType[];
}


const People: React.FC = () => {

  const [people, setPeople] = useState<PeopleType[]>([])
  const [error, setError] = useState<string>('')
  const isLoaded = useRef<boolean>(false)
  const { user } = useContext<UserContextType>(UserContext);

  //Mise en place d'une ref pour tracker l'état de chargement de la data
  const data = useLoaderData() as PeopleResponseType;
  const naviguate = useNavigate();
  useEffect(() => {

    if (user.isConnected === false) {
      naviguate('/login');
      console.log(user.isConnected)

    }

    if (data instanceof AxiosError) {
      setError(data.response?.data.message)
      setPeople([]);

    } else {
      setPeople(data.results)
      setError('')
    }



    return () => setPeople([]);
  }, [data.count])


  console.log(data)
  return (
    <div>
      {
        data.count > 0 &&
        data.results.map((person: PeopleType, key: number) => {
          return (
            <div key={key} >
              <p>{person.name} </p>

            </div>
          )

        })
      }


      {
        error && error === 'Missing authentication' &&
        <div>
          <p>Veuillez vous connecter</p>
        </div>
      }

    </div>
  );
};

export default People;
