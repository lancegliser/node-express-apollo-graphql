module.exports = {
  preset: "ts-jest",
  roots: ["./src/"],
  testEnvironment: "node",
  globalSetup: "./tests/jest/jest.setup.ts",
  // setupFilesAfterEnv: ["./tests/jest/jest.setupAfterEnv.ts"],
};
