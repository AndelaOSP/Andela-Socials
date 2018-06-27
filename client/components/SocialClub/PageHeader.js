import React, { Component } from 'react';
import { Link } from 'react-router-dom';

const PageHeader = ({ image, title, buttonTitle, joinClub }) => {
  const divStyle = {
    backgroundImage: 'url(' + image + ')',
  };
  
  return (
    <div className="page-header" style={divStyle}>
      <div className="club-title">
        <h1>{title}</h1>
        <button onClick={joinClub}>{buttonTitle}</button>
      </div>
      <div className="black-cover"></div>
    </div>
  );
}

export default PageHeader;
