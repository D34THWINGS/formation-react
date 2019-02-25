import React from 'react';
import { shallow } from 'enzyme';

import StudentForm from '../StudentForm';

describe('StudentForm', () => {
  it('should render student form', () => {
    const wrapper = shallow(<StudentForm onAddStudent={jest.fn()} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should handle input change', () => {
    const wrapper = shallow(<StudentForm onAddStudent={jest.fn()} />);
    wrapper.find('input').first().simulate('change', { target: { value: 'azerty' } });
    expect(wrapper).toMatchSnapshot();
  });

  it('should handle form submit', () => {
    const submitFn = jest.fn();
    const wrapper = shallow(<StudentForm onAddStudent={submitFn} />);
    wrapper.setState({ firstName: 'foo', lastName: 'bar' });
    wrapper.find('form').simulate('submit', { preventDefault: jest.fn() });
    expect(submitFn).toHaveBeenCalled();
    expect(wrapper).toMatchSnapshot();
  });
});
