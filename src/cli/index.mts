import isError from "lodash/isError.js";
import args from "./args.mjs";
import TruckDriver from "../utils/drive.mjs";
import { __PORT__ } from "../constants/global.constants.mjs";
import Logger from "../log/index.mjs";
import server from "../services/index.js";

class TruckCommand extends TruckDriver {
  private port: number;

  constructor() {
    super(args);

    this.port = args.port ?? __PORT__;
  }

  public async invoke() {
    const logger = new Logger();

    try {
      const process$ = logger.process(200);

      await this.run();

      process$.stop();

      if (!args.server) return process.exit(0);

      server(this.port);

      const endpoints = [`http://localhost:${this.port}`];

      logger.server(202, endpoints, { port: this.port });
    } catch (error) {
      if (isError(error)) {
        logger.fail(203, { error: error.message });
        process.exit(0);
      }
      throw error;
    }
  }
}

export default TruckCommand;
