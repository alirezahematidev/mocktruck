import { cli } from "./cli/index.mjs";

export const configs: any = {
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
              type: "sentence",
            },
          },
        },
      },
    },
    {
      name: "employees",
      schema: {
        firstname: {
          type: "firstname",
        },
        age: {
          type: "digits",
        },
      },
    },
  ],
};

export const g = { name: "gholi" };
