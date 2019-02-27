export const ADD_STUDENT = 'ADD_STUDENT';
export const addStudent = student => ({
  type: ADD_STUDENT,
  payload: student,
});

export const DELETE_STUDENT = 'DELETE_STUDENT';
export const deleteStudent = studentId => ({
  type: DELETE_STUDENT,
  payload: { studentId },
});
