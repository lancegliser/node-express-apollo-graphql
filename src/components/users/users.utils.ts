import { User } from "../../generated/types";
import { usersSample } from "./users.mock";

export const getUserById = (id: string): User | undefined =>
  usersSample.find((user) => user.id === id);
