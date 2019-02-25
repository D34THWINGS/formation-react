import React from 'react';
import { shallow } from 'enzyme';

import App from '../App';

const students = [{
  id: 1,
  firstName: 'foo',
  lastName: 'bar',
  house: 2,
}];

describe('App', () => {
  it('should render application', () => {
    const wrapper = shallow(<App students={students} />);
    wrapper.setState({ students });
    expect(wrapper).toMatchSnapshot();
  });

  it('should handle student add', () => {
    jest.spyOn(Math, 'random').mockImplementation(() => 0.2);
    const wrapper = shallow(<App students={students} />);
    wrapper.setState({ students });
    const newStudent = { firstName: 'foo', lastName: 'bar' };
    wrapper.find('StudentForm').simulate('addStudent', newStudent);
    expect(wrapper.state().students).toEqual([...students, { ...newStudent, id: 2, house: 1 }]);
    Math.random.mockRestore();
  });
});
