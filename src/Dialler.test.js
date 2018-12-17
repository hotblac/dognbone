import React from 'react';
import { shallow } from 'enzyme';
import { Dialler } from './Dialler';
import { Keypad } from './Keypad';
import { Device } from "twilio-client";

const phoneNumber = '07700900000';

// Mock Device behaviours
Device.setup = jest.fn(token => {});
Device.connect = jest.fn();
Device.disconnectAll = jest.fn();

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

    it('should be green when call is inactive', () => {
        const wrapper = shallow(<Dialler/>);
        wrapper.setState({callIsActive: false});

        const button = wrapper.find('#callButtonField button');
        expect(button.hasClass('is-success')).toBe(true);
        expect(button.hasClass('is-danger')).toBe(false);
    });

    it('should be red when call is active', () => {
        const wrapper = shallow(<Dialler/>);
        wrapper.setState({callIsActive: true});

        const button = wrapper.find('#callButtonField button');
        expect(button.hasClass('is-success')).toBe(false);
        expect(button.hasClass('is-danger')).toBe(true);
    });

    it('should setup device on click when call is inactive', async () => {
        const wrapper = shallow(<Dialler/>);
        wrapper.setState({callIsActive: false});
        await clickCallButton(wrapper);

        expect(fetch.mock.calls[0][0]).toBe('/api/token');
        expect(Device.setup).toBeCalledWith(token);
    });

    it('should end call on click when call is active', async () => {
        const wrapper = shallow(<Dialler/>);
        wrapper.setState({callIsActive: true});
        await clickCallButton(wrapper);

        expect(Device.disconnectAll).toBeCalled();
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

    it('should change on connect', () => {
        const wrapper = shallow(<Dialler/>);
        deviceCallbacks.connect();

        const status = wrapper.find('#callButtonField p.help');
        expect(status.text()).toBe('Connected');
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

describe('phone number input', () => {

    it('should initially be empty', () => {
        const wrapper = shallow(<Dialler/>);
        const input = wrapper.find('#phoneNumberField input');

        expect(input.props().value).toBe('');
    });

    it('should update state', () => {
        const wrapper = shallow(<Dialler/>);
        const input = wrapper.find('#phoneNumberField input');
        input.simulate('change', {target: {value: phoneNumber}});

        expect(wrapper.state('number')).toBe(phoneNumber);
    });

    it('should be passed to Device on connection', () => {
        const wrapper = shallow(<Dialler/>);
        const input = wrapper.find('#phoneNumberField input');
        input.simulate('change', {target: {value: phoneNumber}});

        deviceCallbacks.ready();
        expect(Device.connect).toBeCalledWith({number: phoneNumber});
    });

});

describe('keypad', () => {

    it('should be visible', () => {
        const wrapper = shallow(<Dialler/>);
        const keypad = wrapper.find(Keypad);
        expect(keypad.exists()).toBe(true);

    });

    it('should update phone number field', () => {
        const wrapper = shallow(<Dialler/>);
        const keypad = wrapper.find(Keypad);
        keypad.prop('onChange')({target: {value: '#'}});
        expect(wrapper.state('number')).toBe('#');

        const input = wrapper.find('#phoneNumberField input');
        expect(input.props().value).toBe('#');
    });
});

describe('device', () => {

    it('should connect the call when ready', () => {
        const wrapper = shallow(<Dialler/>);
        deviceCallbacks.ready();

        expect(Device.connect).toBeCalled();
    });
});

async function clickCallButton(wrapper) {
    const button = wrapper.find('#callButtonField button');
    button.simulate('click');
    await flushPromises();
}

function flushPromises() {
    return new Promise(resolve => setImmediate(resolve));
}