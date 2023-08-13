import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig,
} from "graphql";
import { GraphQLContext } from "../components/context";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: NonNullable<T[P]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  JSON: { input: any; output: any };
  Upload: { input: any; output: any };
};

/** A base definition authentication actors. Customized from the auth-api generated types. */
export type AuthenticationIdentity = ICreated &
  IDisplayImage &
  IDisplayName &
  IId &
  IUpdated & {
    __typename?: "AuthenticationIdentity";
    /**
     * True if the Identity is active. False if the User has been deactivated.
     * Deactivated Users will not be able to login. Entities will always be active.
     */
    active: Scalars["Boolean"]["output"];
    /** ISO date time string for the time this resource was created */
    createdAt?: Maybe<Scalars["String"]["output"]>;
    /** Unique identifier for users that created this resource */
    createdBy?: Maybe<Scalars["String"]["output"]>;
    /** A public url name safe to display in any HTML context */
    displayImageUrl?: Maybe<Scalars["String"]["output"]>;
    /** A preformatted name safe to display in any HTML context */
    displayName: Scalars["String"]["output"];
    /** Email address. Users will have emails, entities will not. */
    email?: Maybe<Scalars["String"]["output"]>;
    /** The primary id for this type. Typically a namespaced chain of methods, providers, and unique ids. */
    id: Scalars["ID"]["output"];
    /** The string will be in an IANA time zone format. https://www.iana.org/time-zones */
    timezone?: Maybe<Scalars["String"]["output"]>;
    /** ISO date time string for the time this resource was created */
    updatedAt?: Maybe<Scalars["String"]["output"]>;
    /** Unique identifier for users that created this resource */
    updatedBy?: Maybe<Scalars["String"]["output"]>;
  };

export enum AuthenticationRole {
  Anonymous = "Anonymous",
  Authenticated = "Authenticated",
}

export type ICreated = {
  /** ISO date time string for the time this resource was created */
  createdAt?: Maybe<Scalars["String"]["output"]>;
  /** Unique identifier for users that created this resource */
  createdBy?: Maybe<Scalars["String"]["output"]>;
};

export type IDisplayImage = {
  /** A public url name safe to display in any HTML context */
  displayImageUrl?: Maybe<Scalars["String"]["output"]>;
};

export type IDisplayName = {
  /** A preformatted display name safe to display in HTML context */
  displayName?: Maybe<Scalars["String"]["output"]>;
};

export type IId = {
  /** The primary id for this type. Typically a namespaced chain of methods, providers, and unique ids. */
  id: Scalars["ID"]["output"];
};

/** Provides the required attributes to support automatic .fetchMore() offset pagination merge strategies */
export type IOffsetPaging = {
  /** The number of records in this set */
  limit: Scalars["Int"]["output"];
  /** The index of the first item in this result set from the larger collection */
  offset: Scalars["Int"]["output"];
  /** The total number of records available in the larger collection */
  total: Scalars["Int"]["output"];
};

export type IUpdated = {
  /** ISO date time string for the time this resource was created */
  updatedAt?: Maybe<Scalars["String"]["output"]>;
  /** Unique identifier for users that created this resource */
  updatedBy?: Maybe<Scalars["String"]["output"]>;
};

export type Mutation = {
  __typename?: "Mutation";
  /** Provides name spaced users functionality */
  users: UsersMutations;
};

export type Query = {
  __typename?: "Query";
  /** A base definition authentication actors */
  self?: Maybe<AuthenticationIdentity>;
  system: System;
  /** Provides name spaced users functionality */
  users: UsersQuery;
};

export enum SortDirection {
  Ascending = "Ascending",
  Descending = "Descending",
}

export type System = {
  __typename?: "System";
  /** Returns configurations applicable to the application for the current environment */
  config: SystemConfig;
  /** Provides a list of environmental variables */
  environment: Scalars["JSON"]["output"];
};

/** Provides environment user agnostic system configurations */
export type SystemConfig = {
  __typename?: "SystemConfig";
  loginUrl: Scalars["String"]["output"];
  logoutUrl: Scalars["String"]["output"];
  /** The current time. A mock field likely to be replaced in application specific implementations. */
  timestamp: Scalars["String"]["output"];
};

