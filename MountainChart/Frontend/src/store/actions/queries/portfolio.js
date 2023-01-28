import { gql } from '@apollo/client';

export const GET_CHART_DATA = gql`query ($portfolioId: ID!){
  portfolio(id: $portfolioId){
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
            StartAt
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