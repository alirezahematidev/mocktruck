import ora, { Ora } from "ora";

export class Program {
  private static spinner: Ora;

  constructor() {
    Program.spinner = ora("Generating...");
  }

  static instance() {
    return this.spinner;
  }

  static run() {
    this.spinner.start();
  }

  static stop() {
    this.spinner.stop();
  }

  static succeed(text?: string) {
    this.spinner.succeed(text);
  }

  static fail(text?: string) {
    this.spinner.fail(text);
  }
}
