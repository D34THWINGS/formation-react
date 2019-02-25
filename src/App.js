import React, { Component } from 'react';
import './App.css';
import Menu from './components/Menu';
import HousesList from './components/HousesList';
import studentsData from './data/students';
import StudentForm from './components/StudentForm';

class App extends Component {
  state = {
    students: studentsData,
  };

  handleAddStudent = student => {
    const { students } = this.state;
    return this.setState({
      students: [...students, {
        ...student,
        id: students.length + 1,
        house: Math.round(Math.random() * 2) + 1,
      }],
    });
  };

  render() {
    const { students } = this.state;
    return (
      <div className="App">
        <Menu />
        <StudentForm onAddStudent={this.handleAddStudent} />
        <HousesList students={students} />
      </div>
    );
  }
}

export default App;
