import React from 'react';
import { shallow } from 'enzyme';
import ModalWrapper from '../components/modals/Modal';

describe('Modal Component', () => {
  it('should be closed', () => {
    const props = {
      heading: '',
      openModal: false,
      closeModal: undefined,
      children: undefined
    };

    const wrapper = shallow(<ModalWrapper {...props} />);

    expect(wrapper).toMatchSnapshot();
  });

  it('should be open', () => {
    const props = {
      heading: 'Create Event',
      openModal: true,
      closeModal: jest.fn(),
      children: {}
    };

    const wrapper = shallow(<ModalWrapper {...props} />);

    expect(wrapper).toMatchSnapshot();
  });
});
