import { Chalk, ChalkInstance } from "chalk";
import ora, { Ora } from "ora";
import boxen, { Options } from "boxen";
import messages from "./messages/index.mjs";
import { LogPattern } from "./types/log.type.mjs";
import { matcher } from "./log.matcher.mjs";

const boxOptions: Options = {
  borderColor: "cyan",
  borderStyle: "double",
  dimBorder: true,
  textAlignment: "center",
  padding: { bottom: 1, left: 6, right: 6, top: 1 },
  margin: { top: 1, bottom: 0, left: 0, right: 0 },
};

class Logger {
  private chalk: ChalkInstance;
  private ora: Ora;
  private log = console.log;

  constructor() {
    this.chalk = new Chalk({ level: 3 });
    this.ora = ora();
  }

  public stack<S>(error: S) {
    this.log(this.chalk.red("\nstack: ", error));

    return this;
  }

  public message(
    code: number,
    matchers?: ReadonlyArray<string>,
    patterns?: LogPattern,
  ) {
    const text = matcher(messages[code], patterns);

    if (!matchers || !matchers.length) {
      console.log(this.chalk.whiteBright(text));

      return this;
    }

    const chunks = text.split(/\s+/gm);

    const texts = chunks.map((chunk) => {
      if (matchers.includes(chunk.replace(/\W+/g, ""))) {
        return this.chalk.bold.whiteBright(chunk);
      }
      return this.chalk.whiteBright(chunk);
    });

    this.log(...texts);

    return this;
  }

  public success(code: number, patterns?: LogPattern) {
    const text = matcher(messages[code], patterns);

    this.ora.color = "green";

    this.ora.succeed(this.chalk.green(text));

    return this;
  }

  public warn(code: number, patterns?: LogPattern) {
    const text = matcher(messages[code], patterns);

    this.ora.color = "yellow";

    this.ora.warn(this.chalk.yellow(text));

    return this;
  }

  public fail(code: number, patterns?: LogPattern) {
    const text = matcher(messages[code], patterns);

    this.ora.color = "red";

    this.ora.fail(this.chalk.red(text));

    return this;
  }

  public process(code: number, patterns?: LogPattern) {
    const text = matcher(messages[code], patterns);

    this.ora.color = "cyan";

    this.ora.stop().start(this.chalk.whiteBright(text));

    return this;
  }

  public stop() {
    this.ora.stop();
  }

  public server(code: number, choices?: string[], patterns?: LogPattern) {
    const text = matcher(messages[code], patterns);

    const server = ora();

    server.prefixText = `\n${this.chalk.cyan(text)}`;
    server.spinner = "simpleDots";
    server.color = "cyan";

    if (!choices || !choices.length) {
      server.start();
    } else {
      const message = boxen(choices.join("\n"), boxOptions);

      server.start(this.chalk.cyan(message) + "\n");
    }

    return this;
  }
}

export default Logger;
