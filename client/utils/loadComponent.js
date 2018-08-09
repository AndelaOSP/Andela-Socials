import React, { Component } from 'react';


const LoadComponent = (importCall) => {
  return class extends Component {
    constructor(props) {
      super(props);
      this.state = {
        //TODO: Custom Spinner component to be implemented for use here.
        component: () => <div>Loading...</div>
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
