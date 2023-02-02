import React, { useEffect, useState, useRef } from 'react';
import { useQuery } from '@apollo/client';

import { Select } from 'antd';

import { GET_SELECTOR_DATA } from 'store/actions/queries/workspace';
import { convertSelectorData } from 'common/utility';
import { StyledSelect } from 'component/UI/select';

const { Option } = Select;

const Selector = ({stateChange}) => {

  const [workspace, setWorkspace] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [resource, setResource] = useState([]);
  const [selectedWork, setSelectedWork] = useState('');
  const [selectedPort, setSelectedPort] = useState('');
  const [selectedRes, setSelectedRes] = useState('');
  const workspaceRef = useRef(null), portfolioRef = useRef(null), resourceRef = useRef(null);

  const { data } = useQuery(GET_SELECTOR_DATA, {
    notifyOnNetworkStatusChange: true,
    onCompleted: (res) => {
      const { workList, portList, resList } = convertSelectorData(res);
      setWorkspace(workList);
      setPortfolio(portList);
      setResource(resList);
      setSelectedWork(workList[0].id);
      setSelectedPort(portList[workList[0].id][0].id);
      setSelectedRes(resList[workList[0].id][0]);
    }
  });

  useEffect(() => {
    if(selectedWork && stateChange && selectedPort && selectedRes) {
      stateChange({
        id: selectedWork,
        resource: selectedRes, 
        portfolio: selectedPort
      });
    }
  }, [selectedWork, selectedPort, selectedRes]);

  const handleWorkspace = (e) => {
    setSelectedWork(e);
    setSelectedPort(portfolio[e][0].id);
    setSelectedRes(resource[e][0]);
}

  const handlePortfolio = (e) => {
    setSelectedPort(e);
    setSelectedRes(resource[selectedWork][0]);
  }

  const handleResource = (e) => {
    setSelectedRes(e);
  }

  return (
    <div id = "selector">
      <StyledSelect
        onChange={handleWorkspace}  
        value={selectedWork}>
        {
          workspace && workspace.map(({id, Name}) => (
            <Option value={id} key={id}>{Name}</Option>
          ))
        }
      </StyledSelect>
      <StyledSelect
        onChange={handlePortfolio} 
        value={selectedPort}>
        {
          portfolio[selectedWork] && portfolio[selectedWork].map(({id, Name}) => (
            <Option value={id} key={id}>{Name}</Option>
          ))
        }
      </StyledSelect>
      <StyledSelect
        onChange={handleResource}
        value={selectedRes}>
        {
          resource[selectedWork] && resource[selectedWork].map((item, index) => (
            <Option value={item} key={index}>{item}</Option>
          ))
        }
      </StyledSelect>
    </div>
  )
}

export default Selector;