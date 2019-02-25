import React from 'react';
import { shallow } from 'enzyme';

import StudentsList from '../StudentsList';

describe('StudentsList', () => {
  it('should render a list of students', () => {
    const students = [{ id: 1, firstName: 'foo', lastName: 'bar' }];
    const wrapper = shallow(<StudentsList students={students} />);
    expect(wrapper).toMatchSnapshot();
  });
});
