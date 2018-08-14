import React, { Component } from 'react';

import Spinner from './Spinner';


const LoadComponent = (importCall) => {
  return class extends Component {
    constructor(props) {
      super(props);
      this.state = {
        component: () => <Spinner />
      };
    }

    handleLoadComponent = async () => {
      const importedComponent = await importCall;
      this.setState({
        component: importedComponent.default || importedComponent
      });
    }

    componentDidMount() {
      this.handleLoadComponent();
    }

    render() {
      const ImportedComponent = this.state.component;
      return <ImportedComponent {...this.props} />;
    }
  };
}

export default LoadComponent;
