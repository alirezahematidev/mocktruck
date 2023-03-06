import { Ora } from "ora";
import server from "../src/services/index.js";
import TruckDriver from "../src/utils/drive.mjs";
import { TruckProgram } from "../src/utils/helpers/program.mjs";
import args, { Args } from "./args.mjs";

class TruckCommand extends TruckDriver {
  private ora: Ora;

  constructor() {
    super();

    this.ora = new TruckProgram().instance();
  }

  public async invoke() {
    const ora = this.ora.start("data is generating...");
    try {
      await this.run();

      if (args.server) {
        server();

        this.ora
          .succeed("data is generated successfully")
          .start("Server is running...");

        return;
      }

      this.ora.succeed("data is generated successfully");
    } catch (error) {
      this.ora.fail("generating process is failed, ERROR: " + error);
      process.exit(1);
    }
  }
}

export default TruckCommand;
