import React from 'react';
import { shallow } from 'enzyme';
import { Dialler } from './Dialler';
import { Keypad } from './Keypad';
import { Device } from "twilio-client";

const phoneNumber = '07700900000';

// Mock Device behaviours
Device.connect = jest.fn();
Device.disconnectAll = jest.fn();

describe('call button', () => {

    it('should be green when call is inactive', () => {
        const wrapper = shallow(<Dialler deviceState='ready'/>);

        const button = wrapper.find('#callButtonField button');
        expect(button.hasClass('is-success')).toBe(true);
        expect(button.hasClass('is-danger')).toBe(false);
    });

    it('should be red when call is active', () => {
        const wrapper = shallow(<Dialler deviceState='connect'/>);
        wrapper.setState({callIsActive: true});

        const button = wrapper.find('#callButtonField button');
        expect(button.hasClass('is-success')).toBe(false);
        expect(button.hasClass('is-danger')).toBe(true);
    });

    it('should start call on click when call is inactive', async () => {
        const wrapper = shallow(<Dialler deviceState='ready'/>);
        wrapper.setState({callIsActive: false});
        await clickCallButton(wrapper);

        expect(Device.connect).toBeCalled();
    });

    it('should end call on click when call is active', async () => {
        const wrapper = shallow(<Dialler deviceState='connect'/>);
        wrapper.setState({callIsActive: true});
        await clickCallButton(wrapper);

        expect(Device.disconnectAll).toBeCalled();
    });
});

describe('call status', () => {

    it('should initially be empty', () => {
        const wrapper = shallow(<Dialler/>);
        const status = wrapper.find('#callButtonField p.help');
        expect(status.text()).toBe('');
    });

    it('should change on device ready', () => {
        const wrapper = shallow(<Dialler deviceState={'ready'}/>);
        const status = wrapper.find('#callButtonField p.help');
        expect(status.text()).toBe('Device ready');
    });

    it('should change on connect', () => {
        const wrapper = shallow(<Dialler deviceState={'connect'}/>);
        const status = wrapper.find('#callButtonField p.help');
        expect(status.text()).toBe('Connected');
    });

    it('should change on disconnect', () => {
        const wrapper = shallow(<Dialler deviceState={'disconnect'}/>);
        const status = wrapper.find('#callButtonField p.help');
        expect(status.text()).toBe('Disconnected');
    });

    it('should change on device error', () => {
        const wrapper = shallow(<Dialler deviceState={'error'}/>);
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

    it('should be passed to Device on connection', async () => {
        const wrapper = shallow(<Dialler/>);
        const input = wrapper.find('#phoneNumberField input');
        input.simulate('change', {target: {value: phoneNumber}});

        await clickCallButton(wrapper);
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
        keypad.prop('onChange')('#');
        expect(wrapper.state('number')).toBe('#');

        const input = wrapper.find('#phoneNumberField input');
        expect(input.props().value).toBe('#');
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