import React from 'react';
import { shallow } from 'enzyme';
import { LoginModal } from './LoginModal';
import * as api from "./Backend.api";

const validAccountSid = 'ACffffffffffffffffffffffffffffffff';
const validAuthToken = 'ffffffffffffffffffffffffffffffff';
const incorrectAuthToken = 'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz';

// Mock API behaviour
const mockCapabilityToken = 'MOCK_CAPABILITY_TOKEN';
api.capabilityToken = jest.fn((accountSid, authToken) => {
    if (accountSid === validAccountSid && authToken === validAuthToken) {
        return Promise.resolve(mockCapabilityToken);
    } else {
        return Promise.reject(new Error('Incorrect auth token'));
    }
});

const onLogin = jest.fn();
beforeEach(() => {
    onLogin.mockReset();
});

describe('login modal', () => {

    it('should be shown when visible', () => {
        const wrapper = shallow(<LoginModal visible={true}/>);
        const modal = wrapper.find('.modal');
        expect(modal.hasClass('is-active')).toBe(true);
    });

    it('should be hidden when not visible', () => {
        const wrapper = shallow(<LoginModal visible={false}/>);
        const modal = wrapper.find('.modal');
        expect(modal.hasClass('is-active')).toBe(false);
    });
});

describe('form validation', () => {

    it('should show no errors on initial form', () => {
        const wrapper = shallow(<LoginModal/>);

        const accountSidInput = wrapper.find('#accountSidField input');
        const accountSidValidationHelp = wrapper.find('#accountSidField .help');
        const authTokenInput = wrapper.find('#authTokenField input');
        const authTokenValidationHelp = wrapper.find('#authTokenField .help');

        expect(accountSidInput.hasClass('is-danger')).toBe(false);
        expect(authTokenInput.hasClass('is-danger')).toBe(false);
        expect(accountSidValidationHelp.exists()).toBe(false);
        expect(authTokenValidationHelp.exists()).toBe(false);
    });

    it('should show error on blank account SID', () => {
        const wrapper = shallow(<LoginModal/>);
        submitForm(wrapper, '', validAuthToken);

        const accountSidInput = wrapper.find('#accountSidField input');
        const accountSidValidationHelp = wrapper.find('#accountSidField .help');
        expect(accountSidInput.hasClass('is-danger')).toBe(true);
        expect(accountSidValidationHelp.exists()).toBe(true);
    });

    it('should show error on blank auth token', () => {
        const wrapper = shallow(<LoginModal/>);
        submitForm(wrapper, validAccountSid,'');

        const authTokenInput = wrapper.find('#authTokenField input');
        const authTokenValidationHelp = wrapper.find('#authTokenField .help');
        expect(authTokenInput.hasClass('is-danger')).toBe(true);
        expect(authTokenValidationHelp.exists()).toBe(true);
    });

    it('should show no errors on valid input', () => {
        const wrapper = shallow(<LoginModal/>);
        submitForm(wrapper, validAccountSid, validAuthToken);

        const accountSidInput = wrapper.find('#accountSidField input');
        const accountSidValidationHelp = wrapper.find('#accountSidField .help');
        const authTokenInput = wrapper.find('#authTokenField input');
        const authTokenValidationHelp = wrapper.find('#authTokenField .help');

        expect(accountSidInput.hasClass('is-danger')).toBe(false);
        expect(authTokenInput.hasClass('is-danger')).toBe(false);
        expect(accountSidValidationHelp.exists()).toBe(false);
        expect(authTokenValidationHelp.exists()).toBe(false);
    });
});

describe('form submit', () => {

    it('should reject invalid input', async () => {
        const wrapper = shallow(<LoginModal onLogin={onLogin}/>);
        await submitFormAndUpdate(wrapper, '', '');
        expect(onLogin).not.toBeCalled();
    });

    it('should return capability token to caller', async () => {
        const wrapper = shallow(<LoginModal onLogin={onLogin}/>);
        await submitFormAndUpdate(wrapper, validAccountSid, validAuthToken);
        expect(onLogin).toBeCalledWith(mockCapabilityToken);
    });

    it('should display error on auth failure', async () => {
        const wrapper = shallow(<LoginModal onLogin={onLogin}/>);
        expect(wrapper.find('.notification').exists()).toBe(false);

        await submitFormAndUpdate(wrapper, validAccountSid, incorrectAuthToken);
        expect(onLogin).not.toBeCalled();
        expect(wrapper.find('.notification').exists()).toBe(true);
    });

    /*
     * Incorrect credentials do not result in a failure to obtain a capability token.
     * Instead, a capability token is generated that cause the device to fail to
     * initialise. The device will fire an 'offline' event on initialisation.
     * When device status is offline, assume it was due to invalid credentials and
     * show the auth failure notification.
     */
    it('should display error on device offline', async () => {
        const wrapper = shallow(<LoginModal onLogin={onLogin}/>);
        expect(wrapper.find('.notification').exists()).toBe(false);

        // User logs in
        await submitFormAndUpdate(wrapper, validAccountSid, validAuthToken);

        // Device is initialised and immediately becomes offline
        wrapper.setProps({deviceState: 'offline'});

        expect(wrapper.find('.notification').exists()).toBe(true);
    });
});

function submitForm(wrapper, accountSid, authToken) {
    const accountSidInput = wrapper.find('#accountSidField input');
    const authTokenInput = wrapper.find('#authTokenField input');
    const button = wrapper.find('button');

    accountSidInput.simulate('change', stubEvent(accountSidInput, accountSid));
    authTokenInput.simulate('change', stubEvent(authTokenInput, authToken));
    button.simulate('click');
}

async function submitFormAndUpdate(wrapper, accountSid, authToken) {
    submitForm(wrapper, accountSid, authToken);
    await flushPromises();
}

/**
 * Stubbed event object suitable for event simulation.
 * As we use shallow rendering, we don't get real DOM events.
 * This assumes that we use the named input handler pattern:
 * @link https://reactjs.org/docs/forms.html#handling-multiple-inputs
 */
function stubEvent(node, value) {
    const name = node.prop('name');
    return {target: {
            name: name,
            value: value
        }};
}

function flushPromises() {
    return new Promise(resolve => setImmediate(resolve));
}