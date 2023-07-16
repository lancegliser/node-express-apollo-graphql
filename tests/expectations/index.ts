import { DateTime, Settings as LuxonSettings } from "luxon";

// Ensure invalid dates throw errors
LuxonSettings.throwOnInvalid = true;

export const expectBooleanIfPresent = (
  value: boolean | undefined | null
): void => {
  if (value === undefined || value === null) {
    return;
  }

  expect(typeof value === "boolean").toBeTruthy();
};

export const expectStringIfTruthy = (
  value: string | undefined | null,
  contains?: string
): void => {
  if (!value) {
    return;
  }

  expect(typeof value === "string").toBeTruthy();
  if (contains) {
    expect(value).toContain(contains);
  }
};

interface NumericBounds {
  minimum?: number;
  maximum?: number;
}

export const expectStringArray = (values: string[], minimum = 0): void => {
  expect(Array.isArray(values)).toBeTruthy();
  expect(values.length).toBeGreaterThanOrEqual(minimum);
  values.forEach((value) => {
    expect(typeof value === "string").toBeTruthy();
    expect(value).toBeTruthy();
  });
};

export const expectNumberIfTruthy = (
  value: number | undefined | null,
  bounds?: NumericBounds
): void => {
  if (!value) {
    return;
  }

  expect(typeof value === "number").toBeTruthy();
  if (bounds?.minimum) {
    expect(value).toBeGreaterThanOrEqual(bounds.minimum);
  }
  if (bounds?.maximum) {
    expect(value).toBeLessThanOrEqual(bounds.maximum);
  }
};

export const expectNumberArray = (
  values: string[],
  minimum = 0,
  bounds?: NumericBounds
): void => {
  expect(Array.isArray(values)).toBeTruthy();
  expect(values.length).toBeGreaterThanOrEqual(minimum);
  values.forEach((value) => {
    expect(typeof value === "number").toBeTruthy();
    expect(value).toBeTruthy();
    if (bounds?.minimum) {
      expect(value).toBeGreaterThanOrEqual(bounds.minimum);
    }
    if (bounds?.maximum) {
      expect(value).toBeLessThanOrEqual(bounds.maximum);
    }
  });
};

interface DateBounds {
  minimum?: Date;
  maximum?: Date;
}

export type ExpectDateString = (string: string, bounds?: DateBounds) => void;

/**
 * Eg: 2016-05-25T09:24:15.123
 * See all possible formats at: https://moment.github.io/luxon/#/parsing?id=iso-8601
 */
export const expectDateISOString: ExpectDateString = (string, bounds?) => {
  expect(typeof string).toBe("string");
  const dateTime = DateTime.fromISO(string);
  expectDateInBounds(dateTime, bounds);
};

/**
 * Eg: Sunday, 06-Nov-94 08:49:37 GMT
 * See all possible formats at: https://moment.github.io/luxon/#/parsing?id=http-and-rfc2822
 */
export const expectDateHTTPString: ExpectDateString = (string, bounds?) => {
  expect(typeof string).toBe("string");
  const dateTime = DateTime.fromHTTP(string);
  expectDateInBounds(dateTime, bounds);
};

/**
 * Eg: Tue, 01 Nov 2016 13:23:12 +0630
 * See all possible formats at: https://moment.github.io/luxon/#/parsing?id=http-and-rfc2822
 */
export const expectDateRFC2822String: ExpectDateString = (string, bounds?) => {
  expect(typeof string).toBe("string");
  const dateTime = DateTime.fromRFC2822(string);
  expectDateInBounds(dateTime, bounds);
};

/**
 * Eg: 2017-05-15 09:24:15
 * See all possible formats at: https://moment.github.io/luxon/#/parsing?id=sql
 */
export const expectDateSQLString: ExpectDateString = (string, bounds?) => {
  expect(typeof string).toBe("string");
  const dateTime = DateTime.fromSQL(string);
  expectDateInBounds(dateTime, bounds);
};

const expectDateInBounds = (dateTime: DateTime, bounds?: DateBounds): void => {
  if (bounds?.minimum) {
    const minimumDateTime = DateTime.fromJSDate(bounds.minimum);
    expect(dateTime.valueOf()).toBeGreaterThanOrEqual(
      minimumDateTime.valueOf()
    );
  }
  if (bounds?.maximum) {
    const maximumDateTime = DateTime.fromJSDate(bounds.maximum);
    expect(dateTime.valueOf()).toBeLessThanOrEqual(maximumDateTime.valueOf());
  }
};
