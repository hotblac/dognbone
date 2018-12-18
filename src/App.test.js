import React from 'react';
import { shallow } from 'enzyme';
import App from './App';

it('renders without crashing', () => {
  const app = shallow(<App/>);
  expect(app).toBeDefined();
});

it('should show login modal when auth token is missing', () => {
  const app = shallow(<App/>);
  app.setState({token: ''});

  const loginModal = app.find('LoginModal');
  expect(loginModal.props().visible).toBe(true);
});

it('should hide login modal when auth token is present', () => {
  const app = shallow(<App/>);
  app.setState({token: 'a_valid_token'});

  const loginModal = app.find('LoginModal');
  expect(loginModal.props().visible).toBe(false);
});