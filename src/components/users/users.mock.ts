import { User } from "../../generated/types";

const admin = "user/lance";

export const usersSample: User[] = [
  {
    createdAt: "2023-07-26T22:56:17.610Z",
    createdBy: admin,
    displayName: "1234",
    email: "1234@gmail.com",
    id: "1234",
    updatedAt: "2023-07-26T22:56:17.610Z",
    updatedBy: admin,
  },
  {
    createdAt: "2023-07-26T22:56:17.610Z",
    createdBy: admin,
    displayName: "Tester Benington",
    email: "tester@park.co",
    id: "tester-benington",
    updatedAt: "2023-07-26T22:56:17.610Z",
    updatedBy: admin,
  },
  {
    createdAt: "2023-07-26T22:56:17.610Z",
    createdBy: admin,
    displayName: "Miyamoto Musashi",
    email: "miyamoto.musashi@slash.jp",
    id: "miyamoto.musashi",
    updatedAt: "2023-07-26T22:56:17.610Z",
    updatedBy: admin,
  },
  {
    createdAt: "2023-07-26T22:56:17.610Z",
    createdBy: admin,
    displayName: "Cuba access",
    email: undefined,
    id: "cuba-access",
    updatedAt: "2023-07-26T22:56:17.610Z",
    updatedBy: admin,
    isServiceAccount: true,
  },
];
