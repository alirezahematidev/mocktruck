import { Program } from "src/utils/helpers/program.mjs";
import yargs from "yargs";
import truck from "../src/utils/truck.mjs";

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

function runProgram() {
  Program.run();

  try {
    truck(args as Args, Program.instance());

    process.on("SIGINT", () => {
      Program.stop();
    });
  } catch (error) {
    Program.fail("failed!");
  }
}

export default runProgram;

export type { Args };
