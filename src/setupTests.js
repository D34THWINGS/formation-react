/* eslint-disable import/no-extraneous-dependencies */

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

let consoleError;

beforeAll(() => {
  consoleError = console.error;
  console.error = (err) => {
    throw err;
  };
});

afterAll(() => {
  console.error = consoleError;
});
