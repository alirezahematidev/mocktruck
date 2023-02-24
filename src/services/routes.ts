import express from "express";
import employeesInput from "../configs/employees_lPxHFXPu.mjs";
import usersInput from "../configs/users_IMtCqqux.mjs";

const router = express.Router();

router.get("/___truck/employees", (_req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("X-Truck-Key", "lPxHFXPu");

  res.json(employeesInput);
});

router.get("/___truck/users", (_req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("X-Truck-Key", "IMtCqqux");

  res.json(usersInput);
});

export default router;
