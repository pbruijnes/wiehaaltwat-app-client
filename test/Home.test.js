import React from 'react';
import ReactDOM from 'react-dom';
import { configure, shallow } from 'enzyme';
import { expect } from 'chai';
import Adapter from 'enzyme-adapter-react-16';
import Home from './../src/containers/Home';

configure({ adapter: new Adapter() });

describe('<Home/>', function() {
  it('not authenticated renders login and signup button', function() {
    const wrapper = shallow(<Home isAuthenticated={false}/>);
    const header = <h1>WIE HAALT WAT</h1>;
    expect(wrapper.contains(header)).to.equal(true);
  });

  it('authenticated render items', function() {
    const wrapper = shallow(<Home isAuthenticated={true}/>);
    const header = <h1>WIE HAALT WAT</h1>;
    expect(wrapper.contains(header)).to.equal(false);
  });
});
