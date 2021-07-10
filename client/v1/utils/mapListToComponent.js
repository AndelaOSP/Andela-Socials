import React from 'react';

const mapListToComponent = (listTomap, Component) => {
  const mappedListToCompnent = listTomap.map(eventItem => (
    <Component key={eventItem.node.id}
      {...eventItem.node} />));
  return mappedListToCompnent;
};
export default mapListToComponent;
