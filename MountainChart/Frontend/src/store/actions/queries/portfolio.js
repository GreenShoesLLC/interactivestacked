import { gql } from '@apollo/client';

export const GET_CHART_DATA = gql`query ($portfolioId: ID!){
  portfolio(id: $portfolioId){
    workspace{
      AnchorDate
      TimeInterval
    }
    PortProjects{
      edges{
        node{
          Id
          IsSelected
          AdjustedStartDate
          AdjustedPriority
          project{
            Name
            Color
            StrokeColor
          }
        }
      }
    }
    PortResources{
      edges{
        node{
          Id
          AdjustedCapacity
          resource{
            Name
          }
          PortProRes{
            edges{
              node{
                PortfolioProjectId
                PortfolioResourceId
                AdjustedDemand
                portProject{
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
  }
}`;

export const GET_TABLE_DATA = gql`query ($portfolioId: ID!){
  portfolio(id: $portfolioId){
    PortProjects{
      edges{
        node{
          Id
          id
          IsSelected
          AdjustedPriority
          AdjustedStartDate
          project{
            Name
            BaselinePriority
            BaselineStartDate
            StrokeColor
            Color
            Tags
          }
        }
      }
    }
  }
}`;