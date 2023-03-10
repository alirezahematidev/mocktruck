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
          type: "firstName",
        },
        age: {
          type: "number",
        },
        posts: {
          type: "array",
          schema: {
            name: {
              type: "fullName",
            },
          },
        },
      },
    },
    {
      name: "employees",
      schema: {
        firstname: {
          type: "firstName",
        },
        age: {
          type: "number",
        },
      },
    },
  ],
};
