import React from 'react';
import { shallow } from 'enzyme';
import App from './App';
import { Device } from "twilio-client";

const capabilityToken = 'a_valid_token';

// Mock Device behaviours
Device.setup = jest.fn(token => {});

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

  loginModal.prop('onLogin')(capabilityToken);
  expect(app.find('LoginModal').props().visible).toBe(false);
});

it('should initialize device on successful login', () => {
  const app = shallow(<App/>);
  const loginModal = app.find('LoginModal');
  loginModal.prop('onLogin')(capabilityToken);
  expect(Device.setup).toBeCalledWith(capabilityToken);
});