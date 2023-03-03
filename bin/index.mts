#!/usr/bin/env node

// import args from "../cli/index.mjs";
// import truck from "../src/utils/truck.mjs";

import ora from "ora";
import ex from "../cli/index.mjs";

const spinner = ora({ text: "Generating...", color: "cyan" });

ex().on("spawn", () => {
  spinner.start();
});
