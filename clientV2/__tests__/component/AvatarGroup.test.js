import React from 'react';
import { shallow } from 'enzyme';
import { AvatarGroup } from '../../component/AvatarGroup';
import { Avatar } from '../../component/Avatar';

describe('AvatarGroup Component', () => {
  let wrapper;
  const imgList = () => {
    const imgArr = [];
    for (let i = 0; i < 10; i++) {
      imgArr.push({ imgUrl: `//http:/img.jpg${i + 1}` });
    }
    return imgArr;
  };

  beforeEach(() => {
    const props = {
      imgList: imgList()
    };
    wrapper = shallow(<AvatarGroup {...props} />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should display Avatar Component', () => {
    const avatar = wrapper.find(Avatar);
    expect(avatar.length).toBe(7);
    expect(wrapper).toMatchSnapshot();
  });

  it('should display Avatar count if Avatar length is more than 8', () => {
    const avatarCount = wrapper.find('.img-count');
    expect(avatarCount.text()).toContain(3);
  });

  it('should not display Avatar count if Avatar length is less than 8', () => {
    const props = {
      imgList: [{ imgUrl: '//http:/img.jpg1' }]
    };
    const wrapper = shallow(<AvatarGroup {...props} />);
    const avatarCount = wrapper.find('.img-count');
    expect(avatarCount.length).toBe(0);
  });
});
