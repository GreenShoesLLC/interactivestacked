import React, { useState, useEffect, useRef } from 'react';

import MountainChart from 'component/chart/MountainChart';

import { getPortfolio, getCapacity } from 'store/actions/resourceAction';

const Main = () => {

  const [portfolioData, setPortfolioData] = useState([]);
  const [resourceData, setResourceData] = useState([]);
  const [projectData, setProjectData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filter, setFilter] = useState({
    resource: 'Dev',
    portfolio: 'Portfolio1'
  });

  const chartRef = useRef(null), portRef = useRef(null), resRef = useRef(null);
  const resourceType = {
    'Developer':'Dev',
    'QA':'QA',
    'Business Analyst': 'BA'
  };

  const portfolioType = ['Portfolio1', 'Portfolio2'];

  useEffect(() => {
    setLoading(true);
    getPortfolio(filter.portfolio)
      .then(({tmpProject, tmpDemand}) => {
        setPortfolioData(tmpDemand[filter.resource]);
        setProjectData(tmpProject);
        setLoading(false);
      });
    getCapacity(filter)
      .then((res) => {
        setResourceData(res);
      });
  }, [filter]);

  const handleMethod = () => {
    setFilter({
      resource: resRef.current.value,
      portfolio: portRef.current.value
    });
  }

  const onSourceChange = (change) => {
    const {state, data} = change;
    switch(state){
      case 'demand':
        setPortfolioData(data);
        break;
      case 'capacity':
        setResourceData(data);
        break;
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
        demand = {portfolioData}
        capacity = {resourceData}
        project = {projectData}
        AxisXMin = {2022}
        AxisXMax = {2026}
        AxisXLabel = {'Time'}
        AxisYLabel = {'people'}
        AxisYInterval = {5}
        stateChange = { onSourceChange }
        loading = {loading}
        />
      <MountainChart  
        title = {'MountainChart-2'}
        demand = {portfolioData}
        capacity = {resourceData}
        project = {projectData}
        AxisXMin = {2023}
        AxisXMax = {2026}
        AxisXLabel = {'year/month'}
        AxisYMax = {40}
        AxisYInterval = {5}
        stateChange = { onSourceChange }
        loading = {loading}
        />
    </>
  )
}

export default Main;