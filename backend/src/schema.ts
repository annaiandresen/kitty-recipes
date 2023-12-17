import { createSchema } from 'graphql-yoga'
import { DateTimeResolver } from 'graphql-scalars'
import { Context } from './context'
import { UUID } from 'node:crypto'

export const typeDefs = `
  type Mutation {
    signupUser(data: UserCreateInput!): User!
    deleteUser(id: ID, email: String): User!
    makeAdmin(id: ID, email: String): User!
  }

  type Query {
    users: [User!]!
    user(id: ID, email: String): User
  }

  scalar DateTime

  type User {
    email: String!
    id: ID!
    firstName: String!
    lastName: String!
    createdAt: DateTime!
    isAdmin: Boolean!
  }

  input UserCreateInput {
    email: String!
    firstName: String!
    lastName: String!
  }

  input UserInput {
    id: ID
    email: String
  }

`

export const resolvers = {
  DateTime: DateTimeResolver,
  Query: {
    users: (_parent, _args, context: Context) => {
      return context.prisma.user.findMany()
    },
    user: (_parent, args: UserInput, context: Context) => {
      if (!args.id && !args.email) {
        throw new Error('id or email is required')
      }
      return context.prisma.user.findUnique({
        where: {
          id: args?.id || undefined,
          email: args.email || undefined,
        },
      })
    },
  },
  Mutation: {
    signupUser: async (
      _parent,
      args: { data: UserCreateInput },
      context: Context,
    ) => {
      if (!args.data.email) {
        throw new Error('Email is required')
      }
      if (!args.data.lastName) {
        throw new Error('Last name is required')
      }
      if (!args.data.firstName) {
        throw new Error('First name is required')
      }

      const user = await context.prisma.user.create({
        data: {
          firstName: args.data.firstName,
          lastName: args.data.lastName,
          email: args.data.email,
        },
      })
      console.log('User created:', user)
      return user
    },
    deleteUser: async (_parent, args: UserInput, context: Context) => {
      if (!args.id && !args.email) {
        throw new Error('id or email is required')
      }
      const deletedUser = await context.prisma.user.delete({
        where: {
          id: args?.id || undefined,
          email: args.email || undefined,
        },
      })
      console.log('User deleted:', deletedUser)
      return deletedUser
    },
    makeAdmin: async (_parent, args: UserInput, context: Context) => {
      if (!args.id && !args.email) {
        throw new Error('id or email is required')
      }
      const updatedUser = await context.prisma.user.update({
        where: {
          id: args?.id || undefined,
          email: args.email || undefined,
        },
        data: {
          isAdmin: true,
        },
      })
      console.log('User updated:', updatedUser)
      return updatedUser
    },
  },
}

interface UserCreateInput {
  email: string
  firstName: string
  lastName: string
}

interface UserInput {
  id?: UUID
  email?: string
}

export const schema = createSchema({
  typeDefs,
  resolvers,
})
