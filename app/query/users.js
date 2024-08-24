import { gql } from "@apollo/client";

export const LOGIN = gql`
mutation Mutation($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    accessToken
    _id
    email
  }
}`
export const LOGIN_PROFILE = gql`
query UserLoginProfile {
  userLoginProfile {
    user {
      _id
      name
      username
      email
    }
    followers {
      _id
      name
      username
      email
    }
    followings {
      _id
      name
      username
      email
    }
  }
}`

export const SEARCH_USER = gql`
query UserByUsername($username: String) {
  userByUsername(username: $username) {
    _id
    name
    username
    email
  }
}`