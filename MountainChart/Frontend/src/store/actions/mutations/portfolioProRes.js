import { gql } from '@apollo/client';

export const UPDATE_PORTFOLIOPRORES_BY_RESIZE = gql`
  mutation ($pId: Int!, $rId: Int!, $Demand: String!){
    updatePortfolioProRes(input:{
      PortfolioProjectId: $pId,
      PortfolioResourceId: $rId,
      AdjustedDemand: $Demand
    }){
      ok
    }
  }`;