import React from 'react';

import './StudentsList.css';

const PokemonList = ({ students }) => (
  <ul className="studentsList">
    {students.map(student => (
      <li>{student.lastName.toUpperCase()} {student.firstName}</li>
    ))}
  </ul>
);

export default PokemonList;
