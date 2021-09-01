import {
  MutationResolvers,
  QueryResolvers,
  Resolvers,
  UsersMutationsResolvers,
  UsersQueryResolvers,
} from "../../generated/types";

export const addResolvers = (resolvers: Resolvers): Resolvers => {
  // Expand on the existing resolvers to ensure we don't break any
  resolvers.Query = { ...resolvers.Query, ...queryResolvers };
  resolvers.Mutation = { ...resolvers.Mutation, ...mutationResolvers };
  // Provide our module specific implementations
  resolvers.UsersQuery = usersQuery;
  resolvers.UsersMutations = usersMutations;
  return resolvers;
};

const queryResolvers: QueryResolvers = {
  self: (parent, args, context) => context.user,
  // A small hack that provides pass through enabling name spaces
  users: () => ({}),
};

const mutationResolvers: MutationResolvers = {
  // A small hack that provides pass through enabling name spaces
  users: () => ({}),
};

const usersQuery: UsersQueryResolvers = {
  getById: async (parent, { id }, context) => {
    // Normally, you'd get the user from the database
    // return context.userRepo.getById(id);

    // In this example, we have no DB, so we'll fake that bit
    return context.user.id === id ? context.user : null;
  },
};

const usersMutations: UsersMutationsResolvers = {
  saveUser: async (parent, { user: updates }, context) => {
    // Normally, you'd save the user in the database
    // const user = await context.userRepo.getById(updates.id);
    // ... Some permissions check
    // setUpdatedProperties(user, context.user);
    // return context.userRepo.save({...user, ...updates});

    // In this example, we have no DB, so we'll fake that bit.
    return { ...context.user, ...updates };
  },
};
