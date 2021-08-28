import dotenv from "dotenv";

module.exports = async () => {
  const result = dotenv.config();
  if (result.error) {
    throw result;
  }

  process.env.NODE_ENV = "test";
};
