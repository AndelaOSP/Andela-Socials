/* eslint-env mocha */
import React from 'react';
import { shallow } from 'enzyme';

import EventCard from '../../../components/cards/EventCard';

describe('Search Modal', () => {
  it('renders', () => {
    const instance = shallow(<EventCard />);
    expect(instance).toMatchSnapshot();
  });
});
