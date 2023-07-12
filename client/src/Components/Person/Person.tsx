import React, { useState, ChangeEvent } from 'react';
import axiosInstance from '../../Utils/axiosInstance';
import SearchBar from './SearchBar';

interface PersonType {
  name: string;
  birth_year:string;
  eye_color: string;
  gender: string;
  hair_color: string;
  height: string;
  mass: string;
  species: string[];
  starships: string[];
  vehicles: string[];
  id:number;
}

const Person: React.FC = () => {
  const [person, setPerson] = useState<PersonType | null>(null);

  const updatePerson = (newPerson: PersonType | null) => {
    setPerson(newPerson);
    console.log(newPerson)
  };

  console.log(person)
  return (
    <div>
      <SearchBar updatePerson={updatePerson} />
      {person &&
        <div style={{backgroundColor:'black', color:'white', width:'50%'}}>
          <p>{person.id}</p>
          <p>{person.name}</p>
        </div>
      }

    </div>
  );
};

export default Person;
