import { gql } from '@apollo/client';

export const UPDATE_PORTFOLIOPROJECT_BY_DRAG = gql`
  mutation ($ProjectList: [UpdatePortProjectInput!]){
    updateMultiPortProject(input:{
      PortProjectList: $ProjectList
    }){
      ok
    }
  }`;