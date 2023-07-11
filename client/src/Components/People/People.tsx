import React, { useState, FormEvent, ChangeEvent, useContext, MouseEvent, useEffect } from 'react';
import axios from 'axios';
import { UserContext } from '../../Context/UserContext';
import axiosInstance from '../../Utils/axiosInstance';


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

const People: React.FC = () => {

  const [people, setPeople] = useState<PeopleType | null>(null)

  useEffect(() => {
    const fetchData = () => {
      const response = axiosInstance.get('/people');
      console.log(response)
    }

    fetchData();
  }, [])


  return (
    <div>

    </div>
  );
};

export default People;
