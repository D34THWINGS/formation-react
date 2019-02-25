import React from 'react';

import './StudentsList.css';

const StudentsList = ({ students }) => (
  <ul className="studentsList">
    {students.map(student => (
      <li key={student.id}>{student.lastName.toUpperCase()} {student.firstName}</li>
    ))}
  </ul>
);

export default StudentsList;
