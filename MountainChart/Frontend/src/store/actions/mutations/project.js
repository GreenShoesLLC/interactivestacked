import { gql } from '@apollo/client';

export const UPDATE_PROJECT_BY_DRAG = gql`
  mutation ($ProjectList: [UpdateProjectInput!]){
    updateMultiProject(input:{
      ProjectList: $ProjectList
    }){
      ok
    }
  }`;