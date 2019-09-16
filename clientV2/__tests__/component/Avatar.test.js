import React from 'react';
import { shallow } from 'enzyme';
import { Avatar } from '../../component/Avatar';

describe('Avatar Component', () => {
  it('should render correctly', () => {
    const props = {
      imgUrl: '//http:/img.jpg'
    };

    const wrapper = shallow(<Avatar {...props} />);

    expect(wrapper).toMatchSnapshot();
  });
});
