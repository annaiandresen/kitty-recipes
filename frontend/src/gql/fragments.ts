import { gql } from '@merged/solid-apollo'


export const USER_FRAGMENT = gql`
fragment UserFragment on User {
    email
    id
    isAdmin
    firstName
    lastName
    createdAt
}
` 