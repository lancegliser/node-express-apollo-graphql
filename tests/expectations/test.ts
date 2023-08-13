import {
  expectBooleanIfPresent,
  expectDateHTTPString,
  expectDateISOString,
  expectDateRFC2822String,
  expectDateSQLString,
  ExpectDateString,
  expectNumberArray,
  expectNumberIfTruthy,
  expectStringArray,
  expectStringIfTruthy,
} from "./index";
import { DateTime } from "luxon";

describe("expectations", () => {
  describe("expectBooleanIfPresent", () => {
    it("should accept any boolean values", () => {
      expectBooleanIfPresent(false);
      expectBooleanIfPresent(true);
    });

    it("should allow for null", () => {
      expectBooleanIfPresent(null);
    });

    it("should allow for undefined", () => {
      expectBooleanIfPresent(undefined);
    });

    it("should throw an error for strings", () => {
      expect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expectBooleanIfPresent("asdf" as any);
      }).toThrow();
    });

    it("should throw an error for numbers", () => {
      expect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expectBooleanIfPresent(1234 as any);
      }).toThrow();
    });

    it("should throw an error for objects", () => {
      expect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expectBooleanIfPresent({} as any);
      }).toThrow();
    });

    it("should throw an error for arrays", () => {
      expect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expectBooleanIfPresent([] as any);
      }).toThrow();
    });
  });

  describe("expectStringIfTruthy", () => {
    it("should accept any string values", () => {
      expectStringIfTruthy("asdf");
    });

    it("should allow for null", () => {
      expectStringIfTruthy(null);
    });

    it("should allow for undefined", () => {
      expectStringIfTruthy(undefined);
    });

    it("should throw an error for booleans", () => {
      expect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expectStringIfTruthy(true as any);
      }).toThrow();
    });

    it("should throw an error for numbers", () => {
      expect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expectStringIfTruthy(1234 as any);
      }).toThrow();
    });

    it("should throw an error for objects", () => {
      expect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expectStringIfTruthy({} as any);
      }).toThrow();
    });

    it("should throw an error for arrays", () => {
      expect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expectStringIfTruthy([] as any);
      }).toThrow();
    });
  });

  describe("expectNumberIfTruthy", () => {
    it("should accept any number values", () => {
      expectNumberIfTruthy(1234);
    });

    it("should allow for null", () => {
      expectNumberIfTruthy(null);
    });

    it("should allow for undefined", () => {
      expectNumberIfTruthy(undefined);
    });

    it("should throw an error for booleans", () => {
      expect(() => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expectNumberIfTruthy(true as any);
      }).toThrow();
    });

    it("should throw an error for strings", () => {
      expect(() => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expectNumberIfTruthy("asdf" as any);
      }).toThrow();
    });

    it("should throw an error for objects", () => {
      expect(() => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expectNumberIfTruthy({} as any);
      }).toThrow();
    });

    it("should throw an error for arrays", () => {
      expect(() => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expectNumberIfTruthy([] as any);
      }).toThrow();
    });
  });

  describe("expectStringArray", () => {
    it("should accept a string array", () => {
      expectStringArray(["qwer", "asdf", "zxcv"]);
    });

    it("should throw an error for undefined", () => {
      expect(() => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expectStringArray(undefined as any);
      });
    });

    it("should throw an error for null", () => {
      expect(() => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expectStringArray(undefined as any);
      });
    });

    it("should throw an error for an object", () => {
      expect(() => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expectStringArray({} as any);
      }).toThrow();
    });

    it("should throw an error for an array of non-strings", () => {
      expect(() => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expectStringArray([1234 as any]);
      }).toThrow();
      expect(() => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expectStringArray([true as any]);
      }).toThrow();
    });
  });

  describe("expectNumberArray", () => {
    it("should accept a number array", () => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expectNumberArray([1234 as any]);
    });

    it("should accept undefined", () => {
      expect(() => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expectNumberArray(undefined as any);
      });
    });

    it("should accept null", () => {
      expect(() => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expectNumberArray(undefined as any);
      });
    });

    it("should throw an error for an object", () => {
      expect(() => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expectNumberArray({} as any);
      }).toThrow();
    });

    it("should throw an error for an array of non-number", () => {
      expect(() => {
        expectNumberArray(["qwer", "asdf", "zxcv"]);
      }).toThrow();
      expect(() => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expectNumberArray([true as any]);
      }).toThrow();
    });
  });

  describe("expectDateStrings", () => {
    describe("expectDateISOString", () => {
      const date = "2016-05-25T09:24:15.123";
      it("should consider a date in the proper format valid", () => {
        expectDateISOString(date);
      });

      it("should throw for invalid values", () =>
        expectInvalidValuesToThrow(expectDateISOString));
      it("should throw for out of bounds values", () =>
        expectBoundsToThrow(expectDateISOString, date, DateTime.fromISO(date)));
    });

    describe("expectDateHTTPString", () => {
      const date = "Sunday, 06-Nov-94 08:49:37 GMT";
      it("should consider a date in the proper format valid", () => {
        expectDateHTTPString(date);
      });

      it("should throw for invalid values", () =>
        expectInvalidValuesToThrow(expectDateHTTPString));
      it("should throw for out of bounds values", () =>
        expectBoundsToThrow(
          expectDateHTTPString,
          date,
          DateTime.fromHTTP(date)
        ));
    });

    describe("expectDateRFC2822String", () => {
      const date = "Tue, 01 Nov 2016 13:23:12 +0630";
      it("should consider a date in the proper format valid", () => {
        expectDateRFC2822String(date);
      });

      it("should throw for invalid values", () =>
        expectInvalidValuesToThrow(expectDateRFC2822String));
      it("should throw for out of bounds values", () =>
        expectBoundsToThrow(
          expectDateRFC2822String,
          date,
          DateTime.fromRFC2822(date)
        ));
    });

    describe("expectDateSQLString", () => {
      const date = "2017-05-15 09:24:15";
      it("should consider a date in the proper format valid", () => {
        expectDateSQLString(date);
      });

      it("should throw for invalid values", () =>
        expectInvalidValuesToThrow(expectDateSQLString));
      it("should throw for out of bounds values", () =>
        expectBoundsToThrow(expectDateSQLString, date, DateTime.fromSQL(date)));
    });

    // Shared date testing functions
    const expectInvalidValuesToThrow = (method: ExpectDateString) => {
      // @ts-expect-error Doing this on purpose for testing
      expect(() => method(undefined)).toThrow();
      // @ts-expect-error Doing this on purpose for testing
      expect(() => method(null)).toThrow();
      expect(() => method(0 as unknown as string)).toThrow();
      expect(() => method("I am a string")).toThrow();
    };

    const expectBoundsToThrow = (
      method: ExpectDateString,
      string: string,
      /** The string, converted to DateTime as we don't know the format in this function */
      dateTime: DateTime
    ) => {
      const beforeMinimumDateTime = dateTime.minus({ day: 1 }).toJSDate();
      const afterMinimumDateTime = dateTime.plus({ day: 1 }).toJSDate();
      const beforeMaximumDateTime = dateTime.minus({ day: 1 }).toJSDate();
      const afterMaximumDateTime = dateTime.plus({ day: 1 }).toJSDate();

      // Within bounds tests
      expect(() => {
        method(string, { minimum: beforeMinimumDateTime });
      }).not.toThrow();
      expect(() => {
        method(string, { maximum: afterMaximumDateTime });
      }).not.toThrow();
      expect(() => {
        method(string, {
          minimum: beforeMinimumDateTime,
          maximum: afterMaximumDateTime,
        });
      }).not.toThrow();
      // Outside bounds tests
      expect(() => {
        method(string, { minimum: afterMinimumDateTime });
      }).toThrow();
      expect(() => {
        method(string, { maximum: beforeMaximumDateTime });
      }).toThrow();
      expect(() => {
        method(string, {
          minimum: afterMinimumDateTime,
          maximum: beforeMaximumDateTime,
        });
      }).toThrow();
    };
  });
});
