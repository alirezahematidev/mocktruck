import express from "express";
import usersInput from "../configs/users_bJoWurwp.mjs";
import employeesInput from "../configs/employees_kuJFgbfk.mjs";

const router = express.Router();

router.get("/___truck/users", (_req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("X-Truck-Key", "bJoWurwp");

  res.json(usersInput);
});

router.get("/___truck/employees", (_req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("X-Truck-Key", "kuJFgbfk");

  res.json(employeesInput);
});

export default router;
