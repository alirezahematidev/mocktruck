import express from "express";
import router from "./routes.js";
import { __PORT__ } from "../constants/global.constants.mjs";
import Logger from "../log/index.mjs";

const app = express();

app.use(express.json());

app.use(router);

const server = (port?: number) => {
  const listener = app.listen(port ?? __PORT__);

  const logger = new Logger();

  process.on("SIGINT", () => {
    listener.close((error) => {
      try {
        if (error) {
          logger.fail(210, { error: error.message });
          process.exit(1);
        }

        logger.message(211);
        process.exit(0);
      } catch (error) {
        throw error;
      }
    });
  });
};

export default server;
