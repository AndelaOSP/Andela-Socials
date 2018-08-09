import React, { Component } from 'react';
import Loadable from 'react-loadable';

const Loading = () => <div>Loading...</div>;

const loadComponent = (importCall) => Loadable({
  loader: () => importCall,
  loading: Loading,
});

export default loadComponent;
