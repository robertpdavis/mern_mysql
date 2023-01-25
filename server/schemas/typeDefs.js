import { gql } from 'apollo-server-express';

const typeDefs = gql`

scalar Date

type Auth {
    token: ID!
    user: User
    status: Boolean
    msg: String
}

type User {
  id: Int
  username: String
  email: String
  password: String
  firstname: String
  lastname: String
}

type Users {
  users: [User]
  count: Int
}
 
type Expense {
  id: Int
}

type Income {
  id: Int
}

type Log {
  id: Int
}

type Response {
  status: Boolean
  msg: String
}

type Query {
  getUser(id: Int!): User
}

type Query {
  getUsers(pageIndex: Int, pageSize: Int): Users
}

type Mutation {
  createUser(username: String!, email: String!, password: String!, firstname: String!, lastname: String!): Auth
  loginUser(username: String!, password: String!): Auth
  updateUser(id: Int, username: String, email: String, password: String, firstname: String, lastname: String): Response
  deleteUser(id: Int!): Response
  updatePassword(id: Int!, password: String!, newpassword: String!): Response
}
`;

export default typeDefs;
