import Truck from "./src/interfaces/index.mjs";

export const configs: Truck.Configuration = {
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
