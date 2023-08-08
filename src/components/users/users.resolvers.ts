import {
  MutationResolvers,
  QueryResolvers,
  Resolvers,
  UserResolvers,
  UsersMutationsResolvers,
  UsersQueryResolvers,
} from "../../generated/types";
import { usersSample } from "./users.mock";
import { GraphQLError } from "graphql";
import { getUserById } from "./users.utils";
import { delay } from "../../utilities/timers";

export const addResolvers = (resolvers: Resolvers): Resolvers => {
  // Expand on the existing resolvers to ensure we don't break any
  resolvers.Query = { ...resolvers.Query, ...queryResolvers };
  resolvers.Mutation = { ...resolvers.Mutation, ...mutationResolvers };
  // Provide our module specific implementations
  resolvers.UsersQuery = usersResolvers;
  resolvers.UsersMutations = usersMutations;
  resolvers.User = userResolvers;
  return resolvers;
};

const queryResolvers: QueryResolvers = {
  // @ts-expect-error A small hack that provides pass through enabling name spaces
  users: () => ({}),
};

const mutationResolvers: MutationResolvers = {
  // A small hack that provides pass through enabling name spaces
  users: () => ({}),
};

const usersResolvers: UsersQueryResolvers = {
  search: async (_, args) => {
    const limit = args.limit || 10;
    const offset = args.offset || 0;
    let sortedUsers = !args.order
      ? usersSample
      : usersSample.sort((a, b) => {
          const ascValue = args.order?.direction === "Descending" ? -1 : 1;
          const descValue = ascValue * -1;
          switch (args.order?.method) {
            case "DisplayName":
              const displayNameA = a.displayName || "";
              const displayNameB = b.displayName || "";
              return displayNameA > displayNameB ? ascValue : descValue;
            case "CreatedAt":
              const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
              const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
              return timeA > timeB ? ascValue : descValue;
            case "Id":
            default:
              return a.id > b.id ? ascValue : descValue;
          }
        });
    const filteredUsers = sortedUsers.slice(offset, limit + offset);

    // Fake some delay to allow animations to show
    await delay(Math.max(200, Math.random() * 500));

    return {
      items: filteredUsers,
      limit: limit,
      offset: offset,
      total: sortedUsers.length,
    };
  },
  getById: async (_, { id }) => {
    const user = getUserById(id);
    if (!user) {
      throw new GraphQLError(`User ${id} not found`);
    }
    return user;
  },
};

const userResolvers: UserResolvers = {
  isServiceAccount: (user) => user.isServiceAccount || !user.email,
};

const usersMutations: UsersMutationsResolvers = {
  saveUser: async (parent, { user: updates }) => {
    const { id } = updates;
    const user = getUserById(id);
    if (!user) {
      throw new GraphQLError(`User ${id} not found`);
    }

    // Normally you'd need to save it to a database, but we're mocking here.
    // Fake some delay to allow animations to show
    await delay(Math.max(200, Math.random() * 500));
    return { ...user, ...updates };
  },
};
