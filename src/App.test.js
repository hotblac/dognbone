import React from 'react';
import { shallow } from 'enzyme';
import App from './App';
import { Device } from "twilio-client";
import * as api from "./Backend.api";

const capabilityToken = 'a_valid_token';
const versionString = 'app_version';

api.version = jest.fn(() => {
  return Promise.resolve(versionString);
});

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
    expect(app.find('LoginModal').props().visible).toBe(true);
  });

  it('should be hidden on successful login', () => {
    const app = shallow(<App/>);
    const loginModal = app.find('LoginModal');

    loginModal.prop('onLogin')(capabilityToken);
    expect(app.find('LoginModal').props().visible).toBe(false);
  });

  /*
   * Incorrect login credentials will result in a valid capability
   * token being returned. However, the Device will have state 'offline'
   * on initialisation with this token.
   * When device state is offline, assume that the cause was incorrect
   * login creds and show the login modal again.
   */
  it('should be visible when device is offline', () => {
      const app = shallow(<App/>);
      const loginModal = app.find('LoginModal');

      // Capability token is returned by login modal
      loginModal.prop('onLogin')(capabilityToken);

      // Device immediately fires 'offline' event due to incorrect credentials
      deviceCallbacks.offline();

      expect(app.find('LoginModal').props().visible).toBe(true);
  });
});

describe('error notification', () => {

  it('should be visible on error event', () => {
    const app = shallow(<App/>);
    expect(app.find('.notification').exists()).toBe(false);

    deviceCallbacks.error({code:'31000', message:'Cannot establish connection.'});
    expect(app.find('.notification').exists()).toBe(true);
  });

  it('should hide on dismiss', () => {
    const app = shallow(<App/>);
    deviceCallbacks.error({code:'31000', message:'Cannot establish connection.'});
    expect(app.find('.notification').exists()).toBe(true);

    const closeButton = app.find('.notification .delete');
    closeButton.simulate('click');

    expect(app.find('.notification').exists()).toBe(false);
  });
});

describe('device', () => {

    it('should initialize on successful login', () => {
        const app = shallow(<App/>);
        const loginModal = app.find('LoginModal');
        loginModal.prop('onLogin')(capabilityToken);
        expect(Device.setup).toBeCalledWith(capabilityToken);
    });
});

describe('device status', () => {

  it('should initially be empty', () => {
    const app = shallow(<App/>);
    expect(app.state('deviceState')).toBe('');
  });

  it('should change on cancel', () => {
    const app = shallow(<App/>);
    deviceCallbacks.cancel();
    expect(app.state('deviceState')).toBe('cancel');
  });

  it('should change on connect', () => {
    const app = shallow(<App/>);
    deviceCallbacks.connect();
    expect(app.state('deviceState')).toBe('connect');
  });

  it('should change on disconnect', () => {
    const app = shallow(<App/>);
    deviceCallbacks.disconnect();
    expect(app.state('deviceState')).toBe('disconnect');
  });

  it('should change on incoming', () => {
    const app = shallow(<App/>);
    deviceCallbacks.incoming();
    expect(app.state('deviceState')).toBe('incoming');
  });

  it('should change on offline', () => {
    const app = shallow(<App/>);
    deviceCallbacks.offline();
    expect(app.state('deviceState')).toBe('offline');
  });

  it('should change on device ready', () => {
    const app = shallow(<App/>);
    deviceCallbacks.ready();
    expect(app.state('deviceState')).toBe('ready');
  });

  it('should change on device error', () => {
    const app = shallow(<App/>);
    deviceCallbacks.error({code:'', message:''});
    expect(app.state('deviceState')).toBe('error');
  });

});

describe('footer', () => {

  it('should contain version string', async () => {
    const app = shallow(<App/>);
    await flushPromises();

    const footer = app.find('footer');
    expect(footer.text()).toMatch(versionString)
  });
});

function flushPromises() {
  return new Promise(resolve => setImmediate(resolve));
}


