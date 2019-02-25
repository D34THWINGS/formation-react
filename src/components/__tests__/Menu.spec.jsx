import React from 'react';
import { shallow } from 'enzyme';

import Menu from '../Menu';

describe('Menu', () => {
  it('should render app menu', () => {
    const wrapper = shallow(<Menu />);
    expect(wrapper).toMatchSnapshot();
  });
});
