import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const StyledStudentsList = styled.ul`
  width: 100%;
  padding: 0.5rem;
  margin: 0;
  background: #444;
  box-sizing: border-box;
  list-style: none;
  flex: 1;
  border-radius: 5px;
`;

const StudentsList = ({ students }) => (
  <StyledStudentsList>
    {students.map(student => (
      <li key={student.id}>
        {student.lastName.toUpperCase()}
        {' '}
        {student.firstName}
      </li>
    ))}
  </StyledStudentsList>
);

StudentsList.propTypes = {
  students: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    lastName: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
  })).isRequired,
};

export default StudentsList;
