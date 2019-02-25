import React, { Component } from 'react';
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

class StudentForm extends Component {
  state = {
    firstName: '',
    lastName: '',
  };

  handleChange = input => e => this.setState({ [input]: e.target.value });

  handleSubmit = (e) => {
    e.preventDefault();
    const { firstName, lastName } = this.state;
    const { onAddStudent } = this.props;
    onAddStudent({ firstName, lastName });
    this.setState({ firstName: '', lastName: '' });
  };

  render() {
    const { firstName, lastName } = this.state;
    return (
      <StyledStudentForm onSubmit={this.handleSubmit}>
        <StudentFormTitle>Nouvel étudiant</StudentFormTitle>
        <StudentFormInput type="text" name="firstName" value={firstName} onChange={this.handleChange('firstName')} />
        <StudentFormInput type="text" name="lastName" value={lastName} onChange={this.handleChange('lastName')} />
        <StudentFormButton type="submit">Ajouter</StudentFormButton>
      </StyledStudentForm>
    );
  }
}

StudentForm.propTypes = {
  onAddStudent: PropTypes.func.isRequired,
};

export default StudentForm;
