import express from "express";
import router from "./routes.js";

const app = express();

app.use(express.json());

app.use(router);

app.listen(6969).on("error", (err) => console.log(err.message));
