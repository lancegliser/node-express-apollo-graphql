module.exports = {
  preset: "ts-jest",
  roots: ["./src/"],
  testEnvironment: "node",
  globalSetup: "./tests/jest/jest.setup.ts",
  setupFiles: ["<rootDir>/tests/jest/environment.ts"],
};
