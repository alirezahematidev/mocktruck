import { Ora } from "ora";
import server from "../src/services/index.js";
import TruckDriver from "../src/utils/drive.mjs";
import { TruckProgram } from "../src/utils/helpers/program.mjs";
import args from "./args.mjs";
import { Chalk } from "chalk";
import boxen from "boxen";

const chalk = new Chalk({ level: 2 });

class TruckCommand extends TruckDriver {
  private ora: Ora;
  private port: number;

  constructor() {
    super(args);

    this.ora = new TruckProgram().instance();

    this.port = args.port ?? 6969;
  }

  public async invoke() {
    const ora = this.ora.start("data is generating...");
    try {
      await this.run();

      if (args.server) {
        server(this.port);

        const msg = chalk.cyan(`\nServer is running at port ${this.port}`);

        ora.succeed(chalk.green("data is generated successfully"));

        new TruckProgram({
          prefixText: msg,
          spinner: "simpleDots",
          color: "cyan",
        }).start(
          boxen(chalk.cyan(`http://localhost:${this.port}`), {
            borderColor: "cyan",
            borderStyle: "double",
            dimBorder: true,
            textAlignment: "center",
            padding: { bottom: 1, left: 6, right: 6, top: 1 },
            margin: { top: 1, bottom: 0, left: 0, right: 0 },
          }),
        );

        return;
      }

      ora.succeed(chalk.green("data is generated successfully"));
    } catch (error) {
      ora.fail(
        chalk.redBright("generating process is failed, ERROR: " + error),
      );
      process.exit(1);
    }
  }
}

export default TruckCommand;