export type User = ICreated &
  IDisplayName &
  IUpdated & {
    __typename?: "User";
    /** ISO date time string for the time this resource was created */
    createdAt?: Maybe<Scalars["String"]["output"]>;
    /** Unique identifier for users that created this resource */
    createdBy?: Maybe<Scalars["String"]["output"]>;
    /** A preformatted name safe to display in any HTML context */
    displayName?: Maybe<Scalars["String"]["output"]>;
    /** Email addresses */
    email?: Maybe<Scalars["String"]["output"]>;
    /** Unique identifier for the resource across all collections */
    id: Scalars["ID"]["output"];
    /** Determines if a users is a service account supporting applications */
    isServiceAccount?: Maybe<Scalars["Boolean"]["output"]>;
    /** ISO date time string for the time this resource was created */
    updatedAt?: Maybe<Scalars["String"]["output"]>;
    /** Unique identifier for users that created this resource */
    updatedBy?: Maybe<Scalars["String"]["output"]>;
  };

export type UserInput = {
  /** A preformatted name safe to display in any HTML context */
  displayName?: InputMaybe<Scalars["String"]["input"]>;
  /** Email addresses */
  email?: InputMaybe<Scalars["String"]["input"]>;
  /** Unique identifier for the resource across all collections */
  id: Scalars["ID"]["input"];
};

/** Provides name spaced users functionality */
export type UsersMutations = {
  __typename?: "UsersMutations";
  /** Saves the user and returns the updated copy */
  saveUser?: Maybe<User>;
};

/** Provides name spaced users functionality */
export type UsersMutationsSaveUserArgs = {
  user: UserInput;
};

/** Provides name spaced users functionality */
export type UsersQuery = {
  __typename?: "UsersQuery";
  /** Returns the user record matching the provided id */
  getById?: Maybe<User>;
  search: UsersSearchPagedResponse;
};

/** Provides name spaced users functionality */
export type UsersQueryGetByIdArgs = {
  id: Scalars["ID"]["input"];
};

/** Provides name spaced users functionality */
export type UsersQuerySearchArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order?: InputMaybe<UsersSearchOrdering>;
};

export enum UsersSearchOrderMethod {
  CreatedAt = "CreatedAt",
  DisplayName = "DisplayName",
  Id = "Id",
}

export type UsersSearchOrdering = {
  /** Default: Asc */
  direction?: InputMaybe<SortDirection>;
  /** One or more fields to be used in sort direction */
  method?: InputMaybe<UsersSearchOrderMethod>;
};

export type UsersSearchPagedResponse = IOffsetPaging & {
  __typename?: "UsersSearchPagedResponse";
  items: Array<User>;
  /** The number of records in this set. Default: 50. */
  limit: Scalars["Int"]["output"];
  /** The index of the first item in this result set from the larger collection. Default: 0. */
  offset: Scalars["Int"]["output"];
  /** The total number of records available in the larger collection */
  total: Scalars["Int"]["output"];
};

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {},
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo,
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo,
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {},
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

