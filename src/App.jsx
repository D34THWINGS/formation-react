import React, { Component } from 'react';
import styled from '@emotion/styled';
import { Global, css } from '@emotion/core';

import Menu from './components/Menu';
import HousesList from './components/HousesList';
import studentsData from './data/students';
import StudentForm from './components/StudentForm';

const StyledApp = styled.div`
  padding: 6rem 2rem 2rem;
`;

const globalStyles = css`
  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
      "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;

class App extends Component {
  state = {
    students: studentsData,
  };

  handleAddStudent = (student) => {
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
      <StyledApp className="App">
        <Global styles={globalStyles} />
        <Menu />
        <StudentForm onAddStudent={this.handleAddStudent} />
        <HousesList students={students} />
      </StyledApp>
    );
  }
}

export default App;
