module.exports = async () => {
  process.env.LOG_LEVEL = "warn";
  process.env.NODE_ENV = "test";
  // await loadMockData();
};

export const loadMockData = async () => {
  // load data if you need it
};
