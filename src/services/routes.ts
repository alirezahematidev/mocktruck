import express from "express";
import usersInput from "../configs/users__zvjvFhr.mjs";
import employeesInput from "../configs/employees_ziadbHxD.mjs";

const router = express.Router();

router.get("/___truck/users", (_req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("X-Truck-Key", "_zvjvFhr");

  res.json(usersInput);
});

router.get("/___truck/employees", (_req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("X-Truck-Key", "ziadbHxD");

  res.json(employeesInput);
});

export default router;
