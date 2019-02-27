import React, { useReducer } from 'react';
import styled from '@emotion/styled';
import { css, Global } from '@emotion/core';

import Menu from './components/Menu';
import HousesList from './components/HousesList';
import studentsData from './data/students';
import StudentForm from './components/StudentForm';
import { ADD_STUDENT, addStudent, deleteStudent } from './actions';

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

const initialState = { students: studentsData };

const appReducer = (state, action) => {
  switch (action.type) {
    case ADD_STUDENT:
      return {
        ...state,
        students: [...state.students, {
          ...action.payload,
          id: state.students.length + 1,
          house: Math.round(Math.random() * 2) + 1,
        }],
      };
    default:
      throw new Error(`Unhandled action: ${action.type}`);
  }
};

const App = () => {
  const [{ students }, dispatch] = useReducer(appReducer, initialState);
  return (
    <StyledApp className="App">
      <Global styles={globalStyles} />
      <Menu />
      <StudentForm
        onAddStudent={student => dispatch(addStudent(student))}
        onDeleteStudent={studentId => dispatch(deleteStudent(studentId))}
      />
      <HousesList students={students} />
    </StyledApp>
  );
};

export default App;
