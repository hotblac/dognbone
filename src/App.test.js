import React from 'react';
import { shallow } from 'enzyme';
import App from './App';

it('renders without crashing', () => {
  const app = shallow(<App/>);
  expect(app).toBeDefined();
});

it('should show login modal when auth token is missing', () => {
  const app = shallow(<App/>);

  const loginModal = app.find('LoginModal');
  expect(loginModal.props().visible).toBe(true);
});

it('should hide login modal on successful login', () => {
  const app = shallow(<App/>);
  const loginModal = app.find('LoginModal');
  loginModal.prop('onLogin')('a_valid_token');
  expect(app.find('LoginModal').props().visible).toBe(false);
});