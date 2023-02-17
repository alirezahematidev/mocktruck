import { Chalk } from "chalk";
import path from "node:path";
import fs from "node:fs/promises";

type LoggerConfig = {
  outDirectory?: string;
};

export class Logger {
  private static chalk = new Chalk({ level: 1 });
  private static logger = console.log;
  private static configs: LoggerConfig | undefined = undefined;
  private static logs: string = "";

  constructor(configs?: LoggerConfig) {
    Logger.configs = configs;
  }

  private static targetDir() {
    if (!Logger.configs || !Logger.configs?.outDirectory) return;

    const dir = Logger.configs.outDirectory;

    const current = process.cwd();

    const tpath = path.resolve(current, dir);

    return tpath;
  }

  public async save() {
    const target = Logger.targetDir();

    if (!target) return;

    const date = new Date().toLocaleDateString(undefined, {
      dateStyle: "medium",
      formatMatcher: "best fit",
    });

    const name = `logs[${date}].txt`;

    try {
      await fs.access(target, fs.constants.R_OK);
    } catch (error) {
      await fs.mkdir(target);
    }

    await fs.writeFile(path.resolve(target, name), Logger.logs);
  }

  private static add(message: string) {
    if (!Logger.targetDir()) return;

    const time = new Date().toLocaleTimeString();

    const text = `(${time})` + " " + message;

    if (Logger.logs.includes(text)) return;

    Logger.logs += text + "\n";
  }

  public success(message: string, silent?: boolean) {
    Logger.add(message);

    if (silent) return;

    Logger.logger(Logger.chalk.greenBright(message));
  }

  public failed(message: string, silent?: boolean) {
    Logger.add(message);

    if (silent) return;

    Logger.logger(Logger.chalk.redBright(message));
  }

  public warn(message: string, silent?: boolean) {
    Logger.add(message);

    if (silent) return;

    Logger.logger(Logger.chalk.yellowBright(message));
  }

  public info(message: string, silent?: boolean) {
    Logger.add(message);

    if (silent) return;

    Logger.logger(Logger.chalk.blueBright(message));
  }

  public progress(message: string, silent?: boolean) {
    Logger.add(message);

    if (silent) return;

    Logger.logger(Logger.chalk.greenBright(message));
  }

  public box(message: string, silent?: boolean) {
    Logger.add(message);

    if (silent) return;

    Logger.logger(Logger.chalk.greenBright(message));
  }
}
