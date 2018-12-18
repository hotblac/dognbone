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