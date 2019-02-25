import React from 'react';
import { shallow } from 'enzyme';

import HousesList from '../HousesList';

describe('HousesList', () => {
  it('should render a list of houses', () => {
    const students = [{ id: 1, house: 2, firstName: 'foo', lastName: 'bar' }];
    const wrapper = shallow(<HousesList students={students} />);
    expect(wrapper).toMatchSnapshot();
  });
});
