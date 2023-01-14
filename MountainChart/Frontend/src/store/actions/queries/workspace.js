import { useQuery, gql } from '@apollo/client';
import moment from 'moment';

export const getDataByWorkspaceId = (workspaceId) => {
  const GET_DATA = gql`query {
    workspace(id: "${workspaceId}"){
      projects{
        edges{
          node{
            Id,
            Name,
            BaselineStartDate,
            BaselinePriority,
            Color,
            StrokeColor
          }
        }
      },
      resources{
        edges{
          node{
            Id,
            Name,
            BaselineCapacity,
            StartAt
            pro{
              edges{
                node{
                  ProjectId,
                  ResourceId,
                  BaselineDemand
                  project{
                    Name
                  }
                }
              }
            }
          }
        }
      }
    }
  }`;

  const { loading, error, data, refetch } = useQuery(GET_DATA, {
    fetchPolicy: 'no-cache',
  });
  //refetch(GET_DATA);
  
  if(error) return error;

  if(data) {
    const { workspace } = data;
    let cap = {};
    let project = {};
    let portfolio = {};
    workspace.resources.edges.map((row) => {
      let { Id, Name, BaselineCapacity, StartAt, pro } = row.node;
      cap[Name] = {
        Id,
        BaselineCapacity: JSON.parse(BaselineCapacity),
        StartAt
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
  }
}