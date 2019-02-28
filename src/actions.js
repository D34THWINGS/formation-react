export const ADD_STUDENT = 'ADD_STUDENT';
export const addStudent = async (student, dispatch) => {
  const response = await fetch('http://localhost:5000/students', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(student),
  });
  dispatch({
    type: ADD_STUDENT,
    payload: await response.json(),
  });
};

export const DELETE_STUDENT = 'DELETE_STUDENT';
export const deleteStudent = async (studentId, dispatch) => {
  await fetch('http://localhost:5000/students', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentId }),
  });
  dispatch({
    type: DELETE_STUDENT,
    payload: { studentId },
  });
};

export const FETCH_STUDENTS = 'FETCH_STUDENTS';
export const FETCH_HOUSES = 'FETCH_HOUSES';
