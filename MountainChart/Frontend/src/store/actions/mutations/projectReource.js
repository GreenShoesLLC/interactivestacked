import { gql } from '@apollo/client';

export const UPDATE_PRORES_BY_RESIZE = gql`
  mutation ($pId: Int!, $rId: Int!, $Demand: String!){
    updateProResource(input:{
      ProjectId: $pId,
      ResourceId: $rId,
      BaselineDemand: $Demand
    }){
      ok
    }
  }`;