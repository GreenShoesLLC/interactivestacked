import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useLazyQuery } from '@apollo/client';
import moment from 'moment';

import MountainChart from 'component/chart/MountainChart';
import Selector from './Selector';

import { GET_CHART_DATA } from 'store/actions/queries/workspace';
import { UPDATE_ADJUSTEDCAPACITY_BY_DRAG } from 'store/actions/mutations/portfolioResource';
import { UPDATE_PORTFOLIOPRORES_BY_RESIZE } from 'store/actions/mutations/portfolioProRes';
import { UPDATE_PORTFOLIOPROJECT_BY_DRAG } from 'store/actions/mutations/portfolioProject';

const Main = () => {

  const [workspaceId, SetWorkspaceId] = useState('');
  const [filter, setFilter] = useState({});

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

  const convertData = (data) => {
    if(!data || !data.portfolio) return;
    const { PortProjects, PortResources } = data.portfolio;
    let Capacity = {};
    let Project = {};
    let Demand= [];

    if(!PortProjects.edges) {
      return {
        Capacity,
        Project,
        Demand
      };
    }

    PortProjects.edges.map((row) => {
      let { Id, AdjustedStartDate, AdjustedPriority, project } = row.node;
      let { Name, Color, StrokeColor } = project;
      Project[Name] = {
        Id,
        start: moment(AdjustedStartDate).format('YYYY.MM'),
        priority: AdjustedPriority,
        color: Color,
        strokecolor: StrokeColor
      }
    });

    PortResources.edges.map((row) => {
      let { Id, AdjustedCapacity, resource, PortProRes } = row.node;
      let { Name, StartAt } = resource;

      if( Name === filter.resource ) {
        Capacity = {
          Id,
          AdjustedCapacity: JSON.parse(AdjustedCapacity),
          startAt: moment(StartAt).format('YYYY.MM')
        }

        PortProRes.edges.map((item) => {
          let { AdjustedDemand, portProject, PortfolioProjectId, PortfolioResourceId } = item.node;
          Demand.push({
            name: portProject.project.Name,
            data: JSON.parse(AdjustedDemand),
            pId: PortfolioProjectId,
            rId: PortfolioResourceId
          })
        });
      }
    });

    return {
      Capacity,
      Project,
      Demand
    };
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
  }

  return ( 
    <>
      <Selector stateChange = {onFilterChange}/>
      <MountainChart  
        title = {'MountainChart-1'}
        chartdata = {convertData(data)}
        AxisXMin = {2022}
        AxisXMax = {2026}
        AxisXLabel = {'Time'}
        AxisYLabel = {filter.resource}
        AxisYMax = {35}
        AxisYInterval = {5}
        stateChange = {onSourceChange}
        />
      {/* <MountainChart
        title = {'MountainChart-2'}
        chartdata = {convertData(data)}
        AxisXMin = {2023}
        AxisXMax = {2026}
        AxisXLabel = {'year/month'}
        AxisYMax = {40}
        AxisYInterval = {5}
        stateChange = {onSourceChange}
        filter = {filter}
        loading = {loading}
        /> */}
    </>
  )
}

export default Main;