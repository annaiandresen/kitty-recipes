import { gql } from '@merged/solid-apollo'
import { USER_FRAGMENT } from './fragments';

export const GET_USERS = gql`
${USER_FRAGMENT}
query Users {
    users {
        ...UserFragment
    }
  }
`;

export const GET_USER = gql`
query User($id: ID, $email: String) {
    user(email: $email, id: $id) {
      email
    }
  }
`;