/** Mapping of interface types */
export type ResolversInterfaceTypes<RefType extends Record<string, unknown>> = {
  ICreated: AuthenticationIdentity | User;
  IDisplayImage: AuthenticationIdentity;
  IDisplayName: AuthenticationIdentity | User;
  IId: AuthenticationIdentity;
  IOffsetPaging: UsersSearchPagedResponse;
  IUpdated: AuthenticationIdentity | User;
};

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AuthenticationIdentity: ResolverTypeWrapper<AuthenticationIdentity>;
  AuthenticationRole: AuthenticationRole;
  Boolean: ResolverTypeWrapper<Scalars["Boolean"]["output"]>;
  ICreated: ResolverTypeWrapper<
    ResolversInterfaceTypes<ResolversTypes>["ICreated"]
  >;
  ID: ResolverTypeWrapper<Scalars["ID"]["output"]>;
  IDisplayImage: ResolverTypeWrapper<
    ResolversInterfaceTypes<ResolversTypes>["IDisplayImage"]
  >;
  IDisplayName: ResolverTypeWrapper<
    ResolversInterfaceTypes<ResolversTypes>["IDisplayName"]
  >;
  IId: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>["IId"]>;
  IOffsetPaging: ResolverTypeWrapper<
    ResolversInterfaceTypes<ResolversTypes>["IOffsetPaging"]
  >;
  IUpdated: ResolverTypeWrapper<
    ResolversInterfaceTypes<ResolversTypes>["IUpdated"]
  >;
  Int: ResolverTypeWrapper<Scalars["Int"]["output"]>;
  JSON: ResolverTypeWrapper<Scalars["JSON"]["output"]>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  SortDirection: SortDirection;
  String: ResolverTypeWrapper<Scalars["String"]["output"]>;
  System: ResolverTypeWrapper<System>;
  SystemConfig: ResolverTypeWrapper<SystemConfig>;
  Upload: ResolverTypeWrapper<Scalars["Upload"]["output"]>;
  User: ResolverTypeWrapper<User>;
  UserInput: UserInput;
  UsersMutations: ResolverTypeWrapper<UsersMutations>;
  UsersQuery: ResolverTypeWrapper<UsersQuery>;
  UsersSearchOrderMethod: UsersSearchOrderMethod;
  UsersSearchOrdering: UsersSearchOrdering;
  UsersSearchPagedResponse: ResolverTypeWrapper<UsersSearchPagedResponse>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AuthenticationIdentity: AuthenticationIdentity;
  Boolean: Scalars["Boolean"]["output"];
  ICreated: ResolversInterfaceTypes<ResolversParentTypes>["ICreated"];
  ID: Scalars["ID"]["output"];
  IDisplayImage: ResolversInterfaceTypes<ResolversParentTypes>["IDisplayImage"];
  IDisplayName: ResolversInterfaceTypes<ResolversParentTypes>["IDisplayName"];
  IId: ResolversInterfaceTypes<ResolversParentTypes>["IId"];
  IOffsetPaging: ResolversInterfaceTypes<ResolversParentTypes>["IOffsetPaging"];
  IUpdated: ResolversInterfaceTypes<ResolversParentTypes>["IUpdated"];
  Int: Scalars["Int"]["output"];
  JSON: Scalars["JSON"]["output"];
  Mutation: {};
  Query: {};
  String: Scalars["String"]["output"];
  System: System;
  SystemConfig: SystemConfig;
  Upload: Scalars["Upload"]["output"];
  User: User;
  UserInput: UserInput;
  UsersMutations: UsersMutations;
  UsersQuery: UsersQuery;
  UsersSearchOrdering: UsersSearchOrdering;
  UsersSearchPagedResponse: UsersSearchPagedResponse;
};

export type AuthDirectiveArgs = {
  requires?: Maybe<AuthenticationRole>;
};

