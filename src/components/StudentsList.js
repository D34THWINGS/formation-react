import React from 'react';

import './StudentsList.css';

const PokemonList = ({ students }) => (
  <ul className="studentsList">
    {students.map(student => (
      <li key={student.id}>{student.lastName.toUpperCase()} {student.firstName}</li>
    ))}
  </ul>
);

export default PokemonList;
