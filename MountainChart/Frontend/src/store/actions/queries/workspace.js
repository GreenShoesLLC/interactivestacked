import { gql } from '@apollo/client';

export const GET_DATA = gql`query ($workspaceId: ID!){
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