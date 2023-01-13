import React, { useState, useEffect, useRef } from 'react';
import { useMutation } from '@apollo/client';

import MountainChart from 'component/chart/MountainChart';
import { getDataByWorkspaceId } from 'store/actions/queries/workspace';

import { UPDATE_CAPACITY_BY_DRAG } from 'store/actions/mutations/resource';
import { UPDATE_PRORES_BY_RESIZE } from 'store/actions/mutations/projectReource';
import { UPDATE_PROJECT_BY_DRAG } from 'store/actions/mutations/project';

const Main = () => {

  const [filter, setFilter] = useState({
    resource: 'Developers',
    portfolio: 'Portfolio1'
  });
  
  const data = getDataByWorkspaceId('V29ya3NwYWNlOjE=');

  const [updateRes] = useMutation(UPDATE_CAPACITY_BY_DRAG);
  const [updateDemand] = useMutation(UPDATE_PRORES_BY_RESIZE);
  const [updateProject] = useMutation(UPDATE_PROJECT_BY_DRAG);

  const chartRef = useRef(null), portRef = useRef(null), resRef = useRef(null);
  const resourceType = {
    'Developers':'Developers',
    'QA':'QA',
    'Business Analyst': 'Business Analyst'
  };

  const portfolioType = ['Portfolio1', 'Portfolio2'];

  const handleMethod = () => {
    setFilter({
      resource: resRef.current.value,
      portfolio: portRef.current.value
    });
  }

  const onSourceChange = (change) => {
    const {state, newData} = change;
    switch(state){
      case 'resize': {
        let { pId, rId, data } = newData;
        updateDemand({variables: {pId, rId, Demand: data}});
        break;
      }
      case 'drag': {
        updateProject({variables: {ProjectList: newData}});
        break;
      }
      case 'capacity': {
        let { data, index } = newData;
        updateRes({variables: {Id: index, capacity:`[${data.toString()}]`}});
        break;
      }
      default:
        break;
    }
  }

  const Selector = () => {
    return (
      <div id = "selector">
        <ul>
          <li className="select">
            <select id="standard-select" ref={chartRef} onChange={handleMethod}>
              <option value="c1">MountainChart-1</option>
              <option value="c2">MountainChart-2</option>
            </select>
          </li>
          <li className="select">
            <select id="standard-select" ref={portRef} onChange={handleMethod} defaultValue={filter.portfolio}>
              {
                portfolioType.map((item, index) => (
                  <option value={item} key={index}>{item}</option>
                ))
              }
            </select>
          </li>
          <li className="select">
            <select id="standard-select" ref={resRef} onChange={handleMethod} defaultValue={filter.resource}>
              {
                Object.keys(resourceType).map((key) => (
                  <option value={resourceType[key]} key={key}>{key}</option>
                ))
              }
            </select>
          </li>
        </ul>
      </div>
    );
  }

  return ( 
    <>
      <Selector />
      <MountainChart  
        title = {'MountainChart-1'}
        chartdata = {data}
        AxisXMin = {2022}
        AxisXMax = {2026}
        AxisXLabel = {'Time'}
        AxisYLabel = {'people'}
        AxisYMax = {35}
        AxisYInterval = {5}
        stateChange = { onSourceChange }
        filter = { filter }
        />
      <MountainChart  
        title = {'MountainChart-2'}
        chartdata = {data}
        AxisXMin = {2023}
        AxisXMax = {2026}
        AxisXLabel = {'year/month'}
        AxisYMax = {40}
        AxisYInterval = {5}
        stateChange = { onSourceChange }
        filter = { filter }
        />
    </>
  )
}

export default Main;