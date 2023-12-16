import { gql } from "@merged/solid-apollo";
import { USER_FRAGMENT } from "./fragments";

export const CREATE_USER = gql`
${USER_FRAGMENT}
mutation CreateUser($data: UserCreateInput!) {
    signupUser(data: $data) {
        ...UserFragment
        }
    }
`;