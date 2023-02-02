import React, { useEffect, useState, useRef } from 'react';
import { useQuery } from '@apollo/client';

import { GET_SELECTOR_DATA } from 'store/actions/queries/workspace';

import { convertSelectorData } from 'common/utility';

const Selector = ({stateChange}) => {

  const [workspace, setWorkspace] = useState([]);
  const [selectedWork, setSelectedWork] = useState('');
  const workspaceRef = useRef(null), portfolioRef = useRef(null), resourceRef = useRef(null);

  const { data } = useQuery(GET_SELECTOR_DATA, {
    notifyOnNetworkStatusChange: true,
    onCompleted: (res) => {
      const { all, worklist } = convertSelectorData(res);
      setWorkspace(all);
      setSelectedWork(worklist[0]);
    }
  });

  useEffect(() => {
    if(selectedWork && stateChange) { 
      stateChange({
        id: workspace[selectedWork].id,
        resource: resourceRef.current.value, 
        portfolio: portfolioRef.current.value,
        
      });
    }
  }, [selectedWork]);

  const handleWorkspace = () => {
    setSelectedWork(workspaceRef.current.value);
  }

  const handleMethod = () => {
    stateChange({
      resource: resourceRef.current.value, 
      portfolio: portfolioRef.current.value
    });
  }

  return (
    <div id = "selector">
      <ul>
        <li className="select">
          <select id="standard-select" ref={workspaceRef} onChange={handleWorkspace}>
            {
              Object.keys(workspace).map((key) => (
                <option value={key} key={workspace[key]['id']}>{key}</option>
              ))
            }
          </select>
        </li>
        <li className="select">
          <select id="standard-select" 
            ref={portfolioRef} 
            onChange={handleMethod}>
            {
              workspace[selectedWork] && workspace[selectedWork].portfolio.map(({id, Name}) => (
                <option value={id} key={id}>{Name}</option>
              ))
            }
          </select>
        </li>
        <li className="select">
          <select id="standard-select" 
            ref={resourceRef} 
            onChange={handleMethod}>
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