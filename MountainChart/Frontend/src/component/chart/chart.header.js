import React from 'react';

const ChartHeader = ({Name}) => {

  return (
    <>
      <div className="header">
        <label>{Name}</label>
      </div>
    </>
  ) 
}

export default ChartHeader;