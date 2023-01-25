import { gql } from '@apollo/client';

export const QUERY_USER = gql`
  query getUser($id: Int!) {
    getUser(id: $id) {
      username
      email
      firstname
      lastname
    }
  }
`;

export const QUERY_USERS = gql`
  query getUsers($pageIndex: Int, $pageSize: Int) {
    getUsers(pageIndex: $pageIndex, pageSize: $pageSize) {
      users {
      id
      username
      email
      firstname
      lastname
      }
      count
    }
  }
`;
