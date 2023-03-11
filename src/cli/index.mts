import isError from "lodash/isError.js";
import TruckDriver from "../utils/drive.mjs";
import Logger from "../log/index.mjs";

class TruckCommand extends TruckDriver {
  constructor() {
    super();
  }

  public async invoke() {
    const logger = new Logger();

    try {
      const process$ = logger.process(200);

      await this.run();

      process$.stop();
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
