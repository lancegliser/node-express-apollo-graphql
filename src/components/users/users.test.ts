import { User } from "../../generated/types";
import { expectDisplayName } from "../../../tests/expectations/interfaces";
import { expectStringIfTruthy } from "../../../tests/expectations";
import { print } from "graphql/index";
import gql from "graphql-tag";

describe("users", () => {
  it.skip("has a stub test", () => {});
});

export const UserFields = print(gql`
  fragment UserFields on User {
    createdAt
    createdBy
    displayName
    email
    id
    updatedAt
    updatedBy
    isServiceAccount
  }
`);

export const expectUser = (user: User): void => {
  expect(user.id).toBeTruthy();
  expect(user.createdAt).toBeTruthy();
  expect(user.createdBy).toBeTruthy();
  expectStringIfTruthy(user.email);
  expectStringIfTruthy(user.updatedAt);
  expectStringIfTruthy(user.updatedBy);
  expect(typeof user.isServiceAccount === "boolean").toBeTruthy();
  expectDisplayName(user);
};
