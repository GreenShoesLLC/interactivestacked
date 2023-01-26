import React, { useState, useRef } from 'react';
import { useQuery } from '@apollo/client';

import { GET_SELECTOR_DATA } from 'store/actions/queries/workspace';

const Selector = () => {

  const [workspace, setWorkspace] = useState([]);
  const [selectedWork, setSelectedWork] = useState('');
  const workspaceRef = useRef(null), portfolioRef = useRef(null), resourceRef = useRef(null);

  const { data } = useQuery(GET_SELECTOR_DATA, {
    notifyOnNetworkStatusChange: true,
    onCompleted: (res) => {
      const { all, worklist } = convertData(res);
      setWorkspace(all);
      setSelectedWork(worklist[0]);
    }
  });

  const handleMethod = () => {
    setSelectedWork(workspaceRef.current.value);
    // setFilter({
    //   resource: resRef.current.value,
    //   portfolio: portRef.current.value
    // });
  }

  const convertData = (data) => {
    if(!data) return;
    const { workspaceList } = data;
    let all = {};
    let worklist = [];
    workspaceList.edges.map((row) => {
      const { id, Name, portfolios, resources } = row.node;
      let portfolio = [];
      let resource = [];
      
      worklist.push(Name);
      portfolios.edges.map((item) => {
        portfolio.push(item.node.Name);
      });
      resources.edges.map((item1) => {
        resource.push(item1.node.Name);
      });

      all[Name] = { id, portfolio, resource };

    });

    return {
      worklist,
      all
    }
  }

  return (
    <div id = "selector">
      <ul>
        <li className="select">
          <select id="standard-select" ref={workspaceRef} onChange={handleMethod}>
            {
              Object.keys(workspace).map((key) => (
                <option value={key} key={workspace[key]['id']}>{key}</option>
              ))
            }
          </select>
        </li>
        <li className="select">
          <select id="standard-select" ref={portfolioRef} onChange={handleMethod}>
            {
              workspace[selectedWork] && workspace[selectedWork].portfolio.map((item, index) => (
                <option value={item} key={index}>{item}</option>
              ))
            }
          </select>
        </li>
        <li className="select">
          <select id="standard-select" ref={resourceRef} onChange={handleMethod} defaultValue={''}>
            {
              workspace[selectedWork] && workspace[selectedWork].resource.map((item, index) => (
                <option value={item} key={index}>{item}</option>
              ))
            }
          </select>
        </li>
      </ul>
    </div>
  )
}

export default Selector;