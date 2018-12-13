import React from 'react';
import { shallow } from 'enzyme';
import {Dialler} from './Dialler';
import {Device} from "twilio-client";

// Mock Device behaviours
Device.setup = jest.fn(token => {});
Device.connect = jest.fn();

// Capture Device event registrations so we can trigger them from tests
const deviceCallbacks = {};
Device.on = jest.fn((event, callback) => {
    deviceCallbacks[event] = callback;
});

// Mock API behaviour
const token = 'MOCKTOKEN';
beforeEach(() => {
    fetch.resetMocks();
    fetch.mockResponseOnce(token);
});

describe('call button', () => {

    it('should setup device', async () => {
        const wrapper = shallow(<Dialler/>);
        await clickCallButton(wrapper);

        expect(fetch.mock.calls[0][0]).toBe('/api/token');
        expect(Device.setup).toBeCalledWith(token);
    });
});

describe('status', () => {

    it('should initially be empty', () => {
        const wrapper = shallow(<Dialler/>);
        const status = wrapper.find('#callButtonField p.help');
        expect(status.text()).toBe('');
    });

    it('should change on token response success', async () => {
        const wrapper = shallow(<Dialler/>);
        await clickCallButton(wrapper);

        const status = wrapper.find('#callButtonField p.help');
        expect(status.text()).toBe('Obtained token');
    });

    it('should change on token response error', async () => {
        const errorMessage = 'Simulated API failure';
        fetch.resetMocks();
        fetch.mockReject(new Error(errorMessage));

        const wrapper = shallow(<Dialler/>);
        await clickCallButton(wrapper);

        const status = wrapper.find('#callButtonField p.help');
        expect(status.text()).toBe('Call setup error: Error: ' + errorMessage);
    });

    it('should change on device ready', () => {
        const wrapper = shallow(<Dialler/>);
        deviceCallbacks.ready();

        const status = wrapper.find('#callButtonField p.help');
        expect(status.text()).toBe('Device ready');
    });

    it('should change on disconnect', () => {
        const wrapper = shallow(<Dialler/>);
        deviceCallbacks.disconnect();

        const status = wrapper.find('#callButtonField p.help');
        expect(status.text()).toBe('Disconnected');
    });

    it('should change on device error', () => {
        const wrapper = shallow(<Dialler/>);
        deviceCallbacks.error({code:'', message:''});

        const status = wrapper.find('#callButtonField p.help');
        expect(status.text()).toBe('Device error');
    });
});

async function clickCallButton(wrapper) {
    const button = wrapper.find('#callButtonField button');
    button.simulate('click');
    await flushPromises();
}

async function fireDeviceEvent(event) {
    Device.simulate()
}

function flushPromises() {
    return new Promise(resolve => setImmediate(resolve));
}