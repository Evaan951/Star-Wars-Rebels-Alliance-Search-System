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
        <div>
          <p>{person.name}</p>
          <p>{person.birth_year}</p>
          <p>{person.gender}</p>
          <p>{person.height}cm</p>
          <p>{person.mass}kg</p>
          <p>{person.hair_color}</p>
          <p>{person.eye_color}</p>
        </div>
      }

    </div>
  );
};

export default Person;
