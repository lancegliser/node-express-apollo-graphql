import {
  AuthenticationIdentity,
  MutationResolvers,
  QueryResolvers,
  Resolvers,
  User,
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
    return context.authentication?.identity?.id === id
      ? getUserFromIdentity(context.authentication.identity)
      : null;
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
    const identity = context.authentication?.identity;
    if (!identity) {
      throw new Error("identity is undefined");
    }
    return { ...getUserFromIdentity(identity), ...updates };
  },
};

const getUserFromIdentity = (identity: AuthenticationIdentity): User => ({
  createdAt: identity.createdAt,
  createdBy: identity.createdBy,
  displayName: identity.displayName,
  email: identity.email,
  id: identity.id,
  isServiceAccount: false,
  updatedAt: identity.updatedAt,
  updatedBy: identity.updatedBy,
});
