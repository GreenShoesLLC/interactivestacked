import { gql } from '@apollo/client';

export const UPDATE_CAPACITY_BY_DRAG = gql`
  mutation ($Id: Int!, $capacity: String!){
    updateResource(input:{
      Id: $Id,
      BaselineCapacity: $capacity
    }){
      ok
    }
  }`;