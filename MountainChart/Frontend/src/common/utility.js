import moment from 'moment';

export const convertChartData = (data, filter) => {
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

export const convertSelectorData = (data) => {
  if(!data) return;
  const { workspaceList } = data;
  let all = {};
  let worklist = [];

  workspaceList.edges.map((row) => {
    const { id, Name, portfolios, resources } = row.node;
    let portfolio = [];
    let resource = [];
    
    portfolios.edges.map((item) => {
      const { id, Name } = item.node;
      portfolio.push({id, Name});
    });
    resources.edges.map((item1) => {
      resource.push(item1.node.Name);
    });

    worklist.push(Name);

    all[Name] = { id, portfolio, resource };

  });

  return {
    worklist,
    all
  }
}