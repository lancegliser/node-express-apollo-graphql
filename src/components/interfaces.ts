import { ICreated, IUpdated, Maybe, User } from "../generated/types";

// Utility methods

export const setAuditingProperties = (
  object: ICreated & IUpdated,
  user: User
): void => {
  setCreatedProperties(object, user);
  setUpdatedProperties(object, user);
};

export const setCreatedProperties = (object: ICreated, user: User): void => {
  if (!user.id) {
    throw new Error("users._key is undefined");
  }

  object.createdAt = object.createdAt || new Date().toISOString();
  object.createdBy = object.createdBy || `users/${user.id}`;
};

// Updated
export const setUpdatedProperties = (object: IUpdated, user: User): void => {
  if (!user.id) {
    throw new Error("users._key is undefined");
  }

  object.updatedAt = new Date().toISOString();
  object.updatedBy = `users/${user.id}`;
};

// Unique interfaces

interface FilterWithReturn<T> {
  removed: T[];
  retained: T[];
}

export const filterWithReturn = <T>(
  array: Maybe<T[]> | undefined,
  isMatchFunction: (item: T) => boolean
): FilterWithReturn<T> =>
  (array || []).reduce(
    (iterator: FilterWithReturn<T>, item): FilterWithReturn<T> => {
      if (isMatchFunction(item)) {
        iterator.removed.push(item);
        return iterator;
      }

      iterator.retained.push(item);
      return iterator;
    },
    {
      removed: [],
      retained: [],
    }
  );
