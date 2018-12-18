import React from 'react';
import { shallow } from 'enzyme';
import App from './App';
import { Device } from "twilio-client";

const capabilityToken = 'a_valid_token';

// Mock Device behaviours
Device.setup = jest.fn(token => {});

// Capture Device event registrations so we can trigger them from tests
const deviceCallbacks = {};
Device.on = jest.fn((event, callback) => {
  deviceCallbacks[event] = callback;
})

it('renders without crashing', () => {
  const app = shallow(<App/>);
  expect(app).toBeDefined();
});

describe('login modal', () => {

  it('should be visible when auth token is missing', () => {
    const app = shallow(<App/>);

    const loginModal = app.find('LoginModal');
    expect(loginModal.props().visible).toBe(true);
  });

  it('should be hidden on successful login', () => {
    const app = shallow(<App/>);
    const loginModal = app.find('LoginModal');

    loginModal.prop('onLogin')(capabilityToken);
    expect(app.find('LoginModal').props().visible).toBe(false);
  });
});

describe('device', () => {

  it('should initialize on successful login', () => {
    const app = shallow(<App/>);
    const loginModal = app.find('LoginModal');
    loginModal.prop('onLogin')(capabilityToken);
    expect(Device.setup).toBeCalledWith(capabilityToken);
  });

  it('should show error notification on error event', () => {
    const app = shallow(<App/>);
    expect(app.find('.notification').exists()).toBe(false);

    deviceCallbacks.error({code:'31000', message:'Cannot establish connection.'});
    expect(app.find('.notification').exists()).toBe(true);
  });

  it('should allow error notification to be dismissed', () => {
    const app = shallow(<App/>);
    deviceCallbacks.error({code:'31000', message:'Cannot establish connection.'});
    expect(app.find('.notification').exists()).toBe(true);

    const closeButton = app.find('.notification .delete');
    closeButton.simulate('click');

    expect(app.find('.notification').exists()).toBe(false);
  });

});
