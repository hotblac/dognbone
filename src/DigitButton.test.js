import React from 'react';
import { shallow } from 'enzyme';
import { DigitButton } from './DigitButton';

describe('digit button', () => {

    const digit = "*";
    const onClick = jest.fn();

    beforeEach(() => {
        onClick.mockReset();
    });

    it('should display the digit', () => {
        const wrapper = shallow(<DigitButton digit={digit}/>);
        expect(wrapper.text()).toBe(digit);
    });

    it('should notify caller on click', () => {
        const wrapper = shallow(<DigitButton onClick={onClick}/>);
        wrapper.simulate('click');
        expect(onClick).toBeCalled();
    });

});