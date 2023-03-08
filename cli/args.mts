import yargs from "yargs";

const args = yargs(process.argv.slice(2))
  .option("input", {
    alias: "i",
    describe: "Config file path",
    type: "string",
    requiresArg: true,
  })
  .option("server", {
    alias: "s",
    describe: "Run server",
    type: "boolean",
  })
  .option("port", {
    alias: "p",
    describe: "Server specific port",
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
  })
  .parseSync();

export default args;
