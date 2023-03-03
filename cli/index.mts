import truck from "../src/utils/truck.mjs";
import yargs from "yargs";
import { exec } from "child_process";

type Args = Awaited<typeof args>;

const args = yargs(process.argv.slice(2))
  .option("server", {
    alias: "s",
    describe: "Run server",
    type: "boolean",
  })
  .option("port", {
    alias: "p",
    describe: "-p <port number>",
    type: "number",
    requiresArg: true,
  })
  .alias("help", "h")
  .alias("version", "v")
  .check((args) => {
    if (args.port && !args.server) {
      console.log("port option is useless. because server is not running");
    }
    return true;
  }).argv;

truck(args as Args);

export type { Args };

export default () => exec("yarn cli:invoke");

// export default args;
