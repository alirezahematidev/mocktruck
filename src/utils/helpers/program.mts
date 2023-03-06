import ora, { Ora } from "ora";

export class TruckProgram {
  private spinner: Ora = ora();

  public instance() {
    return this.spinner;
  }

  public start(text: string) {
    return this.spinner.start(text);
  }

  public succeed(text: string) {
    return this.spinner.succeed(text);
  }

  public fail(text: string) {
    return this.spinner.fail(text);
  }

  public stop() {
    return this.spinner.stop();
  }

  public clear() {
    return this.spinner.clear();
  }
}
