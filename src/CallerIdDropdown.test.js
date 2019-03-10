import React from 'react';
import { shallow } from 'enzyme';
import { CallerIdDropdown } from './CallerIdDropdown';

const callerId = '+447700900000';
const twilioNumbers = [callerId, '+447700900111', '+447700900222'];

describe('caller id dropdown', () => {

    it('should display current caller id', () => {
        const wrapper = shallow(<CallerIdDropdown callerId={callerId}/>);
        expect(wrapper.text()).toContain('Caller ID: ' + callerId);
    });

    it('should display all available twilio numbers', () => {
        const wrapper = shallow(<CallerIdDropdown twilioNumbers={twilioNumbers}/>);
        const dropdownItems = wrapper.find('.dropdown-item');
        expect(dropdownItems.length).toBe(twilioNumbers.length);
        dropdownItems.forEach((item, i) =>
            expect(item.text()).toBe(twilioNumbers[i])
        );
    });

    it('should notify onChange', () => {
        const onChange = jest.fn();
        const wrapper = shallow(<CallerIdDropdown callerId={callerId} twilioNumbers={twilioNumbers} onChange={onChange}/>);
        const dropdownItems = wrapper.find('.dropdown-item');
        dropdownItems.at(2).simulate('click');
        expect(onChange).toBeCalledWith(twilioNumbers[2]);
    });

    it('should be hidden when only one twilio number is available', () => {
        const wrapper = shallow(<CallerIdDropdown callerId={callerId} twilioNumbers={[callerId]}/>);
        expect(wrapper.text()).toContain('Caller ID: ' + callerId);
        const dropdownItems = wrapper.find('.dropdown-item');
        expect(dropdownItems.length).toBe(0);
    });
});