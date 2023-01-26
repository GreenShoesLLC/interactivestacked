import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import moment from 'moment';

import MountainChart from 'component/chart/MountainChart';
import Selector from './Selector';

import { GET_CHART_DATA } from 'store/actions/queries/workspace';
import { UPDATE_CAPACITY_BY_DRAG } from 'store/actions/mutations/resource';
import { UPDATE_PRORES_BY_RESIZE } from 'store/actions/mutations/projectReource';
import { UPDATE_PROJECT_BY_DRAG } from 'store/actions/mutations/project';

const Main = () => {

  const [filter, setFilter] = useState({
    resource: 'Developers0',
    portfolio: 'Portfolio1'
  });
  
  const { data, refetch } = useQuery(GET_CHART_DATA, {
    notifyOnNetworkStatusChange: true,
    variables: {workspaceId: 'V29ya3NwYWNlOjE='}
  });

  const [updateRes] = useMutation(UPDATE_CAPACITY_BY_DRAG, {
    notifyOnNetworkStatusChange: true,
    onCompleted: () => {
      refetch();
    }
  });
  const [updateDemand] = useMutation(UPDATE_PRORES_BY_RESIZE, {
    notifyOnNetworkStatusChange: true,
    onCompleted: () => {
      refetch();
    }
  });
  const [updateProject] = useMutation(UPDATE_PROJECT_BY_DRAG, {
    notifyOnNetworkStatusChange: true,
    onCompleted: () => {
      refetch();
    }
  });

  const convertData = (data) => {
    if(!data) return;
    const { workspace } = data;
    let cap = {};
    let project = {};
    let portfolio = {};
    workspace.resources.edges.map((row) => {
      let { Id, Name, BaselineCapacity, StartAt, pro } = row.node;
      cap[Name] = {
        Id,
        BaselineCapacity: JSON.parse(BaselineCapacity),
        startAt: moment(StartAt).format('YYYY.MM')
      }

      portfolio[Name] = [];
      pro.edges.map((item) => {
        let { BaselineDemand, project, ProjectId, ResourceId } = item.node;
        portfolio[Name].push({
          name: project.Name,
          data: JSON.parse(BaselineDemand),
          pId: ProjectId,
          rId: ResourceId
        })
      })
    });

    workspace.projects.edges.map((row) => {
      let { Id, Color, StrokeColor, Name, BaselineStartDate, BaselinePriority } = row.node;
      project[Name] = {
        Id,
        start: moment(BaselineStartDate).format('YYYY.MM'),
        priority: BaselinePriority,
        color: Color,
        strokecolor: StrokeColor,
      }
    });

    return {
      cap, 
      project, 
      portfolio
    };
  };

  const onSourceChange = async (change) => {
    const {state, newData} = change;
    switch(state){
      case 'resize': {
        let { pId, rId, data } = newData;
        await updateDemand({variables: {pId, rId, Demand: data}});
        break;
      }
      case 'drag': {
        await updateProject({variables: {ProjectList: newData}});
        break;
      }
      case 'capacity': {
        let { data, index } = newData;
        await updateRes({variables: {Id: index, capacity: `[${data.toString()}]`}});
        break;
      }
      default:
        break;
    }
  }

  return ( 
    <>
      <Selector />
      <MountainChart  
        title = {'MountainChart-1'}
        chartdata = {convertData(data)}
        AxisXMin = {2022}
        AxisXMax = {2026}
        AxisXLabel = {'Time'}
        AxisYLabel = {filter.resource}
        AxisYMax = {35}
        AxisYInterval = {5}
        stateChange = { onSourceChange }
        filter = { filter }
        />
      <MountainChart
        title = {'MountainChart-2'}
        chartdata = {convertData(data)}
        AxisXMin = {2023}
        AxisXMax = {2026}
        AxisXLabel = {'year/month'}
        AxisYMax = {40}
        AxisYInterval = {5}
        stateChange = {onSourceChange}
        filter = {filter}
        />
    </>
  )
}

export default Main;