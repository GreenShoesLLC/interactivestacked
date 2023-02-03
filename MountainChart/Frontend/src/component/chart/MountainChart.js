import React from 'react';
import { useId } from 'react-id-generator'

import CBody from './chart.body';
import CHeader from './chart.header';

const MountainChart = (props) => {
  const Id = useId();
  
  return (
    <>
      <div className="chart-container">
        <CHeader Name={props.title} />
        <CBody
          chartId={Id}
          dataSource={props}
          loading={props.loading}
          stateChange={props.stateChange}/>
      </div>
    </>
  )
}

export default MountainChart;