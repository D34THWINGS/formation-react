import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const StyledStudentForm = styled.form`
  background: #333;
  margin-bottom: 2rem;
  padding: 0.5rem;
  border-radius: 5px;
`;

const StudentFormTitle = styled.h2`
  color: #fff;
  margin: 0 0 1rem 0;
`;

const StudentFormInput = styled.input`
  display: inline-block;
  border: none;
  background: #fff;
  margin-right: 0.5rem;
  padding: 0.5rem;
  font-size: 1.3rem;
`;

const StudentFormButton = styled.button`
  background: #fff;
  padding: 0.5rem;
  border: none;
  font-size: 1.3rem;
  font-weight: bold;
  cursor: pointer;
`;

const handleChange = (input, state, setState) => e => setState({
  ...state,
  [input]: e.target.value,
});

const handleSubmit = ({ firstName, lastName }, setState, onAddStudent) => (e) => {
  e.preventDefault();
  onAddStudent({ firstName, lastName });
  setState({ firstName: '', lastName: '' });
};

const StudentForm = ({ onAddStudent }) => {
  const [state, setState] = useState({ firstName: '', lastName: '' });
  return (
    <StyledStudentForm onSubmit={handleSubmit(state, setState, onAddStudent)}>
      <StudentFormTitle>Nouvel étudiant</StudentFormTitle>
      <StudentFormInput
        type="text"
        name="firstName"
        value={state.firstName}
        onChange={handleChange('firstName', state, setState)}
      />
      <StudentFormInput
        type="text"
        name="lastName"
        value={state.lastName}
        onChange={handleChange('lastName', state, setState)}
      />
      <StudentFormButton type="submit">Ajouter</StudentFormButton>
    </StyledStudentForm>
  );
};

StudentForm.propTypes = {
  onAddStudent: PropTypes.func.isRequired,
};

export default StudentForm;
