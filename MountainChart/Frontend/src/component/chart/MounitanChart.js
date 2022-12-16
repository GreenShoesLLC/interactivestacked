import React, { useState } from 'react';
import { useId } from 'react-id-generator'

import CBody from './chart.body';
import CHeader from './chart.header';

const MounitanChart = ({chartName}) => {
  const Id = useId();

  const [filter, setFilter] = useState({
    resource: 'Dev',
    portfolio: 'Portfolio1'
  });

  const changeFilter = (new_state) => { 
    setFilter(prev => ({
      ...prev,
      ...new_state
    }));
  }

  const changePortfolio = (new_state) => {
    
  }

  return (
    <>
      <div className="chart-container">
        <CHeader Id={Id} Name={chartName} stateChange={changeFilter}/>
        <CBody chartId={Id} filter={filter}/>
      </div>
    </>
  )
}

export default MounitanChart;