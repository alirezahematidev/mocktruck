import { cli } from "./cli/index.mjs";

const configs: any = {
  models: [
    {
      name: "users",
      schema: {
        email: {
          type: "email",
        },
        firstname: {
          type: "firstname",
        },
        age: {
          type: "digits",
        },
        posts: {
          type: "array",
          schema: {
            name: {
              type: "word",
            },
          },
        },
      },
    },
  ],
};

module.exports = configs;
