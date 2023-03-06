import express from "express";
import usersInput from "../configs/users_JfQz$GxY.mjs";
import employeesInput from "../configs/employees_Ulw$UzMw.mjs";

const router = express.Router();

router.get("/___truck/users", (_req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("X-Truck-Key", "JfQz$GxY");

  res.json(usersInput);
});

router.get("/___truck/employees", (_req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("X-Truck-Key", "Ulw$UzMw");

  res.json(employeesInput);
});

export default router;
