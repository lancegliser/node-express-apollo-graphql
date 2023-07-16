import {IDisplayName} from "../../src/generated/types";

export const expectDisplayName = (object: IDisplayName): void => {
    expect(object.displayName).toBeTruthy();
}