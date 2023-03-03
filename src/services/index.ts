import express from "express";
import router from "./routes.js";

const app = express();

const PORT = 6969;

app.use(express.json());

app.use(router);

app.listen(PORT, () => console.log("Server is running..."));
