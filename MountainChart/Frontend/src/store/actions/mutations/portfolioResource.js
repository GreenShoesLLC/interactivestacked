import { gql } from '@apollo/client';

export const UPDATE_ADJUSTEDCAPACITY_BY_DRAG = gql`
  mutation ($Id: Int!, $capacity: String!){
    updatePortResource(input:{
      Id: $Id,
      AdjustedCapacity: $capacity
    }){
      ok
    }
  }`;