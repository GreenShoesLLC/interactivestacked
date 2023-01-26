import { gql } from '@apollo/client';

export const GET_CHART_DATA = gql`query ($workspaceId: ID!){
  workspace(id: $workspaceId){
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

export const GET_SELECTOR_DATA = gql`query{
  workspaceList{
    edges{
      node{
        id,
        Name,
        portfolios{
          edges{
            node{
              id,
              Name
            }
          }
        },
        resources{
          edges{
            node{
              id,
              Name
            }
          }
        }
      }
    }
  }
}`