import { handleCall } from './hooks/useXHRCall';
import { ADD_STUDENT, DELETE_STUDENT, FETCH_HOUSES, FETCH_STUDENTS } from './actions';

const studentsReducer = handleCall(FETCH_STUDENTS);
const housesReducer = handleCall(FETCH_HOUSES);

export const appReducer = (state, action) => {
  switch (action.type) {
    case ADD_STUDENT:
      return {
        ...state,
        students: {
          ...state.students,
          data: [...state.students.data, action.payload],
        },
      };
    case DELETE_STUDENT:
      return {
        ...state,
        students: {
          ...state.students,
          data: state.students.data.filter(student => student.id !== action.payload.studentId),
        },
      };
    default:
      return {
        ...state,
        students: studentsReducer(state.students, action),
        houses: housesReducer(state.houses, action),
      };
  }
};