export type AuthDirectiveResolver<
  Result,
  Parent,
  ContextType = GraphQLContext,
  Args = AuthDirectiveArgs,
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type AuthenticationIdentityResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes["AuthenticationIdentity"] = ResolversParentTypes["AuthenticationIdentity"],
> = {
  active?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  createdAt?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  createdBy?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  displayImageUrl?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  displayName?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  timezone?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  updatedAt?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  updatedBy?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ICreatedResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes["ICreated"] = ResolversParentTypes["ICreated"],
> = {
  __resolveType: TypeResolveFn<
    "AuthenticationIdentity" | "User",
    ParentType,
    ContextType
  >;
  createdAt?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  createdBy?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
};

export type IDisplayImageResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes["IDisplayImage"] = ResolversParentTypes["IDisplayImage"],
> = {
  __resolveType: TypeResolveFn<
    "AuthenticationIdentity",
    ParentType,
    ContextType
  >;
  displayImageUrl?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
};

export type IDisplayNameResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes["IDisplayName"] = ResolversParentTypes["IDisplayName"],
> = {
  __resolveType: TypeResolveFn<
    "AuthenticationIdentity" | "User",
    ParentType,
    ContextType
  >;
  displayName?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
};

export type IIdResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes["IId"] = ResolversParentTypes["IId"],
> = {
  __resolveType: TypeResolveFn<
    "AuthenticationIdentity",
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
};

export type IOffsetPagingResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes["IOffsetPaging"] = ResolversParentTypes["IOffsetPaging"],
> = {
  __resolveType: TypeResolveFn<
    "UsersSearchPagedResponse",
    ParentType,
    ContextType
  >;
  limit?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  offset?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  total?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
};

export type IUpdatedResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes["IUpdated"] = ResolversParentTypes["IUpdated"],
> = {
  __resolveType: TypeResolveFn<
    "AuthenticationIdentity" | "User",
    ParentType,
    ContextType
  >;
  updatedAt?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  updatedBy?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
};

export interface JsonScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["JSON"], any> {
  name: "JSON";
}

export type MutationResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes["Mutation"] = ResolversParentTypes["Mutation"],
> = {
  users?: Resolver<ResolversTypes["UsersMutations"], ParentType, ContextType>;
};

export type QueryResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes["Query"] = ResolversParentTypes["Query"],
> = {
  self?: Resolver<
    Maybe<ResolversTypes["AuthenticationIdentity"]>,
    ParentType,
    ContextType
  >;
  system?: Resolver<ResolversTypes["System"], ParentType, ContextType>;
  users?: Resolver<ResolversTypes["UsersQuery"], ParentType, ContextType>;
};

export type SystemResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes["System"] = ResolversParentTypes["System"],
> = {
  config?: Resolver<ResolversTypes["SystemConfig"], ParentType, ContextType>;
  environment?: Resolver<ResolversTypes["JSON"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SystemConfigResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes["SystemConfig"] = ResolversParentTypes["SystemConfig"],
> = {
  loginUrl?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  logoutUrl?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface UploadScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["Upload"], any> {
  name: "Upload";
}

export type UserResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes["User"] = ResolversParentTypes["User"],
> = {
  createdAt?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  createdBy?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  displayName?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  email?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  isServiceAccount?: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType
  >;
  updatedAt?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  updatedBy?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UsersMutationsResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes["UsersMutations"] = ResolversParentTypes["UsersMutations"],
> = {
  saveUser?: Resolver<
    Maybe<ResolversTypes["User"]>,
    ParentType,
    ContextType,
    RequireFields<UsersMutationsSaveUserArgs, "user">
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UsersQueryResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes["UsersQuery"] = ResolversParentTypes["UsersQuery"],
> = {
  getById?: Resolver<
    Maybe<ResolversTypes["User"]>,
    ParentType,
    ContextType,
    RequireFields<UsersQueryGetByIdArgs, "id">
  >;
  search?: Resolver<
    ResolversTypes["UsersSearchPagedResponse"],
    ParentType,
    ContextType,
    Partial<UsersQuerySearchArgs>
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UsersSearchPagedResponseResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes["UsersSearchPagedResponse"] = ResolversParentTypes["UsersSearchPagedResponse"],
> = {
  items?: Resolver<Array<ResolversTypes["User"]>, ParentType, ContextType>;
  limit?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  offset?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  total?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = GraphQLContext> = {
  AuthenticationIdentity?: AuthenticationIdentityResolvers<ContextType>;
  ICreated?: ICreatedResolvers<ContextType>;
  IDisplayImage?: IDisplayImageResolvers<ContextType>;
  IDisplayName?: IDisplayNameResolvers<ContextType>;
  IId?: IIdResolvers<ContextType>;
  IOffsetPaging?: IOffsetPagingResolvers<ContextType>;
  IUpdated?: IUpdatedResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  System?: SystemResolvers<ContextType>;
  SystemConfig?: SystemConfigResolvers<ContextType>;
  Upload?: GraphQLScalarType;
  User?: UserResolvers<ContextType>;
  UsersMutations?: UsersMutationsResolvers<ContextType>;
  UsersQuery?: UsersQueryResolvers<ContextType>;
  UsersSearchPagedResponse?: UsersSearchPagedResponseResolvers<ContextType>;
};

export type DirectiveResolvers<ContextType = GraphQLContext> = {
  auth?: AuthDirectiveResolver<any, any, ContextType>;
};
