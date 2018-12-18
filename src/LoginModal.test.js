import React from 'react';
import { shallow } from 'enzyme';
import { LoginModal } from './LoginModal';

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

    const validAccountSid = 'ACffffffffffffffffffffffffffffffff';
    const validAuthToken = 'ffffffffffffffffffffffffffffffff';

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
        submitForm(wrapper, '',validAuthToken);

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
        submitForm(wrapper, validAccountSid,validAuthToken);

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

function submitForm(wrapper, accountSid, authToken) {
    const accountSidInput = wrapper.find('#accountSidField input');
    const authTokenInput = wrapper.find('#authTokenField input');
    const button = wrapper.find('button');

    accountSidInput.simulate('change', stubEvent(accountSidInput, accountSid));
    authTokenInput.simulate('change', stubEvent(authTokenInput, authToken));
    button.simulate('click');
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