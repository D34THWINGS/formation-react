import React from 'react';
import PropTypes from 'prop-types';

import './StudentsList.css';

const StudentsList = ({ students }) => (
  <ul className="studentsList">
    {students.map(student => (
      <li key={student.id}>
        {student.lastName.toUpperCase()}
        {' '}
        {student.firstName}
      </li>
    ))}
  </ul>
);

StudentsList.propTypes = {
  students: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    lastName: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
  })).isRequired,
};

export default StudentsList;
