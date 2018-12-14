import React from 'react';
import { shallow } from 'enzyme';
import { Keypad } from './Keypad';
import { DigitButton } from './DigitButton';

describe('keypad', () => {

    const allButtons = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '*', '#'];

    const onChange = jest.fn();
    beforeEach(() => {
        onChange.mockReset();
    });

    it('should display digits 0-9, star and hash', () => {
        const wrapper = shallow(<Keypad/>);
        const buttons = wrapper.find(DigitButton);
        expect(buttons.length).toBe(12);

        for (let digit of allButtons) {
            const button = buttons.find({digit: digit});
            expect(button.exists()).toBe(true);
        }
    });

    it('should notify caller on button press', () => {
        const wrapper = shallow(<Keypad onChange={onChange}/>);
        const buttons = wrapper.find(DigitButton);

        for (let digit of allButtons) {
            const button = buttons.find({digit: digit});
            button.prop('onClick')({target: {value: digit}});
            expect(onChange).toBeCalledWith({target: {value: digit}});
        }
    });
});