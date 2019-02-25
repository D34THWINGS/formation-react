import React, { Component } from 'react';

import './StudentForm.css';

class StudentForm extends Component {
  state = {
    firstName: '',
    lastName: '',
  };

  handleChange = input => e => this.setState({ [input]: e.target.value });

  handleSubmit = (e) => {
    e.preventDefault();
    const { firstName, lastName } = this.state;
    this.props.onAddStudent({ firstName, lastName });
    this.setState({ firstName: '', lastName: '' });
  };

  render() {
    const { firstName, lastName } = this.state;
    return (
      <form className="studentForm" onSubmit={this.handleSubmit}>
        <h2 className="studentForm__title">Nouvel étudiant</h2>
        <input type="text" name="firstName" value={firstName} onChange={this.handleChange('firstName')} />
        <input type="text" name="lastName" value={lastName} onChange={this.handleChange('lastName')} />
        <button type="submit" className="studentForm__button">Ajouter</button>
      </form>
    );
  }
}

export default StudentForm;
