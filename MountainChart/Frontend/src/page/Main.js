import React, { useState, useEffect } from 'react';
import { useMutation, useLazyQuery } from '@apollo/client';

import MountainChart from 'component/chart/MountainChart';
import Selector from './Selector';
import WorkspaceTable from './Table';

import { GET_CHART_DATA } from 'store/actions/queries/portfolio';
import { UPDATE_ADJUSTEDCAPACITY_BY_DRAG } from 'store/actions/mutations/portfolioResource';
import { UPDATE_PORTFOLIOPRORES_BY_RESIZE } from 'store/actions/mutations/portfolioProRes';
import { UPDATE_PORTFOLIOPROJECT_BY_DRAG } from 'store/actions/mutations/portfolioProject';

import { convertChartData } from 'common/utility';

const Main = () => {

  const [workspaceId, SetWorkspaceId] = useState('');
  const [filter, setFilter] = useState({});
  const [state, SetState] = useState({});

  const [getData, { data, refetch }] = useLazyQuery(GET_CHART_DATA, {
    notifyOnNetworkStatusChange: true
  });

  useEffect(() => {
    if(filter.portfolio) {
      getData({variables: {portfolioId: filter.portfolio}});
    }
  }, [workspaceId, filter]);

  const [updateCapacity] = useMutation(UPDATE_ADJUSTEDCAPACITY_BY_DRAG, {
    notifyOnNetworkStatusChange: true,
    onCompleted: () => {
      refetch();
    }
  });
  const [updateDemand] = useMutation(UPDATE_PORTFOLIOPRORES_BY_RESIZE, {
    notifyOnNetworkStatusChange: true,
    onCompleted: () => {
      refetch();
    }
  });
  const [updateProject] = useMutation(UPDATE_PORTFOLIOPROJECT_BY_DRAG, {
    notifyOnNetworkStatusChange: true,
    onCompleted: () => {
      refetch();
    }
  });

  const onFilterChange = (change) => {
    const { id, resource, portfolio } = change;
    if(id) {
      SetWorkspaceId(id);
    }
    setFilter({ resource, portfolio });
  };

  const onSourceChange = async (change) => {
    const {state, newData} = change;
    switch(state) {
      case 'resize': {
        let { pId, rId, data } = newData;
        await updateDemand({variables: {pId, rId, Demand: `[${data.toString()}]`}});
        break;
      }
      case 'drag': {
        await updateProject({variables: {ProjectList: newData}});
        break;
      }
      case 'capacity': {
        let { data, index } = newData;
        await updateCapacity({variables: {Id: index, capacity: `[${data.toString()}]`}});
        break;
      }
      default:
        break;
    }
    SetState(change);
  }

  return ( 
    <>
      <Selector stateChange = {onFilterChange}/>
      <WorkspaceTable 
        portfolioId={filter.portfolio} 
        refetch={refetch} 
        state={state}
        />
      <MountainChart  
        title = {'MountainChart-1'}
        chartData = {convertChartData(data, filter)}
        AxisXMin = {'2022.01.01'}
        AxisXMax = {'2026.01.01'}
        AxisXLabel = {'Time'}
        AxisYLabel = {filter.resource}
        AxisYMax = {35}
        AxisYInterval = {5}
        stateChange = {onSourceChange}
        />
      <MountainChart
        title = {'MountainChart-2'}
        chartData = {convertChartData(data, filter)}
        AxisXMin = {'2023.01.01'}
        AxisXMax = {'2027.01.01'}
        AxisXLabel = {'year/month'}
        AxisYMax = {40}
        AxisYInterval = {5}
        stateChange = {onSourceChange}
        />
    </>
  )
}

export default Main;