import React, { useReducer } from 'react';
import styled from '@emotion/styled';
import { css, Global } from '@emotion/core';

import Menu from './components/Menu';
import HousesList from './components/HousesList';
import StudentForm from './components/StudentForm';
import { addStudent, FETCH_STUDENTS } from './actions';
import { StateProvider } from './components/StateProvider';
import { useXHRCall } from './hooks/useXHRCall';
import { appReducer } from './reducer';

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

const initialState = { students: { data: [] }, houses: { data: [] } };

const App = () => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  useXHRCall('http://localhost:5000/students', {}, dispatch, FETCH_STUDENTS);
  return (
    <StateProvider value={{ state, dispatch }}>
      <StyledApp className="App">
        <Global styles={globalStyles} />
        <Menu />
        <StudentForm onAddStudent={student => addStudent(student, dispatch)} />
        <HousesList students={state.students.data} />
      </StyledApp>
    </StateProvider>
  );
};

export default App;
