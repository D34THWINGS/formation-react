import React from 'react';
import styled from '@emotion/styled';
import { css, Global } from '@emotion/core';

import Menu from './components/Menu';
import HousesList from './components/HousesList';
import StudentForm from './components/StudentForm';
import useXHRCall from './hooks/useXHRCall';

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

const handleAddStudent = (state, setState) => student => setState({
  ...state,
  data: [...state.students, {
    ...student,
    id: state.students.length + 1,
    house: Math.round(Math.random() * 2) + 1,
  }],
});

const handleDeleteStudents = (state, setState) => studentId => setState({
  ...state,
  data: state.students.filter(student => student.id !== studentId),
});

const App = () => {
  const [state, setState] = useXHRCall('/students');
  return (
    <StyledApp className="App">
      <Global styles={globalStyles} />
      <Menu />
      <StudentForm onAddStudent={handleAddStudent(state, setState)} />
      <HousesList
        students={state.data}
        onDeleteStudent={handleDeleteStudents(state, setState)}
      />
    </StyledApp>
  );
};

export default App;
