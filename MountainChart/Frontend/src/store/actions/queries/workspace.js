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