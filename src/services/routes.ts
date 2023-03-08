import express from "express";
import usersInput from "../configs/users_LqHJTU_f.mjs";
import employeesInput from "../configs/employees_ccKUaLqU.mjs";

const router = express.Router();

router.get("/___truck/users", (_req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("X-Truck-Key", "LqHJTU_f");

  res.json(usersInput);
});

router.get("/___truck/employees", (_req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("X-Truck-Key", "ccKUaLqU");

  res.json(employeesInput);
});

export default router;
