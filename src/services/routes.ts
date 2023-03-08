import express from "express";
import usersInput from "../configs/users_UMZTVGiJ.mjs";
import employeesInput from "../configs/employees_FfLysLMq.mjs";

const router = express.Router();

router.get("/___truck/users", (_req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("X-Truck-Key", "UMZTVGiJ");

  res.json(usersInput);
});

router.get("/___truck/employees", (_req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("X-Truck-Key", "FfLysLMq");

  res.json(employeesInput);
});

export default router;
