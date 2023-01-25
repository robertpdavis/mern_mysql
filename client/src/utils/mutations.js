import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation loginUser($username: String!, $password: String!) {
    loginUser(username: $username, password: $password) {
      token
      user {
        id
        username
      }
      status
      msg
    }
  }
`;

export const CREATE_USER = gql`
  mutation createUser($username: String!, $email: String!, $password: String!, $firstname: String!, $lastname: String!) {
    createUser(username: $username, email: $email, password: $password, firstname: $firstname, lastname: $lastname) {
      token
      user {
        id
        username
      }
      status
      msg
    }
  }
`;

export const UPDATE_USER = gql`
  mutation updateUser($id: Int, $username: String, $email: String, $password: String, $firstname: String, $lastname: String) {
    updateUser(id: $id, username: $username, email: $email, password: $password, firstname: $firstname, lastname: $lastname ) {
    status
    msg
    }
  }
`;

export const DELETE_USER = gql`
  mutation deleteUser($id: Int!) {
    deleteUser(id: $id) {
    status
    msg
    }
  }
`;

export const UPDATE_PASSWORD = gql`
  mutation updatePassword($id: Int!, $password: String!, $newpassword: String!) {
    updatePassword(id: $id, password: $password, newpassword: $newpassword) {
    status
    msg
    }
  }
`;
