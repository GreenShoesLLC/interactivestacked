import { gql } from '@apollo/client';

export const UPDATE_PORTFOLIOPROJECT_BY_DRAG = gql`
  mutation ($ProjectList: [UpdatePortProjectInput!]){
    updateMultiPortProject(input:{
      PortProjectList: $ProjectList
    }){
      ok
    }
  }`;

export const UPDATE_PORTFOLIOPROJECT_ISSELECTED = gql`
  mutation ($Id: Int!){
    updatePortProject(input: {
      Id: $Id,
      IsSelected: 1
    }){
      ok
    }
  }
  `;