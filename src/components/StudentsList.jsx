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

const DeleteButton = styled.button`
  float: right;
  margin-left: 5px;
  border: none;
  border-radius: 0;
  background: #666;
  color: #fff;
  cursor: pointer;
  
  &:hover {
    opacity: 0.8;
  }
`;

const StudentsList = ({ students, onDeleteStudent }) => (
  <StyledStudentsList>
    {students.map(student => (
      <li key={student.id}>
        {student.lastName.toUpperCase()}
        {' '}
        {student.firstName}
        <DeleteButton onClick={() => onDeleteStudent(student.id)}>X</DeleteButton>
      </li>
    ))}
  </StyledStudentsList>
);

StudentsList.propTypes = {
  onDeleteStudent: PropTypes.func.isRequired,
  students: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    lastName: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
  })).isRequired,
};

export default StudentsList;
