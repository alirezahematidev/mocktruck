import express from "express";
import router from "./routes.js";
import { Socket } from "node:net";

const app = express();

const PORT = 6969;

app.use(express.json());

app.use(router);

const checkPort = (port: number, host: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const socket = new Socket();

    socket.setTimeout(1000);

    socket.on("connect", () => {
      socket.end();
      resolve(true);
    });
    socket.on("timeout", () => {
      socket.destroy();
      resolve(false);
    });
    socket.on("error", () => {
      socket.destroy();
      resolve(false);
    });

    socket.connect(port, host);
  });
};

app.listen(PORT, () => console.log("Server is running..."));

checkPort(PORT, "localhost").then((isRunning) =>
  console.log(
    `Server is ${isRunning ? "running" : "not running"} on port ${PORT}`,
  ),
);
