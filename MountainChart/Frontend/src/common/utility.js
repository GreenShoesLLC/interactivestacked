import moment from 'moment';

export const convertChartData = (data, filter) => {
  if(!data || !data.portfolio) return;
  const { PortProjects, PortResources, workspace } = data.portfolio;
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

  let { TimeInterval, AnchorDate } = workspace;

  PortProjects.edges.map((row) => {
    let { Id, AdjustedStartDate, AdjustedPriority, project, IsSelected } = row.node;
    
    if(IsSelected) {
      let { Name, Color, StrokeColor } = project;
      Project[Name] = {
        Id,
        start: moment(AdjustedStartDate).format('YYYY.MM.DD'),
        priority: AdjustedPriority,
        color: Color,
        strokecolor: StrokeColor
      }
    }
  });

  PortResources.edges.map((row) => {
    let { Id, AdjustedCapacity, resource, PortProRes } = row.node;
    let { Name } = resource;

    if( Name === filter.resource ) {
      Capacity = {
        Id,
        AdjustedCapacity: JSON.parse(AdjustedCapacity)
      }

      PortProRes.edges.map((item) => {
        let { AdjustedDemand, portProject, PortfolioProjectId, PortfolioResourceId } = item.node;
        if(Project[portProject.project.Name]) {
          Demand.push({
            name: portProject.project.Name,
            data: JSON.parse(AdjustedDemand),
            pId: PortfolioProjectId,
            rId: PortfolioResourceId
          })
        }
      });
    }
  });

  return {
    Capacity,
    Project,
    Demand,
    TimeInterval,
    AnchorDate: moment(AnchorDate).format('YYYY.MM.DD')
  };
};

export const convertSelectorData = (data) => {
  if(!data || !data.workspaceList) return;
  const { workspaceList } = data;
  let workList = [];
  let portList = {};
  let resList = {};

  workspaceList.edges.map((row) => {
    let { id, Name, portfolios, resources } = row.node;
    let workspaceId = id;
    portList[workspaceId] = [];
    resList[workspaceId] = [];
    
    portfolios.edges.map((item) => {
      const { id, Name } = item.node;
      portList[workspaceId].push({id, Name});
    });
    resources.edges.map((item1) => {
      resList[workspaceId].push(item1.node.Name);
    });

    workList.push({id, Name});
  });

  return {
    workList,
    portList,
    resList
  }
}

export const convertTableData = (data) => {
  if(!data || !data.portfolio) return;

  const { PortProjects } = data.portfolio;
  let projectList = [];
  let i = 0;

  PortProjects.edges.map((row) => {
    let { IsSelected, AdjustedPriority, AdjustedStartDate, project, Id } = row.node;
    let { Name, BaselinePriority, BaselineStartDate, Color, StrokeColor, Tags } = project;
    
    projectList.push({
      Id,
      key: i++,
      Name,
      BaselinePriority,
      BaselineStartDate,
      IsSelected,
      AdjustedPriority,
      AdjustedStartDate,
      Tags,
      Color,
      StrokeColor
    })
  });

  return projectList;
}