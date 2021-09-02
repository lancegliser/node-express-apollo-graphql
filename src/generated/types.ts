import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { GraphQLContext } from '../components/context';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  JSON: any;
  Upload: any;
};

export type ICreated = {
  /** ISO date time string for the time this resource was created */
  createdAt?: Maybe<Scalars['String']>;
  /** Unique identifier for users that created this resource */
  createdBy?: Maybe<Scalars['ID']>;
};

export type IDisplayName = {
  /** A preformatted display name safe to display in HTML context */
  displayName?: Maybe<Scalars['String']>;
};

export type IUpdated = {
  /** ISO date time string for the time this resource was created */
  updatedAt?: Maybe<Scalars['String']>;
  /** Unique identifier for users that created this resource */
  updatedBy?: Maybe<Scalars['ID']>;
};


export type Mutation = {
  __typename?: 'Mutation';
  /** Provides name spaced users functionality */
  users: UsersMutations;
};

export type Query = {
  __typename?: 'Query';
  /** Returns the current user as defined by the authentication headers */
  self?: Maybe<User>;
  /** Provides name spaced users functionality */
  users: UsersQuery;
};


export type User = ICreated & IUpdated & IDisplayName & {
  __typename?: 'User';
  /** Unique identifier for the resource across all collections */
  id?: Maybe<Scalars['ID']>;
  /** ISO date time string for the time this resource was created */
  createdAt?: Maybe<Scalars['String']>;
  /** Unique identifier for users that created this resource */
  createdBy?: Maybe<Scalars['ID']>;
  /** ISO date time string for the time this resource was created */
  updatedAt?: Maybe<Scalars['String']>;
  /** Unique identifier for users that created this resource */
  updatedBy?: Maybe<Scalars['ID']>;
  /** A preformatted name safe to display in any HTML context */
  displayName?: Maybe<Scalars['String']>;
  /** Email addresses */
  email?: Maybe<Scalars['String']>;
  /** Determines if a users is a service account supporting applications */
  isServiceAccount?: Maybe<Scalars['Boolean']>;
};

export type UserInput = {
  /** Unique identifier for the resource across all collections */
  id: Scalars['ID'];
  /** A preformatted name safe to display in any HTML context */
  displayName?: Maybe<Scalars['String']>;
  /** Email addresses */
  email?: Maybe<Scalars['String']>;
};

/** Provides name spaced users functionality */
export type UsersMutations = {
  __typename?: 'UsersMutations';
  /** Saves the user and returns the updated copy */
  saveUser?: Maybe<User>;
};


/** Provides name spaced users functionality */
export type UsersMutationsSaveUserArgs = {
  user: UserInput;
};

/** Provides name spaced users functionality */
export type UsersQuery = {
  __typename?: 'UsersQuery';
  /** Returns the user record matching the provided id */
  getById?: Maybe<User>;
};


/** Provides name spaced users functionality */
export type UsersQueryGetByIdArgs = {
  id: Scalars['ID'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  ICreated: ResolversTypes['User'];
  String: ResolverTypeWrapper<Scalars['String']>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  IDisplayName: ResolversTypes['User'];
  IUpdated: ResolversTypes['User'];
  JSON: ResolverTypeWrapper<Scalars['JSON']>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  Upload: ResolverTypeWrapper<Scalars['Upload']>;
  User: ResolverTypeWrapper<User>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  UserInput: UserInput;
  UsersMutations: ResolverTypeWrapper<UsersMutations>;
  UsersQuery: ResolverTypeWrapper<UsersQuery>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  ICreated: ResolversParentTypes['User'];
  String: Scalars['String'];
  ID: Scalars['ID'];
  IDisplayName: ResolversParentTypes['User'];
  IUpdated: ResolversParentTypes['User'];
  JSON: Scalars['JSON'];
  Mutation: {};
  Query: {};
  Upload: Scalars['Upload'];
  User: User;
  Boolean: Scalars['Boolean'];
  UserInput: UserInput;
  UsersMutations: UsersMutations;
  UsersQuery: UsersQuery;
};

export type ICreatedResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ICreated'] = ResolversParentTypes['ICreated']> = {
  __resolveType: TypeResolveFn<'User', ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdBy?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
};

export type IDisplayNameResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['IDisplayName'] = ResolversParentTypes['IDisplayName']> = {
  __resolveType: TypeResolveFn<'User', ParentType, ContextType>;
  displayName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type IUpdatedResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['IUpdated'] = ResolversParentTypes['IUpdated']> = {
  __resolveType: TypeResolveFn<'User', ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedBy?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
};

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type MutationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  users?: Resolver<ResolversTypes['UsersMutations'], ParentType, ContextType>;
};

export type QueryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  self?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  users?: Resolver<ResolversTypes['UsersQuery'], ParentType, ContextType>;
};

export interface UploadScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Upload'], any> {
  name: 'Upload';
}

export type UserResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdBy?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedBy?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  displayName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  isServiceAccount?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UsersMutationsResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['UsersMutations'] = ResolversParentTypes['UsersMutations']> = {
  saveUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<UsersMutationsSaveUserArgs, 'user'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UsersQueryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['UsersQuery'] = ResolversParentTypes['UsersQuery']> = {
  getById?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<UsersQueryGetByIdArgs, 'id'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = GraphQLContext> = {
  ICreated?: ICreatedResolvers<ContextType>;
  IDisplayName?: IDisplayNameResolvers<ContextType>;
  IUpdated?: IUpdatedResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Upload?: GraphQLScalarType;
  User?: UserResolvers<ContextType>;
  UsersMutations?: UsersMutationsResolvers<ContextType>;
  UsersQuery?: UsersQueryResolvers<ContextType>;
};

