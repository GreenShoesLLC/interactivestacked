import { gql } from '@apollo/client';

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
}`;

export const GET_TABLE_DATA = gql`query ($workspaceId: ID!){
  workspace(id: $workspaceId) {
    projects{
      edges{
        node{
          Name
          BaselineStartDate
          BaselinePriority
          Color
          StrokeColor
          Tags
          Projects{
            edges{
              node{
                Id
                IsSelected
                AdjustedStartDate
                AdjustedPriority
              }
            }
          }
        }
      }
    }
  }
}`;